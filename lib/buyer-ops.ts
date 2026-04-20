import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  BuyerRow,
  BuyerStage,
  BuyerType,
  InquiryRow,
  InquiryStage,
  InquiryStatus,
  ProofOfFundsStatus,
} from "@/lib/supabase/database.types";
export type { BuyerStage, BuyerType, InquiryStage, InquiryStatus, ProofOfFundsStatus } from "@/lib/supabase/database.types";

export type BuyerRecord = Readonly<Omit<BuyerRow, "created_at" | "updated_at">>;

export type InquiryRecord = Readonly<Omit<InquiryRow, "created_at" | "updated_at">> & {
  buyer_name?: string | null;
};

export const buyerTypeLabels: Record<BuyerType, string> = {
  operator: "Operator",
  investor: "Investor",
  hybrid: "Hybrid",
};

export const buyerStageLabels: Record<BuyerStage, string> = {
  new: "New",
  qualified: "Qualified",
  active: "Active",
  watching: "Watching",
  closed: "Closed",
};

export const proofOfFundsLabels: Record<ProofOfFundsStatus, string> = {
  not_shown: "Not Shown",
  unverified: "Unverified",
  verified: "Verified",
};

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  qualified: "Qualified",
  not_fit: "Not Fit",
  waiting: "Waiting",
};

export const inquiryStageLabels: Record<InquiryStage, string> = {
  inbox: "Inbox",
  triage: "Triage",
  qualified: "Qualified",
  handoff: "Handoff",
  closed: "Closed",
};

export const buyerStageOrder: BuyerStage[] = ["new", "qualified", "active", "watching", "closed"];
export const inquiryStageOrder: InquiryStage[] = ["inbox", "triage", "qualified", "handoff", "closed"];

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

function mapBuyerRowToRecord(row: BuyerRow): BuyerRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;
  return record;
}

function mapInquiryRowToRecord(row: InquiryRow): InquiryRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;
  return record;
}

type BuyerFormValues = Omit<BuyerRow, "id" | "created_at" | "updated_at">;
type InquiryFormValues = Omit<InquiryRow, "id" | "created_at" | "updated_at">;

function readBuyerFormData(formData: FormData) {
  const readText = (name: keyof BuyerFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const validBuyerTypes = ["operator", "investor", "hybrid"] as const;
  const validProofOfFunds = ["not_shown", "unverified", "verified"] as const;
  const validStages = ["new", "qualified", "active", "watching", "closed"] as const;
  const validUrgency = ["low", "medium", "high"] as const;

  const nichesOfInterest = normalizeListField(readText("niches_of_interest"));
  const assetPreferences = normalizeListField(readText("asset_preferences"));
  const buyerType = readText("buyer_type");
  const proofOfFundsStatus = readText("proof_of_funds_status");
  const operatorOrInvestor = readText("operator_or_investor");
  const urgency = readText("urgency");
  const currentStage = readText("current_stage");

  const invalid =
    !readText("buyer_name") ||
    !validBuyerTypes.includes(buyerType as (typeof validBuyerTypes)[number]) ||
    !readText("budget") ||
    nichesOfInterest.length === 0 ||
    assetPreferences.length === 0 ||
    !validProofOfFunds.includes(proofOfFundsStatus as (typeof validProofOfFunds)[number]) ||
    !validBuyerTypes.includes(operatorOrInvestor as (typeof validBuyerTypes)[number]) ||
    !validUrgency.includes(urgency as (typeof validUrgency)[number]) ||
    !readText("inquiry_history") ||
    !validStages.includes(currentStage as (typeof validStages)[number]) ||
    !readText("next_action");

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  return {
    data: {
      buyer_name: readText("buyer_name"),
      buyer_type: buyerType as BuyerType,
      budget: readText("budget"),
      niches_of_interest: nichesOfInterest,
      asset_preferences: assetPreferences,
      proof_of_funds_status: proofOfFundsStatus as ProofOfFundsStatus,
      operator_or_investor: operatorOrInvestor as BuyerType,
      urgency: urgency as BuyerRow["urgency"],
      inquiry_history: readText("inquiry_history"),
      current_stage: currentStage as BuyerStage,
      next_action: readText("next_action"),
    } satisfies BuyerFormValues,
  } as const;
}

function readInquiryFormData(formData: FormData) {
  const readText = (name: keyof InquiryFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const stage = readText("stage");
  const qualificationStatus = readText("qualification_status");
  const validStages = ["inbox", "triage", "qualified", "handoff", "closed"] as const;
  const validStatuses = ["new", "reviewing", "qualified", "not_fit", "waiting"] as const;

  const invalid =
    !readText("source") ||
    !readText("asset_interested_in") ||
    !readText("timestamp") ||
    !readText("assigned_owner") ||
    !readText("next_step") ||
    !readText("response_sla") ||
    !readText("notes_summary") ||
    !validStatuses.includes(qualificationStatus as (typeof validStatuses)[number]) ||
    !validStages.includes(stage as (typeof validStages)[number]);

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  const buyerId = readText("buyer_id");

  return {
    data: {
      source: readText("source"),
      asset_interested_in: readText("asset_interested_in"),
      buyer_id: buyerId || null,
      timestamp: readText("timestamp"),
      qualification_status: qualificationStatus as InquiryStatus,
      assigned_owner: readText("assigned_owner"),
      next_step: readText("next_step"),
      response_sla: readText("response_sla"),
      stage: stage as InquiryStage,
      notes_summary: readText("notes_summary"),
    } satisfies InquiryFormValues,
  } as const;
}

function readId(formData: FormData) {
  const idValue = formData.get("id");
  return typeof idValue === "string" ? idValue.trim() : "";
}

function revalidateBuyerPages() {
  revalidatePath("/admin/buyers");
  revalidatePath("/admin/inquiries");
}

function revalidateInquiryPages() {
  revalidatePath("/admin/buyers");
  revalidatePath("/admin/inquiries");
}

export async function getBuyerRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("buyers").select("*").order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(mapBuyerRowToRecord);
  } catch {
    return [];
  }
}

export async function getInquiryRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(mapInquiryRowToRecord);
  } catch {
    return [];
  }
}

export function attachBuyerNames(inquiries: InquiryRecord[], buyers: BuyerRecord[]) {
  const buyerMap = new Map(buyers.map((buyer) => [buyer.id, buyer.buyer_name]));

  return inquiries.map((inquiry) => ({
    ...inquiry,
    buyer_name: inquiry.buyer_id ? buyerMap.get(inquiry.buyer_id) ?? null : null,
  }));
}

export async function createBuyerRecord(formData: FormData) {
  "use server";

  const parsed = readBuyerFormData(formData);

  if ("error" in parsed) {
    redirect(`/admin/buyers?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("buyers").insert({
      id: randomUUID(),
      ...parsed.data,
    } as never);

    if (error) {
      redirect("/admin/buyers?error=Unable%20to%20save%20the%20new%20buyer.");
    }

    revalidateBuyerPages();
    redirect("/admin/buyers?saved=created");
  } catch {
    redirect("/admin/buyers?error=Unable%20to%20save%20the%20new%20buyer.");
  }
}

export async function updateBuyerRecord(formData: FormData) {
  "use server";

  const id = readId(formData);
  const parsed = readBuyerFormData(formData);

  if (!id) {
    redirect("/admin/buyers?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(`/admin/buyers?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("buyers").update(parsed.data as never).eq("id", id);

    if (error) {
      redirect("/admin/buyers?error=Unable%20to%20update%20the%20buyer.");
    }

    revalidateBuyerPages();
    redirect("/admin/buyers?saved=updated");
  } catch {
    redirect("/admin/buyers?error=Unable%20to%20update%20the%20buyer.");
  }
}

export async function createInquiryRecord(formData: FormData) {
  "use server";

  const parsed = readInquiryFormData(formData);

  if ("error" in parsed) {
    redirect(
      `/admin/inquiries?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("inquiries").insert({
      id: randomUUID(),
      ...parsed.data,
    } as never);

    if (error) {
      redirect("/admin/inquiries?error=Unable%20to%20save%20the%20new%20inquiry.");
    }

    revalidateInquiryPages();
    redirect("/admin/inquiries?saved=created");
  } catch {
    redirect("/admin/inquiries?error=Unable%20to%20save%20the%20new%20inquiry.");
  }
}

export async function updateInquiryRecord(formData: FormData) {
  "use server";

  const id = readId(formData);
  const parsed = readInquiryFormData(formData);

  if (!id) {
    redirect("/admin/inquiries?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(
      `/admin/inquiries?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("inquiries").update(parsed.data as never).eq("id", id);

    if (error) {
      redirect("/admin/inquiries?error=Unable%20to%20update%20the%20inquiry.");
    }

    revalidateInquiryPages();
    redirect("/admin/inquiries?saved=updated");
  } catch {
    redirect("/admin/inquiries?error=Unable%20to%20update%20the%20inquiry.");
  }
}
