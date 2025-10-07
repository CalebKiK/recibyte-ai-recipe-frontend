// This is a middleware file for providing server side protection and security of routes and urls that need authentication for users to access
import { NextResponse } from "next/server";

export function middleware(req) {
  // const accessToken = req.cookies.get("access_token");
  const refreshToken = req.cookies.get("refresh_token");
  
  // If trying to access dashboard without token, redirect
  if (!refreshToken && req.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/authentication", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // protect dashboard and subroutes
};