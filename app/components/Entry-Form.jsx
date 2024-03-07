import { useActionData, useFetcher, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { useState } from "react";
export default function EntryForm({ event }) {
  const fetcher = useFetcher();
  const [image, setImage] = useState(event?.image);
  const navigate = useNavigate();
  const actionData = useActionData();

  return (
    <fetcher.Form id="post-form" method="post" className="mt-2">
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
            className="w-full text-gray-700"
            required
            defaultValue={event?.title}
          />
        </div>
        {actionData?.errors.title && <p>{actionData.errors.title.message}</p>}

        <div className="mt-4">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            aria-label="description"
            placeholder="Type your entry..."
            className="w-full text-gray-700"
            required
            defaultValue={event?.description}
          />
        </div>
        {actionData?.errors.description && (
          <p>{actionData.errors.description.message}</p>
        )}

        <label htmlFor="image">Image URL</label>
        <input
          name="image"
          type="url"
          onChange={(e) => setImage(e.target.value)}
          placeholder="Paste an image URL..."
          defaultValue={event?.image}
        />

        <label htmlFor="image-preview">Image Preview</label>
        <img
          id="image-preview"
          className="image-preview"
          src={
            image
              ? image
              : "https://placehold.co/600x400?text=Paste+an+image+URL"
          }
          alt="Choose"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/600x400?text=Error+loading+image")
          }
        />
        {actionData?.errors.image && <p>{actionData.errors.image.message}</p>}

        <div className="mt-2 text-right">
          <button
            type="submit"
            className="bg-blue-500 px-4 py-1 font-semibold text-white"
          >
            {fetcher.state !== "idle" ? "Saving..." : "Save"}
          </button>
        </div>
        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </fieldset>
    </fetcher.Form>
  );
}
