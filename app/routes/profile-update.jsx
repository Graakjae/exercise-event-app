import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import useStore from "~/store/useStore";
import { useThemeStore } from "~/store";

export function meta() {
  return [
    {
      title: "Go exercise - Profile Update",
    },
  ];
}

export async function loader({ request }) {
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  const user = await mongoose.models.User.findById(authUser._id);
  return user;
}

export default function UpdateProfile() {
  const user = useLoaderData();
  const [image, setImage] = useState(user.image);
  const navigate = useNavigate();
  const theme = useStore(useThemeStore, (state) => state.theme);
  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="flex justify-center px-[5%] mt-10">
      <div>
        <h1 className="text-center text-[30px] font-bold">
          Update your profile
        </h1>
        <Form
          method="post"
          className={`p-4 border-2 rounded-md mt-4 ${theme === "light" ? "border-black" : "border-white"}`}
        >
          <div className="mt-4">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              defaultValue={user.name}
              name="name"
              type="text"
              aria-label="name"
              required
              placeholder="Write a name..."
              className={`p-2 border border-gray-300 rounded-md w-full fill-transparent ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="image">Image URL</label>
            <input
              name="image"
              defaultValue={user.image}
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
              className="rounded-md mt-2  md:h-[400px] object-cover border-2 border-gray-300"
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
          <div className="flex flex-row-reverse justify-center gap-4 mt-4">
            <button className="w-[150px] text-white p-2  bg-[#635FC7] rounded-md h-[40px]">
              Save
            </button>
            <button
              type="button"
              className={`p-2 rounded-md mb-4   h-[40px] w-[150px] text-black bg-[#d4d4d4]`}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const formData = await request.formData();
  const userChanges = Object.fromEntries(formData);

  await mongoose.models.User.findByIdAndUpdate(user._id, {
    name: userChanges.name,
    image: userChanges.image,
  });

  return redirect(`/profile`);
}
