import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { verifyJwtToken, getJwtSecretKey } from "@/app/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/app/components/ui/button";

const MapWithNoSSR = dynamic(() => import("@/app/components/Map"), {
  ssr: false,
});

const SidebarWithNoSSR = dynamic(() => import("@/app/components/Sidebar"), {
  ssr: false,
});

export default async function Home() {
  async function logout() {
    "use server";
    cookies().delete("AUTH_TOKEN");
    redirect("/login");
  }

  // const token = cookies().get("AUTH_TOKEN")?.value;
  // const payload = token ? await verifyJwtToken(token, getJwtSecretKey()) : null;
  // if (!payload) {
  //   redirect("/login");
  // }

  return (
    <div>
      {/* <div id="sidebar" className="h-full fixed top-0 left-0 bg-purple-200 overflow-x-hidden transition-all duration-500 pt-15">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()"
        >&times;</a
      >
      <a href="#">Saved</a>
      <a href="#">Settings</a>
      <a href="#">Submitted</a>
      <a href="#">Sign Out</a>
    </div>
     */}
      



      <MapWithNoSSR />
    </div>
  );
}
