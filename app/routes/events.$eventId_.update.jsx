import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";

export function meta() {
  return [
    {
      title: "Remix Post App - Update",
    },
  ];
}

export async function loader({ params, request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  const event = await mongoose.models.Event.findById(params.eventId).populate(
    "user",
  );
  return json({ event });
}

export default function UpdateEvent() {
  const { event } = useLoaderData();
  const [image, setImage] = useState(event.image);
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page">
      <h1>Update Event</h1>
      <Form id="post-form" method="post">
        <label htmlFor="caption">Caption</label>
        <input
          id="caption"
          defaultValue={event.caption}
          name="caption"
          type="text"
          aria-label="caption"
          placeholder="Write a caption..."
        />
        <label htmlFor="image">Image URL</label>
        <input
          name="image"
          defaultValue={event.image}
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

        <input name="uid" type="text" defaultValue={event.uid} hidden />
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

export async function action({ request, params }) {
  const formData = await request.formData();
  const event = Object.fromEntries(formData);

  await mongoose.models.Event.findByIdAndUpdate(params.eventId, {
    caption: event.caption,
    image: event.image,
  });

  return redirect(`/events/${params.eventId}`);
}
