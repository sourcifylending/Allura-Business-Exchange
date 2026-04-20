import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

type Claims = {
  email?: unknown;
  app_metadata?: {
    role?: unknown;
  };
};

type UpdateSessionResult = {
  claims: unknown | null;
  response: NextResponse;
};

export function isAlluraAdminClaims(claims: unknown) {
  if (!claims || typeof claims !== "object") {
    return false;
  }

  const typedClaims = claims as Claims;
  const email = typeof typedClaims.email === "string" ? typedClaims.email.toLowerCase() : "";
  const role = typedClaims.app_metadata?.role;

  return email === "abelf305@gmail.com" || role === "admin";
}

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
}

export async function updateSession(request: NextRequest): Promise<UpdateSessionResult> {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const hasValidUrl =
    typeof supabaseUrl === "string" &&
    supabaseUrl.length > 0 &&
    (() => {
      try {
        const parsedUrl = new URL(supabaseUrl);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
      } catch {
        return false;
      }
    })();

  if (!hasValidUrl || !supabaseKey) {
    return {
      claims: null,
      response,
    };
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data } = await supabase.auth.getClaims();

    return {
      claims: data?.claims ?? null,
      response,
    };
  } catch {
    return {
      claims: null,
      response,
    };
  }
}

export function attachCookies(source: NextResponse, target: NextResponse) {
  copyCookies(source, target);
  return target;
}
