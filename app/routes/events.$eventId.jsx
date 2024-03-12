import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";
import { format } from "date-fns";
import useStore from "~/store/useStore";
import { useThemeStore } from "~/store";
import { useEffect, useState } from "react";
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

  const event = await mongoose.models.Event.findById(params.eventId)
    .populate("registrations")
    .populate("comments.commentedBy")
    .populate("user");
  const session = await getSession(request.headers.get("Cookie"));

  return json({ event, session: session.data.user._id });
}

export default function Event() {
  const { event, session } = useLoaderData();
  const [isRegisteredOpen, setIsRegisteredOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [comment, setComment] = useState("");
  const theme = useStore(useThemeStore, (state) => state.theme);
  const fetcher = useFetcher();
  const navigate = useNavigate();
  console.log("fetcher", fetcher);
  function confirmDelete(event) {
    const response = confirm("Please confirm you want to delete this event.");
    if (!response) {
      event.preventDefault();
    }
  }
  // Check if the user is registered
  const isRegistered = event.registrations.some(
    (registration) => registration._id === session,
  );
  useEffect(() => {
    {
      fetcher?.data?.message &&
        fetcher?.data?.message === "Comment added" &&
        setComment("");
    }
  }, [fetcher.data, fetcher.error]);
  console.log("event", event);
  return (
    <div id="event-page" className="md:px-[5%] md:mt-10">
      <div className="relative">
        <img
          src="/arrow-left.png"
          alt="back"
          className="absolute left-4 top-4 cursor-pointer w-8 h-8 md:hidden"
          onClick={() => navigate("/")}
        />
        <img
          src={event.image}
          alt={event.title}
          className="w-full md:h-[600px]  object-cover md:rounded-md"
        />
      </div>
      <div className="w-full px-2 md:px-0">
        <div className="flex justify-between items-center">
          <h2 className="text-[30px] font-bold">{event.title}</h2>
          {event.user._id === session && (
            <img
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              src={theme === "light" ? "/more-black.png" : "/more-white.png"}
              alt="more"
              className="w-5 h-5 cursor-pointer"
            />
          )}
        </div>
        {isMoreOpen && (
          <div className="fixed w-[100svw] h-[100svh] top-0 left-0 flex items-center justify-center z-50">
            <div
              className={`${
                theme === "light" ? "bg-white" : "bg-gray-500"
              } w-[50%] md:w-[500px] rounded-[6px] p-8 z-20 relative`}
            >
              <div className="w-full text-center md:flex md:justify-center md:gap-10 ">
                <Form
                  action="update"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={
                      theme === "light"
                        ? "/editing-black.png"
                        : "/editing-white.png"
                    }
                    alt="editing event"
                    className="w-6 h-6"
                  />

                  <button className="text-center font-bold text-[20px] py-2">
                    Edit event
                  </button>
                </Form>
                <Form
                  action="destroy"
                  method="post"
                  onSubmit={confirmDelete}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={
                      theme === "light"
                        ? "/delete-black.png"
                        : "/delete-white.png"
                    }
                    alt="delete event"
                    className="w-6 h-6"
                  />

                  <button className="text-center font-bold text-[20px] py-2">
                    Delete event
                  </button>
                </Form>
              </div>
            </div>
            <div
              className="bg-black/50 inset-0 fixed w-[100svw]"
              onClick={() => setIsMoreOpen(false)}
            />
          </div>
        )}

        <div className="relative flex gap-6 w-full">
          {event.date && (
            <div className="flex gap-1 items-center">
              <img
                src={
                  theme === "light"
                    ? "/calendar-black.png"
                    : "/calendar-white.png"
                }
                alt="calendar"
                className="w-4 h-4"
              />

              <p className="text-[15px] font-medium">
                {format(new Date(event?.date), "MMMM, dd, yyyy")}
              </p>
            </div>
          )}
          <div className="flex gap-1 items-center">
            <img
              src={
                theme === "light"
                  ? "/location-black.png"
                  : "/location-white.png"
              }
              alt="location"
              className="w-4 h-4"
            />

            <p className="text-[15px] font-medium">{event.location}</p>
          </div>
          <div className="flex gap-1 items-center">
            <img
              src={theme === "light" ? "/clock-black.png" : "/clock-white.png"}
              alt="clock"
              className="w-4 h-4"
            />
            <p className="text-[15px] font-medium">{event.time}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="">Event host</p>
          <div className="flex items-center mt-1 gap-2">
            <img
              src={event.user.image || "/default-profilePicture.png"}
              alt={event.user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#635FC7]"
            />
            <p>{event.user.name}</p>
          </div>
        </div>
        <div className="md:flex md:justify-between md:w-full">
          <p className="mt-4 font-light md:w-[70%]">{event.description}</p>
          <div className="">
            <div
              onClick={() => setIsRegisteredOpen(true)}
              className="cursor-pointer "
            >
              <div className="flex gap-2 items-center mr-[-5px] md:mr-0 mt-4">
                <img
                  src={
                    theme === "light"
                      ? "/people-black.png"
                      : "/people-white.png"
                  }
                  alt="people"
                  className="w-6 h-6 mt-1"
                />

                <p>{event.registrations.length} are going to this event</p>
              </div>
              <div className="flex">
                {event.registrations.slice(0, 6).map((registration) => (
                  <img
                    src={registration.image || "/default-profilePicture.png"}
                    alt={registration.name}
                    className="w-[40px] h-[40px] mr-[-5px] rounded-full object-cover border-2 border-[#635FC7]"
                    key={registration._id}
                  />
                ))}
              </div>
            </div>
            <fetcher.Form method="post">
              <fieldset
                className="disabled:opacity-70"
                disabled={fetcher.state !== "idle"}
              >
                <button
                  type="submit"
                  name="_action"
                  aria-label="register"
                  value="register"
                  className={`mt-6 md:w-full text-white w-full py-2 rounded-md transition-all duration-300  ${isRegistered ? "bg-[#635FC7]" : "bg-[#635FC7]"}`}
                >
                  {isRegistered ? (
                    <div className="flex gap-2 justify-center items-center">
                      <p>
                        {fetcher.state !== "idle"
                          ? "Unregistering..."
                          : "Registered"}
                      </p>
                      <img src="/check.png" className="w-[20px] h-[20px]" />
                    </div>
                  ) : (
                    <p>
                      {fetcher.state !== "idle" ? "Registering..." : "Register"}
                    </p>
                  )}
                </button>
              </fieldset>
            </fetcher.Form>
          </div>
        </div>

        {isRegisteredOpen && (
          <div className="fixed w-[100svw] h-[100svh] top-0 left-0 flex items-center justify-center">
            <div
              className={`${
                theme === "light" ? "bg-white" : "bg-[#1c1c1c]"
              } w-[95%] md:w-[500px] rounded-[6px] p-8 z-20 relative`}
            >
              <div className="mb-4">
                <button
                  onClick={() => setIsRegisteredOpen(false)}
                  className={`absolute top-6 right-8  rounded-full w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-600 transition-all duration-300 cursor-pointer ${theme === "light" ? "bg-[#eeeeee]" : "bg-[#313131]"}`}
                >
                  <img
                    src={
                      theme === "light"
                        ? "/close-black.png"
                        : "/close-white.png"
                    }
                    alt="close"
                    className="w-[15px]"
                  />
                </button>
                <h3 className="text-[20px] font-bold">Registered for event</h3>
              </div>
              {event.registrations.map((registration) => (
                <div
                  key={registration._id}
                  className={`flex gap-3 items-center  mt-1  rounded-md p-2 ${theme === "light" ? "bg-[#eeeeee]" : "bg-[#313131]"}`}
                >
                  <img
                    src={registration.image}
                    alt={registration.name}
                    className="w-[40px] h-[40px] sm:mr-[-5px] md:ml-[-5px] rounded-full object-cover border-2 border-[#635FC7]"
                  />
                  <p className="font-medium">{registration.name}</p>
                </div>
              ))}
            </div>
            <div
              className="bg-black/50 inset-0 fixed w-[100svw]"
              onClick={() => setIsRegisteredOpen(false)}
            />
          </div>
        )}

        <fetcher.Form method="post" className="my-4">
          <fieldset
            className="disabled:opacity-70"
            disabled={fetcher.state !== "idle"}
          >
            <label htmlFor="commentText" className="text-[20px]">
              Comment section
            </label>
            <div className="flex gap-3">
              <textarea
                type="text"
                name="commentText"
                id="commentText"
                aria-label="commentText"
                placeholder="Add a comment"
                className="w-full p-2 border border-gray-300 rounded-md text-gray-900 mt-2 "
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button
                type="submit"
                name="_action"
                aria-label="comment"
                value="comment"
                className="mt-2 text-white px-5 py-2 rounded-md transition-all duration-300 bg-[#635FC7]"
              >
                <img src="/send.png" alt="send" className="w-6" />
              </button>
            </div>
            {fetcher?.data?.errors?.["comments.commentText"] && (
              <p>{fetcher.data.errors["comments.commentText"].message}</p>
            )}
          </fieldset>
        </fetcher.Form>
        {event.comments.map((comment) => (
          <div key={comment._id} className="flex gap-2 my-2">
            <img
              src={comment?.commentedBy?.image || "/default-profilePicture.png"}
              alt={comment?.commentedBy?.name}
              className="w-[40px] h-[40px] rounded-full object-cover border-2 border-[#635FC7]"
            />
            <div
              className={`${theme !== "light" ? "bg-[#313131]" : "bg-[#e4e4e4]"} rounded-lg p-2`}
            >
              <p className="font-semibold">{comment?.commentedBy?.name}</p>
              <p className="font-light">{comment.commentText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "register") {
    const authUser = await authenticator.isAuthenticated(request, {
      failureRedirect: "/signin",
    });
    const event = await mongoose.models.Event.findById(params.eventId);

    if (event.registrations.includes(authUser._id.toString())) {
      await mongoose.models.Event.findByIdAndUpdate(params.eventId, {
        $pull: { registrations: authUser._id },
      });
      return json({ message: "You have been unregistered" });
    }
    const registration = await mongoose.models.Event.findByIdAndUpdate(
      params.eventId,
      {
        $push: { registrations: authUser._id },
      },
      { new: true },
    );

    console.log("registrationbumbam", registration);
    return json({ registration });
  }
  if (_action === "comment") {
    const authUser = await authenticator.isAuthenticated(request, {
      failureRedirect: "/signin",
    });
    try {
      const validation = { runValidators: true };

      const comment = {
        commentedBy: authUser._id,
        commentText: formData.get("commentText"),
      };
      await mongoose.models.Event.findByIdAndUpdate(
        params.eventId,
        {
          $push: { comments: comment },
        },
        validation,
      );
      return json({ message: "Comment added" });
    } catch (error) {
      console.error(error);
      return json(
        { errors: error.errors, values: Object.fromEntries(formData) },
        { status: 400 },
      );
    }
  }
}
