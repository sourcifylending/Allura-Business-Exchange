import { createAdminClient } from "@/lib/supabase/admin";
import type {
  AssetPackagingRow,
  AssetRegistryRow,
  BuyerOfferSubmissionRow,
  ContractRow,
  ContractStatus,
  OfferRow,
  TransferRow,
  TransferStatus,
} from "@/lib/supabase/database.types";
import {
  normalizeContractStatus,
  type ContractWorkflowStatus,
} from "@/lib/closeout-ops";

export type PortalContractRecord = Readonly<{
  id: string;
  contract_record_id: string;
  asset_name: string;
  contract_type: string;
  status: ContractStatus;
  portal_status: ContractWorkflowStatus;
  safe_next_step: string;
  document_status: string;
  submitted_at: string | null;
  contract_created_at: string;
  contract_updated_at: string;
  sent_date: string;
  offer_record_id: string | null;
  submission_id: string | null;
  packaging_id: string | null;
  offer_amount: string | null;
  structure_preference: string | null;
  financing_plan: string | null;
  target_close_date: string | null;
  transfer_row_id: string | null;
  transfer_status: TransferStatus | null;
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

function portalContractStatusText(status: ContractWorkflowStatus, transferStatus?: TransferStatus | null) {
  if (transferStatus === "complete") {
    return "Completed";
  }

  if (transferStatus === "in_progress") {
    return "Transfer in Progress";
  }

  switch (status) {
    case "draft":
      return "Draft";
    case "in_review":
    case "awaiting_admin":
      return "Under Review";
    case "ready_for_transfer":
      return "Contract Ready";
    case "transferred":
      return "Transfer Ready";
    case "closed":
    case "cancelled":
      return "Closed";
  }
}

function portalContractNextStepText(status: ContractWorkflowStatus, transferStatus?: TransferStatus | null) {
  if (transferStatus === "complete") {
    return "Closed out";
  }

  if (transferStatus === "in_progress") {
    return "Transfer processing";
  }

  switch (status) {
    case "draft":
      return "Waiting on admin review";
    case "in_review":
    case "awaiting_admin":
      return "Awaiting admin review";
    case "ready_for_transfer":
      return "Ready for transfer";
    case "transferred":
      return "Transfer ready";
    case "closed":
    case "cancelled":
      return "Closed";
  }
}

function mapPortalContractRecord({
  contract,
  submission,
  offer,
  transfer,
}: Readonly<{
  contract: ContractRow;
  submission: BuyerOfferSubmissionRow | null;
  offer: OfferRow | null;
  transfer: TransferRow | null;
}>): PortalContractRecord {
  const portalStatus = normalizeContractStatus(contract.status);

  return {
    id: contract.id,
    contract_record_id: contract.contract_record_id,
    asset_name: contract.asset_name,
    contract_type: contract.contract_type,
    status: contract.status,
    portal_status: portalStatus,
    safe_next_step: portalContractNextStepText(portalStatus, transfer?.overall_transfer_status ?? null),
    document_status: contract.document_status,
    submitted_at: submission?.created_at ?? null,
    contract_created_at: contract.created_at,
    contract_updated_at: contract.updated_at,
    sent_date: contract.sent_date,
    offer_record_id: offer?.id ?? null,
    submission_id: submission?.id ?? null,
    packaging_id: submission?.asset_packaging_id ?? null,
    offer_amount: offer?.offer_amount ?? submission?.proposed_price ?? null,
    structure_preference: submission?.structure_preference ?? offer?.counteroffer_status ?? null,
    financing_plan: submission?.financing_plan ?? null,
    target_close_date: offer?.target_close_date ?? submission?.target_close_date ?? null,
    transfer_row_id: contract.transfer_row_id,
    transfer_status: transfer?.overall_transfer_status ?? null,
  };
}

async function loadContractsForBuyer(applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as PortalContractRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as PortalContractRecord[];
  }

  try {
    const [submissionResult, offerResult] = await Promise.all([
      adminClient
        .from("buyer_offer_submissions")
        .select("*")
        .eq("buyer_application_id", applicationId)
        .order("created_at", { ascending: false }),
      adminClient.from("offers").select("*"),
    ]);

    if (submissionResult.error || !submissionResult.data || offerResult.error || !offerResult.data) {
      return [] as PortalContractRecord[];
    }

    const submissions = submissionResult.data as BuyerOfferSubmissionRow[];
    const offers = offerResult.data as OfferRow[];
    const offerMap = new Map(offers.map((offer) => [offer.id, offer]));
    const contractIds = [...new Set(offers.map((offer) => offer.contract_row_id).filter((value): value is string => Boolean(value)))];
    const contractMap = new Map<string, ContractRow>();
    const transferMap = new Map<string, TransferRow>();

    if (contractIds.length === 0) {
      return [] as PortalContractRecord[];
    }

    const contractResult = await adminClient.from("contracts").select("*").in("id", contractIds);
    if (contractResult.error || !contractResult.data) {
      return [] as PortalContractRecord[];
    }

    const contracts = contractResult.data as ContractRow[];
    const transferIds = [...new Set(contracts.map((contract) => contract.transfer_row_id).filter((value): value is string => Boolean(value)))];

    for (const contract of contracts) {
      contractMap.set(contract.id, contract);
    }

    if (transferIds.length > 0) {
      const transferResult = await adminClient.from("transfers").select("*").in("id", transferIds);
      if (!transferResult.error && transferResult.data) {
        for (const transfer of transferResult.data as TransferRow[]) {
          transferMap.set(transfer.id, transfer);
        }
      }
    }

    const records = new Map<string, PortalContractRecord>();

    for (const submission of submissions) {
      const offer = submission.offer_record_id ? offerMap.get(submission.offer_record_id) ?? null : null;
      if (!offer?.contract_row_id) {
        continue;
      }

      const contract = contractMap.get(offer.contract_row_id);
      if (!contract) {
        continue;
      }

      const transfer = contract.transfer_row_id ? transferMap.get(contract.transfer_row_id) ?? null : null;
      const record = mapPortalContractRecord({ contract, submission, offer, transfer });

      const existing = records.get(contract.id);
      if (!existing || existing.contract_updated_at < record.contract_updated_at) {
        records.set(contract.id, record);
      }
    }

    return [...records.values()].sort((a, b) => b.contract_updated_at.localeCompare(a.contract_updated_at));
  } catch {
    return [] as PortalContractRecord[];
  }
}

async function loadContractsForSeller(applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as PortalContractRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as PortalContractRecord[];
  }

  try {
    const [packagingResult, offerResult] = await Promise.all([
      adminClient.from("asset_packaging").select("*").eq("seller_application_id", applicationId),
      adminClient.from("offers").select("*"),
    ]);

    if (packagingResult.error || !packagingResult.data || offerResult.error || !offerResult.data) {
      return [] as PortalContractRecord[];
    }

    const packagingRows = packagingResult.data as AssetPackagingRow[];
    if (packagingRows.length === 0) {
      return [] as PortalContractRecord[];
    }

    const packagingIds = packagingRows.map((row) => row.id);
    const [submissionResult, contractResult] = await Promise.all([
      adminClient
        .from("buyer_offer_submissions")
        .select("*")
        .in("asset_packaging_id", packagingIds)
        .order("created_at", { ascending: false }),
      adminClient.from("contracts").select("*"),
    ]);

    if (submissionResult.error || !submissionResult.data || contractResult.error || !contractResult.data) {
      return [] as PortalContractRecord[];
    }

    const submissions = submissionResult.data as BuyerOfferSubmissionRow[];
    const offers = offerResult.data as OfferRow[];
    const contracts = contractResult.data as ContractRow[];
    const offerMap = new Map(offers.map((offer) => [offer.id, offer]));
    const contractMap = new Map(contracts.map((contract) => [contract.id, contract]));
    const transferIds = [...new Set(contracts.map((contract) => contract.transfer_row_id).filter((value): value is string => Boolean(value)))];
    const transferMap = new Map<string, TransferRow>();

    if (transferIds.length > 0) {
      const transferResult = await adminClient.from("transfers").select("*").in("id", transferIds);
      if (!transferResult.error && transferResult.data) {
        for (const transfer of transferResult.data as TransferRow[]) {
          transferMap.set(transfer.id, transfer);
        }
      }
    }

    const packagingMap = new Map(packagingRows.map((row) => [row.id, row]));
    const records = new Map<string, PortalContractRecord>();

    for (const submission of submissions) {
      const packaging = packagingMap.get(submission.asset_packaging_id);
      const offer = submission.offer_record_id ? offerMap.get(submission.offer_record_id) ?? null : null;
      if (!packaging || !offer?.contract_row_id) {
        continue;
      }

      const contract = contractMap.get(offer.contract_row_id);
      if (!contract) {
        continue;
      }

      const transfer = contract.transfer_row_id ? transferMap.get(contract.transfer_row_id) ?? null : null;
      const record = mapPortalContractRecord({ contract, submission, offer, transfer });

      const existing = records.get(contract.id);
      if (!existing || existing.contract_updated_at < record.contract_updated_at) {
        records.set(contract.id, record);
      }
    }

    return [...records.values()].sort((a, b) => b.contract_updated_at.localeCompare(a.contract_updated_at));
  } catch {
    return [] as PortalContractRecord[];
  }
}

export async function getBuyerPortalContracts(applicationId: string) {
  return loadContractsForBuyer(applicationId);
}

export async function getBuyerPortalContractById(applicationId: string, contractId: string) {
  const records = await loadContractsForBuyer(applicationId);
  return records.find((record) => record.id === contractId) ?? null;
}

export async function getSellerPortalContracts(applicationId: string) {
  return loadContractsForSeller(applicationId);
}

export async function getSellerPortalContractById(applicationId: string, contractId: string) {
  const records = await loadContractsForSeller(applicationId);
  return records.find((record) => record.id === contractId) ?? null;
}

export function portalContractStatusLabel(record: PortalContractRecord) {
  return portalContractStatusText(record.portal_status, record.transfer_status);
}

export function portalContractNextStepLabel(record: PortalContractRecord) {
  return record.safe_next_step;
}
