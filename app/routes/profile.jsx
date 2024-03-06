import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import mongoose from "mongoose";

export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "/" });

  return json(
    { message: "Logged out successfully." },
    { status: 200, statusText: "OK" },
  );
}

export async function loader({ request }) {
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  console.log("authUser", authUser._id);
  const user = await mongoose.models.User.findById(authUser._id);
  return user;
}

export default function Profile() {
  const user = useLoaderData();
  console.log("user", user);
  return (
    <div id="profile-page" className="page">
      <h1>Profile</h1>
      <p>Welcome, {user.name}</p>
      <p>Your mail is: {user.mail}</p>
      <p>Your password are: {user.password}</p>
      <img src={user.image} alt="avatar" className="profile-image" />
      <Form method="post">
        <button>logout</button>
      </Form>
      <Link to="/profile-update">Update Profile</Link>
    </div>
  );
}
