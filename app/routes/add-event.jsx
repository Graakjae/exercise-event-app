import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";
import { authenticator } from "../services/auth.server";

export const meta = () => {
  return [{ title: "Remix Post App - Add New Post" }];
};

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
}

export default function AddPost() {
  const [image, setImage] = useState(
    "https://placehold.co/600x400?text=Add+your+amazing+image",
  );
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  const actionData = useActionData();
  console.log(actionData);
  return (
    <div className="page">
      <h1>Add a Event</h1>
      <Form id="post-form" method="post">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          aria-label="title"
          required
          placeholder="Write a title..."
        />
        {actionData?.errors.title && <p>{actionData.errors.title.message}</p>}
        <label htmlFor="image">Image URL</label>
        <input
          name="image"
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
        {actionData?.errors.image && <p>{actionData.errors.image.message}</p>}

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
  const formData = await request.formData();
  try {
    const newEvent = mongoose.models.Event({
      title: formData.get("title"),
      image: formData.get("image"),
    });
    await newEvent.save();
    return redirect(`/events/${newEvent._id}`);
  } catch (error) {
    console.error(error);
    return json(
      { errors: error.errors, values: Object.fromEntries(formData) },
      { status: 400 },
    );
  }
}
