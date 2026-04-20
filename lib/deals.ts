import { createAdminClient } from "@/lib/supabase/admin";
import type {
  AssetPackagingRecordStatus,
  AssetPackagingRow,
  AssetRegistryRow,
  BuyerOpportunityInteractionRow,
  BuyerOfferSubmissionRow,
  ContractRow,
  OfferRow,
  TransferRow,
} from "@/lib/supabase/database.types";
import {
  normalizeContractStatus,
  normalizeTransferWorkflowStatus,
  transferCloseoutLabel,
  transferCloseoutSummary,
  transferIsArchived,
  type TransferWorkflowStatus,
} from "@/lib/closeout-ops";

export type DealLifecycleAudience = "admin" | "buyer" | "seller";

export type DealLifecycleStage = "opportunity" | "interest" | "offer" | "contract" | "transfer" | "closeout" | "archived";

export type DealLifecycleEventState = "complete" | "pending" | "blocked" | "archived";

export type DealLifecycleEvent = Readonly<{
  key: string;
  label: string;
  at: string | null;
  summary: string;
  state: DealLifecycleEventState;
}>;

export type DealLifecycleRecord = Readonly<{
  id: string;
  asset_name: string;
  asset_slug: string;
  portal_summary: string;
  portal_visible: boolean;
  packaging_status: AssetPackagingRecordStatus;
  buyer_application_id: string | null;
  seller_application_id: string | null;
  stage: DealLifecycleStage;
  workflow_status: string;
  current_status_label: string;
  buyer_status_label: string;
  seller_status_label: string;
  current_summary: string;
  has_submission: boolean;
  has_offer: boolean;
  has_contract: boolean;
  has_transfer: boolean;
  is_completed: boolean;
  is_archived: boolean;
  last_meaningful_at: string | null;
  portal_visible_at: string | null;
  interest_at: string | null;
  submission_at: string | null;
  offer_at: string | null;
  contract_at: string | null;
  transfer_at: string | null;
  ready_to_close_at: string | null;
  completed_at: string | null;
  archived_at: string | null;
  submission_id: string | null;
  offer_id: string | null;
  contract_id: string | null;
  contract_record_id: string | null;
  transfer_id: string | null;
  transfer_workflow_status: TransferWorkflowStatus | null;
  interest_count: number;
}>;

type DealAggregation = {
  packaging: AssetPackagingRow;
  asset: AssetRegistryRow | null;
  submissions: BuyerOfferSubmissionRow[];
  primarySubmission: BuyerOfferSubmissionRow | null;
  offer: OfferRow | null;
  contract: ContractRow | null;
  transfer: TransferRow | null;
  interestCount: number;
  firstInterestAt: string | null;
};

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

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

function maxIso(values: Array<string | null | undefined>) {
  const present = values.filter((value): value is string => Boolean(value));
  if (present.length === 0) {
    return null;
  }

  return [...present].sort((left, right) => right.localeCompare(left))[0] ?? null;
}

function choosePrimarySubmission(
  submissions: BuyerOfferSubmissionRow[],
  offerMap: ReadonlyMap<string, OfferRow>,
  contractMap: ReadonlyMap<string, ContractRow>,
  transferMap: ReadonlyMap<string, TransferRow>,
) {
  if (submissions.length === 0) {
    return null;
  }

  const ranked = submissions
    .map((submission) => {
      const offer = submission.offer_record_id ? offerMap.get(submission.offer_record_id) ?? null : null;
      const contract = offer?.contract_row_id ? contractMap.get(offer.contract_row_id) ?? null : null;
      const transfer = contract?.transfer_row_id ? transferMap.get(contract.transfer_row_id) ?? null : null;

      const score = transfer
        ? transferIsArchived(transfer)
          ? 4
          : transfer.workflow_status === "completed"
            ? 3
            : 2
        : contract
          ? 2
          : offer
            ? 1
            : 0;

      return { submission, offer, contract, transfer, score };
    })
    .sort((left, right) => {
      if (left.score !== right.score) {
        return right.score - left.score;
      }

      return right.submission.created_at.localeCompare(left.submission.created_at);
    });

  return ranked[0] ?? null;
}

function buildLifecycleSummary(aggregation: DealAggregation): DealLifecycleRecord {
  const { packaging, asset, primarySubmission, offer, contract, transfer, interestCount, firstInterestAt } = aggregation;
  const archived = Boolean(transfer?.archived_at);
  const completed = archived || transfer?.workflow_status === "completed";
  const closeoutReached = Boolean(transfer?.closeout_ready_at) || completed;
  const contractStage = Boolean(contract);
  const offerStage = Boolean(offer);
  const interestStage = Boolean(primarySubmission) || interestCount > 0;
  const activeTransferWorkflow = transfer ? normalizeTransferWorkflowStatus(transfer.workflow_status, transfer.overall_transfer_status) : null;
  const stage: DealLifecycleStage = archived
    ? "archived"
    : closeoutReached
      ? "closeout"
      : activeTransferWorkflow
        ? "transfer"
        : contractStage
          ? "contract"
          : offerStage
            ? "offer"
            : interestStage
              ? "interest"
              : "opportunity";

  const workflowStatus =
    transfer?.workflow_status ??
    contract?.status ??
    offer?.disposition_status ??
    primarySubmission?.status ??
    packaging.status;

  const currentStatusLabel = archived
    ? "Archived"
    : transfer
      ? transferCloseoutLabel(transfer)
      : contract
        ? humanize(normalizeContractStatus(contract.status))
        : offer
          ? humanize(offer.disposition_status ?? offer.stage)
          : primarySubmission
            ? humanize(primarySubmission.status)
            : packaging.portal_visible
              ? "Portal visible"
              : "Hidden";

  const buyerStatusLabel = archived
    ? "Completed / archived"
    : closeoutReached
      ? "Moving toward close"
      : activeTransferWorkflow
        ? "Transfer stage reached"
        : contractStage
          ? "Contract stage reached"
          : offerStage
            ? "Under review"
            : interestStage
              ? "Buyer interest recorded"
              : packaging.portal_visible
                ? "Opportunity visible"
                : "Hidden";

  const sellerStatusLabel = archived
    ? "Completed / archived"
    : closeoutReached
      ? "Moving toward close"
      : activeTransferWorkflow
        ? "Transfer stage reached"
        : contractStage
          ? "Contract stage reached"
          : offerStage
            ? "Review stage"
            : interestStage
              ? "Inbound offer activity"
              : packaging.portal_visible
                ? "Opportunity visible"
                : "Hidden";

  const portalSummary = packaging.portal_summary || packaging.short_listing_description;
  const currentSummary = archived
    ? "The deal has been archived after completion."
    : closeoutReached
      ? transferCloseoutSummary(transfer!)
      : activeTransferWorkflow
        ? "Transfer work is underway."
        : contractStage
          ? "Contract stage has been reached."
          : offerStage
            ? "Offer review is underway."
            : interestStage
              ? "Buyer interest has been recorded."
              : "The opportunity is visible in the portal.";

  const lastMeaningfulAt = maxIso([
    transfer?.archived_at,
    transfer?.completed_at,
    transfer?.closeout_ready_at,
    transfer?.updated_at,
    contract?.updated_at,
    offer?.updated_at,
    primarySubmission?.updated_at,
    firstInterestAt,
    packaging.updated_at,
  ]);

  return {
    id: packaging.id,
    asset_name: asset?.asset_name ?? "Unknown asset",
    asset_slug: asset?.slug ?? packaging.asset_registry_id,
    portal_summary: portalSummary,
    portal_visible: packaging.portal_visible,
    packaging_status: packaging.status,
    buyer_application_id: primarySubmission?.buyer_application_id ?? null,
    seller_application_id: packaging.seller_application_id,
    stage,
    workflow_status: workflowStatus,
    current_status_label: currentStatusLabel,
    buyer_status_label: buyerStatusLabel,
    seller_status_label: sellerStatusLabel,
    current_summary: currentSummary,
    has_submission: Boolean(primarySubmission),
    has_offer: Boolean(offer),
    has_contract: Boolean(contract),
    has_transfer: Boolean(transfer),
    is_completed: completed,
    is_archived: archived,
    last_meaningful_at: lastMeaningfulAt,
    portal_visible_at: null,
    interest_at: firstInterestAt,
    submission_at: primarySubmission?.created_at ?? null,
    offer_at: offer?.created_at ?? null,
    contract_at: contract?.created_at ?? null,
    transfer_at: transfer?.created_at ?? null,
    ready_to_close_at: transfer?.closeout_ready_at ?? null,
    completed_at: transfer?.completed_at ?? null,
    archived_at: transfer?.archived_at ?? null,
    submission_id: primarySubmission?.id ?? null,
    offer_id: offer?.id ?? null,
    contract_id: contract?.id ?? null,
    contract_record_id: contract?.contract_record_id ?? null,
    transfer_id: transfer?.id ?? null,
    transfer_workflow_status: transfer ? normalizeTransferWorkflowStatus(transfer.workflow_status, transfer.overall_transfer_status) : null,
    interest_count: interestCount,
  };
}

async function loadDealLifecycleRecords() {
  if (!hasSupabaseEnv()) {
    return [] as DealLifecycleRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as DealLifecycleRecord[];
  }

  try {
    const [packagingResult, assetResult, interactionResult, submissionResult, offerResult, contractResult, transferResult] =
      await Promise.all([
        adminClient.from("asset_packaging").select("*").order("created_at", { ascending: false }),
        adminClient.from("asset_registry").select("*"),
        adminClient.from("buyer_opportunity_interactions").select("*"),
        adminClient.from("buyer_offer_submissions").select("*"),
        adminClient.from("offers").select("*"),
        adminClient.from("contracts").select("*"),
        adminClient.from("transfers").select("*"),
      ]);

    if (
      packagingResult.error ||
      !packagingResult.data ||
      assetResult.error ||
      !assetResult.data ||
      interactionResult.error ||
      !interactionResult.data ||
      submissionResult.error ||
      !submissionResult.data ||
      offerResult.error ||
      !offerResult.data ||
      contractResult.error ||
      !contractResult.data ||
      transferResult.error ||
      !transferResult.data
    ) {
      return [] as DealLifecycleRecord[];
    }

    const packagingRows = packagingResult.data as AssetPackagingRow[];
    const assetRows = assetResult.data as AssetRegistryRow[];
    const interactionRows = interactionResult.data as BuyerOpportunityInteractionRow[];
    const submissionRows = submissionResult.data as BuyerOfferSubmissionRow[];
    const offerRows = offerResult.data as OfferRow[];
    const contractRows = contractResult.data as ContractRow[];
    const transferRows = transferResult.data as TransferRow[];

    const assetMap = new Map(assetRows.map((asset) => [asset.id, asset]));
    const interactionsByPackaging = new Map<string, BuyerOpportunityInteractionRow[]>();
    const submissionsByPackaging = new Map<string, BuyerOfferSubmissionRow[]>();
    const offerMap = new Map(offerRows.map((offer) => [offer.id, offer]));
    const contractMap = new Map(contractRows.map((contract) => [contract.id, contract]));
    const transferMap = new Map(transferRows.map((transfer) => [transfer.id, transfer]));

    for (const interaction of interactionRows) {
      const rows = interactionsByPackaging.get(interaction.asset_packaging_id) ?? [];
      rows.push(interaction);
      interactionsByPackaging.set(interaction.asset_packaging_id, rows);
    }

    for (const submission of submissionRows) {
      const rows = submissionsByPackaging.get(submission.asset_packaging_id) ?? [];
      rows.push(submission);
      submissionsByPackaging.set(submission.asset_packaging_id, rows);
    }

    return packagingRows
      .map((packaging) => {
      const asset = assetMap.get(packaging.asset_registry_id) ?? null;
      const submissions = (submissionsByPackaging.get(packaging.id) ?? []).sort((left, right) => right.created_at.localeCompare(left.created_at));
      const primarySubmission = choosePrimarySubmission(submissions, offerMap, contractMap, transferMap);
      const interestRows = (interactionsByPackaging.get(packaging.id) ?? []).sort((left, right) => left.created_at.localeCompare(right.created_at));
      const interestCount = interestRows.length;
      const firstInterestAt = interestRows[0]?.created_at ?? null;

      return buildLifecycleSummary({
        packaging,
        asset,
        submissions,
        primarySubmission: primarySubmission?.submission ?? null,
        offer: primarySubmission?.offer ?? null,
        contract: primarySubmission?.contract ?? null,
        transfer: primarySubmission?.transfer ?? null,
        interestCount,
        firstInterestAt,
      });
      })
      .sort((left, right) => {
        const leftKey = left.last_meaningful_at ?? left.submission_at ?? left.portal_visible_at ?? "";
        const rightKey = right.last_meaningful_at ?? right.submission_at ?? right.portal_visible_at ?? "";
        return rightKey.localeCompare(leftKey);
      });
  } catch {
    return [] as DealLifecycleRecord[];
  }
}

export async function getDealLifecycleRecords() {
  return loadDealLifecycleRecords();
}

export async function getDealLifecycleRecordById(packagingId: string) {
  if (!packagingId) {
    return null;
  }

  const records = await loadDealLifecycleRecords();
  return records.find((record) => record.id === packagingId) ?? null;
}

export async function getBuyerDealLifecycleRecords(applicationId: string) {
  if (!applicationId) {
    return [] as DealLifecycleRecord[];
  }

  const records = await loadDealLifecycleRecords();
  return records.filter((record) => record.buyer_application_id === applicationId).sort((left, right) => {
    const leftKey = left.last_meaningful_at ?? left.submission_at ?? left.portal_visible_at ?? "";
    const rightKey = right.last_meaningful_at ?? right.submission_at ?? right.portal_visible_at ?? "";
    return rightKey.localeCompare(leftKey);
  });
}

export async function getSellerDealLifecycleRecords(applicationId: string) {
  if (!applicationId) {
    return [] as DealLifecycleRecord[];
  }

  const records = await loadDealLifecycleRecords();
  return records.filter((record) => record.seller_application_id === applicationId).sort((left, right) => {
    const leftKey = left.last_meaningful_at ?? left.transfer_at ?? left.portal_visible_at ?? "";
    const rightKey = right.last_meaningful_at ?? right.transfer_at ?? right.portal_visible_at ?? "";
    return rightKey.localeCompare(leftKey);
  });
}

export function buildLifecycleTimelineEvents(record: DealLifecycleRecord, audience: DealLifecycleAudience): DealLifecycleEvent[] {
  if (audience === "admin") {
    return [
      {
        key: "portal-visible",
        label: "Portal visible",
        at: record.portal_visible ? record.portal_visible_at : null,
        summary: record.portal_visible ? "The opportunity is visible in the buyer portal." : "The opportunity is hidden from the portal.",
        state: record.portal_visible ? "complete" : "pending",
      },
      {
        key: "buyer-interest",
        label: "Buyer interest",
        at: record.interest_at,
        summary: record.interest_count > 0 ? `${record.interest_count} interest event${record.interest_count === 1 ? "" : "s"} recorded.` : "No buyer interest has been recorded yet.",
        state: record.interest_count > 0 ? "complete" : "pending",
      },
      {
        key: "buyer-offer",
        label: "Buyer offer submitted",
        at: record.submission_at,
        summary: record.has_submission ? "A structured buyer submission exists." : "No buyer offer submission yet.",
        state: record.has_submission ? "complete" : "pending",
      },
      {
        key: "internal-offer",
        label: "Internal offer created",
        at: record.offer_at,
        summary: record.has_offer ? "The internal offer record exists." : "The internal offer record has not been created yet.",
        state: record.has_offer ? "complete" : "pending",
      },
      {
        key: "contract",
        label: "Contract linked / created",
        at: record.contract_at,
        summary: record.has_contract ? "The contract record is linked into the chain." : "No contract record is linked yet.",
        state: record.has_contract ? "complete" : "pending",
      },
      {
        key: "transfer",
        label: "Transfer linked / created",
        at: record.transfer_at,
        summary: record.has_transfer ? "The transfer record is linked into the chain." : "No transfer record is linked yet.",
        state: record.has_transfer ? "complete" : "pending",
      },
      {
        key: "ready-to-close",
        label: "Ready to close",
        at: record.ready_to_close_at,
        summary: record.ready_to_close_at ? "Closeout readiness has been stamped." : "Closeout readiness has not been stamped yet.",
        state: record.ready_to_close_at ? "complete" : "pending",
      },
      {
        key: "completed",
        label: "Completed",
        at: record.completed_at,
        summary: record.is_completed ? "The deal is completed." : "The deal has not been completed yet.",
        state: record.is_completed ? "complete" : "pending",
      },
      {
        key: "archived",
        label: "Archived",
        at: record.archived_at,
        summary: record.is_archived ? "The completed deal is archived." : "The deal has not been archived yet.",
        state: record.is_archived ? "archived" : "pending",
      },
    ];
  }

  if (audience === "buyer") {
    return [
      {
        key: "offer-submitted",
        label: "Offer submitted",
        at: record.submission_at,
        summary: record.has_submission ? "Your offer submission has been recorded." : "No offer submission has been recorded yet.",
        state: record.has_submission ? "complete" : "pending",
      },
      {
        key: "under-review",
        label: "Under review",
        at: record.offer_at ?? record.submission_at,
        summary: record.has_offer ? "The offer chain is under review." : "The offer chain is not under review yet.",
        state: record.has_offer ? "complete" : "pending",
      },
      {
        key: "contract",
        label: "Contract stage reached",
        at: record.contract_at,
        summary: record.has_contract ? "The contract stage has been reached." : "The contract stage has not been reached yet.",
        state: record.has_contract ? "complete" : "pending",
      },
      {
        key: "transfer",
        label: "Transfer stage reached",
        at: record.transfer_at,
        summary: record.has_transfer ? "The transfer stage has been reached." : "The transfer stage has not been reached yet.",
        state: record.has_transfer ? "complete" : "pending",
      },
      {
        key: "moving",
        label: "Moving toward close",
        at: record.ready_to_close_at,
        summary: record.ready_to_close_at ? "The deal is moving toward close." : "The deal is not at closeout readiness yet.",
        state: record.ready_to_close_at ? "complete" : "pending",
      },
      {
        key: "completed",
        label: "Completed",
        at: record.completed_at,
        summary: record.is_completed ? "The deal has been completed." : "The deal has not been completed yet.",
        state: record.is_completed ? "complete" : "pending",
      },
      {
        key: "archived",
        label: "Archived",
        at: record.archived_at,
        summary: record.is_archived ? "The completed deal is archived." : "The deal has not been archived yet.",
        state: record.is_archived ? "archived" : "pending",
      },
    ];
  }

  return [
    {
      key: "inbound",
      label: "Inbound offer activity",
      at: record.interest_at ?? record.submission_at,
      summary: record.has_submission || record.interest_count > 0 ? "Inbound buyer activity has been recorded." : "No inbound activity has been recorded yet.",
      state: record.has_submission || record.interest_count > 0 ? "complete" : "pending",
    },
    {
      key: "review",
      label: "Review stage",
      at: record.offer_at,
      summary: record.has_offer ? "The deal is in review." : "The deal is not in review yet.",
      state: record.has_offer ? "complete" : "pending",
    },
    {
      key: "contract",
      label: "Contract stage reached",
      at: record.contract_at,
      summary: record.has_contract ? "The contract stage has been reached." : "The contract stage has not been reached yet.",
      state: record.has_contract ? "complete" : "pending",
    },
    {
      key: "transfer",
      label: "Transfer stage reached",
      at: record.transfer_at,
      summary: record.has_transfer ? "The transfer stage has been reached." : "The transfer stage has not been reached yet.",
      state: record.has_transfer ? "complete" : "pending",
    },
    {
      key: "moving",
      label: "Moving toward close",
      at: record.ready_to_close_at,
      summary: record.ready_to_close_at ? "The deal is moving toward close." : "The deal is not at closeout readiness yet.",
      state: record.ready_to_close_at ? "complete" : "pending",
    },
    {
      key: "completed",
      label: "Completed",
      at: record.completed_at,
      summary: record.is_completed ? "The deal has been completed." : "The deal has not been completed yet.",
      state: record.is_completed ? "complete" : "pending",
    },
    {
      key: "archived",
      label: "Archived",
      at: record.archived_at,
      summary: record.is_archived ? "The completed deal is archived." : "The deal has not been archived yet.",
      state: record.is_archived ? "archived" : "pending",
    },
  ];
}

export function dealLifecycleStageLabel(stage: DealLifecycleStage) {
  switch (stage) {
    case "opportunity":
      return "Opportunity";
    case "interest":
      return "Buyer Interest";
    case "offer":
      return "Offer Review";
    case "contract":
      return "Contract";
    case "transfer":
      return "Transfer";
    case "closeout":
      return "Closeout";
    case "archived":
      return "Archived";
  }
}
