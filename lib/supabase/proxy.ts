import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

type UpdateSessionResult = {
  claims: unknown | null;
  response: NextResponse;
};

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
}

export async function updateSession(request: NextRequest): Promise<UpdateSessionResult> {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();

  return {
    claims: data?.claims ?? null,
    response,
  };
}

export function attachCookies(source: NextResponse, target: NextResponse) {
  copyCookies(source, target);
  return target;
}
