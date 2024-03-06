import { Link, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";
export async function loader({ request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  const events = await mongoose.models.Event.find();
  return events;
}

export default function Index() {
  const events = useLoaderData();
  console.log("loaderData", events);
  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <Link to={`/events/${event._id}`} key={event._id}>
            <h2>{event.title}</h2>
            <img src={event.image} alt={event.caption} />
          </Link>
        ))}
      </ul>
    </div>
  );
}
