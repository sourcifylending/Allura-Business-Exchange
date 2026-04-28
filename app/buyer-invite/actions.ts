"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyBuyerInviteToken } from "@/lib/invite-tokens";

export async function signNdaAction(formData: FormData) {
  const token = String(formData.get("token") || "");
  const signedName = String(formData.get("signed_name") || "").trim();
  const consent = formData.get("consent") === "yes";

  if (!token || !signedName || !consent) {
    redirect(`/buyer-invite?token=${encodeURIComponent(token)}`);
  }

  const verified = verifyBuyerInviteToken(token);

  if (!verified.ok) {
    redirect(`/buyer-invite?token=${encodeURIComponent(token)}`);
  }

  const client = createAdminClient();

  if (!client) {
    redirect(`/buyer-invite?token=${encodeURIComponent(token)}`);
  }

  await (client.from("digital_asset_buyer_interest") as any)
    .update({
      nda_status: "signed",
      buyer_stage: "nda_signed",
      nda_signed_date: new Date().toISOString(),
      nda_signed_name: signedName,
    })
    .eq("id", verified.buyerId);

  redirect(`/buyer-invite?token=${encodeURIComponent(token)}&signed=1`);
}
