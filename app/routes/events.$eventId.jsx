import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";

export function meta({ data }) {
  return [
    {
      title: `Event App - ${data.event.title || "Event"}`,
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
  const session = await getSession(request.headers.get("Cookie"));

  return json({ event, session: session.data.user._id });
}

export default function Event() {
  const { event, session } = useLoaderData();
  function confirmDelete(event) {
    const response = confirm("Please confirm you want to delete this event.");
    if (!response) {
      event.preventDefault();
    }
  }

  return (
    <div id="event-page" className="page">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <img src={event.image} alt={event.title} />
      {/* <eventCard event={event} /> */}

      {event.user._id === session && (
        <div className="btns">
          <Form action="update">
            <button>Update</button>
          </Form>
          <Form action="destroy" method="post" onSubmit={confirmDelete}>
            <button>Delete</button>
          </Form>
        </div>
      )}
    </div>
  );
}
