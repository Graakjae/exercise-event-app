import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { format } from "date-fns";
import mongoose from "mongoose";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useStore from "~/store/useStore";
import { useThemeStore } from "~/store";
import EventCard from "~/components/EventCard";

export async function loader({ request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const sortBy = url.searchParams.get("sort-by") || "createdAt";

  // Assuming you want to sort in ascending order.
  // If you need descending order for some fields, you might need to adjust the logic accordingly.
  const sortOption = {};
  sortOption[sortBy] = sortBy != "title" ? -1 : 1; // Use -1 here if you want to sort in descending order by default

  const date = url.searchParams.get("date");

  const query = {
    title: { $regex: q, $options: "i" },
  };

  if (date) {
    query.date = {
      $gte: new Date(date),
      $lt: new Date(date + "T23:59:59.999Z"),
    };
  }

  let events = await mongoose.models.Event.find(query)
    .sort(sortOption)
    .populate("user")
    .populate("registrations")
    .exec();

  // Calculate the count of registrations for each event
  events = events.map((event) => {
    const registrationCount = event.registrations.length;
    return { ...event.toObject(), registrationCount };
  });

  if (sortBy === "registrations") {
    events.sort((a, b) => {
      return sortOption[sortBy] * (a.registrationCount - b.registrationCount);
    });
  }

  const session = await getSession(request.headers.get("Cookie"));

  return { events, session, q, sortBy };
}

export default function Index() {
  const { events, q, sortBy } = useLoaderData();
  const submit = useSubmit();
  const [defaultValue, setDefaultValue] = useState("");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  console.log(sortBy, "sortBy");
  const theme = useStore(useThemeStore, (state) => state.theme);
  const [filter, setFilter] = useState(sortBy);
  useEffect(() => {
    // Get the URL parameters
    const params = new URLSearchParams(window.location.search);
    // Get the date from the URL parameters
    const dateFromUrl = params.get("date");

    // If there's a date in the URL parameters, format it and use it as the default value
    if (dateFromUrl) {
      setDefaultValue(format(new Date(dateFromUrl), "yyyy-MM-dd"));
    }
  }, []);

  function handleSearchFilterAndSort(event) {
    const isFirstSearch = q === null;

    submit(event.currentTarget, {
      replace: !isFirstSearch,
    });
  }

  return (
    <section className="p-4 md:px-[5%]">
      <Form
        className="gap-4 flex flex-col mb-8 w-full"
        id="search-form"
        role="search"
        onChange={handleSearchFilterAndSort}
      >
        <label className="flex flex-col text-[18px] font-semibold">
          Search for a event
          <input
            aria-label="Search by Title"
            placeholder="Search"
            type="search"
            name="q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`p-2 border border-gray-300 rounded-md w-full md:w-[100%] fill-transparent text-black`}
          />
        </label>
        <div className="md:flex md:items-end md:gap-4">
          <div className="flex flex-col">
            <label htmlFor="date" className="mb-1 text-[18px] font-semibold">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              className={`p-2 border border-gray-300 rounded-md w-full h-[50px] fill-transparent text-black`}
              value={defaultValue}
              onChange={(event) => setDefaultValue(event.target.value)}
            />
          </div>
          <label>
            Sort by{" "}
            <select
              name="sort-by"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`p-2 border border-gray-300 rounded-md w-full h-[50px] fill-transparent text-black`}
            >
              <option value="createdAt">Newest</option>
              <option value="title">A-Z</option>
              <option value="registrations">Popular events</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setDefaultValue("");
              setSearch("");
              setFilter("createdAt");

              // Navigate to the same page without query parameters
              navigate("/events", {
                replace: true,
              });
            }}
            className="p-2 bg-[#635FC7] text-white rounded-md h-[50px] w-full md:w-auto mt-6 md:mt-0"
          >
            Reset Filters
          </button>
        </div>
      </Form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center mt-8">
        {events.map((event) => (
          <EventCard key={event._id} event={event} theme={theme} />
        ))}
      </div>
    </section>
  );
}
