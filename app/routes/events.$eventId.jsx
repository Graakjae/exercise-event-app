import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";

export function meta({ data }) {
  return [
    {
      title: `Remix Post App - ${data.event.caption || "Post"}`,
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

export default function Event() {
  const { event } = useLoaderData();
  console.log("event", event);
  function confirmDelete(event) {
    const response = confirm("Please confirm you want to delete this event.");
    if (!response) {
      event.preventDefault();
    }
  }

  return (
    <div id="event-page" className="page">
      <h1>{event.title}</h1>
      <img src={event.image} alt={event.caption} />
      {/* <eventCard event={event} /> */}
      <div className="btns">
        <Form action="update">
          <button>Update</button>
        </Form>
        <Form action="destroy" method="post" onSubmit={confirmDelete}>
          <button>Delete</button>
        </Form>
      </div>
    </div>
  );
}
