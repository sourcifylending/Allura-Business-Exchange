import { createAdminClient } from "@/lib/supabase/admin";
import type {
  AssetPackagingRow,
  BuyerOfferSubmissionRow,
  ContractRow,
  OfferRow,
  TransferRow,
  TransferStatus,
  TransferWorkflowStatus,
} from "@/lib/supabase/database.types";
import {
  normalizeTransferWorkflowStatus,
  transferCloseoutLabel,
  transferCloseoutNextStepLabel,
  transferCloseoutSummary,
  transferIsArchived,
} from "@/lib/closeout-ops";

export type PortalTransferRecord = Readonly<{
  id: string;
  asset_name: string;
  contract_record_id: string;
  contract_id: string;
  transfer_status: TransferWorkflowStatus;
  overall_transfer_status: TransferStatus;
  status_label: string;
  next_step: string;
  progress_summary: string;
  documentation_delivery: string;
  support_window: string;
  offer_amount: string | null;
  structure_preference: string | null;
  financing_plan: string | null;
  target_close_date: string | null;
  contract_created_at: string;
  contract_updated_at: string;
  transfer_created_at: string;
  transfer_updated_at: string;
  submitted_at: string | null;
  closeout_ready_at: string | null;
  completed_at: string | null;
  archived_at: string | null;
  offer_id: string | null;
  submission_id: string | null;
  packaging_id: string | null;
}>;

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

function mapPortalTransferRecord({
  submission,
  offer,
  contract,
  transfer,
}: Readonly<{
  submission: BuyerOfferSubmissionRow;
  offer: OfferRow;
  contract: ContractRow;
  transfer: TransferRow;
}>): PortalTransferRecord {
  const transferStatus = normalizeTransferWorkflowStatus(transfer.workflow_status, transfer.overall_transfer_status);

  return {
    id: transfer.id,
    asset_name: contract.asset_name,
    contract_record_id: contract.contract_record_id,
    contract_id: contract.id,
    transfer_status: transferStatus,
    overall_transfer_status: transfer.overall_transfer_status,
    status_label: transferIsArchived(transfer) ? "Archived" : transferCloseoutLabel(transfer),
    next_step: transferCloseoutNextStepLabel(transfer),
    progress_summary: transferCloseoutSummary(transfer),
    documentation_delivery: transfer.documentation_delivery,
    support_window: transfer.support_window,
    offer_amount: offer.offer_amount ?? submission.proposed_price ?? null,
    structure_preference: submission.structure_preference ?? null,
    financing_plan: submission.financing_plan ?? null,
    target_close_date: offer.target_close_date ?? submission.target_close_date ?? null,
    contract_created_at: contract.created_at,
    contract_updated_at: contract.updated_at,
    transfer_created_at: transfer.created_at,
    transfer_updated_at: transfer.updated_at,
    submitted_at: submission.created_at,
    closeout_ready_at: transfer.closeout_ready_at,
    completed_at: transfer.completed_at,
    archived_at: transfer.archived_at,
    offer_id: offer.id,
    submission_id: submission.id,
    packaging_id: submission.asset_packaging_id,
  };
}

async function loadTransfersForBuyer(applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as PortalTransferRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as PortalTransferRecord[];
  }

  try {
    const [submissionResult, offerResult, contractResult, transferResult] = await Promise.all([
      adminClient
        .from("buyer_offer_submissions")
        .select("*")
        .eq("buyer_application_id", applicationId)
        .order("created_at", { ascending: false }),
      adminClient.from("offers").select("*"),
      adminClient.from("contracts").select("*"),
      adminClient.from("transfers").select("*"),
    ]);

    if (
      submissionResult.error ||
      !submissionResult.data ||
      offerResult.error ||
      !offerResult.data ||
      contractResult.error ||
      !contractResult.data ||
      transferResult.error ||
      !transferResult.data
    ) {
      return [] as PortalTransferRecord[];
    }

    const submissions = submissionResult.data as BuyerOfferSubmissionRow[];
    const offers = offerResult.data as OfferRow[];
    const contracts = contractResult.data as ContractRow[];
    const transfers = transferResult.data as TransferRow[];
    const offerMap = new Map(offers.map((offer) => [offer.id, offer]));
    const contractMap = new Map(contracts.map((contract) => [contract.id, contract]));
    const transferMap = new Map(transfers.map((transfer) => [transfer.id, transfer]));
    const records = new Map<string, PortalTransferRecord>();

    for (const submission of submissions) {
      const offer = submission.offer_record_id ? offerMap.get(submission.offer_record_id) ?? null : null;
      if (!offer?.contract_row_id) {
        continue;
      }

      const contract = contractMap.get(offer.contract_row_id);
      if (!contract?.transfer_row_id) {
        continue;
      }

      const transfer = transferMap.get(contract.transfer_row_id);
      if (!transfer) {
        continue;
      }

      const record = mapPortalTransferRecord({ submission, offer, contract, transfer });
      const existing = records.get(transfer.id);

      if (!existing || existing.transfer_updated_at < record.transfer_updated_at) {
        records.set(transfer.id, record);
      }
    }

    return [...records.values()].sort((a, b) => b.transfer_updated_at.localeCompare(a.transfer_updated_at));
  } catch {
    return [] as PortalTransferRecord[];
  }
}

async function loadTransfersForSeller(applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as PortalTransferRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as PortalTransferRecord[];
  }

  try {
    const [packagingResult, offerResult, contractResult, transferResult] = await Promise.all([
      adminClient.from("asset_packaging").select("*").eq("seller_application_id", applicationId),
      adminClient.from("offers").select("*"),
      adminClient.from("contracts").select("*"),
      adminClient.from("transfers").select("*"),
    ]);

    if (
      packagingResult.error ||
      !packagingResult.data ||
      offerResult.error ||
      !offerResult.data ||
      contractResult.error ||
      !contractResult.data ||
      transferResult.error ||
      !transferResult.data
    ) {
      return [] as PortalTransferRecord[];
    }

    const packagingRows = packagingResult.data as AssetPackagingRow[];
    if (packagingRows.length === 0) {
      return [] as PortalTransferRecord[];
    }

    const packagingIds = new Set(packagingRows.map((row) => row.id));
    const offers = offerResult.data as OfferRow[];
    const contracts = contractResult.data as ContractRow[];
    const transfers = transferResult.data as TransferRow[];
    const packagingMap = new Map(packagingRows.map((row) => [row.id, row]));
    const offerMap = new Map(offers.map((offer) => [offer.id, offer]));
    const contractMap = new Map(contracts.map((contract) => [contract.id, contract]));
    const transferMap = new Map(transfers.map((transfer) => [transfer.id, transfer]));
    const records = new Map<string, PortalTransferRecord>();

    const submissionResult = await adminClient
      .from("buyer_offer_submissions")
      .select("*")
      .in("asset_packaging_id", [...packagingIds])
      .order("created_at", { ascending: false });

    if (submissionResult.error || !submissionResult.data) {
      return [] as PortalTransferRecord[];
    }

    const submissions = submissionResult.data as BuyerOfferSubmissionRow[];

    for (const submission of submissions) {
      const packaging = packagingMap.get(submission.asset_packaging_id);
      if (!packaging) {
        continue;
      }

      const offer = submission.offer_record_id ? offerMap.get(submission.offer_record_id) ?? null : null;
      if (!offer?.contract_row_id) {
        continue;
      }

      const contract = contractMap.get(offer.contract_row_id);
      if (!contract?.transfer_row_id) {
        continue;
      }

      const transfer = transferMap.get(contract.transfer_row_id);
      if (!transfer) {
        continue;
      }

      const record = mapPortalTransferRecord({ submission, offer, contract, transfer });
      const existing = records.get(transfer.id);

      if (!existing || existing.transfer_updated_at < record.transfer_updated_at) {
        records.set(transfer.id, record);
      }
    }

    return [...records.values()].sort((a, b) => b.transfer_updated_at.localeCompare(a.transfer_updated_at));
  } catch {
    return [] as PortalTransferRecord[];
  }
}

export async function getBuyerPortalTransfers(applicationId: string) {
  return loadTransfersForBuyer(applicationId);
}

export async function getBuyerPortalTransferById(applicationId: string, transferId: string) {
  const records = await loadTransfersForBuyer(applicationId);
  return records.find((record) => record.id === transferId) ?? null;
}

export async function getSellerPortalTransfers(applicationId: string) {
  return loadTransfersForSeller(applicationId);
}

export async function getSellerPortalTransferById(applicationId: string, transferId: string) {
  const records = await loadTransfersForSeller(applicationId);
  return records.find((record) => record.id === transferId) ?? null;
}

export function portalTransferStatusLabel(record: PortalTransferRecord) {
  return record.status_label;
}

export function portalTransferNextStepLabel(record: PortalTransferRecord) {
  return record.next_step;
}
