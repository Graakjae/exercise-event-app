import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { sessionStorage } from "../services/session.server";
import { json, redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { useState } from "react";
import useStore from "~/store/useStore";
import { useThemeStore } from "~/store";

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
  const [image, setImage] = useState();
  const theme = useStore(useThemeStore, (state) => state.theme);

  return (
    <div className="flex justify-center px-[5%] mt-10">
      <div>
        <h1 className="text-center text-[30px] font-bold">Sign up</h1>
        <Form
          method="post"
          className={`p-4 border-2 rounded-md mt-4 ${theme === "light" ? "border-black" : "border-white"}`}
        >
          <div className="mt-4">
            <label htmlFor="mail">Mail</label>
            <input
              id="mail"
              type="email"
              name="mail"
              aria-label="mail"
              placeholder="Type your mail..."
              className={`p-2 border border-gray-300 rounded-md w-full fill-transparent ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              aria-label="password"
              placeholder="Type your password..."
              autoComplete="current-password"
              className={`p-2 border border-gray-300 rounded-md w-full fill-transparent ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              aria-label="name"
              className={`p-2 border border-gray-300 rounded-md w-full fill-transparent ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}
              placeholder="Type your name..."
            />
          </div>
          <div className="mt-4">
            <label htmlFor="image">Image URL</label>
            <input
              name="image"
              type="url"
              onChange={(e) => setImage(e.target.value)}
              placeholder="Paste an image URL..."
              className={`p-2 border border-gray-300 rounded-md w-full fill-transparent ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="image-preview">Image Preview</label>
            <img
              id="image-preview"
              className="rounded-md mt-2"
              src={
                image
                  ? image
                  : "https://placehold.co/600x400?text=Paste+an+image+URL"
              }
              alt="Choose"
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/600x400?text=Error+loading+image")
              }
            />
          </div>

          <div className="error-message">
            {loaderData?.error ? <p>{loaderData?.error?.message}</p> : null}
          </div>
          <div className="flex justify-center mt-6">
            <button className="w-[150px] text-white p-2 bg-[#635FC7] rounded-md">
              Sign Up
            </button>
          </div>
        </Form>
        <p className="text-center mt-4 mb-10">
          Have an account?{" "}
          <Link className="text-blue-700" to="/signin">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

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
