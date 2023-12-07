"use client";

import { Heart } from "lucide-react";
import { addOrRemoveLike } from "../lib/actions";

export default function AddLike({ likeCount, isLiked, postId, username }) {
  return (
    <button
      onClick={() => addOrRemoveLike(postId, username)}
      type="button"
      className="h-10 text-purple-700 border border-purple-700 hover:bg-purple-700 hover:text-purple-200 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:focus:ring-purple-800 dark:hover:bg-purple-500"
    >
      Like {likeCount}{" "}
      <Heart
        className="ml-2"
        color="#8b5cf6"
        fill={isLiked ? "#8b5cf6" : "none"}
      />
    </button>
  );
}
