import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = createAdminClient();

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteTokenHash = crypto.createHash("sha256").update(inviteToken).digest("hex");

    const { data, error } = await (client.from("digital_asset_buyer_interest") as any)
      .insert([
        {
          digital_asset_id: body.assetId,
          buyer_name: body.buyerName || null,
          buyer_email: body.buyerEmail || null,
          buyer_phone: body.buyerPhone || null,
          status: "new",
          nda_status: "not_sent",
          invite_status: "pending",
          invite_token_hash: inviteTokenHash,
          portal_access_status: "invited",
          notes: body.notes || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, buyer: data, inviteToken });
  } catch (error) {
    console.error("Failed to create buyer:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create buyer" },
      { status: 500 }
    );
  }
}
