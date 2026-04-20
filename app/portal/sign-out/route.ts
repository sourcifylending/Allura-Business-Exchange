import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // Sign-out should fail closed but still send the user home.
  }

  return NextResponse.redirect(new URL("/", request.url));
}
