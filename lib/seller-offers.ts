import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActivatedSellerPortalAccess } from "@/lib/portal-access";
import type {
  AssetPackagingRecordStatus,
  AssetPackagingRow,
  AssetRegistryRow,
  OfferDispositionStatus,
  OfferRow,
  BuyerOfferSubmissionRow,
  BuyerOfferSubmissionStatus,
} from "@/lib/supabase/database.types";

export type SellerOfferActivityRecord = Readonly<{
  id: string;
  asset_packaging_id: string;
  asset_name: string;
  asset_slug: string;
  portal_summary: string;
  asking_price: string;
  packaging_status: AssetPackagingRecordStatus;
  offer_count: number;
  latest_status: BuyerOfferSubmissionStatus | null;
  latest_submission_at: string | null;
  converted_offer_count: number;
  latest_offer_record_id: string | null;
  latest_offer_disposition_status: OfferDispositionStatus | null;
  latest_offer_disposition_note: string | null;
  buyer_visible_status: string;
}>;

export type SellerOfferDetailRecord = Readonly<SellerOfferActivityRecord & {
  latest_submission_id: string | null;
  latest_submission_proposed_price: string | null;
  latest_submission_structure_preference: string | null;
  latest_submission_financing_plan: string | null;
  latest_submission_target_close_date: string | null;
  latest_offer_updated_at: string | null;
  has_active_offer: boolean;
}>;

export const sellerOfferResponseLabels: Record<
  "acknowledge_review" | "interested" | "need_more_info" | "decline",
  string
> = {
  acknowledge_review: "Acknowledge Review",
  interested: "Interested",
  need_more_info: "Need More Info",
  decline: "Decline",
};

export const sellerOfferResponseOrder = [
  "acknowledge_review",
  "interested",
  "need_more_info",
  "decline",
] as const;

function sellerDispositionLabel(status: OfferDispositionStatus | null) {
  switch (status) {
    case "seller_review":
      return "Seller Reviewing";
    case "seller_interested":
      return "Seller Interested";
    case "seller_declined":
      return "Seller Declined";
    case "request_follow_up":
      return "Follow-up Needed";
    case "advance_to_contract":
      return "Advancing";
    case "close_out":
      return "Closed Out";
    default:
      return "Awaiting Review";
  }
}

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

function mapActivityRecord(
  packaging: AssetPackagingRow,
  registryMap: ReadonlyMap<string, AssetRegistryRow>,
  submissionMap: ReadonlyMap<string, BuyerOfferSubmissionRow[]>,
  offerMap: ReadonlyMap<string, OfferRow>,
): SellerOfferActivityRecord {
  const asset = registryMap.get(packaging.asset_registry_id);
  const submissions = submissionMap.get(packaging.id) ?? [];
  const latestSubmission = submissions[0] ?? null;
  const latestLinkedSubmission = submissions.find((submission) => submission.offer_record_id) ?? null;
  const latestOffer = latestLinkedSubmission?.offer_record_id ? offerMap.get(latestLinkedSubmission.offer_record_id) ?? null : null;

  return {
    id: packaging.id,
    asset_packaging_id: packaging.id,
    asset_name: asset?.asset_name ?? "Unknown asset",
    asset_slug: asset?.slug ?? packaging.asset_registry_id,
    portal_summary: packaging.portal_summary || packaging.short_listing_description,
    asking_price: packaging.asking_price,
    packaging_status: packaging.status,
    offer_count: submissions.length,
    latest_status: latestSubmission?.status ?? null,
    latest_submission_at: latestSubmission?.created_at ?? null,
    converted_offer_count: submissions.filter((submission) => submission.offer_record_id || submission.status === "converted_to_offer").length,
    latest_offer_record_id: latestOffer?.id ?? null,
    latest_offer_disposition_status: latestOffer?.disposition_status ?? null,
    latest_offer_disposition_note: latestOffer?.disposition_note ?? null,
    buyer_visible_status: sellerDispositionLabel(latestOffer?.disposition_status ?? null),
  };
}

function mapDetailRecord(
  activity: SellerOfferActivityRecord,
  latestSubmission: BuyerOfferSubmissionRow | null,
  latestOffer: OfferRow | null,
): SellerOfferDetailRecord {

  return {
    ...activity,
    latest_submission_id: latestSubmission?.id ?? null,
    latest_submission_proposed_price: latestSubmission?.proposed_price ?? null,
    latest_submission_structure_preference: latestSubmission?.structure_preference ?? null,
    latest_submission_financing_plan: latestSubmission?.financing_plan ?? null,
    latest_submission_target_close_date: latestSubmission?.target_close_date ?? null,
    latest_offer_updated_at: latestOffer?.updated_at ?? null,
    has_active_offer: Boolean(activity.latest_offer_record_id),
  };
}

export async function getSellerPortalOfferActivity(applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as SellerOfferActivityRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as SellerOfferActivityRecord[];
  }

  try {
    const [packagingResult, assetResult] = await Promise.all([
      adminClient
        .from("asset_packaging")
        .select("*")
        .eq("seller_application_id", applicationId)
        .order("created_at", { ascending: false }),
      adminClient.from("asset_registry").select("*"),
    ]);

    if (packagingResult.error || !packagingResult.data || assetResult.error || !assetResult.data) {
      return [];
    }

    const packagingRows = packagingResult.data as AssetPackagingRow[];
    if (packagingRows.length === 0) {
      return [];
    }

    const [submissionResult] = await Promise.all([
      adminClient
        .from("buyer_offer_submissions")
        .select("*")
        .in("asset_packaging_id", packagingRows.map((row) => row.id))
        .order("created_at", { ascending: false }),
    ]);

    if (submissionResult.error || !submissionResult.data) {
      return [];
    }

    const submissions = submissionResult.data as BuyerOfferSubmissionRow[];
    const submissionMap = new Map<string, BuyerOfferSubmissionRow[]>();
    for (const submission of submissions) {
      const items = submissionMap.get(submission.asset_packaging_id) ?? [];
      items.push(submission);
      submissionMap.set(submission.asset_packaging_id, items);
    }

    const assetRows = assetResult.data as AssetRegistryRow[];
    const registryMap = new Map(assetRows.map((asset) => [asset.id, asset]));
    const offerIds = [...new Set(submissions.map((submission) => submission.offer_record_id).filter((value): value is string => Boolean(value)))];
    const offerMap = new Map<string, OfferRow>();

    if (offerIds.length > 0) {
      const offersResult = await adminClient.from("offers").select("*").in("id", offerIds);
      if (!offersResult.error && offersResult.data) {
        for (const offer of offersResult.data as OfferRow[]) {
          offerMap.set(offer.id, offer);
        }
      }
    }

    return packagingRows.map((packaging) =>
      mapActivityRecord(packaging, registryMap, submissionMap, offerMap),
    );
  } catch {
    return [];
  }
}

export async function getSellerPortalOfferDetail(applicationId: string, assetPackagingId: string) {
  if (!hasSupabaseEnv() || !applicationId || !assetPackagingId) {
    return null;
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return null;
  }

  try {
    const [packagingResult, assetResult, submissionResult] = await Promise.all([
      adminClient.from("asset_packaging").select("*").eq("seller_application_id", applicationId).eq("id", assetPackagingId).maybeSingle(),
      adminClient.from("asset_registry").select("*"),
      adminClient
        .from("buyer_offer_submissions")
        .select("*")
        .eq("asset_packaging_id", assetPackagingId)
        .order("created_at", { ascending: false }),
    ]);

    if (packagingResult.error || !packagingResult.data || assetResult.error || !assetResult.data || submissionResult.error || !submissionResult.data) {
      return null;
    }

    const packaging = packagingResult.data as AssetPackagingRow;
    const submissions = submissionResult.data as BuyerOfferSubmissionRow[];
    const assetRows = assetResult.data as AssetRegistryRow[];
    const registryMap = new Map(assetRows.map((asset) => [asset.id, asset]));
    const offerIds = [...new Set(submissions.map((submission) => submission.offer_record_id).filter((value): value is string => Boolean(value)))];
    const offerMap = new Map<string, OfferRow>();

    if (offerIds.length > 0) {
      const offersResult = await adminClient.from("offers").select("*").in("id", offerIds);
      if (!offersResult.error && offersResult.data) {
        for (const offer of offersResult.data as OfferRow[]) {
          offerMap.set(offer.id, offer);
        }
      }
    }

    const submissionMap = new Map<string, BuyerOfferSubmissionRow[]>([
      [packaging.id, submissions],
    ]);
    const latestLinkedSubmission = submissions.find((submission) => submission.offer_record_id) ?? submissions[0] ?? null;
    const activity = mapActivityRecord(packaging, registryMap, submissionMap, offerMap);
    const latestOffer = latestLinkedSubmission?.offer_record_id ? offerMap.get(latestLinkedSubmission.offer_record_id) ?? null : null;
    return mapDetailRecord(activity, latestLinkedSubmission, latestOffer);
  } catch {
    return null;
  }
}

function readSellerResponseStatus(formData: FormData) {
  const value = formData.get("response_status");
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return sellerOfferResponseOrder.includes(trimmed as (typeof sellerOfferResponseOrder)[number])
    ? (trimmed as (typeof sellerOfferResponseOrder)[number])
    : null;
}

function readSellerResponseNote(formData: FormData) {
  const value = formData.get("response_note");
  return typeof value === "string" ? value.trim() : "";
}

function sellerResponseToDisposition(status: (typeof sellerOfferResponseOrder)[number]): OfferDispositionStatus {
  switch (status) {
    case "acknowledge_review":
      return "seller_review";
    case "interested":
      return "seller_interested";
    case "need_more_info":
      return "request_follow_up";
    case "decline":
      return "seller_declined";
  }
}

export async function submitSellerOfferResponseAction(formData: FormData) {
  "use server";

  const application = await requireActivatedSellerPortalAccess();
  const assetPackagingIdValue = formData.get("asset_packaging_id");
  const assetPackagingId = typeof assetPackagingIdValue === "string" ? assetPackagingIdValue.trim() : "";
  const responseStatus = readSellerResponseStatus(formData);
  const responseNote = readSellerResponseNote(formData);
  const returnToValue = formData.get("return_to");
  const returnTo = typeof returnToValue === "string" && returnToValue.trim().startsWith("/")
    ? returnToValue.trim()
    : `/portal/seller/offers/${assetPackagingId}`;

  if (!assetPackagingId || !responseStatus) {
    redirect("/portal/seller/offers?error=Missing%20offer%20details.");
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    redirect("/portal/seller/offers?error=Seller%20response%20is%20temporarily%20unavailable.");
  }

  const detail = await getSellerPortalOfferDetail(application.id, assetPackagingId);
  if (!detail || !detail.latest_offer_record_id) {
    redirect("/portal/seller/offers?error=This%20opportunity%20has%20not%20been%20promoted%20into%20an%20internal%20offer%20yet.");
  }

  const offerResult = await adminClient.from("offers").select("*").eq("id", detail.latest_offer_record_id).maybeSingle();
  if (offerResult.error || !offerResult.data) {
    redirect("/portal/seller/offers?error=Internal%20offer%20not%20found.");
  }

  const dispositionStatus = sellerResponseToDisposition(responseStatus);
  const { error } = await adminClient
    .from("offers")
    .update({
      disposition_status: dispositionStatus,
      disposition_note: responseNote,
      disposition_at: new Date().toISOString(),
      next_action:
        dispositionStatus === "seller_declined"
          ? "Admin review required for closure."
          : dispositionStatus === "request_follow_up"
            ? "Await admin follow-up."
            : "Await admin disposition.",
    } as never)
    .eq("id", detail.latest_offer_record_id);

  if (error) {
    redirect("/portal/seller/offers?error=Unable%20to%20save%20your%20response.");
  }

  revalidatePath("/portal/seller/offers");
  revalidatePath(`/portal/seller/offers/${assetPackagingId}`);
  revalidatePath("/admin/offers");
  revalidatePath(`/admin/offers/${detail.latest_offer_record_id}`);
  revalidatePath("/portal/buyer/offers");
  if (detail.latest_submission_id) {
    revalidatePath(`/portal/buyer/offers/${detail.latest_submission_id}`);
    revalidatePath(`/admin/buyer-offers/${detail.latest_submission_id}`);
  }

  redirect(returnTo);
}
