import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapBasicWithNoSSR = dynamic(() => import("@/app/components/MapBasic"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <div>
        <div
          id="landing"
          className="leaflet-control absolute top-0 left-0 right-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-50 m-4"
        >
          <h1 className="text-6xl text-white font-bold mb-4">
            Welcome to Slapscape
          </h1>
          <div className="text-center">
            <Link
              className="text-xl bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-xl mx-2 button-shadow "
              href="/login"
            >
              Login
            </Link>
            <Link
              className="text-xl bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl button-shadow  mx-2"
              href="/register"
            >
              Register
            </Link>
          </div>
        </div>

        {/* <button className="leaflet-control absolute top-24 left-24 z-40 text-xl bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
        Create post
      </button> */}
        <MapBasicWithNoSSR />

      </div>
    </main>
  );
}
