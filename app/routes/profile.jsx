import { Form, Link, json, redirect, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import mongoose from "mongoose";
import useStore from "~/store/useStore";
import { useThemeStore } from "~/store";

export async function loader({ request }) {
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  const user = await mongoose.models.User.findById(authUser._id);
  const events = await mongoose.models.Event.find({ user: authUser._id });
  const registeredEvents = await mongoose.models.Event.find({
    registrations: authUser._id,
  });
  return { user, events, registeredEvents };
}

export default function Profile() {
  const { user, events, registeredEvents } = useLoaderData();
  const theme = useStore(useThemeStore, (state) => state.theme);
  function confirmLogout(event) {
    const response = confirm("Please confirm to logout.");
    if (!response) {
      event.preventDefault();
    }
  }

  function confirmUnregister(event) {
    const response = confirm("Please confirm to unregister from this event");
    if (!response) {
      event.preventDefault();
    }
  }
  return (
    <div id="profile-page" className="flex justify-center w-full px-[5%] mt-10">
      <div className="w-full justify-center">
        <div className="flex justify-center">
          <img
            src={user.image ? user.image : "/defaultprofilePicture.png"}
            alt="avatar"
            className="w-[200px] h-[200px] rounded-full object-cover border-2 border-white"
          />
        </div>

        <h2 className="text-[30px] md:text-[40px] font-bold text-center ">
          {user.name}
        </h2>

        <h2 className="text-center md:text-start font-semibold text-[20px] mt-4 mb-2">
          Your events
        </h2>
        {events.length === 0 ? (
          <p>
            You have not created any event, go create one{" "}
            <Link className="text-blue-700 cursor-pointor" to="/add-event">
              here
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {events.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className={`shadow-lg  rounded-md  flex flex-col justify-between ${theme === "light" ? "bg-white" : "bg-black"}`}
              >
                <img
                  src={event.image}
                  alt={event.caption}
                  className="w-full h-[150px] md:h-[250px] object-cover rounded-t-md"
                />
                <h2 className="text-[20px] p-2 font-semibold mb-2 overflow-hidden text-ellipsis w-full whitespace-nowrap">
                  {event.title}
                </h2>
              </Link>
            ))}
          </div>
        )}

        <h2 className="text-center md:text-start font-semibold text-[20px] mt-4 mb-2">
          You are signed up to these events
        </h2>
        {registeredEvents.length === 0 ? (
          <p>
            You are not registered to any event, go find events{" "}
            <Link className="text-blue-700 cursor-pointor" to="/">
              here
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {registeredEvents.map((event) => (
              <div
                key={event._id}
                to={`/events/${event._id}`}
                className={`shadow-lg  rounded-md  flex flex-col justify-between ${theme === "light" ? "bg-white" : "bg-black"}`}
              >
                <Link to={`/events/${event._id}`}>
                  <img
                    src={event.image}
                    alt={event.caption}
                    className="w-full h-[150px] md:h-[250px] object-cover rounded-t-md"
                  />
                  <h2 className="text-[20px] font-semibold p-2 mb-2 overflow-hidden text-ellipsis w-full whitespace-nowrap">
                    {event.title}
                  </h2>
                </Link>
                <Form
                  method="post"
                  className="flex justify-center"
                  onSubmit={confirmUnregister}
                >
                  <input type="hidden" name="eventId" value={event._id} />

                  <button
                    type="submit"
                    name="_action"
                    aria-label="register"
                    value="register"
                    className="w-[80%] bg-[#635FC7] text-white p-2 rounded-md mt-2 mb-4"
                  >
                    Unregister
                  </button>
                </Form>
              </div>
            ))}
          </div>
        )}
        <div className="md:flex md:gap-6 justify-center my-10">
          <div className="flex justify-center md:w-[200px]">
            <Link
              to="/profile-update"
              className="flex items-center gap-2 justify-center w-full bg-[#635FC7] text-white p-2 rounded-md mt-4"
            >
              <img src="/editing-white.png" alt="logout" className="w-6" />
              Update Profile
            </Link>
          </div>

          <Form
            method="post"
            className="flex justify-center"
            onSubmit={confirmLogout}
          >
            <button
              type="submit"
              name="_action"
              aria-label="logout"
              value="logout"
              className="flex items-center gap-2 justify-center w-full md:w-[200px] bg-[#FF4D4F] text-white p-2 rounded-md mt-4"
            >
              <img src="/logout-white.png" alt="logout" className="w-6" />

              <p>Logout</p>
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const _action = formData.get("_action");
  if (_action === "logout") {
    await authenticator.logout(request, { redirectTo: "/" });

    return json(
      { message: "Logged out successfully." },
      { status: 200, statusText: "OK" },
    );
  }
  if (_action === "register") {
    const authUser = await authenticator.isAuthenticated(request, {
      failureRedirect: "/signin",
    });
    const eventId = formData.get("eventId");
    const event = await mongoose.models.Event.findById(eventId);
    if (event.registrations.includes(authUser._id.toString())) {
      await mongoose.models.Event.findByIdAndUpdate(eventId, {
        $pull: { registrations: authUser._id },
      });
      return json({ message: "You have been unregistered" });
    }
  }
}
