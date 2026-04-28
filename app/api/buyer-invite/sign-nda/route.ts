import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyBuyerInviteToken } from "@/lib/invite-tokens";

export const dynamic = "force-dynamic";

function getIpAddress(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "Not captured";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = String(body.token || "");
    const signedName = String(body.signedName || "").trim();
    const consent = body.consent === true;

    if (!token) {
      return NextResponse.json({ error: "Invite token is missing." }, { status: 400 });
    }

    if (!signedName) {
      return NextResponse.json({ error: "Typed signature name is required." }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: "Electronic signature consent is required." }, { status: 400 });
    }

    const verified = verifyBuyerInviteToken(token);

    if (!verified.ok) {
      return NextResponse.json({ error: verified.error || "Invalid invite token." }, { status: 400 });
    }

    const client = createAdminClient();

    if (!client) {
      return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
    }

    const signedAt = new Date().toISOString();
    const ipAddress = getIpAddress(request);
    const userAgent = request.headers.get("user-agent") || "Not captured";

    const { error: updateError } = await (client.from("digital_asset_buyer_interest") as any)
      .update({
        nda_status: "signed",
        buyer_stage: "nda_signed",
        nda_signed_date: signedAt,
        nda_signed_name: signedName,
        nda_signed_ip: ipAddress,
        nda_signed_user_agent: userAgent,
        nda_version: "sourcify-asset-sale-v1",
        last_viewed_at: signedAt,
      })
      .eq("id", verified.buyerId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message || "Failed to save NDA signature." }, { status: 500 });
    }

    return NextResponse.json({ success: true, signedAt, message: "NDA signed successfully." });
  } catch (error) {
    console.error("Failed to sign NDA:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to sign NDA." }, { status: 500 });
  }
}
