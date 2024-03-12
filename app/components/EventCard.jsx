import { Link } from "@remix-run/react";
import { format } from "date-fns";

export default function EventCard({ event, theme }) {
  return (
    <Link
      to={`/events/${event._id}`}
      key={event._id}
      className={`rounded w-full overflow-hidden shadow-lg transition-shadow duration-300 ease-in-out ${theme === "light" ? "bg-white" : "bg-black"}`}
    >
      <img
        src={event.image}
        alt={event.caption}
        className="w-full h-[300px] object-cover rounded-t-md"
      />
      <div className="px-3 pb-2">
        <h2 className="text-[25px] font-bold mb-2 overflow-hidden text-ellipsis w-full whitespace-nowrap">
          {event.title}
        </h2>
        <div className="flex justify-between">
          <div className="w-full relative">
            {event.date && (
              <div className="flex gap-2 items-center">
                <img
                  src={
                    theme === "light"
                      ? "/calendar-black.png"
                      : "/calendar-white.png"
                  }
                  alt="calendar"
                  className="w-4 h-4"
                />

                <p className="">
                  {format(new Date(event?.date), "MMMM, dd, yyyy")}
                </p>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <img
                src={
                  theme === "light"
                    ? "/location-black.png"
                    : "/location-white.png"
                }
                alt="location"
                className="w-4 h-4"
              />

              <p className="">{event.address}</p>
            </div>
            <div className="flex gap-2 items-center">
              <img
                src={
                  theme === "light" ? "/clock-black.png" : "/clock-white.png"
                }
                alt="clock"
                className="w-4 h-4"
              />
              <p className="">{event.time}</p>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <div>
              <div className="flex gap-2 justify-center items-center ml-[-15px]">
                <img
                  src={
                    theme === "light"
                      ? "/people-black.png"
                      : "/people-white.png"
                  }
                  alt="people"
                  className="w-4 h-4 mt-1"
                />
                {event.registrations?.length === 0 ? (
                  <p>No one signed up yet</p>
                ) : (
                  <p>{event.registrations?.length} signed up</p>
                )}
              </div>
              <div className="flex">
                {event.registrations?.slice(0, 4).map((registration) => (
                  <img
                    src={registration.image || "/default-profilePicture.png"}
                    alt={registration.name}
                    className="w-[40px] h-[40px] ml-[-15px] rounded-full object-cover border-2 border-[#635FC7]"
                    key={registration._id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
