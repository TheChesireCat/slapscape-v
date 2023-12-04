"use client";

import { updateUserData } from "@/app/lib/actions";
import { Button } from "@/app/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

const initialState = {
  error: null,
};

export default function User({ userdata }) {
  const [state, formAction] = useFormState(updateUserData, initialState);
  //   console.log(userdata);

  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form
          action={formAction}
          className="bg-white mx-auto rounded-xl px-8 pb-8 pt-8 mb-4 shadow-lg w-full max-w-md"
        >
          <h1 className="text-xl font-bold text-center mb-6">
            Update Your Profile
          </h1>
          <input hidden id="username" name="username" defaultValue={userdata.username} />
          <div id="title-new-post" className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <label
              id="username"
              className="text-l block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {userdata.username}
            </label>
          </div>
          <div id="title-new-post" className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Change Password"
              className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></input>
          </div>
          <div className="mb-4 mx-auto">
            <img
              width="60"
              height="60"
              src={
                userdata?.user_img ||
                "https://img.icons8.com/ios-glyphs/30/user--v1.png"
              }
              alt="user--v1"
              className="rounded-full mx-auto border border-black border-spacing-1 p-1 mb-5"
            />
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div id="title-new-post" className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Bio"
            >
              Bio
            </label>
            <textarea
              id="bio"
              type="text"
              name="bio"
              placeholder="Enter Bio Here"
              defaultValue={userdata?.bio}
              className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="flex justify-center gap-4 mb-4">
          <Button
            type="submit"
            className="w-1/3 bg-gray-800 text-white p-4 rounded-xl button-shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
          >
            Update
          </Button>
          <Button
            type="button"
            className=" bg-red-800 text-white p-4 rounded-xl button-shadow hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
          >
            Delete Account
          </Button>
          <Button
            type="button"
            className=" bg-gray-800 text-white p-4 rounded-xl button-shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
          >
            <Link href="/home">Home</Link>
          </Button>
          </div>
          

        </form>
      </div>

      {userdata ? JSON.stringify(userdata) : "No user data"}
    </div>
  );
}
