import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { verifyJwtToken, getJwtSecretKey } from "@/app/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default async function Home() {
  async function logout() {
    "use server";
    cookies().delete("AUTH_TOKEN");
    redirect("/login");
  }

  const token = cookies().get("AUTH_TOKEN")?.value;
  const payload = token ? await verifyJwtToken(token, getJwtSecretKey()) : null;
  if (!payload) {
    redirect("/login");
  }

  return (
    <div>
      <form className="leaflet-control absolute top-24 left-24 z-40">
        <button
          type="button"
          className=" text-xl bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Create post
        </button>
        <button
          formAction={logout}
          className="text-xl bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Logout
        </button>
      </form>

      <MapWithNoSSR />
    </div>
  );
}
