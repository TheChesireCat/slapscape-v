"use client";

import { updatePostDescription } from "@/app/lib/actionsSupa";
import { useFormState } from "react-dom";
import { useState } from "react";

const initialState = {
  error: null,
};

export default function EditTitle({ description, postId }) {
  const [state, formAction] = useFormState(updatePostDescription, initialState);
  const [text, setText] = useState(description);
  return (
    <form action={formAction}>
      <input hidden name="post_id" defaultValue={postId} />
      <input hidden name="description" value={text} onChange={(e) => setText(e.target.value)} />
        <textarea
        id="postDescription"
        name="description"
        defaultValue={description}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        rows="4"
      ></textarea>
      <button className="bg-purple-500 border hover:bg-purple-700 text-white py-2 px-4 rounded-xl m-2 input-shadow">Edit</button>
      <p className="text-red-400 text-xs">{state?.error}</p>
    </form>
  );
}
