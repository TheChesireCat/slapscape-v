import React from "react";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/app/components/Map"), {
  ssr: false,
});

export default async function Home() {



  return (
    <div>
      <MapWithNoSSR />
    </div>
  );
}
