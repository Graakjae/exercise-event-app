import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";
import EntryForm from "~/components/Entry-Form";

export function meta() {
  return [
    {
      title: "Go exercise - Update Event",
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

  return (
    <div className="px-[5%] justify-center flex">
      <div>
        <h1 className="text-[30px] font-bold text-center">Update event</h1>
        <EntryForm event={event} />
      </div>
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
  try {
    const event = Object.fromEntries(formData);
    const validation = { runValidators: true };
    await mongoose.models.Event.findByIdAndUpdate(
      params.eventId,
      {
        title: event.title,
        image: event.image,
        description: event.description,
        date: new Date(event.date),
        time: event.time,
        address: event.address,
      },
      validation,
    );

    return redirect(`/events/${params.eventId}`);
  } catch (error) {
    console.error(error);
    return json(
      { errors: error.errors, values: Object.fromEntries(formData) },
      { status: 400 },
    );
  }
}
