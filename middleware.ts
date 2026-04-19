import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { attachCookies, updateSession } from "@/lib/supabase/proxy";

export async function middleware(request: NextRequest) {
  const { claims, response } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";

  if (isAdminRoute && !claims) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return attachCookies(response, NextResponse.redirect(loginUrl));
  }

  if (isLoginRoute && claims) {
    return attachCookies(response, NextResponse.redirect(new URL("/admin", request.url)));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
