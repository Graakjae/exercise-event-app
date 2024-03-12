import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { format } from "date-fns";
import mongoose, { set } from "mongoose";
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
  const filterTag = url.searchParams.get("tag") || "";

  // Assuming you want to sort in ascending order.
  // If you need descending order for some fields, you might need to adjust the logic accordingly.
  const sortOption = {};
  sortOption[sortBy] = sortBy != "caption" ? -1 : 1; // Use -1 here if you want to sort in descending order by default
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
  if (filterTag) {
    query.tags = filterTag;
  }

  // const uniqueTags = await mongoose.models.Post.aggregate([
  //   // Unwind the array of tags to make each tag a separate document
  //   { $unwind: "$tags" },
  //   // Group by the tag to eliminate duplicates
  //   { $group: { _id: "$tags" } },
  //   // Optionally, you might want to sort the tags alphabetically
  //   { $sort: { _id: 1 } },
  //   // Project to get the desired output format, if needed
  //   { $project: { tag: "$_id", _id: 0 } },
  // ]);

  // Extract just the tags from the results
  // const tags = uniqueTags.map((tagDoc) => tagDoc.tag);
  //date filter

  const events = await mongoose.models.Event.find(query)
    .sort(sortOption)
    .populate("user")
    .populate("registrations")
    .exec();
  const session = await getSession(request.headers.get("Cookie"));

  return { events, session, q, sortBy, filterTag };
}

export default function Index() {
  const { events, session, q, sortBy, filterTag, tags, date } = useLoaderData();
  const submit = useSubmit();
  const [defaultValue, setDefaultValue] = useState("");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const theme = useStore(useThemeStore, (state) => state.theme);

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

  console.log(events, "defaultValue");
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
            aria-label="Search by caption"
            placeholder="Search"
            type="search"
            name="q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full md:w-[100%] "
          />
        </label>
        <div className="md:flex md:items-end">
          <div className="flex flex-col">
            <label htmlFor="date" className="mb-1 text-[18px] font-semibold">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              className="p-2 border border-gray-300 rounded-md text-gray-900 h-[50px]"
              value={defaultValue}
              onChange={(event) => setDefaultValue(event.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setDefaultValue("");
              setSearch("");

              // Navigate to the same page without query parameters
              navigate("/events", { replace: true });
            }}
            className="p-2 bg-[#635FC7] text-white rounded-md h-[50px] md:ml-4 w-full md:w-auto mt-6 md:mt-0"
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
