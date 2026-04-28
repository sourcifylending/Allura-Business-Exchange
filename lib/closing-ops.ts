import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  AssetClosingPaymentStatus,
  AssetClosingPurchaseAgreementStatus,
  AssetClosingRow,
  AssetClosingStatus,
  AssetClosingTransferStatus,
  AssetPackagingRow,
  AssetRegistryRow,
  AssetTransferChecklistItemRow,
  AssetTransferChecklistItemStatus,
  BuyerApplicationRow,
  BuyerOfferSubmissionRow,
  DigitalAssetBuyerInterestRow,
  DigitalAssetRow,
  OfferRow,
  ContractRow,
  TransferRow,
} from "@/lib/supabase/database.types";

export const closingStatusOrder: AssetClosingStatus[] = [
  "offer_accepted",
  "pa_sent",
  "pa_signed",
  "awaiting_payment",
  "payment_received",
  "transfer_in_progress",
  "buyer_reviewing_transfer",
  "transfer_complete",
  "closed",
  "cancelled",
];

export const closingStatusLabels: Record<AssetClosingStatus, string> = {
  offer_accepted: "Offer Accepted",
  pa_sent: "Purchase Agreement Sent",
  pa_signed: "Purchase Agreement Signed",
  awaiting_payment: "Awaiting Payment",
  payment_received: "Payment Received",
  transfer_in_progress: "Transfer In Progress",
  buyer_reviewing_transfer: "Buyer Reviewing Transfer",
  transfer_complete: "Transfer Complete",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const purchaseAgreementStatusLabels: Record<AssetClosingPurchaseAgreementStatus, string> = {
  not_sent: "Not Sent",
  sent: "Sent",
  signed: "Signed",
  cancelled: "Cancelled",
};

export const paymentStatusLabels: Record<AssetClosingPaymentStatus, string> = {
  not_requested: "Not Requested",
  invoice_sent: "Invoice Sent",
  awaiting_payment: "Awaiting Payment",
  payment_received: "Payment Received",
  payment_failed: "Payment Failed",
  refunded: "Refunded",
};

export const transferStatusLabels: Record<AssetClosingTransferStatus, string> = {
  not_started: "Not Started",
  preparing: "Preparing",
  in_progress: "In Progress",
  waiting_on_buyer: "Waiting on Buyer",
  complete: "Complete",
};

export const checklistStatusLabels: Record<AssetTransferChecklistItemStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  waiting_on_buyer: "Waiting on Buyer",
  complete: "Complete",
  blocked: "Blocked",
};

export const buyerProgressSteps = [
  "Purchase Agreement Signed",
  "Payment Confirmed",
  "Transfer Started",
  "Access Handoff",
  "Buyer Review",
  "Transfer Complete",
  "Deal Closed",
] as const;

export type ClosingDeskRecord = Readonly<{
  id: string;
  digital_asset_id: string;
  buyer_interest_id: string;
  buyer_application_id: string | null;
  buyer_offer_submission_id: string | null;
  offer_id: string | null;
  contract_row_id: string | null;
  transfer_row_id: string | null;
  asset_packaging_id: string | null;
  asset_registry_id: string | null;
  asset_name: string;
  asset_slug: string;
  buyer_name: string;
  buyer_email: string;
  accepted_offer_amount: string | null;
  closing_status: AssetClosingStatus;
  purchase_agreement_status: AssetClosingPurchaseAgreementStatus;
  payment_status: AssetClosingPaymentStatus;
  transfer_status: AssetClosingTransferStatus;
  buyer_visible_status: string;
  internal_notes: string;
  checklist_total: number;
  checklist_complete: number;
  checklist_visible_total: number;
  checklist_visible_complete: number;
  created_at: string;
  updated_at: string;
}>;

export type ClosingChecklistRecord = Readonly<Omit<AssetTransferChecklistItemRow, "created_at" | "updated_at">>;

export type BuyerTransferProgressStep = Readonly<{
  label: (typeof buyerProgressSteps)[number];
  status: "pending" | "current" | "complete";
}>;

export type BuyerTransferProgressRecord = Readonly<{
  closing_id: string;
  digital_asset_id: string;
  asset_name: string;
  buyer_name: string;
  buyer_email: string;
  closing_status: AssetClosingStatus;
  purchase_agreement_status: AssetClosingPurchaseAgreementStatus;
  payment_status: AssetClosingPaymentStatus;
  transfer_status: AssetClosingTransferStatus;
  buyer_visible_status: string;
  next_required_buyer_action: string;
  transition_notes: string;
  progress_steps: BuyerTransferProgressStep[];
  visible_checklist_items: Array<Readonly<{
    id: string;
    label: string;
    status: AssetTransferChecklistItemStatus;
    buyer_visible_label: string;
    completed_at: string | null;
  }>>;
}>;

type AssetLookup = Readonly<{
  digitalAsset: DigitalAssetRow | null;
  buyerInterest: DigitalAssetBuyerInterestRow | null;
  buyerApplication: BuyerApplicationRow | null;
  offer: OfferRow | null;
  contract: ContractRow | null;
  transfer: TransferRow | null;
  submission: BuyerOfferSubmissionRow | null;
  assetPackaging: AssetPackagingRow | null;
  assetRegistry: AssetRegistryRow | null;
}>;

const defaultChecklistSeeds = [
  { label: "Confirm purchase agreement signed", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Confirm payment received and cleared", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Confirm buyer legal name and email", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Confirm asset being transferred", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare domain transfer details", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare website/Vercel transfer details", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare Supabase/project transfer details", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare GitHub repository transfer details", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare Resend/email service transfer details if included", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare Stripe/billing handoff notes if included", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare client/customer handoff notes if included", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare lead database export if included", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare SOP/workflow handoff", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Prepare transition call agenda", isBuyerVisible: false, buyerVisibleLabel: "" },
  { label: "Confirm buyer received access", isBuyerVisible: true, buyerVisibleLabel: "Buyer received access" },
  { label: "Confirm buyer reviewed transferred materials", isBuyerVisible: true, buyerVisibleLabel: "Buyer reviewed transferred materials" },
  { label: "Confirm buyer acceptance of transfer", isBuyerVisible: true, buyerVisibleLabel: "Buyer accepted transfer" },
  { label: "Mark transfer complete", isBuyerVisible: true, buyerVisibleLabel: "Transfer complete" },
  { label: "Mark deal closed", isBuyerVisible: true, buyerVisibleLabel: "Deal closed" },
] as const;

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

function mapClosingRow(
  row: AssetClosingRow,
): Omit<
  ClosingDeskRecord,
  "asset_name" | "asset_slug" | "buyer_name" | "buyer_email" | "checklist_total" | "checklist_complete" | "checklist_visible_total" | "checklist_visible_complete" | "created_at" | "updated_at"
> {
  const { created_at: _createdAt, updated_at: _updatedAt, ...rest } = row;
  return rest as unknown as Omit<
    ClosingDeskRecord,
    "asset_name" | "asset_slug" | "buyer_name" | "buyer_email" | "checklist_total" | "checklist_complete" | "checklist_visible_total" | "checklist_visible_complete" | "created_at" | "updated_at"
  >;
}

function mapChecklistRow(row: AssetTransferChecklistItemRow): ClosingChecklistRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...rest } = row;
  return rest;
}

function stageIndex(status: AssetClosingStatus) {
  return closingStatusOrder.indexOf(status);
}

function deriveBuyerVisibleStatus(status: AssetClosingStatus) {
  switch (status) {
    case "pa_sent":
      return "Purchase agreement sent.";
    case "pa_signed":
      return "Purchase agreement signed.";
    case "awaiting_payment":
      return "Awaiting payment confirmation.";
    case "payment_received":
      return "Payment confirmed. Transfer preparation underway.";
    case "transfer_in_progress":
      return "Transfer started. Allura is preparing the handoff.";
    case "buyer_reviewing_transfer":
      return "Buyer review is in progress.";
    case "transfer_complete":
      return "Transfer complete. Final buyer confirmation pending.";
    case "closed":
      return "Deal closed.";
    case "cancelled":
      return "Deal cancelled.";
    case "offer_accepted":
    default:
      return "Offer accepted. Purchase agreement pending.";
  }
}

function deriveNextBuyerAction(closing: Pick<AssetClosingRow, "closing_status" | "purchase_agreement_status" | "payment_status" | "transfer_status">) {
  switch (closing.closing_status) {
    case "offer_accepted":
      return "Review the purchase agreement once Allura sends it.";
    case "pa_sent":
      return "Sign the purchase agreement when received.";
    case "pa_signed":
    case "awaiting_payment":
      return "Complete the payment step to unlock transfer prep.";
    case "payment_received":
      return "Wait for Allura to confirm transfer readiness.";
    case "transfer_in_progress":
      return "Review the transfer handoff when Allura marks it ready.";
    case "buyer_reviewing_transfer":
      return "Confirm the transferred materials and access handoff.";
    case "transfer_complete":
      return "Await final closing confirmation.";
    case "closed":
      return "No further action required.";
    case "cancelled":
      return "This deal is closed out.";
    default:
      return "Await Allura's next step.";
  }
}

function deriveTransitionNotes(status: AssetClosingStatus) {
  switch (status) {
    case "offer_accepted":
      return "Allura has accepted the offer and is preparing the purchase agreement.";
    case "pa_sent":
      return "Purchase agreement has been sent through the closing desk.";
    case "pa_signed":
      return "Purchase agreement signature has been recorded.";
    case "awaiting_payment":
      return "The deal is waiting on cleared payment.";
    case "payment_received":
      return "Payment has cleared and transfer preparation is underway.";
    case "transfer_in_progress":
      return "Transfer coordination is underway.";
    case "buyer_reviewing_transfer":
      return "Buyer review is in progress.";
    case "transfer_complete":
      return "Transfer work is complete and ready for final close.";
    case "closed":
      return "The closing is complete.";
    case "cancelled":
      return "The closing was cancelled.";
    default:
      return "The closing is active.";
  }
}

async function fetchAdminClient() {
  const client = createAdminClient();
  if (!client) {
    return null;
  }

  return client;
}

async function getLookupMaps(closings: AssetClosingRow[]) {
  const adminClient = await fetchAdminClient();
  if (!adminClient) {
    return null;
  }

  const digitalAssetIds = [...new Set(closings.map((closing) => closing.digital_asset_id).filter(Boolean))];
  const buyerInterestIds = [...new Set(closings.map((closing) => closing.buyer_interest_id).filter(Boolean))];
  const buyerApplicationIds = [...new Set(closings.map((closing) => closing.buyer_application_id).filter((value): value is string => Boolean(value)))];
  const offerIds = [...new Set(closings.map((closing) => closing.offer_id).filter((value): value is string => Boolean(value)))];
  const contractIds = [...new Set(closings.map((closing) => closing.contract_row_id).filter((value): value is string => Boolean(value)))];
  const transferIds = [...new Set(closings.map((closing) => closing.transfer_row_id).filter((value): value is string => Boolean(value)))];
  const closingIds = closings.map((closing) => closing.id);

  const [
    digitalAssetsResult,
    buyerInterestsResult,
    buyerApplicationsResult,
    offersResult,
    contractsResult,
    transfersResult,
    checklistResult,
  ] = await Promise.all([
    digitalAssetIds.length > 0 ? adminClient.from("digital_assets").select("*").in("id", digitalAssetIds) : Promise.resolve({ data: [], error: null } as const),
    buyerInterestIds.length > 0
      ? adminClient.from("digital_asset_buyer_interest").select("*").in("id", buyerInterestIds)
      : Promise.resolve({ data: [], error: null } as const),
    buyerApplicationIds.length > 0
      ? adminClient.from("buyer_applications").select("*").in("id", buyerApplicationIds)
      : Promise.resolve({ data: [], error: null } as const),
    offerIds.length > 0 ? adminClient.from("offers").select("*").in("id", offerIds) : Promise.resolve({ data: [], error: null } as const),
    contractIds.length > 0 ? adminClient.from("contracts").select("*").in("id", contractIds) : Promise.resolve({ data: [], error: null } as const),
    transferIds.length > 0 ? adminClient.from("transfers").select("*").in("id", transferIds) : Promise.resolve({ data: [], error: null } as const),
    closingIds.length > 0
      ? adminClient.from("asset_transfer_checklist_items").select("*").in("asset_closing_id", closingIds).order("sort_order", { ascending: true })
      : Promise.resolve({ data: [], error: null } as const),
  ]);

  if (
    digitalAssetsResult.error ||
    buyerInterestsResult.error ||
    buyerApplicationsResult.error ||
    offersResult.error ||
    contractsResult.error ||
    transfersResult.error ||
    checklistResult.error
  ) {
    return null;
  }

  return {
    digitalAssetMap: new Map((digitalAssetsResult.data as DigitalAssetRow[]).map((row) => [row.id, row])),
    buyerInterestMap: new Map((buyerInterestsResult.data as DigitalAssetBuyerInterestRow[]).map((row) => [row.id, row])),
    buyerApplicationMap: new Map((buyerApplicationsResult.data as BuyerApplicationRow[]).map((row) => [row.id, row])),
    offerMap: new Map((offersResult.data as OfferRow[]).map((row) => [row.id, row])),
    contractMap: new Map((contractsResult.data as ContractRow[]).map((row) => [row.id, row])),
    transferMap: new Map((transfersResult.data as TransferRow[]).map((row) => [row.id, row])),
    checklistRows: checklistResult.data as AssetTransferChecklistItemRow[],
  };
}

function buildDeskRecord(
  closing: AssetClosingRow,
  lookups: NonNullable<Awaited<ReturnType<typeof getLookupMaps>>>,
): ClosingDeskRecord | null {
  const asset = lookups.digitalAssetMap.get(closing.digital_asset_id) ?? null;
  const buyerInterest = lookups.buyerInterestMap.get(closing.buyer_interest_id) ?? null;
  const buyerApplication = closing.buyer_application_id ? lookups.buyerApplicationMap.get(closing.buyer_application_id) ?? null : null;
  const checklistItems = lookups.checklistRows.filter((item) => item.asset_closing_id === closing.id);

  if (!asset || !buyerInterest) {
    return null;
  }

  const checklistComplete = checklistItems.filter((item) => item.status === "complete").length;
  const checklistVisibleItems = checklistItems.filter((item) => item.is_buyer_visible);
  const checklistVisibleComplete = checklistVisibleItems.filter((item) => item.status === "complete").length;

  return {
    ...mapClosingRow(closing),
    asset_name: asset.name,
    asset_slug: asset.slug,
    buyer_name: buyerInterest.buyer_name ?? buyerApplication?.applicant_name ?? "Buyer",
    buyer_email: buyerInterest.buyer_email ?? buyerApplication?.email ?? "Not provided",
    checklist_total: checklistItems.length,
    checklist_complete: checklistComplete,
    checklist_visible_total: checklistVisibleItems.length,
    checklist_visible_complete: checklistVisibleComplete,
    created_at: closing.created_at,
    updated_at: closing.updated_at,
  };
}

function mapPatchForClosingStatus(
  current: AssetClosingRow,
  closingStatus: AssetClosingStatus,
  fields: Partial<Pick<AssetClosingRow, "purchase_agreement_status" | "payment_status" | "transfer_status">> = {},
) {
  const next: Partial<AssetClosingRow> = {
    closing_status: closingStatus,
    buyer_visible_status: deriveBuyerVisibleStatus(closingStatus),
  };

  switch (closingStatus) {
    case "pa_sent":
      next.purchase_agreement_status = fields.purchase_agreement_status ?? "sent";
      break;
    case "pa_signed":
      next.purchase_agreement_status = fields.purchase_agreement_status ?? "signed";
      break;
    case "awaiting_payment":
      next.payment_status = fields.payment_status ?? "awaiting_payment";
      break;
    case "payment_received":
      next.payment_status = fields.payment_status ?? "payment_received";
      break;
    case "transfer_in_progress":
      next.transfer_status = fields.transfer_status ?? "in_progress";
      break;
    case "buyer_reviewing_transfer":
      next.transfer_status = fields.transfer_status ?? "waiting_on_buyer";
      break;
    case "transfer_complete":
      next.transfer_status = fields.transfer_status ?? "complete";
      break;
    case "closed":
      next.transfer_status = fields.transfer_status ?? "complete";
      break;
    case "cancelled":
      break;
    case "offer_accepted":
    default:
      break;
  }

  if (!next.purchase_agreement_status) {
    next.purchase_agreement_status = current.purchase_agreement_status;
  }

  if (!next.payment_status) {
    next.payment_status = current.payment_status;
  }

  if (!next.transfer_status) {
    next.transfer_status = current.transfer_status;
  }

  return next;
}

function isBuyerReviewChecklistItem(label: string) {
  return label === "Confirm buyer reviewed transferred materials";
}

function isTransferCompleteChecklistItem(label: string) {
  return label === "Mark transfer complete";
}

function isDealClosedChecklistItem(label: string) {
  return label === "Mark deal closed";
}

function isBuyerReceiptVisibleChecklistItem(label: string) {
  return label === "Confirm buyer received access" || label === "Confirm buyer reviewed transferred materials" || label === "Confirm buyer acceptance of transfer" || label === "Mark transfer complete" || label === "Mark deal closed";
}

async function ensureChecklistItems(adminClient: NonNullable<Awaited<ReturnType<typeof fetchAdminClient>>>, closingId: string) {
  const existing = await adminClient
    .from("asset_transfer_checklist_items")
    .select("id")
    .eq("asset_closing_id", closingId);

  if (existing.error || (existing.data && existing.data.length > 0)) {
    return;
  }

  const items = defaultChecklistSeeds.map((seed, index) => ({
    id: randomUUID(),
    asset_closing_id: closingId,
    label: seed.label,
    status: "not_started" as const,
    is_buyer_visible: seed.isBuyerVisible,
    buyer_visible_label: seed.buyerVisibleLabel,
    internal_notes: "",
    completed_at: null,
    sort_order: index,
  }));

  await adminClient.from("asset_transfer_checklist_items").insert(items as never);
}

async function getClosingByFilter(
  filter: { column: "id" | "offer_id" | "buyer_application_id" | "buyer_offer_submission_id" | "buyer_interest_id"; value: string },
  includeChecklist = false,
) {
  if (!hasSupabaseEnv() || !filter.value.trim()) {
    return null;
  }

  const adminClient = await fetchAdminClient();
  if (!adminClient) {
    return null;
  }

  const result = await adminClient.from("asset_closings").select("*").eq(filter.column, filter.value).maybeSingle();
  if (result.error || !result.data) {
    return null;
  }

  const row = result.data as AssetClosingRow;
  if (!includeChecklist) {
    return row;
  }

  await ensureChecklistItems(adminClient, row.id);
  return row;
}

async function getOfferRelatedContext(offerId: string) {
  const adminClient = await fetchAdminClient();
  if (!adminClient || !offerId.trim()) {
    return null;
  }

  const offerResult = await adminClient.from("offers").select("*").eq("id", offerId).maybeSingle();
  if (offerResult.error || !offerResult.data) {
    return null;
  }

  const offer = offerResult.data as OfferRow;
  const submissionResult = await adminClient.from("buyer_offer_submissions").select("*").eq("offer_record_id", offer.id).maybeSingle();
  const submission = submissionResult.error || !submissionResult.data ? null : (submissionResult.data as BuyerOfferSubmissionRow);
  const buyerApplication = submission
    ? ((await adminClient.from("buyer_applications").select("*").eq("id", submission.buyer_application_id).maybeSingle()).data as BuyerApplicationRow | null)
    : null;
  const assetPackaging = submission
    ? ((await adminClient.from("asset_packaging").select("*").eq("id", submission.asset_packaging_id).maybeSingle()).data as AssetPackagingRow | null)
    : null;
  const assetRegistry = assetPackaging
    ? ((await adminClient.from("asset_registry").select("*").eq("id", assetPackaging.asset_registry_id).maybeSingle()).data as AssetRegistryRow | null)
    : null;
  const digitalAsset = assetRegistry
    ? ((await adminClient
        .from("digital_assets")
        .select("*")
        .or(`slug.eq.${assetRegistry.slug},name.eq.${assetRegistry.asset_name}`)
        .maybeSingle()).data as DigitalAssetRow | null)
    : ((await adminClient.from("digital_assets").select("*").eq("name", offer.asset_name).maybeSingle()).data as DigitalAssetRow | null);

  const buyerInterest = digitalAsset && buyerApplication
    ? ((await adminClient
        .from("digital_asset_buyer_interest")
        .select("*")
        .eq("digital_asset_id", digitalAsset.id)
        .eq("buyer_email", buyerApplication.email)
        .maybeSingle()).data as DigitalAssetBuyerInterestRow | null)
    : null;

  const fallbackBuyerInterest = !buyerInterest && digitalAsset
    ? ((await adminClient
        .from("digital_asset_buyer_interest")
        .select("*")
        .eq("digital_asset_id", digitalAsset.id)
        .eq("buyer_name", buyerApplication?.applicant_name ?? offer.buyer_name)
        .maybeSingle()).data as DigitalAssetBuyerInterestRow | null)
    : null;

  return {
    offer,
    submission,
    buyerApplication,
    assetPackaging,
    assetRegistry,
    digitalAsset,
    buyerInterest: buyerInterest ?? fallbackBuyerInterest,
  } as const;
}

async function ensureContractCompatibilityRecord(context: Awaited<ReturnType<typeof getOfferRelatedContext>>) {
  const adminClient = await fetchAdminClient();
  if (!adminClient || !context) {
    return null;
  }

  const { offer, submission, buyerApplication } = context;
  if (!buyerApplication) {
    return null;
  }

  if (offer.contract_row_id) {
    const contractResult = await adminClient.from("contracts").select("*").eq("id", offer.contract_row_id).maybeSingle();
    if (!contractResult.error && contractResult.data) {
      return contractResult.data as ContractRow;
    }
  }

  const contractId = randomUUID();
  const contractRecordId = `PA-${offer.id.slice(0, 8).toUpperCase()}`;
  const insertResult = await adminClient.from("contracts").insert({
    id: contractId,
    contract_record_id: contractRecordId,
    asset_name: offer.asset_name,
    buyer_id: offer.buyer_id,
    buyer_name: offer.buyer_name,
    contract_type: "Purchase Agreement",
    status: "draft",
    sent_date: new Date().toISOString().slice(0, 10),
    signature_status: "not_sent",
    document_status: "Purchase agreement prepared from the accepted offer.",
    payment_status: "pending",
    notes: submission ? `${submission.structure_preference}\n\n${submission.financing_plan}\n\n${submission.notes}` : offer.accepted_terms,
  } as never);

  if (insertResult.error) {
    return null;
  }

  await adminClient.from("offers").update({ contract_row_id: contractId } as never).eq("id", offer.id);
  return (await adminClient.from("contracts").select("*").eq("id", contractId).maybeSingle()).data as ContractRow | null;
}

async function createOrUpdateClosing(context: Awaited<ReturnType<typeof getOfferRelatedContext>>) {
  const adminClient = await fetchAdminClient();
  if (!adminClient || !context) {
    return null;
  }

  const { offer, submission, buyerApplication, assetPackaging, assetRegistry, digitalAsset, buyerInterest } = context;

  if (!submission || !buyerApplication || !assetPackaging || !assetRegistry || !digitalAsset || !buyerInterest) {
    return null;
  }

  const existing = await adminClient
    .from("asset_closings")
    .select("*")
    .eq("buyer_interest_id", buyerInterest.id)
    .maybeSingle();

  const contract = await ensureContractCompatibilityRecord(context);
  const acceptedOfferAmount = submission.proposed_price || offer.offer_amount || null;

  const payload = {
    digital_asset_id: digitalAsset.id,
    buyer_interest_id: buyerInterest.id,
    buyer_application_id: buyerApplication.id,
    buyer_offer_submission_id: submission.id,
    offer_id: offer.id,
    contract_row_id: contract?.id ?? offer.contract_row_id ?? null,
    transfer_row_id: contract?.transfer_row_id ?? null,
    asset_packaging_id: assetPackaging.id,
    asset_registry_id: assetRegistry.id,
    accepted_offer_amount: acceptedOfferAmount,
    closing_status: "offer_accepted" as AssetClosingStatus,
    purchase_agreement_status: "not_sent" as AssetClosingPurchaseAgreementStatus,
    payment_status: "not_requested" as AssetClosingPaymentStatus,
    transfer_status: "not_started" as AssetClosingTransferStatus,
    buyer_visible_status: deriveBuyerVisibleStatus("offer_accepted"),
    internal_notes: "",
  };

  if (existing.data) {
    const current = existing.data as AssetClosingRow;
    const { error } = await adminClient
      .from("asset_closings")
      .update({
        ...payload,
        buyer_visible_status: current.buyer_visible_status || payload.buyer_visible_status,
        internal_notes: current.internal_notes || "",
      } as never)
      .eq("id", current.id);

    if (error) {
      return null;
    }

    await ensureChecklistItems(adminClient, current.id);
    const refreshed = await adminClient.from("asset_closings").select("*").eq("id", current.id).maybeSingle();
    return refreshed.data as AssetClosingRow | null;
  }

  const insertResult = await adminClient.from("asset_closings").insert({
    id: randomUUID(),
    ...payload,
  } as never);

  if (insertResult.error) {
    return null;
  }

  const closingResult = await adminClient
    .from("asset_closings")
    .select("*")
    .eq("buyer_interest_id", buyerInterest.id)
    .maybeSingle();

  if (closingResult.error || !closingResult.data) {
    return null;
  }

  const closingData = closingResult.data as AssetClosingRow;
  await ensureChecklistItems(adminClient, closingData.id);
  return closingData;
}

function buildBuyerProgressSteps(closing: AssetClosingRow): BuyerTransferProgressStep[] {
  const statuses: BuyerTransferProgressStep["status"][] = Array.from({ length: buyerProgressSteps.length }, () => "pending");
  const markComplete = (count: number) => {
    for (let index = 0; index < count; index += 1) {
      statuses[index] = "complete";
    }
  };

  switch (closing.closing_status) {
    case "offer_accepted":
    case "pa_sent":
      statuses[0] = "current";
      break;
    case "pa_signed":
      markComplete(1);
      statuses[1] = "current";
      break;
    case "awaiting_payment":
      markComplete(1);
      statuses[1] = "current";
      break;
    case "payment_received":
      markComplete(2);
      statuses[2] = "current";
      break;
    case "transfer_in_progress":
      markComplete(3);
      statuses[3] = "current";
      break;
    case "buyer_reviewing_transfer":
      markComplete(4);
      statuses[4] = "current";
      break;
    case "transfer_complete":
      markComplete(5);
      statuses[5] = "current";
      break;
    case "closed":
      markComplete(7);
      break;
    case "cancelled":
      break;
    default:
      statuses[0] = "current";
      break;
  }

  return buyerProgressSteps.map((label, index) => ({
    label,
    status: statuses[index] ?? "pending",
  }));
}

function buildBuyerTransferProgressRecord(
  closing: AssetClosingRow,
  lookup: AssetLookup,
  checklistItems: AssetTransferChecklistItemRow[],
): BuyerTransferProgressRecord | null {
  const asset = lookup.digitalAsset;
  const buyerInterest = lookup.buyerInterest;

  if (!asset || !buyerInterest) {
    return null;
  }

  const visibleItems = checklistItems
    .filter((item) => item.is_buyer_visible)
    .map((item) => ({
      id: item.id,
      label: item.label,
      status: item.status,
      buyer_visible_label: item.buyer_visible_label || item.label,
      completed_at: item.completed_at ?? null,
    }));

  return {
    closing_id: closing.id,
    digital_asset_id: asset.id,
    asset_name: asset.name,
    buyer_name: buyerInterest.buyer_name ?? "Buyer",
    buyer_email: buyerInterest.buyer_email ?? "Not provided",
    closing_status: closing.closing_status,
    purchase_agreement_status: closing.purchase_agreement_status,
    payment_status: closing.payment_status,
    transfer_status: closing.transfer_status,
    buyer_visible_status: closing.buyer_visible_status || deriveBuyerVisibleStatus(closing.closing_status),
    next_required_buyer_action: deriveNextBuyerAction(closing),
    transition_notes: deriveTransitionNotes(closing.closing_status),
    progress_steps: buildBuyerProgressSteps(closing),
    visible_checklist_items: visibleItems,
  };
}

async function loadClosingContextByClosingId(closingId: string, includeChecklist = false) {
  const adminClient = await fetchAdminClient();
  if (!adminClient || !closingId.trim()) {
    return null;
  }

  const closingResult = await adminClient.from("asset_closings").select("*").eq("id", closingId).maybeSingle();
  if (closingResult.error || !closingResult.data) {
    return null;
  }

  const closing = closingResult.data as AssetClosingRow;
  if (includeChecklist) {
    await ensureChecklistItems(adminClient, closing.id);
  }

  const lookups = await getLookupMaps([closing]);
  if (!lookups) {
    return null;
  }

  const checklistItems = lookups.checklistRows.filter((item) => item.asset_closing_id === closing.id);
  return { closing, lookups, checklistItems } as const;
}

export async function getClosingDeskRecords() {
  if (!hasSupabaseEnv()) {
    return [] as ClosingDeskRecord[];
  }

  const adminClient = await fetchAdminClient();
  if (!adminClient) {
    return [];
  }

  try {
    const { data, error } = await adminClient.from("asset_closings").select("*").order("created_at", { ascending: false });
    if (error || !data) {
      return [];
    }

    const closings = data as AssetClosingRow[];
    const lookups = await getLookupMaps(closings);
    if (!lookups) {
      return [];
    }

    return closings.map((closing) => buildDeskRecord(closing, lookups)).filter((record): record is ClosingDeskRecord => Boolean(record));
  } catch {
    return [];
  }
}

export async function getAssetClosingById(id: string) {
  const context = await loadClosingContextByClosingId(id, true);
  if (!context) {
    return null;
  }

  const { closing, lookups, checklistItems } = context;
  const deskRecord = buildDeskRecord(closing, lookups);
  if (!deskRecord) {
    return null;
  }

  return {
    ...deskRecord,
    checklist_items: checklistItems.map(mapChecklistRow).sort((left, right) => left.sort_order - right.sort_order),
    related_contract: closing.contract_row_id ? lookups.contractMap.get(closing.contract_row_id) ?? null : null,
    related_transfer: closing.transfer_row_id ? lookups.transferMap.get(closing.transfer_row_id) ?? null : null,
    related_offer: closing.offer_id ? lookups.offerMap.get(closing.offer_id) ?? null : null,
    buyer_interest: lookups.buyerInterestMap.get(closing.buyer_interest_id) ?? null,
    digital_asset: lookups.digitalAssetMap.get(closing.digital_asset_id) ?? null,
  } as const;
}

export async function getAssetClosingByOfferId(offerId: string) {
  const adminClient = await fetchAdminClient();
  if (!adminClient || !offerId.trim()) {
    return null;
  }

  const closingResult = await adminClient.from("asset_closings").select("*").eq("offer_id", offerId).maybeSingle();
  if (closingResult.error || !closingResult.data) {
    return null;
  }

  return closingResult.data as AssetClosingRow;
}

export async function getAssetClosingByBuyerApplicationId(buyerApplicationId: string) {
  const adminClient = await fetchAdminClient();
  if (!adminClient || !buyerApplicationId.trim()) {
    return null;
  }

  const closingResult = await adminClient.from("asset_closings").select("*").eq("buyer_application_id", buyerApplicationId).maybeSingle();
  if (closingResult.error || !closingResult.data) {
    return null;
  }

  return closingResult.data as AssetClosingRow;
}

export async function getAssetClosingByTransferRowId(transferRowId: string) {
  const adminClient = await fetchAdminClient();
  if (!adminClient || !transferRowId.trim()) {
    return null;
  }

  const closingResult = await adminClient.from("asset_closings").select("*").eq("transfer_row_id", transferRowId).maybeSingle();
  if (closingResult.error || !closingResult.data) {
    return null;
  }

  return closingResult.data as AssetClosingRow;
}

export async function getBuyerTransferProgressByBuyerApplicationId(buyerApplicationId: string) {
  const closing = await getAssetClosingByBuyerApplicationId(buyerApplicationId);
  if (!closing) {
    return null;
  }

  const adminClient = await fetchAdminClient();
  if (!adminClient) {
    return null;
  }

  await ensureChecklistItems(adminClient, closing.id);
  const [digitalAssetResult, buyerInterestResult, checklistResult] = await Promise.all([
    adminClient.from("digital_assets").select("*").eq("id", closing.digital_asset_id).maybeSingle(),
    adminClient.from("digital_asset_buyer_interest").select("*").eq("id", closing.buyer_interest_id).maybeSingle(),
    adminClient.from("asset_transfer_checklist_items").select("*").eq("asset_closing_id", closing.id).order("sort_order", { ascending: true }),
  ]);

  if (digitalAssetResult.error || buyerInterestResult.error || checklistResult.error || !digitalAssetResult.data || !buyerInterestResult.data) {
    return null;
  }

  return buildBuyerTransferProgressRecord(
    closing,
    {
      digitalAsset: digitalAssetResult.data as DigitalAssetRow,
      buyerInterest: buyerInterestResult.data as DigitalAssetBuyerInterestRow,
      buyerApplication: null,
      offer: null,
      contract: null,
      transfer: null,
      submission: null,
      assetPackaging: null,
      assetRegistry: null,
    },
    checklistResult.data as AssetTransferChecklistItemRow[],
  );
}

export async function getClosingSummaryByOfferIds(offerIds: string[]) {
  const adminClient = await fetchAdminClient();
  if (!adminClient || offerIds.length === 0) {
    return new Map<string, Pick<ClosingDeskRecord, "id" | "closing_status" | "buyer_visible_status" | "payment_status" | "purchase_agreement_status" | "transfer_status">>();
  }

  const { data, error } = await adminClient.from("asset_closings").select("*").in("offer_id", offerIds);
  if (error || !data) {
    return new Map();
  }

  const closings = data as AssetClosingRow[];
  return new Map(
    closings.map((closing) => [
      closing.offer_id ?? closing.id,
      {
        id: closing.id,
        closing_status: closing.closing_status,
        buyer_visible_status: closing.buyer_visible_status,
        payment_status: closing.payment_status,
        purchase_agreement_status: closing.purchase_agreement_status,
        transfer_status: closing.transfer_status,
      },
    ]),
  );
}

export async function acceptOfferAndOpenClosingAction(formData: FormData) {
  "use server";

  const offerIdValue = formData.get("offer_id");
  const returnToValue = formData.get("return_to");
  const offerId = typeof offerIdValue === "string" ? offerIdValue.trim() : "";
  const returnTo = typeof returnToValue === "string" && returnToValue.trim().startsWith("/") ? returnToValue.trim() : "/admin/deals/closing-desk";

  if (!offerId) {
    redirect("/admin/offers?error=Missing%20offer%20id.");
  }

  const context = await getOfferRelatedContext(offerId);
  if (!context) {
    redirect("/admin/offers?error=Offer%20context%20not%20found.");
  }

  const closing = await createOrUpdateClosing(context);
  if (!closing) {
    redirect("/admin/offers?error=Unable%20to%20open%20the%20closing%20desk.");
  }

  const adminClient = await fetchAdminClient();
  if (!adminClient) {
    redirect("/admin/offers?error=Closing%20desk%20is%20temporarily%20unavailable.");
  }

  await adminClient
    .from("offers")
    .update({
      disposition_status: "advance_to_contract",
      disposition_note: "Accepted into the closing desk.",
      disposition_at: new Date().toISOString(),
      next_action: "Open Closing Desk",
      contract_row_id: context.offer.contract_row_id ?? closing.contract_row_id ?? null,
    } as never)
    .eq("id", offerId);

  revalidatePath("/admin/deals");
  revalidatePath("/admin/deals/buyer-offers");
  if (context.submission?.id) {
    revalidatePath(`/admin/deals/buyer-offers/${context.submission.id}`);
  }
  revalidatePath("/admin/deals/closing-desk");
  revalidatePath("/admin/buyer-offers");
  revalidatePath("/admin/offers");
  revalidatePath(`/admin/offers/${offerId}`);
  revalidatePath(`/admin/deals/closing-desk/${closing.id}`);

  const target = returnTo.startsWith("/") ? returnTo : `/admin/deals/closing-desk/${closing.id}`;
  const closingTarget = `/admin/deals/closing-desk/${closing.id}`;
  if (
    target === "/admin/deals/closing-desk" ||
    target.includes("/admin/offers") ||
    target.includes("/admin/buyer-offers") ||
    target.includes("/admin/deals/buyer-offers")
  ) {
    redirect(closingTarget);
  }

  redirect(target);
}

export async function saveClosingStateAction(formData: FormData) {
  "use server";

  const idValue = formData.get("id");
  const returnToValue = formData.get("return_to");
  const closingStatusValue = formData.get("closing_status");
  const purchaseAgreementStatusValue = formData.get("purchase_agreement_status");
  const paymentStatusValue = formData.get("payment_status");
  const transferStatusValue = formData.get("transfer_status");
  const internalNotesValue = formData.get("internal_notes");

  const id = typeof idValue === "string" ? idValue.trim() : "";
  const returnTo = typeof returnToValue === "string" && returnToValue.trim().startsWith("/") ? returnToValue.trim() : "/admin/deals/closing-desk";
  const closingStatus = typeof closingStatusValue === "string" && closingStatusOrder.includes(closingStatusValue.trim() as AssetClosingStatus)
    ? (closingStatusValue.trim() as AssetClosingStatus)
    : null;
  const purchaseAgreementStatus = typeof purchaseAgreementStatusValue === "string" &&
    ["not_sent", "sent", "signed", "cancelled"].includes(purchaseAgreementStatusValue.trim())
    ? (purchaseAgreementStatusValue.trim() as AssetClosingPurchaseAgreementStatus)
    : null;
  const paymentStatus = typeof paymentStatusValue === "string" &&
    ["not_requested", "invoice_sent", "awaiting_payment", "payment_received", "payment_failed", "refunded"].includes(paymentStatusValue.trim())
    ? (paymentStatusValue.trim() as AssetClosingPaymentStatus)
    : null;
  const transferStatus = typeof transferStatusValue === "string" &&
    ["not_started", "preparing", "in_progress", "waiting_on_buyer", "complete"].includes(transferStatusValue.trim())
    ? (transferStatusValue.trim() as AssetClosingTransferStatus)
    : null;
  const internalNotes = typeof internalNotesValue === "string" ? internalNotesValue.trim() : "";

  if (!id) {
    redirect("/admin/deals/closing-desk?error=Missing%20closing%20id.");
  }

  const adminClient = await fetchAdminClient();
  if (!adminClient) {
    redirect("/admin/deals/closing-desk?error=Closing%20desk%20is%20temporarily%20unavailable.");
  }

  const currentResult = await adminClient.from("asset_closings").select("*").eq("id", id).maybeSingle();
  if (currentResult.error || !currentResult.data) {
    redirect("/admin/deals/closing-desk?error=Closing%20not%20found.");
  }

  const current = currentResult.data as AssetClosingRow;
  const patch: Partial<AssetClosingRow> = {};

  if (internalNotesValue !== null && typeof internalNotesValue === "string") {
    patch.internal_notes = internalNotes;
  }

  if (closingStatus) {
    Object.assign(patch, mapPatchForClosingStatus(current, closingStatus, {
      purchase_agreement_status: purchaseAgreementStatus ?? undefined,
      payment_status: paymentStatus ?? undefined,
      transfer_status: transferStatus ?? undefined,
    }));
  }

  if (purchaseAgreementStatus && !closingStatus) {
    patch.purchase_agreement_status = purchaseAgreementStatus;
  }
  if (paymentStatus && !closingStatus) {
    patch.payment_status = paymentStatus;
  }
  if (transferStatus && !closingStatus) {
    patch.transfer_status = transferStatus;
  }

  if (Object.keys(patch).length === 0) {
    redirect(returnTo);
  }

  const { error } = await adminClient.from("asset_closings").update(patch as never).eq("id", id);
  if (error) {
    redirect("/admin/deals/closing-desk?error=Unable%20to%20update%20the%20closing.");
  }

  revalidatePath("/admin/deals");
  revalidatePath("/admin/deals/buyer-offers");
  revalidatePath("/admin/deals/closing-desk");
  revalidatePath(`/admin/deals/closing-desk/${id}`);
  if (current.buyer_offer_submission_id) {
    revalidatePath(`/admin/deals/buyer-offers/${current.buyer_offer_submission_id}`);
  }
  revalidatePath("/portal/buyer");
  revalidatePath("/portal/buyer/transfers");

  redirect(returnTo);
}

export async function updateChecklistItemAction(formData: FormData) {
  "use server";

  const idValue = formData.get("id");
  const closingIdValue = formData.get("asset_closing_id");
  const statusValue = formData.get("status");
  const notesValue = formData.get("internal_notes");
  const returnToValue = formData.get("return_to");
  const itemId = typeof idValue === "string" ? idValue.trim() : "";
  const closingId = typeof closingIdValue === "string" ? closingIdValue.trim() : "";
  const status = typeof statusValue === "string" && ["not_started", "in_progress", "waiting_on_buyer", "complete", "blocked"].includes(statusValue.trim())
    ? (statusValue.trim() as AssetTransferChecklistItemStatus)
    : null;
  const internalNotes = typeof notesValue === "string" ? notesValue.trim() : "";
  const returnTo = typeof returnToValue === "string" && returnToValue.trim().startsWith("/") ? returnToValue.trim() : `/admin/deals/closing-desk/${closingId || ""}`;

  if (!itemId || !closingId || !status) {
    redirect(`/admin/deals/closing-desk/${closingId || ""}?error=Missing%20checklist%20details.`);
  }

  const adminClient = await fetchAdminClient();
  if (!adminClient) {
    redirect(`/admin/deals/closing-desk/${closingId}?error=Checklist%20updates%20are%20temporarily%20unavailable.`);
  }

  const currentResult = await adminClient.from("asset_transfer_checklist_items").select("*").eq("id", itemId).maybeSingle();
  if (currentResult.error || !currentResult.data) {
    redirect(`/admin/deals/closing-desk/${closingId}?error=Checklist%20item%20not%20found.`);
  }

  const current = currentResult.data as AssetTransferChecklistItemRow;
  const completedAt = status === "complete" ? current.completed_at ?? new Date().toISOString() : null;
  const { error } = await adminClient
    .from("asset_transfer_checklist_items")
    .update({
      status,
      internal_notes: internalNotes,
      completed_at: completedAt,
    } as never)
    .eq("id", itemId);

  if (error) {
    redirect(`/admin/deals/closing-desk/${closingId}?error=Unable%20to%20update%20the%20checklist%20item.`);
  }

  if (status === "complete") {
    const closingResult = await adminClient.from("asset_closings").select("*").eq("id", closingId).maybeSingle();
    if (!closingResult.error && closingResult.data) {
      const closing = closingResult.data as AssetClosingRow;
      if (isBuyerReviewChecklistItem(current.label)) {
        await adminClient
          .from("asset_closings")
          .update({
            closing_status: "buyer_reviewing_transfer",
            transfer_status: "waiting_on_buyer",
            buyer_visible_status: deriveBuyerVisibleStatus("buyer_reviewing_transfer"),
          } as never)
          .eq("id", closing.id);
      } else if (isTransferCompleteChecklistItem(current.label)) {
        await adminClient
          .from("asset_closings")
          .update({
            closing_status: "transfer_complete",
            transfer_status: "complete",
            buyer_visible_status: deriveBuyerVisibleStatus("transfer_complete"),
          } as never)
          .eq("id", closing.id);
      } else if (isDealClosedChecklistItem(current.label)) {
        await adminClient
          .from("asset_closings")
          .update({
            closing_status: "closed",
            transfer_status: "complete",
            buyer_visible_status: deriveBuyerVisibleStatus("closed"),
          } as never)
          .eq("id", closing.id);
      } else if (isBuyerReceiptVisibleChecklistItem(current.label) && closing.closing_status === "transfer_in_progress") {
        await adminClient
          .from("asset_closings")
          .update({
            closing_status: "buyer_reviewing_transfer",
            transfer_status: "waiting_on_buyer",
            buyer_visible_status: deriveBuyerVisibleStatus("buyer_reviewing_transfer"),
          } as never)
          .eq("id", closing.id);
      }
    }
  }

  revalidatePath("/admin/deals");
  revalidatePath("/admin/deals/buyer-offers");
  revalidatePath("/admin/deals/closing-desk");
  revalidatePath(`/admin/deals/closing-desk/${closingId}`);
  const closingRecord = await adminClient.from("asset_closings").select("buyer_offer_submission_id").eq("id", closingId).maybeSingle();
  const closingRow = closingRecord.data as { buyer_offer_submission_id: string | null } | null;
  if (!closingRecord.error && closingRow?.buyer_offer_submission_id) {
    revalidatePath(`/admin/deals/buyer-offers/${closingRow.buyer_offer_submission_id}`);
  }
  revalidatePath("/portal/buyer");
  revalidatePath("/portal/buyer/transfers");

  redirect(returnTo);
}

export async function getClosingDeskClosingById(id: string) {
  return getAssetClosingById(id);
}
