import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { attachCookies, isAlluraAdminClaims, updateSession } from "@/lib/supabase/proxy";
import { getAdminCookieName, verifyAdminSession } from "@/lib/admin-session";
import { getAppHostname, isAppHostname, getAdminHostname, isAdminHostname } from "@/lib/app-url";

function isPortalPath(pathname: string) {
  return pathname === "/portal" || pathname.startsWith("/portal/");
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAppPath(pathname: string) {
  return pathname === "/login" || pathname === "/auth/callback" || isPortalPath(pathname);
}

function getRequestHostname(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.hostname;
  const host = forwardedHost.split(",")[0]?.trim().toLowerCase() ?? "";

  return host.split(":")[0] ?? host;
}

function redirectToAppHost(request: NextRequest, pathname: string) {
  const destination = new URL(pathname, `https://${getAppHostname()}`);
  return NextResponse.redirect(destination);
}

function redirectToAdminHost(request: NextRequest, pathname: string) {
  const destination = new URL(pathname, `https://${getAdminHostname()}`);
  return NextResponse.redirect(destination);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = getRequestHostname(request);
  const isAppHost = isAppHostname(hostname);
  const isAdminHost = isAdminHostname(hostname);

  // Root domain - redirect app-only paths to app subdomain
  if (!isAppHost && !isAdminHost) {
    if (pathname === "/login") {
      return redirectToAppHost(request, "/login");
    }
    if (isPortalPath(pathname)) {
      return redirectToAppHost(request, pathname);
    }
    if (isAdminPath(pathname)) {
      return redirectToAdminHost(request, pathname);
    }
    // Root domain serves public marketing pages
    return NextResponse.next();
  }

  // Admin subdomain
  if (isAdminHost) {
    // Redirect portal paths to app host (admins don't access portal)
    if (isPortalPath(pathname)) {
      return redirectToAppHost(request, pathname);
    }

    // Allow API and auth routes on admin host
    if (pathname.startsWith("/api/") || pathname === "/auth/callback") {
      return NextResponse.next();
    }

    // Handle admin-only routes
    const { claims, response } = await updateSession(request);
    const isAdminCookieValid = await verifyAdminSession(request.cookies.get(getAdminCookieName())?.value);
    const isAdmin = isAlluraAdminClaims(claims) || isAdminCookieValid;

    if (pathname === "/" || pathname === "") {
      if (isAdmin) {
        return attachCookies(response, NextResponse.redirect(new URL("/admin", request.url)));
      }
      return attachCookies(response, NextResponse.redirect(new URL("/login", request.url)));
    }

    if (isAdminPath(pathname)) {
      if (!isAdmin) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return attachCookies(response, NextResponse.redirect(loginUrl));
      }
      return response;
    }

    if (pathname === "/login") {
      if (isAdmin) {
        return attachCookies(response, NextResponse.redirect(new URL("/admin", request.url)));
      }
      return response;
    }

    // Deny access to other paths on admin host
    return NextResponse.redirect(new URL("/", request.url));
  }

  // App subdomain
  if (isAppHost) {
    // Redirect admin paths to admin host
    if (isAdminPath(pathname)) {
      return redirectToAdminHost(request, pathname);
    }

    const { claims, response } = await updateSession(request);

    // App root - go to portal or login
    if (pathname === "/" || pathname === "") {
      if (claims) {
        return attachCookies(response, NextResponse.redirect(new URL("/portal", request.url)));
      }
      return attachCookies(response, NextResponse.redirect(new URL("/login", request.url)));
    }

    // Portal routes require auth
    if (isPortalPath(pathname)) {
      if (!claims) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return attachCookies(response, NextResponse.redirect(loginUrl));
      }
      return response;
    }

    // Allow login and auth/callback without session check
    if (pathname === "/login" || pathname === "/auth/callback") {
      return response;
    }

    // Deny unknown paths on app host
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml).*)"],
};
