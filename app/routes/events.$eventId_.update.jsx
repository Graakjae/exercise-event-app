import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";
import EntryForm from "~/components/Entry-Form";

export function meta() {
  return [
    {
      title: "Event App - Update Event",
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
  let session = await getSession(request.headers.get("Cookie"));
  if (session.data.user._id != event.user._id) {
    throw new Response("not authorized", { status: 401 });
  }
  return json({ event });
}

export default function UpdateEvent() {
  const { event } = useLoaderData();
  const [image, setImage] = useState(event.image);
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Update Event</h1>
      <EntryForm event={event} />
    </div>
  );
}

export async function action({ request, params }) {
  const eventId = await mongoose.models.Event.findById(params.eventId).populate(
    "user",
  );
  let session = await getSession(request.headers.get("Cookie"));
  if (session.data.user._id != eventId.user._id) {
    throw new Response("not authorized", { status: 401 });
  }
  const formData = await request.formData();
  const event = Object.fromEntries(formData);

  await mongoose.models.Event.findByIdAndUpdate(params.eventId, {
    title: event.title,
    image: event.image,
    description: event.description,
  });

  return redirect(`/events/${params.eventId}`);
}
