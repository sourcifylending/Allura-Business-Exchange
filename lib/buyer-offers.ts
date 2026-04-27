import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getBuyerPortalOpportunityById } from "@/lib/buyer-opportunities";
import { requireActivatedBuyerPortalAccess } from "@/lib/portal-access";
import type {
  AssetPackagingRow,
  AssetRegistryRow,
  OfferDispositionStatus,
  OfferRow,
  BuyerApplicationRow,
  BuyerOfferSubmissionRow,
  BuyerOfferSubmissionStatus,
} from "@/lib/supabase/database.types";

const activeSubmissionStatuses: BuyerOfferSubmissionStatus[] = [
  "submitted",
  "under_review",
  "needs_follow_up",
  "approved_to_present",
  "converted_to_offer",
];

const buyerOfferStatusOrder: BuyerOfferSubmissionStatus[] = [
  "submitted",
  "under_review",
  "needs_follow_up",
  "approved_to_present",
  "converted_to_offer",
  "declined",
  "withdrawn",
];

export const buyerOfferStatusLabels: Record<BuyerOfferSubmissionStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  needs_follow_up: "Needs Follow Up",
  approved_to_present: "Approved to Present",
  converted_to_offer: "Converted to Offer",
  declined: "Declined",
  withdrawn: "Withdrawn",
};

export const buyerVisibleOfferStatusLabels: Record<
  "submitted" | "under_review" | "seller_reviewing" | "follow_up_needed" | "declined" | "advancing",
  string
> = {
  submitted: "Submitted",
  under_review: "Under Review",
  seller_reviewing: "Seller Reviewing",
  follow_up_needed: "Follow-up Needed",
  declined: "Declined",
  advancing: "Advancing",
};

export type BuyerOfferSubmissionRecord = Readonly<{
  id: string;
  buyer_application_id: string;
  asset_packaging_id: string;
  owner_user_id: string;
  asset_name: string;
  asset_slug: string;
  niche: string;
  asset_type: string;
  portal_summary: string;
  asking_price: string;
  proposed_price: string;
  structure_preference: string;
  financing_plan: string;
  target_close_date: string;
  notes: string;
  status: BuyerOfferSubmissionStatus;
  offer_record_id: string | null;
  offer_disposition_status: OfferDispositionStatus | null;
  offer_disposition_note: string | null;
  offer_disposition_at: string | null;
  buyer_visible_status: string;
  created_at: string;
  updated_at: string;
}>;

export type BuyerOfferAdminRecord = Readonly<BuyerOfferSubmissionRecord & {
  buyer_name: string;
  buyer_email: string;
  admin_notes: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}>;

type SubmissionPayload = Omit<BuyerOfferSubmissionRow, "id" | "created_at" | "updated_at">;

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

function isActiveSubmissionStatus(status: BuyerOfferSubmissionStatus) {
  return activeSubmissionStatuses.includes(status);
}

function mapBuyerVisibleStatus(
  submissionStatus: BuyerOfferSubmissionStatus,
  offerDispositionStatus: OfferDispositionStatus | null,
): string {
  if (offerDispositionStatus === "seller_review") {
    return buyerVisibleOfferStatusLabels.seller_reviewing;
  }

  if (offerDispositionStatus === "seller_interested" || offerDispositionStatus === "advance_to_contract") {
    return buyerVisibleOfferStatusLabels.advancing;
  }

  if (offerDispositionStatus === "request_follow_up") {
    return buyerVisibleOfferStatusLabels.follow_up_needed;
  }

  if (offerDispositionStatus === "seller_declined" || offerDispositionStatus === "close_out") {
    return buyerVisibleOfferStatusLabels.declined;
  }

  switch (submissionStatus) {
    case "submitted":
      return buyerVisibleOfferStatusLabels.submitted;
    case "under_review":
      return buyerVisibleOfferStatusLabels.under_review;
    case "needs_follow_up":
      return buyerVisibleOfferStatusLabels.follow_up_needed;
    case "approved_to_present":
    case "converted_to_offer":
      return buyerVisibleOfferStatusLabels.advancing;
    case "declined":
    case "withdrawn":
      return buyerVisibleOfferStatusLabels.declined;
    default:
      return buyerVisibleOfferStatusLabels.submitted;
  }
}

function mapSubmissionRow(
  row: BuyerOfferSubmissionRow,
  packagingMap: ReadonlyMap<string, AssetPackagingRow>,
  registryMap: ReadonlyMap<string, AssetRegistryRow>,
  offerMap: ReadonlyMap<string, OfferRow>,
): BuyerOfferSubmissionRecord | null {
  const packaging = packagingMap.get(row.asset_packaging_id);

  if (!packaging) {
    return null;
  }

  const asset = registryMap.get(packaging.asset_registry_id);
  const offer = row.offer_record_id ? offerMap.get(row.offer_record_id) ?? null : null;

  return {
    id: row.id,
    buyer_application_id: row.buyer_application_id,
    asset_packaging_id: row.asset_packaging_id,
    owner_user_id: row.owner_user_id,
    asset_name: asset?.asset_name ?? "Unknown asset",
    asset_slug: asset?.slug ?? packaging.asset_registry_id,
    niche: asset?.niche ?? "Uncategorized",
    asset_type: asset?.target_buyer_type ?? packaging.buyer_type,
    portal_summary: packaging.portal_summary || packaging.short_listing_description,
    asking_price: packaging.asking_price,
    proposed_price: row.proposed_price,
    structure_preference: row.structure_preference,
    financing_plan: row.financing_plan,
    target_close_date: row.target_close_date,
    notes: row.notes,
    status: row.status,
    offer_record_id: row.offer_record_id,
    offer_disposition_status: offer?.disposition_status ?? null,
    offer_disposition_note: offer?.disposition_note ?? null,
    offer_disposition_at: offer?.disposition_at ?? null,
    buyer_visible_status: mapBuyerVisibleStatus(row.status, offer?.disposition_status ?? null),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapSubmissionRowToAdminRecord(
  row: BuyerOfferSubmissionRow,
  buyerMap: ReadonlyMap<string, BuyerApplicationRow>,
  packagingMap: ReadonlyMap<string, AssetPackagingRow>,
  registryMap: ReadonlyMap<string, AssetRegistryRow>,
  offerMap: ReadonlyMap<string, OfferRow>,
): BuyerOfferAdminRecord | null {
  const buyer = buyerMap.get(row.buyer_application_id);
  const submission = mapSubmissionRow(row, packagingMap, registryMap, offerMap);

  if (!buyer || !submission) {
    return null;
  }

  return {
    ...submission,
    buyer_name: buyer.applicant_name,
    buyer_email: buyer.email,
    admin_notes: row.admin_notes,
    reviewed_at: row.reviewed_at,
    reviewed_by: row.reviewed_by,
  };
}

async function getOfferLookupMap(adminClient: ReturnType<typeof createAdminClient>, rows: BuyerOfferSubmissionRow[]) {
  if (!adminClient) {
    return new Map<string, OfferRow>();
  }

  const offerIds = [...new Set(rows.map((row) => row.offer_record_id).filter((value): value is string => Boolean(value)))];
  if (offerIds.length === 0) {
    return new Map<string, OfferRow>();
  }

  const result = await adminClient.from("offers").select("*").in("id", offerIds);
  if (result.error || !result.data) {
    return new Map<string, OfferRow>();
  }

  return new Map((result.data as OfferRow[]).map((offer) => [offer.id, offer]));
}

function readSubmissionFormData(formData: FormData) {
  const readText = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const opportunityId = readText("asset_packaging_id");
  const proposedPrice = readText("proposed_price");
  const structurePreference = readText("structure_preference");
  const financingPlan = readText("financing_plan");
  const targetCloseDate = readText("target_close_date");
  const notes = readText("notes");

  if (!opportunityId || !proposedPrice || !structurePreference || !financingPlan || !targetCloseDate || !notes) {
    return { error: "Please complete all required fields." } as const;
  }

  return {
    data: {
      asset_packaging_id: opportunityId,
      proposed_price: proposedPrice,
      structure_preference: structurePreference,
      financing_plan: financingPlan,
      target_close_date: targetCloseDate,
      notes,
    },
  } as const;
}

function readStatus(formData: FormData): BuyerOfferSubmissionStatus | null {
  const value = formData.get("status");
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return buyerOfferStatusOrder.includes(trimmed as BuyerOfferSubmissionStatus)
    ? (trimmed as BuyerOfferSubmissionStatus)
    : null;
}

function readRecordId(formData: FormData) {
  const value = formData.get("id");
  return typeof value === "string" ? value.trim() : "";
}

function readReturnTo(formData: FormData, fallback: string) {
  const value = formData.get("return_to");
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.startsWith("/") ? trimmed : fallback;
}

async function getLookups(adminClient: ReturnType<typeof createAdminClient>) {
  if (!adminClient) {
    return null;
  }

  const [packagingResult, registryResult] = await Promise.all([
    adminClient.from("asset_packaging").select("*"),
    adminClient.from("asset_registry").select("*"),
  ]);

  if (packagingResult.error || !packagingResult.data || registryResult.error || !registryResult.data) {
    return null;
  }

  return {
    packagingMap: new Map((packagingResult.data as AssetPackagingRow[]).map((row) => [row.id, row])),
    registryMap: new Map((registryResult.data as AssetRegistryRow[]).map((row) => [row.id, row])),
  };
}

export async function getBuyerPortalOfferSubmissions(applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as BuyerOfferSubmissionRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [];
  }

  try {
    const [submissionResult, lookups] = await Promise.all([
      adminClient
        .from("buyer_offer_submissions")
        .select("*")
        .eq("buyer_application_id", applicationId)
        .order("created_at", { ascending: false }),
      getLookups(adminClient),
    ]);

    if (submissionResult.error || !submissionResult.data || !lookups) {
      return [];
    }

    const submissions = submissionResult.data as BuyerOfferSubmissionRow[];
    const offerMap = await getOfferLookupMap(adminClient, submissions);
    return submissions
      .map((row) => mapSubmissionRow(row, lookups.packagingMap, lookups.registryMap, offerMap))
      .filter((record): record is BuyerOfferSubmissionRecord => Boolean(record));
  } catch {
    return [];
  }
}

export async function getBuyerPortalOfferSubmissionForOpportunity(applicationId: string, opportunityId: string) {
  if (!hasSupabaseEnv() || !applicationId || !opportunityId) {
    return null;
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return null;
  }

  try {
    const [submissionResult, lookups] = await Promise.all([
      adminClient
        .from("buyer_offer_submissions")
        .select("*")
        .eq("buyer_application_id", applicationId)
        .eq("asset_packaging_id", opportunityId)
        .maybeSingle(),
      getLookups(adminClient),
    ]);

    if (submissionResult.error || !submissionResult.data || !lookups) {
      return null;
    }

    const submissions = [submissionResult.data as BuyerOfferSubmissionRow];
    const offerMap = await getOfferLookupMap(adminClient, submissions);
    return mapSubmissionRow(submissionResult.data as BuyerOfferSubmissionRow, lookups.packagingMap, lookups.registryMap, offerMap);
  } catch {
    return null;
  }
}

export async function getBuyerPortalOfferSubmissionById(applicationId: string, submissionId: string) {
  if (!hasSupabaseEnv() || !applicationId || !submissionId) {
    return null;
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return null;
  }

  try {
    const [submissionResult, lookups] = await Promise.all([
      adminClient
        .from("buyer_offer_submissions")
        .select("*")
        .eq("buyer_application_id", applicationId)
        .eq("id", submissionId)
        .maybeSingle(),
      getLookups(adminClient),
    ]);

    if (submissionResult.error || !submissionResult.data || !lookups) {
      return null;
    }

    const submissions = [submissionResult.data as BuyerOfferSubmissionRow];
    const offerMap = await getOfferLookupMap(adminClient, submissions);
    return mapSubmissionRow(submissionResult.data as BuyerOfferSubmissionRow, lookups.packagingMap, lookups.registryMap, offerMap);
  } catch {
    return null;
  }
}

export async function getBuyerOfferSubmissionByOfferRecordId(offerRecordId: string) {
  if (!hasSupabaseEnv() || !offerRecordId) {
    return null;
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return null;
  }

  try {
    const [submissionResult, lookups] = await Promise.all([
      adminClient.from("buyer_offer_submissions").select("*").eq("offer_record_id", offerRecordId).maybeSingle(),
      getLookups(adminClient),
    ]);

    if (submissionResult.error || !submissionResult.data || !lookups) {
      return null;
    }

    const offerMap = await getOfferLookupMap(adminClient, [submissionResult.data as BuyerOfferSubmissionRow]);
    return mapSubmissionRow(submissionResult.data as BuyerOfferSubmissionRow, lookups.packagingMap, lookups.registryMap, offerMap);
  } catch {
    return null;
  }
}

async function getAdminAuthUserId() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function submitBuyerOfferAction(formData: FormData) {
  "use server";

  const parsed = readSubmissionFormData(formData);
  if ("error" in parsed) {
    redirect(`/portal/buyer/opportunities?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`);
  }

  const buyerRecord = await requireActivatedBuyerPortalAccess();
  const opportunity = await getBuyerPortalOpportunityById(parsed.data.asset_packaging_id);

  if (!opportunity) {
    redirect("/portal/buyer/opportunities?error=This%20opportunity%20is%20not%20available.");
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    redirect("/portal/buyer/opportunities?error=Offer%20submission%20is%20temporarily%20unavailable.");
  }

  const existingResult = await adminClient
    .from("buyer_offer_submissions")
    .select("*")
    .eq("buyer_application_id", buyerRecord.id)
    .eq("asset_packaging_id", opportunity.id)
    .maybeSingle();

  if (existingResult.error) {
    redirect("/portal/buyer/opportunities?error=Unable%20to%20check%20your%20existing%20offer.");
  }

  const existing = existingResult.data as BuyerOfferSubmissionRow | null;
  if (existing && isActiveSubmissionStatus(existing.status)) {
    redirect("/portal/buyer/opportunities?error=You%20already%20have%20an%20active%20offer%20for%20this%20opportunity.");
  }

  const payload: SubmissionPayload = {
    buyer_application_id: buyerRecord.id,
    asset_packaging_id: opportunity.id,
    owner_user_id: buyerRecord.linked_user_id ?? buyerRecord.id,
    buyer_offer_invitation_id: null,
    proposed_price: parsed.data.proposed_price,
    structure_preference: parsed.data.structure_preference,
    financing_plan: parsed.data.financing_plan,
    target_close_date: parsed.data.target_close_date,
    notes: parsed.data.notes,
    status: "submitted",
    admin_notes: "",
    package_status: "submitted",
    package_summary_note: "",
    presentation_status: "not_presented",
    presented_at: null,
    presented_by: null,
    seller_review_status: "not_reviewed",
    seller_reviewed_at: null,
    seller_response_summary: "",
    offer_record_id: null,
    reviewed_at: null,
    reviewed_by: null,
  };

  const writeResult = existing
    ? await adminClient.from("buyer_offer_submissions").update(payload as never).eq("id", existing.id)
    : await adminClient.from("buyer_offer_submissions").insert(payload as never);

  if (writeResult.error) {
    redirect("/portal/buyer/opportunities?error=Unable%20to%20save%20your%20offer.");
  }

  revalidatePath("/portal/buyer");
  revalidatePath("/portal/buyer/offers");
  revalidatePath("/portal/buyer/notifications");
  revalidatePath("/portal/seller/notifications");
  revalidatePath(`/portal/buyer/opportunities/${opportunity.id}`);
  revalidatePath("/admin/buyer-offers");
  revalidatePath("/admin/risk");
  redirect(`/portal/buyer/opportunities/${opportunity.id}?submitted=offer`);
}

export async function getAdminBuyerOfferSubmissions(statusFilter: "all" | BuyerOfferSubmissionStatus = "all") {
  if (!hasSupabaseEnv()) {
    return [] as BuyerOfferAdminRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [];
  }

  try {
    const [submissionResult, buyerResult, lookups] = await Promise.all([
      adminClient.from("buyer_offer_submissions").select("*").order("created_at", { ascending: false }),
      adminClient.from("buyer_applications").select("*"),
      getLookups(adminClient),
    ]);

    if (submissionResult.error || !submissionResult.data || buyerResult.error || !buyerResult.data || !lookups) {
      return [];
    }

    const submissions = submissionResult.data as BuyerOfferSubmissionRow[];
    const buyers = buyerResult.data as BuyerApplicationRow[];
    const buyerMap = new Map(buyers.map((buyer) => [buyer.id, buyer]));
    const offerMap = await getOfferLookupMap(adminClient, submissions);

    return submissions
      .filter((row) => statusFilter === "all" || row.status === statusFilter)
      .map((row) => mapSubmissionRowToAdminRecord(row, buyerMap, lookups.packagingMap, lookups.registryMap, offerMap))
      .filter((record): record is BuyerOfferAdminRecord => Boolean(record));
  } catch {
    return [];
  }
}

export async function getAdminBuyerOfferSubmissionById(id: string) {
  if (!hasSupabaseEnv() || !id) {
    return null;
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return null;
  }

  try {
    const [submissionResult, buyerResult, lookups] = await Promise.all([
      adminClient.from("buyer_offer_submissions").select("*").eq("id", id).maybeSingle(),
      adminClient.from("buyer_applications").select("*"),
      getLookups(adminClient),
    ]);

    if (submissionResult.error || !submissionResult.data || buyerResult.error || !buyerResult.data || !lookups) {
      return null;
    }

    const buyerMap = new Map((buyerResult.data as BuyerApplicationRow[]).map((buyer) => [buyer.id, buyer]));
    const offerMap = await getOfferLookupMap(adminClient, [submissionResult.data as BuyerOfferSubmissionRow]);
    return mapSubmissionRowToAdminRecord(
      submissionResult.data as BuyerOfferSubmissionRow,
      buyerMap,
      lookups.packagingMap,
      lookups.registryMap,
      offerMap,
    );
  } catch {
    return null;
  }
}

export async function updateBuyerOfferSubmissionStatusAction(formData: FormData) {
  "use server";

  const id = readRecordId(formData);
  const status = readStatus(formData);
  const adminNotesValue = formData.get("admin_notes");
  const adminNotes = typeof adminNotesValue === "string" ? adminNotesValue.trim() : "";
  const returnTo = readReturnTo(formData, "/admin/buyer-offers?saved=updated");

  if (!id || !status) {
    redirect("/admin/buyer-offers?error=Missing%20submission%20details.");
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    redirect("/admin/buyer-offers?error=Offer%20review%20is%20temporarily%20unavailable.");
  }

  const reviewerId = await getAdminAuthUserId();
  const existingResult = await adminClient.from("buyer_offer_submissions").select("*").eq("id", id).maybeSingle();

  if (existingResult.error || !existingResult.data) {
    redirect("/admin/buyer-offers?error=Submission%20not%20found.");
  }

  const existing = existingResult.data as BuyerOfferSubmissionRow;
  if (status === "converted_to_offer" && !existing.offer_record_id) {
    redirect("/admin/buyer-offers?error=Promote%20the%20submission%20before%20marking%20it%20as%20converted.");
  }

  const { error } = await adminClient
    .from("buyer_offer_submissions")
    .update({
      status,
      admin_notes: adminNotes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    } as never)
    .eq("id", id);

  if (error) {
    redirect("/admin/buyer-offers?error=Unable%20to%20update%20the%20offer%20submission.");
  }

  revalidatePath("/admin/buyer-offers");
  revalidatePath("/admin/applications");
  revalidatePath("/admin/risk");
  revalidatePath("/portal/buyer/offers");
  revalidatePath("/portal/buyer/notifications");
  revalidatePath("/portal/seller/notifications");
  revalidatePath(`/portal/buyer/opportunities/${existing.asset_packaging_id}`);
  redirect(returnTo);
}

export async function promoteBuyerOfferSubmissionAction(formData: FormData) {
  "use server";

  const id = readRecordId(formData);
  const returnTo = readReturnTo(formData, "/admin/buyer-offers?saved=promoted");

  if (!id) {
    redirect("/admin/buyer-offers?error=Missing%20submission%20id.");
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    redirect("/admin/buyer-offers?error=Offer%20promotion%20is%20temporarily%20unavailable.");
  }

  const reviewerId = await getAdminAuthUserId();
  const submissionResult = await adminClient
    .from("buyer_offer_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (submissionResult.error || !submissionResult.data) {
    redirect("/admin/buyer-offers?error=Submission%20not%20found.");
  }

  const submission = submissionResult.data as BuyerOfferSubmissionRow;
  if (submission.offer_record_id) {
    redirect("/admin/buyer-offers?error=This%20submission%20already%20has%20an%20internal%20offer%20record.");
  }

  const opportunity = await getBuyerPortalOpportunityById(submission.asset_packaging_id);
  if (!opportunity) {
    redirect("/admin/buyer-offers?error=This%20opportunity%20is%20not%20available.");
  }

  const buyerResult = await adminClient.from("buyer_applications").select("*").eq("id", submission.buyer_application_id).maybeSingle();
  if (buyerResult.error || !buyerResult.data) {
    redirect("/admin/buyer-offers?error=Buyer%20application%20not%20found.");
  }

  const buyer = buyerResult.data as BuyerApplicationRow;
  const offerRecordId = randomUUID();
  const offerInsert = await adminClient.from("offers").insert({
    id: offerRecordId,
    asset_name: opportunity.asset_name,
    buyer_id: null,
    buyer_name: buyer.applicant_name,
    asking_price: opportunity.asking_price,
    offer_amount: submission.proposed_price,
    counteroffer_status: submission.structure_preference,
    accepted_terms: `${submission.financing_plan}\n\n${submission.notes}`,
    stage: "offered",
    next_action: "Review buyer-submitted offer for presentation.",
    owner: "Buyer Offer Desk",
    target_close_date: submission.target_close_date,
  } as never);

  if (offerInsert.error) {
    redirect("/admin/buyer-offers?error=Unable%20to%20create%20the%20internal%20offer%20record.");
  }

  const { error } = await adminClient
    .from("buyer_offer_submissions")
    .update({
      status: "converted_to_offer",
      offer_record_id: offerRecordId,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    } as never)
    .eq("id", id);

  if (error) {
    redirect("/admin/buyer-offers?error=Unable%20to%20link%20the%20internal%20offer%20record.");
  }

  revalidatePath("/admin/buyer-offers");
  revalidatePath("/admin/offers");
  revalidatePath("/portal/buyer/offers");
  revalidatePath("/portal/buyer/notifications");
  revalidatePath("/portal/seller/notifications");
  revalidatePath("/admin/risk");
  revalidatePath(`/portal/buyer/opportunities/${submission.asset_packaging_id}`);
  redirect(returnTo);
}

export function buyerOfferSubmissionStatusOrder() {
  return buyerOfferStatusOrder;
}
