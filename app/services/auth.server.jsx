// app/services/auth.server.ts
import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator(sessionStorage, {
  sessionErrorKey: "sessionErrorKey", // keep in sync
});
// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let mail = form.get("mail");
    let password = form.get("password");
    const user = await verifyUser({ mail, password });

    if (!mail || mail?.length === 0) {
      throw new AuthorizationError("Bad Credentials: Email is required");
    }
    if (typeof mail !== "string") {
      throw new AuthorizationError("Bad Credentials: Email must be a string");
    }

    if (!password || password?.length === 0) {
      throw new AuthorizationError("Bad Credentials: Password is required");
    }
    if (typeof password !== "string") {
      throw new AuthorizationError(
        "Bad Credentials: Password must be a string",
      );
    }

    // verify the user
    if (!user) {
      // if problem with user throw error AuthorizationError
      throw new AuthorizationError("Bad Credentials: User not found ");
    }
    return user;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass",
);

async function verifyUser({ mail, password }) {
  const user = await mongoose.models.User.findOne({ mail }).select("+password");
  if (!user) {
    throw new AuthorizationError("Bad Credentials: User not found");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AuthorizationError("Invalid password.");
  }
  return user;
}
