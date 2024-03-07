import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";

export function meta() {
  return [
    {
      title: "Event - Profile Update",
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

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page">
      <h1>Update Profile</h1>
      <Form id="post-form" method="post">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          defaultValue={user.name}
          name="name"
          type="text"
          aria-label="name"
          placeholder="Write a name..."
        />
        <label htmlFor="title">Title</label>
        <input
          id="title"
          defaultValue={user.title}
          name="title"
          type="text"
          aria-label="title"
          placeholder="Write a title..."
        />
        <label htmlFor="educations">Educations</label>
        <input
          id="educations"
          defaultValue={user.educations}
          name="educations"
          type="text"
          aria-label="educations"
          placeholder="Write your educations..."
        />
        <label htmlFor="mail">Mail</label>
        <input
          id="mail"
          defaultValue={user.mail}
          name="mail"
          type="email"
          aria-label="mail"
          placeholder="Write your mail..."
        />
        <label htmlFor="image">Image URL</label>
        <input
          name="image"
          defaultValue={user.image}
          type="url"
          onChange={(e) => setImage(e.target.value)}
          placeholder="Paste an image URL..."
        />

        <label htmlFor="image-preview">Image Preview</label>
        <img
          id="image-preview"
          className="image-preview"
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
        {/* <input name="_id" type="text" defaultValue={user._id} hidden /> */}

        <div className="btns">
          <button>Save</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  console.log("User before form data parsing:", user);

  const formData = await request.formData();
  console.log("Form Data:", formData);

  const userChanges = Object.fromEntries(formData);
  console.log("User Changes:", userChanges);

  await mongoose.models.User.findByIdAndUpdate(user._id, {
    name: userChanges.name,
    image: userChanges.image,
    title: userChanges.title,
    educations: userChanges.educations,
    mail: userChanges.mail,
  });

  console.log("User updated successfully!");

  return redirect(`/profile`);
}
