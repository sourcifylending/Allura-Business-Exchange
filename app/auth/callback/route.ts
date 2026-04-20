import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { activateInvitedPortalAccess, type PortalRole } from "@/lib/portal-access";

function resolveRole(value: string | null): PortalRole | null {
  return value === "buyer" || value === "seller" ? value : null;
}

function portalRouteForRole(role: PortalRole) {
  return role === "buyer" ? "/portal/buyer" : "/portal/seller";
}

function errorRedirect(request: NextRequest, message: string) {
  return NextResponse.redirect(new URL(`/portal?error=${encodeURIComponent(message)}`, request.url));
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const role = resolveRole(url.searchParams.get("type"));

  if (!code || !role) {
    return errorRedirect(request, "Invite link is missing the required activation details.");
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      return errorRedirect(request, "Unable to complete the invited-user sign in.");
    }

    const activation = await activateInvitedPortalAccess(role, data.user.id, data.user.email);

    if (!activation.ok) {
      return errorRedirect(request, activation.error);
    }

    return NextResponse.redirect(
      new URL(`${portalRouteForRole(activation.kind)}?activated=1`, request.url)
    );
  } catch {
    return errorRedirect(request, "Unable to complete the invited-user sign in.");
  }
}
