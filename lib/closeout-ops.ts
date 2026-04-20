import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { BuyerRecord } from "@/lib/buyer-ops";
import { getBuyerRecords } from "@/lib/buyer-ops";
import { createClient } from "@/lib/supabase/server";
import type {
  ContractRow,
  ContractStatus,
  OfferDispositionStatus,
  OfferRow,
  OfferStage,
  PaymentStatus,
  BuyerOfferSubmissionRow,
  SignatureStatus,
  TransferRow,
  TransferStatus,
  TransferWorkflowStatus,
} from "@/lib/supabase/database.types";

export type { ContractStatus, OfferStage, PaymentStatus, SignatureStatus, TransferStatus, TransferWorkflowStatus } from "@/lib/supabase/database.types";
export type { BuyerRecord } from "@/lib/buyer-ops";

export type OfferRecord = Readonly<Omit<OfferRow, "created_at" | "updated_at">>;
export type ContractRecord = Readonly<Omit<ContractRow, "created_at" | "updated_at">>;
export type TransferRecord = Readonly<Omit<TransferRow, "created_at" | "updated_at">>;

export const offerStageLabels: Record<OfferStage, string> = {
  offered: "Offered",
  countered: "Countered",
  accepted: "Accepted",
  waiting: "Waiting",
};

export const offerDispositionLabels: Record<OfferDispositionStatus, string> = {
  seller_review: "Seller Review",
  seller_interested: "Seller Interested",
  seller_declined: "Seller Declined",
  request_follow_up: "Request Follow Up",
  advance_to_contract: "Advance to Contract",
  close_out: "Close Out",
};

export const offerDispositionOrder: OfferDispositionStatus[] = [
  "seller_review",
  "seller_interested",
  "seller_declined",
  "request_follow_up",
  "advance_to_contract",
  "close_out",
];

export const contractStatusLabels: Record<ContractStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  signed: "Signed",
  blocked: "Blocked",
  in_review: "In Review",
  awaiting_admin: "Awaiting Admin",
  ready_for_transfer: "Ready for Transfer",
  transferred: "Transferred",
  closed: "Closed",
  cancelled: "Cancelled",
};

export type ContractWorkflowStatus =
  | "draft"
  | "in_review"
  | "awaiting_admin"
  | "ready_for_transfer"
  | "transferred"
  | "closed"
  | "cancelled";

export const contractWorkflowStatusLabels: Record<ContractWorkflowStatus, string> = {
  draft: "Draft",
  in_review: "In Review",
  awaiting_admin: "Awaiting Admin",
  ready_for_transfer: "Ready for Transfer",
  transferred: "Transferred",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const signatureStatusLabels: Record<SignatureStatus, string> = {
  not_sent: "Not Sent",
  pending: "Pending",
  complete: "Complete",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Pending",
  received: "Received",
  blocked: "Blocked",
};

export const transferStatusLabels: Record<TransferStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  complete: "Complete",
};

export const transferWorkflowStatusLabels: Record<TransferWorkflowStatus, string> = {
  queued: "Queued",
  in_progress: "In Progress",
  pending_docs: "Pending Docs",
  pending_admin: "Pending Admin",
  ready_to_close: "Ready to Close",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const transferArchiveStatusLabels = {
  active: "Active",
  archived: "Archived",
} as const;

export const offerStageOrder: OfferStage[] = ["offered", "countered", "accepted", "waiting"];
export const contractStatusOrder: ContractWorkflowStatus[] = [
  "draft",
  "in_review",
  "awaiting_admin",
  "ready_for_transfer",
  "transferred",
  "closed",
  "cancelled",
];
export const transferStatusOrder: TransferStatus[] = ["not_started", "in_progress", "blocked", "complete"];
export const transferWorkflowStatusOrder: TransferWorkflowStatus[] = [
  "queued",
  "in_progress",
  "pending_docs",
  "pending_admin",
  "ready_to_close",
  "completed",
  "cancelled",
];

export function normalizeTransferWorkflowStatus(
  workflowStatus?: TransferWorkflowStatus | null,
  overallStatus?: TransferStatus | null,
): TransferWorkflowStatus {
  if (workflowStatus) {
    return workflowStatus;
  }

  switch (overallStatus) {
    case "complete":
      return "completed";
    case "blocked":
      return "pending_admin";
    case "in_progress":
      return "in_progress";
    case "not_started":
    default:
      return "queued";
  }
}

export function transferWorkflowStatusToLegacyStatus(status: TransferWorkflowStatus): TransferStatus {
  switch (status) {
    case "completed":
      return "complete";
    case "cancelled":
      return "blocked";
    case "in_progress":
    case "pending_docs":
    case "pending_admin":
    case "ready_to_close":
      return "in_progress";
    case "queued":
    default:
      return "not_started";
  }
}

export function normalizeContractStatus(status: ContractStatus): ContractWorkflowStatus {
  switch (status) {
    case "sent":
      return "in_review";
    case "signed":
      return "ready_for_transfer";
    case "blocked":
      return "cancelled";
    default:
      return status as ContractWorkflowStatus;
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

function mapOfferRowToRecord(row: OfferRow): OfferRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;
  return record;
}

function mapContractRowToRecord(row: ContractRow): ContractRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;
  return record;
}

function mapTransferRowToRecord(row: TransferRow): TransferRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;
  return record;
}

export function transferIsArchived(transfer: TransferRecord) {
  return Boolean(transfer.archived_at);
}

export function transferArchiveStatusLabel(transfer: TransferRecord) {
  return transferIsArchived(transfer) ? transferArchiveStatusLabels.archived : transferArchiveStatusLabels.active;
}

export function transferCloseoutLabel(transfer: TransferRecord) {
  if (transfer.archived_at) {
    return "Archived";
  }

  switch (transfer.workflow_status) {
    case "completed":
      return "Completed";
    case "ready_to_close":
      return "Ready to Close";
    case "pending_docs":
      return "Pending Docs";
    case "pending_admin":
      return "Pending Admin";
    case "in_progress":
      return "In Progress";
    case "cancelled":
      return "Closed";
    case "queued":
    default:
      return "Queued";
  }
}

export function transferCloseoutNextStepLabel(transfer: TransferRecord) {
  if (transfer.archived_at) {
    return "Archive finalized";
  }

  switch (transfer.workflow_status) {
    case "completed":
      return "Closeout completed";
    case "ready_to_close":
      return "Admin closeout review";
    case "pending_docs":
      return "Waiting on required documents";
    case "pending_admin":
      return "Waiting on admin review";
    case "in_progress":
      return "Transfer processing";
    case "cancelled":
      return "Closed";
    case "queued":
    default:
      return "Awaiting closeout kickoff";
  }
}

export function transferCloseoutSummary(transfer: TransferRecord) {
  if (transfer.archived_at) {
    return "This deal has been archived after completion.";
  }

  if (transfer.workflow_status === "completed") {
    return "This deal has been completed and is ready for archive.";
  }

  if (transfer.workflow_status === "ready_to_close") {
    return "Closeout readiness has been confirmed and is waiting on admin completion.";
  }

  if (transfer.workflow_status === "pending_docs") {
    return "The closeout desk is waiting on required documents.";
  }

  if (transfer.workflow_status === "pending_admin") {
    return "The closeout desk is waiting on admin review.";
  }

  if (transfer.workflow_status === "in_progress") {
    return "Closeout work is underway.";
  }

  return "The closeout record is queued.";
}

export type TransferCloseoutMilestoneState = "complete" | "pending" | "blocked" | "archived";

export type TransferCloseoutMilestone = Readonly<{
  label: string;
  state: TransferCloseoutMilestoneState;
  detail: string;
}>;

export function transferCloseoutMilestones(transfer: TransferRecord): TransferCloseoutMilestone[] {
  const archived = transferIsArchived(transfer);
  const completed = archived || transfer.workflow_status === "completed";
  const ready = completed || transfer.workflow_status === "ready_to_close";
  const blocked = transfer.workflow_status === "pending_docs" || transfer.workflow_status === "pending_admin" || transfer.workflow_status === "cancelled";

  return [
    {
      label: "Closeout ready",
      state: ready ? "complete" : blocked ? "blocked" : "pending",
      detail: ready
        ? "The transfer is ready for closeout review."
        : blocked
          ? "The transfer is waiting on blocking items."
          : "The transfer has not yet reached closeout readiness.",
    },
    {
      label: "Completion",
      state: completed ? "complete" : "pending",
      detail: completed
        ? "The transfer has been completed."
        : "The transfer is still moving through review.",
    },
    {
      label: "Archive",
      state: archived ? "archived" : completed ? "pending" : "pending",
      detail: archived ? "The completed transfer has been archived." : "Archive remains available after completion.",
    },
  ];
}

export async function getCloseoutDeskTransferRecords() {
  const records = await getTransferRecords();
  const workflowRank: Record<TransferWorkflowStatus, number> = {
    ready_to_close: 0,
    pending_docs: 1,
    pending_admin: 2,
    in_progress: 3,
    completed: 4,
    cancelled: 5,
    queued: 6,
  };

  return records
    .filter((record) => !record.archived_at)
    .filter((record) =>
      ["queued", "in_progress", "pending_docs", "pending_admin", "ready_to_close", "completed", "cancelled"].includes(record.workflow_status),
    )
    .sort((left, right) => {
      const order = workflowRank[left.workflow_status] - workflowRank[right.workflow_status];
      if (order !== 0) {
        return order;
      }

      const leftSortKey = left.completed_at ?? left.closeout_ready_at ?? "";
      const rightSortKey = right.completed_at ?? right.closeout_ready_at ?? "";
      return rightSortKey.localeCompare(leftSortKey);
    });
}

export async function getArchivedTransferRecords() {
  const records = await getTransferRecords();
  return records
    .filter((record) => record.archived_at)
    .sort((left, right) => (right.archived_at ?? "").localeCompare(left.archived_at ?? ""));
}

type OfferFormValues = Omit<
  OfferRow,
  "id" | "created_at" | "updated_at" | "disposition_status" | "disposition_note" | "disposition_at" | "disposition_by" | "contract_row_id"
>;
type ContractFormValues = Omit<ContractRow, "id" | "created_at" | "updated_at" | "transfer_row_id">;
type TransferFormValues = Omit<TransferRow, "id" | "created_at" | "updated_at" | "archived_at" | "archived_by">;

function normalizeBuyerName(buyerId: string, fallback: string, buyerMap: ReadonlyMap<string, string>) {
  if (!buyerId) {
    return fallback;
  }

  return buyerMap.get(buyerId) ?? fallback;
}

function readOfferFormData(formData: FormData) {
  const readText = (name: keyof OfferFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const stage = readText("stage");
  const validStages = ["offered", "countered", "accepted", "waiting"] as const;

  const invalid =
    !readText("asset_name") ||
    !readText("buyer_name") ||
    !readText("asking_price") ||
    !readText("offer_amount") ||
    !readText("counteroffer_status") ||
    !readText("accepted_terms") ||
    !validStages.includes(stage as (typeof validStages)[number]) ||
    !readText("next_action") ||
    !readText("owner") ||
    !readText("target_close_date");

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  const buyerId = readText("buyer_id");

  return {
    data: {
      asset_name: readText("asset_name"),
      buyer_id: buyerId || null,
      buyer_name: readText("buyer_name"),
      asking_price: readText("asking_price"),
      offer_amount: readText("offer_amount"),
      counteroffer_status: readText("counteroffer_status"),
      accepted_terms: readText("accepted_terms"),
      stage: stage as OfferStage,
      next_action: readText("next_action"),
      owner: readText("owner"),
      target_close_date: readText("target_close_date"),
    } satisfies OfferFormValues,
  } as const;
}

function readContractFormData(formData: FormData) {
  const readText = (name: keyof ContractFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const status = readText("status");
  const signatureStatus = readText("signature_status");
  const paymentStatus = readText("payment_status");
  const validStatus = contractStatusOrder;
  const validSignatureStatus = ["not_sent", "pending", "complete"] as const;
  const validPaymentStatus = ["pending", "received", "blocked"] as const;

  const invalid =
    !readText("contract_record_id") ||
    !readText("asset_name") ||
    !readText("buyer_name") ||
    !readText("contract_type") ||
    !validStatus.includes(status as (typeof validStatus)[number]) ||
    !readText("sent_date") ||
    !validSignatureStatus.includes(signatureStatus as (typeof validSignatureStatus)[number]) ||
    !readText("document_status") ||
    !validPaymentStatus.includes(paymentStatus as (typeof validPaymentStatus)[number]) ||
    !readText("notes");

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  const buyerId = readText("buyer_id");

  return {
    data: {
      contract_record_id: readText("contract_record_id"),
      asset_name: readText("asset_name"),
      buyer_id: buyerId || null,
      buyer_name: readText("buyer_name"),
      contract_type: readText("contract_type"),
      status: status as ContractStatus,
      sent_date: readText("sent_date"),
      signature_status: signatureStatus as SignatureStatus,
      document_status: readText("document_status"),
      payment_status: paymentStatus as PaymentStatus,
      notes: readText("notes"),
    } satisfies ContractFormValues,
  } as const;
}

function readTransferFormData(formData: FormData) {
  const readText = (name: keyof TransferFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const workflowStatus = readText("workflow_status");
  const validWorkflowStatuses = transferWorkflowStatusOrder;
  const normalizedWorkflowStatus = validWorkflowStatuses.includes(workflowStatus as TransferWorkflowStatus)
    ? (workflowStatus as TransferWorkflowStatus)
    : null;

  const invalid =
    !readText("asset_name") ||
    !readText("buyer_name") ||
    !readText("documentation_delivery") ||
    !readText("support_window") ||
    !readText("next_action") ||
    !normalizedWorkflowStatus ||
    !["not_started", "in_progress", "blocked", "complete"].includes(readText("repo_transfer_status")) ||
    !["not_started", "in_progress", "blocked", "complete"].includes(readText("domain_transfer_status")) ||
    !["not_started", "in_progress", "blocked", "complete"].includes(readText("hosting_transfer_status")) ||
    !["not_started", "in_progress", "blocked", "complete"].includes(readText("admin_account_transfer_status"));

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  const buyerId = readText("buyer_id");

  return {
    data: {
      asset_name: readText("asset_name"),
      buyer_id: buyerId || null,
      buyer_name: readText("buyer_name"),
      repo_transfer_status: readText("repo_transfer_status") as TransferStatus,
      domain_transfer_status: readText("domain_transfer_status") as TransferStatus,
      hosting_transfer_status: readText("hosting_transfer_status") as TransferStatus,
      admin_account_transfer_status: readText("admin_account_transfer_status") as TransferStatus,
      documentation_delivery: readText("documentation_delivery"),
      support_window: readText("support_window"),
      workflow_status: normalizedWorkflowStatus,
      overall_transfer_status: transferWorkflowStatusToLegacyStatus(normalizedWorkflowStatus),
      next_action: readText("next_action"),
      internal_notes: readText("internal_notes") || null,
      closeout_ready_at: null,
      completed_at: null,
    } satisfies TransferFormValues,
  } as const;
}

function readId(formData: FormData) {
  const idValue = formData.get("id");
  return typeof idValue === "string" ? idValue.trim() : "";
}

function readDispositionStatus(formData: FormData) {
  const value = formData.get("disposition_status");
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return offerDispositionOrder.includes(trimmed as OfferDispositionStatus)
    ? (trimmed as OfferDispositionStatus)
    : null;
}

function readDispositionNote(formData: FormData) {
  const value = formData.get("disposition_note");
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

async function buyerNameMap() {
  const buyers = await getBuyerRecords();
  return new Map(buyers.map((buyer) => [buyer.id, buyer.buyer_name]));
}

function revalidateCloseoutPages() {
  revalidatePath("/admin/offers");
  revalidatePath("/admin/contracts");
  revalidatePath("/admin/transfers");
  revalidatePath("/admin/closeout");
  revalidatePath("/admin/closeout/archive");
  revalidatePath("/admin/risk");
  revalidatePath("/portal/buyer/notifications");
  revalidatePath("/portal/seller/notifications");
  revalidatePath("/portal/buyer/contracts");
  revalidatePath("/portal/seller/contracts");
  revalidatePath("/portal/buyer/transfers");
  revalidatePath("/portal/buyer/transfers/");
  revalidatePath("/portal/seller/transfers");
  revalidatePath("/portal/seller/transfers/");
}

export async function getOfferRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("offers").select("*").order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(mapOfferRowToRecord);
  } catch {
    return [];
  }
}

export async function getContractRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(mapContractRowToRecord);
  } catch {
    return [];
  }
}

export async function getTransferRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("transfers").select("*").order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(mapTransferRowToRecord);
  } catch {
    return [];
  }
}

export async function getOfferRecordById(id: string) {
  if (!hasSupabaseEnv() || !id) {
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("offers").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapOfferRowToRecord(data as OfferRow);
  } catch {
    return null;
  }
}

export async function getOfferRecordByContractRowId(contractRowId: string) {
  if (!hasSupabaseEnv() || !contractRowId) {
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("offers").select("*").eq("contract_row_id", contractRowId).maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapOfferRowToRecord(data as OfferRow);
  } catch {
    return null;
  }
}

export async function getContractRecordById(id: string) {
  if (!hasSupabaseEnv() || !id) {
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("contracts").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapContractRowToRecord(data as ContractRow);
  } catch {
    return null;
  }
}

export async function getContractRecordByTransferRowId(transferRowId: string) {
  if (!hasSupabaseEnv() || !transferRowId) {
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("contracts").select("*").eq("transfer_row_id", transferRowId).maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapContractRowToRecord(data as ContractRow);
  } catch {
    return null;
  }
}

export async function getTransferRecordById(id: string) {
  if (!hasSupabaseEnv() || !id) {
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("transfers").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapTransferRowToRecord(data as TransferRow);
  } catch {
    return null;
  }
}

export async function getBuyerOfferSubmissionByOfferRecordId(offerRecordId: string): Promise<BuyerOfferSubmissionRow | null> {
  if (!hasSupabaseEnv() || !offerRecordId) {
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("buyer_offer_submissions")
      .select("*")
      .eq("offer_record_id", offerRecordId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function createOfferRecord(formData: FormData) {
  "use server";

  const parsed = readOfferFormData(formData);

  if ("error" in parsed) {
    redirect(`/admin/offers?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`);
  }

  try {
    const buyerMap = await buyerNameMap();
    const payload = {
      id: randomUUID(),
      ...parsed.data,
      buyer_name: normalizeBuyerName(parsed.data.buyer_id ?? "", parsed.data.buyer_name, buyerMap),
    };
    const supabase = createClient();
    const { error } = await supabase.from("offers").insert(payload as never);

    if (error) {
      redirect("/admin/offers?error=Unable%20to%20save%20the%20new%20offer.");
    }

    revalidateCloseoutPages();
    redirect("/admin/offers?saved=created");
  } catch {
    redirect("/admin/offers?error=Unable%20to%20save%20the%20new%20offer.");
  }
}

export async function updateOfferRecord(formData: FormData) {
  "use server";

  const id = readId(formData);
  const returnTo = readReturnTo(formData, "/admin/offers?saved=updated");
  const parsed = readOfferFormData(formData);

  if (!id) {
    redirect("/admin/offers?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(`/admin/offers?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`);
  }

  try {
    const buyerMap = await buyerNameMap();
    const payload = {
      ...parsed.data,
      buyer_name: normalizeBuyerName(parsed.data.buyer_id ?? "", parsed.data.buyer_name, buyerMap),
    };
    const supabase = createClient();
    const { error } = await supabase.from("offers").update(payload as never).eq("id", id);

    if (error) {
      redirect("/admin/offers?error=Unable%20to%20update%20the%20offer.");
    }

    revalidateCloseoutPages();
    redirect(returnTo);
  } catch {
    redirect("/admin/offers?error=Unable%20to%20update%20the%20offer.");
  }
}

export async function createContractRecord(formData: FormData) {
  "use server";

  const parsed = readContractFormData(formData);

  if ("error" in parsed) {
    redirect(
      `/admin/contracts?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`,
    );
  }

  try {
    const buyerMap = await buyerNameMap();
    const payload = {
      id: randomUUID(),
      ...parsed.data,
      buyer_name: normalizeBuyerName(parsed.data.buyer_id ?? "", parsed.data.buyer_name, buyerMap),
    };
    const supabase = createClient();
    const { error } = await supabase.from("contracts").insert(payload as never);

    if (error) {
      redirect("/admin/contracts?error=Unable%20to%20save%20the%20new%20contract.");
    }

    revalidateCloseoutPages();
    redirect("/admin/contracts?saved=created");
  } catch {
    redirect("/admin/contracts?error=Unable%20to%20save%20the%20new%20contract.");
  }
}

export async function updateContractRecord(formData: FormData) {
  "use server";

  const id = readId(formData);
  const parsed = readContractFormData(formData);

  if (!id) {
    redirect("/admin/contracts?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(
      `/admin/contracts?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`,
    );
  }

  try {
    const buyerMap = await buyerNameMap();
    const payload = {
      ...parsed.data,
      buyer_name: normalizeBuyerName(parsed.data.buyer_id ?? "", parsed.data.buyer_name, buyerMap),
    };
    const supabase = createClient();
    const { error } = await supabase.from("contracts").update(payload as never).eq("id", id);

    if (error) {
      redirect("/admin/contracts?error=Unable%20to%20update%20the%20contract.");
    }

    revalidateCloseoutPages();
    redirect("/admin/contracts?saved=updated");
  } catch {
    redirect("/admin/contracts?error=Unable%20to%20update%20the%20contract.");
  }
}

export async function advanceContractToTransferAction(formData: FormData) {
  "use server";

  const id = readId(formData);
  const returnTo = readReturnTo(formData, "/admin/contracts?saved=updated");

  if (!id) {
    redirect("/admin/contracts?error=Missing%20contract%20details.");
  }

  try {
    const supabase = createClient();
    const { data: contract, error: contractError } = await supabase.from("contracts").select("*").eq("id", id).maybeSingle();

    if (contractError || !contract) {
      redirect("/admin/contracts?error=Contract%20not%20found.");
    }

    const typedContract = contract as ContractRow;
    if (typedContract.transfer_row_id) {
      redirect("/admin/contracts?error=This%20contract%20is%20already%20linked%20to%20a%20transfer.");
    }

    const transferId = randomUUID();
    const transferInsert = await supabase.from("transfers").insert({
      id: transferId,
      asset_name: typedContract.asset_name,
      buyer_id: typedContract.buyer_id,
      buyer_name: typedContract.buyer_name,
      repo_transfer_status: "not_started",
      domain_transfer_status: "not_started",
      hosting_transfer_status: "not_started",
      admin_account_transfer_status: "not_started",
      documentation_delivery: "Transfer readiness reviewed from contract pipeline.",
      support_window: "To be confirmed by admin.",
      overall_transfer_status: "not_started",
      next_action: "Review the linked contract transfer readiness.",
    } as never);

    if (transferInsert.error) {
      redirect("/admin/contracts?error=Unable%20to%20create%20the%20transfer%20record.");
    }

    const contractUpdate = await supabase
      .from("contracts")
      .update({
        transfer_row_id: transferId,
        status: "ready_for_transfer",
      } as never)
      .eq("id", id);

    if (contractUpdate.error) {
      redirect("/admin/contracts?error=Unable%20to%20link%20the%20transfer%20record.");
    }

    revalidateCloseoutPages();
    revalidatePath(`/admin/contracts/${id}`);
    revalidatePath(`/admin/transfers/${transferId}`);
    revalidatePath("/portal/buyer/contracts");
    revalidatePath("/portal/seller/contracts");
    revalidatePath("/portal/buyer/transfers");
    revalidatePath("/portal/seller/transfers");
    revalidatePath(`/portal/buyer/transfers/${transferId}`);
    revalidatePath(`/portal/seller/transfers/${transferId}`);
    redirect(returnTo);
  } catch {
    redirect("/admin/contracts?error=Unable%20to%20advance%20the%20contract%20to%20transfer.");
  }
}

export async function createTransferRecord(formData: FormData) {
  "use server";

  const parsed = readTransferFormData(formData);

  if ("error" in parsed) {
    redirect(
      `/admin/transfers?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`,
    );
  }

  try {
    const buyerMap = await buyerNameMap();
    const payload = {
      id: randomUUID(),
      ...parsed.data,
      buyer_name: normalizeBuyerName(parsed.data.buyer_id ?? "", parsed.data.buyer_name, buyerMap),
    };
    const supabase = createClient();
    const { error } = await supabase.from("transfers").insert(payload as never);

    if (error) {
      redirect("/admin/transfers?error=Unable%20to%20save%20the%20new%20transfer.");
    }

    revalidateCloseoutPages();
    redirect("/admin/transfers?saved=created");
  } catch {
    redirect("/admin/transfers?error=Unable%20to%20save%20the%20new%20transfer.");
  }
}

export async function updateTransferRecord(formData: FormData) {
  "use server";

  const id = readId(formData);
  const parsed = readTransferFormData(formData);

  if (!id) {
    redirect("/admin/transfers?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(
      `/admin/transfers?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`,
    );
  }

  try {
    const buyerMap = await buyerNameMap();
    const payload = {
      ...parsed.data,
      buyer_name: normalizeBuyerName(parsed.data.buyer_id ?? "", parsed.data.buyer_name, buyerMap),
    };
    const supabase = createClient();
    const { error } = await supabase.from("transfers").update(payload as never).eq("id", id);

    if (error) {
      redirect("/admin/transfers?error=Unable%20to%20update%20the%20transfer.");
    }

    revalidateCloseoutPages();
    redirect("/admin/transfers?saved=updated");
  } catch {
    redirect("/admin/transfers?error=Unable%20to%20update%20the%20transfer.");
  }
}

export async function updateTransferWorkflowAction(formData: FormData) {
  "use server";

  const id = readId(formData);
  const workflowStatusValue = formData.get("workflow_status");
  const internalNotesValue = formData.get("internal_notes");
  const returnTo = readReturnTo(formData, "/admin/transfers?saved=updated");

  if (!id || typeof workflowStatusValue !== "string") {
    redirect("/admin/transfers?error=Missing%20transfer%20details.");
  }

  const workflowStatus = transferWorkflowStatusOrder.find((status) => status === workflowStatusValue.trim());
  if (!workflowStatus) {
    redirect("/admin/transfers?error=Invalid%20workflow%20status.");
  }

  const internalNotes = typeof internalNotesValue === "string" ? internalNotesValue.trim() : "";

  try {
    const supabase = createClient();
    const { data: transfer, error: transferError } = await supabase.from("transfers").select("*").eq("id", id).maybeSingle();

    if (transferError || !transfer) {
      redirect("/admin/transfers?error=Transfer%20not%20found.");
    }

    const typedTransfer = transfer as TransferRow;
    const alreadyCompleted = typedTransfer.workflow_status === "completed";
    if (alreadyCompleted && workflowStatus === "completed") {
      redirect("/admin/transfers?error=This%20transfer%20is%20already%20completed.");
    }

    const closeoutReadyAt =
      workflowStatus === "ready_to_close" ? typedTransfer.closeout_ready_at ?? new Date().toISOString() : typedTransfer.closeout_ready_at;
    const completedAt = workflowStatus === "completed" ? typedTransfer.completed_at ?? new Date().toISOString() : typedTransfer.completed_at;

    const { error } = await supabase
      .from("transfers")
      .update({
        workflow_status: workflowStatus,
        overall_transfer_status: transferWorkflowStatusToLegacyStatus(workflowStatus),
        closeout_ready_at: closeoutReadyAt,
        completed_at: completedAt,
        internal_notes: internalNotes || null,
      } as never)
      .eq("id", id);

    if (error) {
      redirect("/admin/transfers?error=Unable%20to%20update%20the%20transfer%20workflow.");
    }

    revalidateCloseoutPages();
    revalidatePath(`/admin/transfers/${id}`);
    revalidatePath(`/admin/closeout/${id}`);
    revalidatePath(`/portal/buyer/transfers`);
    revalidatePath(`/portal/seller/transfers`);
    revalidatePath(`/portal/buyer/transfers/${id}`);
    revalidatePath(`/portal/seller/transfers/${id}`);
    redirect(returnTo);
  } catch {
    redirect("/admin/transfers?error=Unable%20to%20update%20the%20transfer%20workflow.");
  }
}

export async function archiveTransferAction(formData: FormData) {
  "use server";

  const id = readId(formData);
  const returnTo = readReturnTo(formData, "/admin/closeout?saved=updated");

  if (!id) {
    redirect("/admin/closeout?error=Missing%20transfer%20details.");
  }

  try {
    const supabase = createClient();
    const { data: transfer, error: transferError } = await supabase.from("transfers").select("*").eq("id", id).maybeSingle();

    if (transferError || !transfer) {
      redirect("/admin/closeout?error=Transfer%20not%20found.");
    }

    const typedTransfer = transfer as TransferRow;
    if (typedTransfer.archived_at) {
      redirect("/admin/closeout?error=This%20transfer%20is%20already%20archived.");
    }

    const now = new Date().toISOString();
    const { data: userData } = await supabase.auth.getUser();
    const adminUserId = userData.user?.id ?? null;
    const { error } = await supabase
      .from("transfers")
      .update({
        workflow_status: "completed",
        overall_transfer_status: "complete",
        closeout_ready_at: typedTransfer.closeout_ready_at ?? now,
        completed_at: typedTransfer.completed_at ?? now,
        archived_at: now,
        archived_by: adminUserId,
      } as never)
      .eq("id", id);

    if (error) {
      redirect("/admin/closeout?error=Unable%20to%20archive%20the%20transfer.");
    }

    revalidateCloseoutPages();
    revalidatePath(`/admin/closeout/${id}`);
    revalidatePath(`/admin/transfers/${id}`);
    redirect(returnTo);
  } catch {
    redirect("/admin/closeout?error=Unable%20to%20archive%20the%20transfer.");
  }
}

export async function updateOfferDispositionAction(formData: FormData) {
  "use server";

  const id = readId(formData);
  const dispositionStatus = readDispositionStatus(formData);
  const dispositionNote = readDispositionNote(formData);
  const returnTo = readReturnTo(formData, "/admin/offers?saved=updated");

  if (!id || !dispositionStatus) {
    redirect("/admin/offers?error=Missing%20offer%20details.");
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("offers")
      .update({
        disposition_status: dispositionStatus,
        disposition_note: dispositionNote,
        disposition_at: new Date().toISOString(),
      } as never)
      .eq("id", id);

    if (error) {
      redirect("/admin/offers?error=Unable%20to%20update%20the%20offer%20disposition.");
    }

    revalidateCloseoutPages();
    revalidatePath("/admin/buyer-offers");
    revalidatePath("/admin/buyer-offers?saved=updated");
    revalidatePath("/portal/buyer/offers");
    revalidatePath("/portal/seller/offers");
    redirect(returnTo);
  } catch {
    redirect("/admin/offers?error=Unable%20to%20update%20the%20offer%20disposition.");
  }
}

export async function advanceOfferToContractAction(formData: FormData) {
  "use server";

  const id = readId(formData);
  const returnTo = readReturnTo(formData, "/admin/offers?saved=updated");

  if (!id) {
    redirect("/admin/offers?error=Missing%20offer%20details.");
  }

  try {
    const supabase = createClient();
    const { data: offer, error: offerError } = await supabase.from("offers").select("*").eq("id", id).maybeSingle();

    if (offerError || !offer) {
      redirect("/admin/offers?error=Offer%20not%20found.");
    }

    const typedOffer = offer as OfferRow;
    if (typedOffer.contract_row_id) {
      redirect("/admin/offers?error=This%20offer%20is%20already%20linked%20to%20a%20contract.");
    }

    const contractId = randomUUID();
    const contractRecordId = `CON-${typedOffer.id.slice(0, 8).toUpperCase()}`;
    const contractInsert = await supabase.from("contracts").insert({
      id: contractId,
      contract_record_id: contractRecordId,
      asset_name: typedOffer.asset_name,
      buyer_id: typedOffer.buyer_id,
      buyer_name: typedOffer.buyer_name,
      contract_type: "Offer-to-contract",
      status: "draft",
      sent_date: new Date().toISOString().slice(0, 10),
      signature_status: "not_sent",
      document_status: "Draft prepared from approved offer.",
      payment_status: "pending",
      notes: typedOffer.accepted_terms,
    } as never);

    if (contractInsert.error) {
      redirect("/admin/offers?error=Unable%20to%20create%20the%20contract%20record.");
    }

    const { error } = await supabase
      .from("offers")
      .update({
        contract_row_id: contractId,
        disposition_status: "advance_to_contract",
        disposition_at: new Date().toISOString(),
        next_action: "Review the linked contract record.",
      } as never)
      .eq("id", id);

    if (error) {
      redirect("/admin/offers?error=Unable%20to%20link%20the%20contract%20record.");
    }

    revalidateCloseoutPages();
    revalidatePath("/admin/buyer-offers");
    revalidatePath("/portal/buyer/offers");
    revalidatePath("/portal/seller/offers");
    revalidatePath(`/admin/contracts/${contractId}`);
    revalidatePath("/portal/buyer/contracts");
    revalidatePath("/portal/seller/contracts");
    redirect(returnTo);
  } catch {
    redirect("/admin/offers?error=Unable%20to%20advance%20the%20offer%20to%20contract.");
  }
}
