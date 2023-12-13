"use client";

import { updatePostTitle } from "@/app/lib/actionsSupa";
import { useFormState } from "react-dom";

const initialState = {
  error: null,
};

export default function EditTitle({ title, postId }) {
  const [state, formAction] = useFormState(updatePostTitle, initialState);

  return (
    <form action={formAction}>
      <div className="flex">
        <input hidden name="post_id" defaultValue={postId} />
        <input
          type="text"
          id="postTitle"
          name="title"
          defaultValue={title}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
        <button className="bg-purple-500 border hover:bg-purple-700 text-white py-2 px-4 rounded-xl m-2 input-shadow">
          Edit
        </button>
        <p className="text-red-400 text-xs">{state?.error}</p>
        <p className="text-green-400 text-xs">{state?.result ? "Edited" : ""}</p>
      </div>
    </form>
  );
}
