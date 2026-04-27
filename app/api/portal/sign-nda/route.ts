import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, fullName, userAgent } = body;

    if (!token || !fullName) {
      return NextResponse.json(
        { error: "Token and full name are required" },
        { status: 400 }
      );
    }

    const client = createAdminClient();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const { data: buyer, error: fetchError } = await (
      client.from("digital_asset_buyer_interest") as any
    )
      .select("*")
      .eq("invite_token_hash", tokenHash)
      .single();

    if (fetchError || !buyer) {
      return NextResponse.json(
        { error: "Buyer record not found" },
        { status: 404 }
      );
    }

    const updateResult = await (client.from("digital_asset_buyer_interest") as any)
      .update({
        nda_status: "signed",
        nda_signed_name: fullName,
        nda_signed_user_agent: userAgent || null,
        nda_signed_date: new Date().toISOString(),
        portal_access_status: "active",
      })
      .eq("id", buyer.id);

    if (updateResult.error) {
      throw updateResult.error;
    }

    return NextResponse.json({
      success: true,
      message: "NDA signed successfully",
    });
  } catch (error) {
    console.error("Failed to sign NDA:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sign NDA" },
      { status: 500 }
    );
  }
}
