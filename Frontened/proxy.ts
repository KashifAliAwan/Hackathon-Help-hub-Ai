import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/messages",
  "/ai-center",
  "/leaderboard",
  "/notifications",
  "/create-request",
  "/explore",
  "/requests",
  "/onboarding",
];

const AUTH_ROUTES = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/ai-center/:path*",
    "/leaderboard/:path*",
    "/notifications/:path*",
    "/create-request/:path*",
    "/explore/:path*",
    "/requests/:path*",
    "/onboarding/:path*",
    "/login",
    "/signup",
  ],
};
