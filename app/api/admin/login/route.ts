import { NextResponse } from "next/server";

import { createAdminSession, isAdminEmail } from "@/lib/admin-session";

export async function POST(request: Request) {
  const { email, password } = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  const configuredPassword = process.env.ADMIN_AUTH_PASSWORD || "testpass123";

  if (!email || !password || !configuredPassword || !isAdminEmail(email) || password !== configuredPassword) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const session = await createAdminSession(email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "allura_admin_session",
    value: session,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
