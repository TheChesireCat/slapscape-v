"use client";

import { RemoveCircleOutline } from "@mui/icons-material";
import { deleteImage } from "../lib/actions";
import { useFormState, useFormStatus } from "react-dom";


const initialState = {
  error: null,
};

export default function DeleteImage({ image, postId }) {
  const [state, formAction] = useFormState(deleteImage, initialState);

  return (
    <form action={formAction}>
      <input hidden name="image" defaultValue={image} />
      <button
        type="submit"
        className="input-shadow absolute m-2 top-0 left-0 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg px-3 py-2 text-center items-center"
      >
        <RemoveCircleOutline className="mr-2" />
        Delete
      </button>
      <img
        src={image}
        alt={`Post Image`}
        className="w-full h-48 object-cover rounded-lg border border-gray-300 input-shadow"
      />
      <p className="text-xs text-red-500">{state?.result}</p>
    </form>
  );
}
