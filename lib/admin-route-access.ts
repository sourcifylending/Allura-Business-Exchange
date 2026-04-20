import { type NextRequest } from "next/server";
import { getAdminCookieName, verifyAdminSession } from "@/lib/admin-session";
import { isAlluraAdminClaims, updateSession } from "@/lib/supabase/proxy";

export async function isAuthorizedAdminRequest(request: NextRequest) {
  const { claims } = await updateSession(request);
  const cookieValue = request.cookies.get(getAdminCookieName())?.value;
  return isAlluraAdminClaims(claims) || verifyAdminSession(cookieValue);
}
