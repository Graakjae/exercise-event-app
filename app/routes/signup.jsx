import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { sessionStorage } from "../services/session.server";
import { json, redirect } from "@remix-run/node";
import mongoose from "mongoose";

export async function action({ request }) {
  const formData = await request.formData(); // get the form data
  const newUser = Object.fromEntries(formData); // convert the form data to an object
  const result = mongoose.models.User(newUser); // create a new user document
  await result.save(); // save the user document
  if (result) {
    return redirect("/signin");
  } else {
    return redirect("/signup");
  }
}

export async function loader({ request }) {
  // If the user is already authenticated redirect to /posts directly
  await authenticator.isAuthenticated(request, {
    successRedirect: "/events",
  });
  // Retrieve error message from session if present
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  // Get the error message from the session
  const error = session.get("sessionErrorKey");
  return json({ error }); // return the error message
}

export default function SignUp() {
  // if i got an error it will come back with the loader dxata
  const loaderData = useLoaderData();
  console.log("loaderData", loaderData);
  return (
    <div id="sign-up-page" className="page">
      <h1>Sign Up</h1>
      <Form id="sign-up-form" method="post">
        <label htmlFor="mail">Mail</label>
        <input
          id="mail"
          type="email"
          name="mail"
          aria-label="mail"
          placeholder="Type your mail..."
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          aria-label="password"
          placeholder="Type your password..."
          autoComplete="current-password"
        />
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          aria-label="name"
          placeholder="Type your name..."
        />

        <div className="error-message">
          {loaderData?.error ? <p>{loaderData?.error?.message}</p> : null}
        </div>
        <div className="btns">
          <button>Sign Up</button>
        </div>
      </Form>
      <p>
        have an account? <Link to="/signin">Sign in here</Link>
      </p>
    </div>
  );
}
