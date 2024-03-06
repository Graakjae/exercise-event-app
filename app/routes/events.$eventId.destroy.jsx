import { redirect } from "@remix-run/node";
import mongoose from "mongoose";

export async function action({ params }) {
  await mongoose.models.Event.findByIdAndDelete(params.eventId);
  return redirect("/events");
}
