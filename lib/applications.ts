import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BuyerApplicationRow, SellerApplicationRow } from "@/lib/supabase/database.types";

type BuyerApplicationValues = Omit<
  BuyerApplicationRow,
  "id" | "created_at" | "updated_at" | "reviewed_at" | "reviewed_by" | "invited_at" | "invited_by" | "linked_user_id"
>;
type SellerApplicationValues = Omit<
  SellerApplicationRow,
  "id" | "created_at" | "updated_at" | "reviewed_at" | "reviewed_by" | "invited_at" | "invited_by" | "linked_user_id"
>;

function hasSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return Boolean(
    url &&
      key &&
      (() => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      })(),
  );
}

function normalizeListField(value: string) {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function readBuyerApplicationFormData(formData: FormData) {
  const readText = (name: keyof BuyerApplicationValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const buyerType = readText("buyer_type");
  const proofOfFundsStatus = readText("proof_of_funds_status");
  const urgency = readText("urgency");

  const validBuyerTypes = ["operator", "investor", "hybrid"] as const;
  const validProofOfFunds = ["not_shown", "unverified", "verified"] as const;
  const validUrgency = ["low", "medium", "high"] as const;

  const invalid =
    !readText("applicant_name") ||
    !readText("email") ||
    !readText("phone") ||
    !validBuyerTypes.includes(buyerType as (typeof validBuyerTypes)[number]) ||
    !readText("budget_range") ||
    normalizeListField(readText("niches_of_interest")).length === 0 ||
    normalizeListField(readText("asset_preferences")).length === 0 ||
    !validProofOfFunds.includes(proofOfFundsStatus as (typeof validProofOfFunds)[number]) ||
    !validUrgency.includes(urgency as (typeof validUrgency)[number]) ||
    !readText("message");

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  return {
    data: {
      applicant_name: readText("applicant_name"),
      email: readText("email"),
      phone: readText("phone"),
      buyer_type: buyerType as BuyerApplicationRow["buyer_type"],
      budget_range: readText("budget_range"),
      niches_of_interest: normalizeListField(readText("niches_of_interest")),
      asset_preferences: normalizeListField(readText("asset_preferences")),
      proof_of_funds_status: proofOfFundsStatus as BuyerApplicationRow["proof_of_funds_status"],
      urgency: urgency as BuyerApplicationRow["urgency"],
      message: readText("message"),
      status: "submitted" as BuyerApplicationRow["status"],
      admin_notes: "",
    } satisfies BuyerApplicationValues,
  } as const;
}

function readSellerApplicationFormData(formData: FormData) {
  const readText = (name: keyof SellerApplicationValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const invalid =
    !readText("applicant_name") ||
    !readText("email") ||
    !readText("phone") ||
    !readText("business_name") ||
    !readText("industry") ||
    !readText("asset_type") ||
    !readText("asking_price_range") ||
    !readText("summary") ||
    !readText("reason_for_selling");

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  return {
    data: {
      applicant_name: readText("applicant_name"),
      email: readText("email"),
      phone: readText("phone"),
      business_name: readText("business_name"),
      website: readText("website"),
      industry: readText("industry"),
      asset_type: readText("asset_type"),
      asking_price_range: readText("asking_price_range"),
      summary: readText("summary"),
      reason_for_selling: readText("reason_for_selling"),
      status: "submitted" as SellerApplicationRow["status"],
      admin_notes: "",
    } satisfies SellerApplicationValues,
  } as const;
}

export async function createBuyerApplication(formData: FormData) {
  "use server";

  if (!hasSupabaseEnv()) {
    redirect("/buyers/apply?error=Application%20submission%20is%20temporarily%20unavailable.");
  }

  const parsed = readBuyerApplicationFormData(formData);

  if ("error" in parsed) {
    redirect(`/buyers/apply?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("buyer_applications").insert(parsed.data as never);

    if (error) {
      redirect("/buyers/apply?error=Unable%20to%20submit%20your%20application.");
    }

    redirect("/buyers/apply?submitted=1");
  } catch {
    redirect("/buyers/apply?error=Unable%20to%20submit%20your%20application.");
  }
}

export async function createSellerApplication(formData: FormData) {
  "use server";

  if (!hasSupabaseEnv()) {
    redirect("/sellers/apply?error=Application%20submission%20is%20temporarily%20unavailable.");
  }

  const parsed = readSellerApplicationFormData(formData);

  if ("error" in parsed) {
    redirect(`/sellers/apply?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("seller_applications").insert(parsed.data as never);

    if (error) {
      redirect("/sellers/apply?error=Unable%20to%20submit%20your%20application.");
    }

    redirect("/sellers/apply?submitted=1");
  } catch {
    redirect("/sellers/apply?error=Unable%20to%20submit%20your%20application.");
  }
}
