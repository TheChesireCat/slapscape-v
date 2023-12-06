"use client";

import { Comment } from "@mui/icons-material";
import { addComment } from "../lib/actions";
import { use, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";

const initialState = {
  error: null,
};

export default function AddComment({ postId, username }) {
  const [text, setText] = useState("");
  const [state, formAction] = useFormState(addComment, initialState);

  return (
    <div className="m-8 flex justify-center items-center">
      <form className="w-full" action={formAction}>
        <input hidden name="commentText" value={text} onChange={(e) => setText(e.target.value)}/>
        <input hidden name="username" defaultValue={username} />
        <input hidden name="post_id" defaultValue={postId} />
        <div className="input-shadow h-20 w-full py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <label className="sr-only">Your comment</label>
          <textarea
            id="comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full px-0 text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
            placeholder="Write a comment..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-purple-500 border hover:bg-purple-700 text-white py-2 px-4 rounded-xl m-2 input-shadow"
        >
          Comment <Comment className="ml-2" />
        </button>
        <p className="text-red">{state?.error}</p>
      </form>
    </div>
  );
}
