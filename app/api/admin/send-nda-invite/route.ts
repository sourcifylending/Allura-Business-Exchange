import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerId } = body;

    if (!buyerId) {
      return NextResponse.json(
        { error: "Buyer ID is required" },
        { status: 400 }
      );
    }

    const client = createAdminClient();

    const { data: buyer, error: buyerError } = await (
      client.from("digital_asset_buyer_interest") as any
    )
      .select("*, digital_assets(name)")
      .eq("id", buyerId)
      .single();

    if (buyerError || !buyer) {
      return NextResponse.json(
        { error: "Buyer not found" },
        { status: 404 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL;

    if (!resendApiKey || !resendFromEmail) {
      return NextResponse.json(
        {
          error: "Email service not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL environment variables.",
          success: false,
        },
        { status: 400 }
      );
    }

    // Generate a fresh invite token
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteTokenHash = crypto.createHash("sha256").update(inviteToken).digest("hex");

    const resend = new Resend(resendApiKey);
    const portalLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/portal/buyer?token=${inviteToken}`;

    const emailResult = await resend.emails.send({
      from: resendFromEmail,
      to: buyer.buyer_email,
      subject: "SourcifyLending Review Access - NDA Required",
      html: `
        <h2>Asset Review Invitation</h2>
        <p>You've been invited to review <strong>${buyer.digital_assets?.name || "an asset"}</strong> on SourcifyLending.</p>
        <p>Please review and sign the NDA to access full details.</p>
        <a href="${portalLink}" style="display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px;">Access Buyer Portal</a>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">This link is for ${buyer.buyer_email} only. Do not share.</p>
      `,
    });

    if (emailResult.error) {
      return NextResponse.json(
        { error: `Failed to send email: ${emailResult.error.message}` },
        { status: 500 }
      );
    }

    const updateResult = await (client.from("digital_asset_buyer_interest") as any)
      .update({
        invite_status: "sent",
        invite_sent_at: new Date().toISOString(),
        invite_token_hash: inviteTokenHash,
      })
      .eq("id", buyerId);

    if (updateResult.error) {
      console.error("Failed to update invite status:", updateResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "NDA invite sent successfully",
      emailId: emailResult.data?.id,
    });
  } catch (error) {
    console.error("Failed to send NDA invite:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send invite" },
      { status: 500 }
    );
  }
}
