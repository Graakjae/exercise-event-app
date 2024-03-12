import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import mongoose, { mongo } from "mongoose";
import { authenticator } from "../services/auth.server";
import EntryForm from "~/components/Entry-Form";

export const meta = () => {
  return [{ title: "Event app - Add New Post" }];
};

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
}

export default function AddPost() {
  return (
    <div className="px-[5%] justify-center flex">
      <div>
        <h1 className="text-[30px] font-bold text-center">Add a Event</h1>
        <EntryForm />
      </div>
    </div>
  );
}

export async function action({ request }) {
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  const formData = await request.formData();
  try {
    const newEvent = mongoose.models.Event({
      title: formData.get("title"),
      image: formData.get("image"),
      description: formData.get("description"),
      date: new Date(formData.get("date")),
      time: formData.get("time"),
      location: formData.get("location"),
      user: authUser._id,
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
