import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import mongoose, { mongo } from "mongoose";
import { useState } from "react";
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
  const actionData = useActionData();
  console.log("add-event actionData", actionData);
  return (
    <div className="page">
      <h1>Add a Event</h1>
      <EntryForm />
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
