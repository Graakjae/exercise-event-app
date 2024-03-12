import { useFetcher, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { useThemeStore } from "~/store";
import useStore from "~/store/useStore";
import { useState } from "react";

export default function EntryForm({ event }) {
  const fetcher = useFetcher();
  const theme = useStore(useThemeStore, (state) => state.theme);
  const [startDate, setStartDate] = useState("");

  const [image, setImage] = useState(event?.image);
  const navigate = useNavigate();
  console.log(fetcher);
  return (
    <fetcher.Form
      method="post"
      className={`p-4 border-2 rounded-md mt-4 w-full ${theme === "light" ? "border-black" : "border-white"}`}
    >
      <fieldset
        className="disabled:opacity-70"
        disabled={fetcher.state !== "idle"}
      >
        <div className="mt-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Type your title..."
            aria-label="title"
            required
            defaultValue={event?.title}
            className={`p-2 border border-gray-300 rounded-md w-full  fill-transparent ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}
          />
        </div>
        {fetcher?.data?.errors?.title && (
          <p>{fetcher.data.errors.title.message}</p>
        )}

        <div className="mt-4">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            aria-label="description"
            placeholder="Type your description..."
            className={`p-2 border border-gray-300 rounded-md w-full ${theme === "light" ? "bg-white" : "bg-black"}`}
            required
            defaultValue={event?.description}
          />
        </div>
        {fetcher?.data?.errors?.description && (
          <p>{fetcher.data.errors.description.message}</p>
        )}
        <div className="flex justify-between w-full">
          <div className="mt-4 flex flex-col w-[45%]">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              required
              className={`p-2 border border-gray-300 rounded-md w-[160px] md:w-[100%] bg-black  ${theme === "light" ? "bg-white" : "bg-black"}`}
              defaultValue={
                event == undefined
                  ? format(new Date(), "yyyy-MM-dd")
                  : format(new Date(event?.date), "yyyy-MM-dd")
              }
            />
          </div>

          <div className="mt-4 flex flex-col w-[45%]">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              name="time"
              id="time"
              required
              defaultValue={event?.time}
              className={`p-2 border border-gray-300 rounded-md w-[160px] md:w-[100%] ${theme === "light" ? "bg-white" : "bg-black"}`}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Type a address for your event..."
            required
            defaultValue={event?.address}
            className={`p-2 border border-gray-300 rounded-md w-full ${theme === "light" ? "bg-white" : "bg-black"}`}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="image">Image URL</label>
          <input
            name="image"
            type="url"
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste an image URL..."
            defaultValue={event?.image}
            className={`p-2 border border-gray-300 rounded-md w-full ${theme === "light" ? "bg-white" : "bg-black"}`}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="image-preview">Image Preview</label>
          <img
            id="image-preview"
            className="w-full h-[200px] md:w-[600px]  md:h-[600px] object-cover rounded-md mt-2"
            src={
              image
                ? image
                : theme === "light"
                  ? "/default-image-black.png"
                  : "/default-image-white.png"
            }
            alt="Choose"
          />
        </div>
        {fetcher?.data?.errors?.image && (
          <p>{fetcher.data.errors.image.message}</p>
        )}
        <div className="md:flex md:flex-row-reverse md:justify-center md:gap-4">
          <div className="mt-4 text-right md:mt-0 ">
            <button
              type="submit"
              className="bg-[#635FC7] text-white p-2 rounded-md mt-2 mb-4 w-full md:w-[150px]"
            >
              {fetcher.state !== "idle" ? "Saving..." : "Save"}
            </button>
          </div>
          <button
            type="button"
            className={`p-2 rounded-md mt-2 mb-4 w-full md:w-[150px] text-black bg-[#d4d4d4]`}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </fetcher.Form>
  );
}
