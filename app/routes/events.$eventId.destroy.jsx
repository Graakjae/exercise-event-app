import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import mongoose from "mongoose";
import { getSession } from "~/services/session.server";

export async function action({ params, request }) {
  const event = await mongoose.models.Event.findById(params.eventId).populate(
    "user",
  );
  let session = await getSession(request.headers.get("Cookie"));
  if (session.data.user._id != event.user._id) {
    throw new Response("not authorized", { status: 401 });
  }
  invariant(params.eventId, "Missing contactId param");
  await mongoose.models.Event.findByIdAndDelete(params.eventId);
  return redirect("/events");
}
