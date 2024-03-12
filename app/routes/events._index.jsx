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
  const sortBy = url.searchParams.get("sort-by") || "date";

  // Assuming you want to sort in ascending order.
  // If you need descending order for some fields, you might need to adjust the logic accordingly.
  const sortOption = {};
  sortOption[sortBy] = 1; // Use -1 here if you want to sort in descending order by default

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
      return sortOption[sortBy] * (b.registrationCount - a.registrationCount);
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
  const [filter, setFilter] = useState("Date");
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
  console.log(events);
  return (
    <section className="p-4 md:px-[5%] mt-14 mb-10">
      <Form
        className="gap-4 flex flex-col lg:flex-row lg:items-end mb-8 lg:mb-0 w-full"
        id="search-form"
        role="search"
        onChange={handleSearchFilterAndSort}
      >
        <div className="flex flex-col text-[18px] font-semibold lg:w-[40%]">
          <label className="mb-1 text-[18px] font-semibold">
            Search for a event
          </label>
          <input
            aria-label="Search by Title"
            placeholder="Search"
            type="search"
            name="q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`p-2 border border-gray-300 rounded-lg w-full lg:w-[100%] fill-transparent text-black h-[50px]`}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="date" className="mb-1 text-[18px] font-semibold">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            className={`p-2 border border-gray-300 rounded-lg w-full h-[50px] fill-transparent text-black`}
            value={defaultValue}
            onChange={(event) => setDefaultValue(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 text-[18px] font-semibold">Sort by </label>
          <select
            name="sort-by"
            defaultValue={"date"}
            onChange={(e) => setFilter(e.target.value)}
            className={`p-2 border border-gray-300 rounded-lg w-full h-[50px] fill-transparent text-black`}
          >
            <option value="date">Date</option>
            <option value="title">A-Z</option>
            <option value="registrations">Popular events</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setDefaultValue("");
            setSearch("");
            setFilter("date");

            // Navigate to the same page without query parameters
            navigate("/events", {
              replace: true,
            });
          }}
          className="p-2 bg-[#635FC7] text-white rounded-md h-[50px] w-full md:w-auto mt-6 md:mt-0"
        >
          Reset Filters
        </button>
      </Form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mt-8">
        {events.map((event) => (
          <EventCard key={event._id} event={event} theme={theme} />
        ))}
      </div>
    </section>
  );
}
