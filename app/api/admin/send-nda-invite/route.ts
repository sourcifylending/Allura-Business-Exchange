import { createAdminClient } from "@/lib/supabase/admin";
import { getAppUrl } from "@/lib/app-url";
import { createBuyerInviteToken } from "@/lib/invite-tokens";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerId } = body;

    if (!buyerId) {
      return NextResponse.json({ error: "Buyer ID is required" }, { status: 400 });
    }

    const client = createAdminClient();

    if (!client) {
      return NextResponse.json(
        { error: "Supabase service role is not configured." },
        { status: 500 }
      );
    }

    const { data: buyer, error: buyerError } = await (client.from("digital_asset_buyer_interest") as any)
      .select("*, digital_assets(name)")
      .eq("id", buyerId)
      .single();

    if (buyerError || !buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    if (!buyer.buyer_email) {
      return NextResponse.json({ error: "Buyer email is required before sending an invite." }, { status: 400 });
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

    const inviteToken = createBuyerInviteToken(buyerId);
    const portalLink = `${getAppUrl()}/buyer-invite?token=${encodeURIComponent(inviteToken)}`;
    const assetName = buyer.digital_assets?.name || "the asset";

    const resend = new Resend(resendApiKey);
    const emailResult = await resend.emails.send({
      from: resendFromEmail,
      to: buyer.buyer_email,
      subject: `${assetName} Review Access - NDA Required`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #111827;">
          <h2 style="font-size: 28px; margin: 0 0 16px;">Asset Review Invitation</h2>
          <p style="font-size: 16px; line-height: 1.6;">You've been invited by Allura Business Exchange to review <strong>${assetName}</strong>.</p>
          <p style="font-size: 16px; line-height: 1.6;">Please review and sign the NDA before accessing full details.</p>
          <a href="${portalLink}" style="display: inline-block; margin-top: 12px; padding: 14px 24px; background: #0f172a; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 700;">Access Buyer Portal</a>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">This secure link is for ${buyer.buyer_email} only. Do not share.</p>
        </div>
      `,
    });

    if (emailResult.error) {
      return NextResponse.json(
        { error: `Failed to send email: ${emailResult.error.message}` },
        { status: 500 }
      );
    }

    const { error: updateError } = await (client.from("digital_asset_buyer_interest") as any)
      .update({
        nda_status: "sent",
        buyer_stage: "nda_sent",
        invite_status: "sent",
        invite_sent_at: new Date().toISOString(),
        last_contacted_at: new Date().toISOString(),
      })
      .eq("id", buyerId);

    if (updateError) {
      console.error("Failed to update invite status:", updateError);
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
