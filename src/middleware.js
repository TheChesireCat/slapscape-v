// import { NextResponse } from "next/server";
// import { verifyJwtToken } from "@/app/lib/auth";

// export async function middleware(request) {
//     const token = request.cookies.get("AUTH_TOKEN");
//     console.log(token);
//     console.log(await verifyJwtToken(token));
//    if (request.nextUrl.pathname.startsWith("/home")) {
//      if (!token || !(await verifyJwtToken(token))) {
//        return NextResponse.redirect(new URL('/login', request.url))
//     }
//    }

//   if (request.nextUrl.pathname.startsWith("/login")) {
//     if (token && (await verifyJwtToken(token))) {
//       return NextResponse.redirect(new URL("/home", request.url));
//     }
//   }

//   return NextResponse.next();
// }

import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/app/lib/auth";

const AUTH_PAGES = ["/login"];

const isAuthPages = (url) => AUTH_PAGES.some((page) => page.startsWith(url));

export async function middleware(request) {

  const { url, nextUrl, cookies } = request;
  const { value: token } = cookies.get("AUTH_TOKEN") ?? { value: null };
  const hasVerifiedToken = token && (await verifyJwtToken(token));
  const isAuthPageRequested = isAuthPages(nextUrl.pathname);

  if (isAuthPageRequested) {
    if (!hasVerifiedToken) {
      const response = NextResponse.next();
      response.cookies.delete("AUTH_TOKEN");
      return response;
    }
    const response = NextResponse.redirect(new URL(`/home`, url));
    return response;
  }

  if (!hasVerifiedToken) {
    // const searchParams = new URLSearchParams(nextUrl.searchParams);
    // searchParams.set("next", nextUrl.pathname);
    const response = NextResponse.redirect(
      new URL(`/login`, url)
    );
    response.cookies.delete("AUTH_TOKEN");
    return response;
  }

  return NextResponse.next();

}
export const config = { matcher: ["/login", "/home/:path*"] };
// export const config = { matcher: ["/login", "/home/:path*","/api/:path*"] };