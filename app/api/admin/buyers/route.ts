import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = createAdminClient();

    if (!client) {
      return NextResponse.json(
        { error: "Supabase service role is not configured" },
        { status: 500 }
      );
    }

    if (!body.assetId) {
      return NextResponse.json({ error: "Asset is required" }, { status: 400 });
    }

    if (!body.buyerName?.trim()) {
      return NextResponse.json({ error: "Buyer name is required" }, { status: 400 });
    }

    const { data, error } = await (client.from("digital_asset_buyer_interest") as any)
      .insert([
        {
          digital_asset_id: body.assetId,
          buyer_name: body.buyerName.trim(),
          buyer_email: body.buyerEmail?.trim() || null,
          buyer_phone: body.buyerPhone?.trim() || null,
          status: "new",
          nda_status: body.ndaStatus || "not_sent",
          buyer_stage: body.buyerStage || "new",
          invite_status: "not_sent",
          proof_of_funds_status: "not_requested",
          next_follow_up_date: body.nextFollowUpDate || null,
          notes: body.notes?.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, buyer: data });
  } catch (error) {
    console.error("Failed to create buyer:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create buyer" },
      { status: 500 }
    );
  }
}
