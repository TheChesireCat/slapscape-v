// import { NextResponse } from "next/server"
// import { getJwtSecretKey, verifyJwtToken } from "@/lib/auth";


// export async function middleware(request) {
//     if (request.nextUrl.pathname.startsWith('/login')) {
//         const token = request.cookies.get('AUTH_TOKEN');
//         if (token) {
//             return NextResponse.redirect(new URL('/home', request.url))
//         }    
//     }
// }


// export const config = {
//     matcher: [
//       /*
//        * Match all request paths except for the ones starting with:
//        * - api (API routes)
//        * - _next/static (static files)
//        * - _next/image (image optimization files)
//        * - favicon.ico (favicon file)
//        */
//       '/((?!api|login|register|_next/static|_next/image|favicon.ico).*)',
//     ],
//   }