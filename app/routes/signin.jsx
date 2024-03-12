import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { sessionStorage } from "../services/session.server";
import { json } from "@remix-run/node";
import useStore from "~/store/useStore";
import { useThemeStore } from "~/store";

export async function action({ request }) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/events",
    failureRedirect: "/signin",
  });
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

export default function SignIn() {
  const theme = useStore(useThemeStore, (state) => state.theme);
  // if i got an error it will come back with the loader dxata
  const loaderData = useLoaderData();
  return (
    <div id="sign-in-page" className="flex justify-center px-[5%] mt-10">
      <div>
        <h1 className="text-center text-[30px] font-bold">Sign In</h1>
        <Form
          id="sign-in-form"
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
          <div className="error-message">
            {loaderData?.error ? <p>{loaderData?.error?.message}</p> : null}
          </div>
          <div className="flex justify-center mt-6">
            <button className="w-[150px] text-white p-2 bg-[#635FC7] rounded-md">
              Sign In
            </button>
          </div>
        </Form>
        <p className="mt-4">
          Dont have an account?{" "}
          <Link className="text-blue-700" to="/signup">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
}
