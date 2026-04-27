import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = createClient();

    const { data, error } = await (client.from("digital_asset_buyer_interest") as any)
      .insert([
        {
          digital_asset_id: body.assetId,
          buyer_name: body.buyerName || null,
          buyer_email: body.buyerEmail || null,
          buyer_phone: body.buyerPhone || null,
          status: body.buyerStage || "new",
          nda_status: body.ndaStatus || "not_sent",
          buyer_stage: body.buyerStage || "new",
          next_follow_up_date: body.nextFollowUpDate || null,
          notes: body.notes || null,
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
