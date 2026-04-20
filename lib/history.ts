import { createAdminClient } from "@/lib/supabase/admin";
import type {
  ApplicationDocumentRow,
  AssetPackagingRow,
  BuyerApplicationRow,
  BuyerOfferSubmissionRow,
  ContractRow,
  OfferRow,
  SellerApplicationRow,
  TransferRow,
} from "@/lib/supabase/database.types";
import { getBuyerApplicationRecords, getSellerApplicationRecords } from "@/lib/application-review";
import { applicationDocumentStatusLabels } from "@/lib/application-documents";
import type { BuyerOfferSubmissionRecord } from "@/lib/buyer-offers";
import { getDealLifecycleRecords, type DealLifecycleRecord } from "@/lib/deals";
import {
  getAdminPortalRequests,
  getBuyerPortalRequests,
  type PortalRequestSummaryRecord,
} from "@/lib/portal-requests";
import { offerDispositionLabels, transferWorkflowStatusLabels } from "@/lib/closeout-ops";
import { getBuyerPortalContracts, type PortalContractRecord } from "@/lib/portal-contracts";
import { getBuyerPortalTransfers, type PortalTransferRecord } from "@/lib/portal-transfers";

export type HistoryRole = "admin" | "buyer" | "seller";

export type HistoryEntityType =
  | "application"
  | "request"
  | "document"
  | "offer"
  | "contract"
  | "transfer"
  | "deal"
  | "closeout";

export type HistoryEventType =
  | "submitted"
  | "reviewed"
  | "invited"
  | "activated"
  | "created"
  | "updated"
  | "acknowledged"
  | "in_progress"
  | "completed"
  | "blocked"
  | "cancelled"
  | "overdue"
  | "uploaded"
  | "archived"
  | "disposition";

export type HistoryEvent = Readonly<{
  key: string;
  entity_type: HistoryEntityType;
  entity_id: string;
  role_scope: HistoryRole;
  event_type: HistoryEventType;
  label: string;
  summary: string;
  timestamp: string;
  timestamp_label: string;
  href: string;
  source_label: string;
  is_overdue: boolean;
  is_completed: boolean;
  is_archived: boolean;
}>;

export type HistoryFilters = Readonly<{
  entity?: HistoryEntityType | "all";
  role?: HistoryRole | "all";
  event?: HistoryEventType | "all";
  window?: "7" | "30" | "90" | "all";
}>;

export const historyEntityTypeLabels: Record<HistoryEntityType, string> = {
  application: "Application",
  request: "Request",
  document: "Document",
  offer: "Offer",
  contract: "Contract",
  transfer: "Transfer",
  deal: "Deal",
  closeout: "Closeout",
};

export const historyEventTypeLabels: Record<HistoryEventType, string> = {
  submitted: "Submitted",
  reviewed: "Reviewed",
  invited: "Invited",
  activated: "Activated",
  created: "Created",
  updated: "Updated",
  acknowledged: "Acknowledged",
  in_progress: "In Progress",
  completed: "Completed",
  blocked: "Blocked",
  cancelled: "Cancelled",
  overdue: "Overdue",
  uploaded: "Uploaded",
  archived: "Archived",
  disposition: "Disposition",
};

export const historyRoleLabels: Record<HistoryRole, string> = {
  admin: "Admin",
  buyer: "Buyer",
  seller: "Seller",
};

const DAY_MS = 24 * 60 * 60 * 1000;

type SubmissionHistoryRecord = Pick<
  BuyerOfferSubmissionRow,
  "id" | "created_at" | "updated_at" | "reviewed_at" | "status" | "offer_record_id"
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

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function normalizeTimestamp(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function dateOnlyToTimestamp(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.length === 10 ? `${value}T00:00:00.000Z` : value;
  return normalizeTimestamp(normalized);
}

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

function makeKey(parts: Array<string | null | undefined>) {
  return parts.filter((part): part is string => Boolean(part)).join(":");
}

function makeEvent({
  key,
  entityType,
  entityId,
  roleScope,
  eventType,
  label,
  summary,
  timestamp,
  href,
  sourceLabel,
  isOverdue = false,
  isCompleted = false,
  isArchived = false,
}: Readonly<{
  key: string;
  entityType: HistoryEntityType;
  entityId: string;
  roleScope: HistoryRole;
  eventType: HistoryEventType;
  label: string;
  summary: string;
  timestamp: string | null;
  href: string;
  sourceLabel: string;
  isOverdue?: boolean;
  isCompleted?: boolean;
  isArchived?: boolean;
}>): HistoryEvent | null {
  const normalizedTimestamp = normalizeTimestamp(timestamp);

  if (!normalizedTimestamp) {
    return null;
  }

  return {
    key,
    entity_type: entityType,
    entity_id: entityId,
    role_scope: roleScope,
    event_type: eventType,
    label,
    summary,
    timestamp: normalizedTimestamp,
    timestamp_label: formatTimestamp(normalizedTimestamp),
    href,
    source_label: sourceLabel,
    is_overdue: isOverdue,
    is_completed: isCompleted,
    is_archived: isArchived,
  };
}

function collect(events: Array<HistoryEvent | null>) {
  return events.filter((event): event is HistoryEvent => Boolean(event));
}

function sortDescending(events: HistoryEvent[]) {
  return [...events].sort((left, right) => {
    const leftKey = left.timestamp ?? "";
    const rightKey = right.timestamp ?? "";
    if (leftKey !== rightKey) {
      return rightKey.localeCompare(leftKey);
    }

    return right.key.localeCompare(left.key);
  });
}

function dedupe(events: HistoryEvent[]) {
  const seen = new Set<string>();
  const result: HistoryEvent[] = [];

  for (const event of events) {
    if (seen.has(event.key)) {
      continue;
    }

    seen.add(event.key);
    result.push(event);
  }

  return result;
}

function filterWindow(events: HistoryEvent[], window: "7" | "30" | "90" | "all" = "all") {
  if (window === "all") {
    return events;
  }

  const days = Number(window);
  if (!Number.isFinite(days)) {
    return events;
  }

  const cutoff = Date.now() - days * DAY_MS;
  return events.filter((event) => new Date(event.timestamp).getTime() >= cutoff);
}

function requestHref(role: HistoryRole, requestId: string) {
  if (role === "admin") {
    return `/admin/requests/${requestId}`;
  }

  return `/portal/${role}/requests/${requestId}`;
}

function applicationHref(role: HistoryRole, applicationId: string) {
  if (role === "admin") {
    return `/admin/applications/${applicationId}`;
  }

  return `/portal/${role}/profile`;
}

function dealHref(role: HistoryRole, record: DealLifecycleRecord) {
  if (role === "admin") {
    return `/admin/deals/${record.id}`;
  }

  if (role === "buyer") {
    return record.transfer_id
      ? `/portal/buyer/transfers/${record.transfer_id}`
      : record.contract_id
        ? `/portal/buyer/contracts/${record.contract_id}`
        : record.offer_id
          ? `/portal/buyer/offers/${record.submission_id ?? record.id}`
          : `/portal/buyer/opportunities/${record.id}`;
  }

  return record.transfer_id
    ? `/portal/seller/transfers/${record.transfer_id}`
    : record.contract_id
      ? `/portal/seller/contracts/${record.contract_id}`
      : `/portal/seller/offers/${record.id}`;
}

function offerHref(role: HistoryRole, offerId: string, submissionId: string | null = null) {
  if (role === "admin") {
    return `/admin/offers/${offerId}`;
  }

  if (role === "buyer") {
    return submissionId ? `/portal/buyer/offers/${submissionId}` : "/portal/buyer/offers";
  }

  return "/portal/seller/offers";
}

function contractHref(role: HistoryRole, contractId: string) {
  if (role === "admin") {
    return `/admin/contracts/${contractId}`;
  }

  return `/portal/${role}/contracts/${contractId}`;
}

function transferHref(role: HistoryRole, transferId: string) {
  if (role === "admin") {
    return `/admin/transfers/${transferId}`;
  }

  return `/portal/${role}/transfers/${transferId}`;
}

function closeoutHref(role: HistoryRole, transferId: string) {
  if (role === "admin") {
    return `/admin/closeout/${transferId}`;
  }

  return `/portal/${role}/transfers/${transferId}`;
}

function sourceLabel(role: HistoryRole, source: string) {
  return `${historyRoleLabels[role]} · ${source}`;
}

function applicationEvents(
  record: BuyerApplicationRow | SellerApplicationRow,
  role: HistoryRole,
  href: string,
): HistoryEvent[] {
  const events = collect([
    makeEvent({
      key: makeKey(["application", record.id, "submitted"]),
      entityType: "application",
      entityId: record.id,
      roleScope: role,
      eventType: "submitted",
      label: "Application submitted",
      summary: "The application was created and entered the review queue.",
      timestamp: record.created_at,
      href,
      sourceLabel: sourceLabel(role, "Application intake"),
    }),
    makeEvent({
      key: makeKey(["application", record.id, "reviewed"]),
      entityType: "application",
      entityId: record.id,
      roleScope: role,
      eventType: "reviewed",
      label: record.status === "rejected" ? "Application rejected" : "Application reviewed",
      summary:
        record.status === "rejected"
          ? "The application was reviewed and rejected."
          : "The application moved through the admin review step.",
      timestamp: record.reviewed_at ?? record.updated_at,
      href,
      sourceLabel: sourceLabel(role, "Admin review"),
    }),
    record.invited_at
      ? makeEvent({
          key: makeKey(["application", record.id, "invited"]),
          entityType: "application",
          entityId: record.id,
          roleScope: role,
          eventType: "invited",
          label: "Invite sent",
          summary: "Admin sent the invite and the account moved toward portal activation.",
          timestamp: record.invited_at,
          href,
          sourceLabel: sourceLabel(role, "Invite flow"),
        })
      : null,
    record.status === "activated"
      ? makeEvent({
          key: makeKey(["application", record.id, "activated"]),
          entityType: "application",
          entityId: record.id,
          roleScope: role,
          eventType: "activated",
          label: "Portal access activated",
          summary: "The invited account completed activation and can use the portal.",
          timestamp: record.updated_at ?? record.invited_at ?? record.reviewed_at ?? record.created_at,
          href,
          sourceLabel: sourceLabel(role, "Auth callback"),
        })
      : null,
  ]);

  return events;
}

function requestEvents(request: PortalRequestSummaryRecord, role: HistoryRole, href: string): HistoryEvent[] {
  const baseLabel = role === "admin" ? "Admin request" : "Portal request";
  const events = collect([
    makeEvent({
      key: makeKey(["request", request.id, "created"]),
      entityType: "request",
      entityId: request.id,
      roleScope: role,
      eventType: "created",
      label: "Request created",
      summary: `${request.request_type_label} assigned to the ${request.target_role_label.toLowerCase()} portal.`,
      timestamp: request.created_at,
      href,
      sourceLabel: sourceLabel(role, baseLabel),
    }),
    request.acknowledged_at
      ? makeEvent({
          key: makeKey(["request", request.id, "acknowledged"]),
          entityType: "request",
          entityId: request.id,
          roleScope: role,
          eventType: "acknowledged",
          label: "Request acknowledged",
          summary: "The portal user acknowledged the request.",
          timestamp: request.acknowledged_at,
          href,
          sourceLabel: sourceLabel(role, "Portal action"),
        })
      : null,
    request.status === "in_progress"
      ? makeEvent({
          key: makeKey(["request", request.id, "in_progress"]),
          entityType: "request",
          entityId: request.id,
          roleScope: role,
          eventType: "in_progress",
          label: "Request moved in progress",
          summary: "The request moved into active work.",
          timestamp: request.updated_at,
          href,
          sourceLabel: sourceLabel(role, "Portal action"),
        })
      : null,
    request.completed_at
      ? makeEvent({
          key: makeKey(["request", request.id, "completed"]),
          entityType: "request",
          entityId: request.id,
          roleScope: role,
          eventType: "completed",
          label: "Request completed",
          summary: "The request was marked complete.",
          timestamp: request.completed_at,
          href,
          sourceLabel: sourceLabel(role, "Portal action"),
          isCompleted: true,
        })
      : null,
    request.blocked_at
      ? makeEvent({
          key: makeKey(["request", request.id, "blocked"]),
          entityType: "request",
          entityId: request.id,
          roleScope: role,
          eventType: "blocked",
          label: "Request blocked",
          summary: "The request was marked blocked.",
          timestamp: request.blocked_at,
          href,
          sourceLabel: sourceLabel(role, "Portal action"),
        })
      : null,
    request.cancelled_at
      ? makeEvent({
          key: makeKey(["request", request.id, "cancelled"]),
          entityType: "request",
          entityId: request.id,
          roleScope: role,
          eventType: "cancelled",
          label: "Request cancelled",
          summary: "The request was closed out before completion.",
          timestamp: request.cancelled_at,
          href,
          sourceLabel: sourceLabel(role, "Admin action"),
        })
      : null,
    request.is_overdue
      ? makeEvent({
          key: makeKey(["request", request.id, "overdue"]),
          entityType: "request",
          entityId: request.id,
          roleScope: role,
          eventType: "overdue",
          label: "Request became overdue",
          summary: "The request passed its due date before completion.",
          timestamp: request.due_date,
          href,
          sourceLabel: sourceLabel(role, "Monitoring"),
          isOverdue: true,
        })
      : null,
  ]);

  return events;
}

function documentEvents(
  document: ApplicationDocumentRow,
  role: HistoryRole,
  href: string,
  ownerLabel: string,
): HistoryEvent[] {
  return collect([
    makeEvent({
      key: makeKey(["document", document.id, "uploaded"]),
      entityType: "document",
      entityId: document.id,
      roleScope: role,
      eventType: "uploaded",
      label: "Document uploaded",
      summary: `${document.file_name} was uploaded and attached to the ${ownerLabel.toLowerCase()} chain.`,
      timestamp: document.created_at,
      href,
      sourceLabel: sourceLabel(role, "Document upload"),
    }),
    document.request_id
      ? makeEvent({
          key: makeKey(["document", document.id, "linked-request"]),
          entityType: "document",
          entityId: document.id,
          roleScope: role,
          eventType: "updated",
          label: "Document linked to request",
          summary: "The upload is linked to a controlled portal request.",
          timestamp: document.created_at,
          href,
          sourceLabel: sourceLabel(role, "Document upload"),
        })
      : null,
    document.reviewed_at
      ? makeEvent({
          key: makeKey(["document", document.id, "reviewed"]),
          entityType: "document",
          entityId: document.id,
          roleScope: role,
          eventType: "reviewed",
          label: `Document ${applicationDocumentStatusLabels[document.status]}`,
          summary: `The document moved to ${applicationDocumentStatusLabels[document.status].toLowerCase()}.`,
          timestamp: document.reviewed_at,
          href,
          sourceLabel: sourceLabel(role, "Document review"),
        })
      : null,
  ]);
}

function submissionEvents(submission: SubmissionHistoryRecord, role: HistoryRole, href: string): HistoryEvent[] {
  return collect([
    makeEvent({
      key: makeKey(["submission", submission.id, "submitted"]),
      entityType: "offer",
      entityId: submission.id,
      roleScope: role,
      eventType: "submitted",
      label: "Buyer offer submitted",
      summary: "A structured buyer offer was submitted from the portal.",
      timestamp: submission.created_at,
      href,
      sourceLabel: sourceLabel(role, "Buyer offer desk"),
    }),
    submission.reviewed_at
      ? makeEvent({
          key: makeKey(["submission", submission.id, "reviewed"]),
          entityType: "offer",
          entityId: submission.id,
          roleScope: role,
          eventType: "reviewed",
          label:
            submission.status === "approved_to_present"
              ? "Offer approved to present"
              : submission.status === "converted_to_offer"
                ? "Offer converted"
                : submission.status === "needs_follow_up"
                  ? "Follow-up requested"
                  : submission.status === "declined"
                    ? "Offer declined"
                    : "Offer reviewed",
          summary:
            submission.status === "converted_to_offer"
              ? "The submission was promoted into the internal offer pipeline."
              : submission.status === "approved_to_present"
                ? "The submission was approved for presentation."
                : submission.status === "needs_follow_up"
                  ? "Admin requested follow-up on the submission."
                  : submission.status === "declined"
                    ? "The submission was declined."
                    : "The submission moved through review.",
          timestamp: submission.reviewed_at,
          href,
          sourceLabel: sourceLabel(role, "Admin review"),
        })
      : null,
    submission.offer_record_id
      ? makeEvent({
          key: makeKey(["submission", submission.id, "offer-linked"]),
          entityType: "offer",
          entityId: submission.id,
          roleScope: role,
          eventType: "created",
          label: "Internal offer created",
          summary: "The submission now has an internal offer record.",
          timestamp: submission.reviewed_at ?? submission.updated_at,
          href,
          sourceLabel: sourceLabel(role, "Offer bridge"),
        })
      : null,
  ]);
}

function offerEvents(
  offer: OfferRow,
  role: HistoryRole,
  href: string,
  submissionId: string | null = null,
  contractId: string | null = null,
): HistoryEvent[] {
  return collect([
    makeEvent({
      key: makeKey(["offer", offer.id, "created"]),
      entityType: "offer",
      entityId: offer.id,
      roleScope: role,
      eventType: "created",
      label: "Internal offer created",
      summary: "The internal offer row was created from the buyer submission bridge.",
      timestamp: offer.created_at,
      href,
      sourceLabel: sourceLabel(role, "Offer bridge"),
    }),
    offer.updated_at
      ? makeEvent({
          key: makeKey(["offer", offer.id, "updated"]),
          entityType: "offer",
          entityId: offer.id,
          roleScope: role,
          eventType: "updated",
          label: "Offer updated",
          summary: "The internal offer row was updated.",
          timestamp: offer.updated_at,
          href,
          sourceLabel: sourceLabel(role, "Offer bridge"),
        })
      : null,
    offer.disposition_at
      ? makeEvent({
          key: makeKey(["offer", offer.id, "disposition"]),
          entityType: "offer",
          entityId: offer.id,
          roleScope: role,
          eventType: "disposition",
          label: offerDispositionLabels[offer.disposition_status ?? "seller_review"],
          summary:
            offer.disposition_note ||
            `Disposition changed to ${offerDispositionLabels[offer.disposition_status ?? "seller_review"].toLowerCase()}.`,
          timestamp: offer.disposition_at,
          href,
          sourceLabel: sourceLabel(role, "Admin disposition"),
        })
      : null,
    contractId
      ? makeEvent({
          key: makeKey(["offer", offer.id, "contract-linked"]),
          entityType: "offer",
          entityId: offer.id,
          roleScope: role,
          eventType: "created",
          label: "Contract created",
          summary: "A contract was created from the internal offer.",
          timestamp: offer.disposition_at ?? offer.updated_at,
          href,
          sourceLabel: sourceLabel(role, "Contract handoff"),
        })
      : null,
  ]);
}

function contractEvents(contract: ContractRow, role: HistoryRole, href: string, transferId: string | null = null): HistoryEvent[] {
  return collect([
    makeEvent({
      key: makeKey(["contract", contract.id, "created"]),
      entityType: "contract",
      entityId: contract.id,
      roleScope: role,
      eventType: "created",
      label: "Contract created",
      summary: "The contract record was created from the approved offer.",
      timestamp: contract.created_at,
      href,
      sourceLabel: sourceLabel(role, "Contract pipeline"),
    }),
    makeEvent({
      key: makeKey(["contract", contract.id, "sent"]),
      entityType: "contract",
      entityId: contract.id,
      roleScope: role,
      eventType: "updated",
      label: "Contract sent",
      summary: `Contract status is ${humanize(contract.status)}.`,
      timestamp: dateOnlyToTimestamp(contract.sent_date) ?? contract.updated_at,
      href,
      sourceLabel: sourceLabel(role, "Contract pipeline"),
    }),
    contract.updated_at
      ? makeEvent({
          key: makeKey(["contract", contract.id, "updated"]),
          entityType: "contract",
          entityId: contract.id,
          roleScope: role,
          eventType: "updated",
          label: "Contract updated",
          summary: `Contract status is ${humanize(contract.status)}.`,
          timestamp: contract.updated_at,
          href,
          sourceLabel: sourceLabel(role, "Contract pipeline"),
        })
      : null,
    transferId
      ? makeEvent({
          key: makeKey(["contract", contract.id, "transfer-linked"]),
          entityType: "contract",
          entityId: contract.id,
          roleScope: role,
          eventType: "created",
          label: "Transfer linked",
          summary: "The contract was linked into the transfer workflow.",
          timestamp: contract.updated_at,
          href,
          sourceLabel: sourceLabel(role, "Transfer handoff"),
        })
      : null,
  ]);
}

function transferEvents(transfer: TransferRow | PortalTransferRecord, role: HistoryRole, href: string): HistoryEvent[] {
  const workflowStatus = "workflow_status" in transfer ? transfer.workflow_status : transfer.transfer_status;
  const archived = Boolean(transfer.archived_at);
  const completed = archived || workflowStatus === "completed";
  const ready = Boolean(transfer.closeout_ready_at) || workflowStatus === "ready_to_close";
  const statusLabel = transferWorkflowStatusLabels[workflowStatus];

  return collect([
    makeEvent({
      key: makeKey(["transfer", transfer.id, "created"]),
      entityType: "transfer",
      entityId: transfer.id,
      roleScope: role,
      eventType: "created",
      label: "Transfer created",
      summary: "The transfer record was created from the contract pipeline.",
      timestamp: "created_at" in transfer ? transfer.created_at : transfer.transfer_created_at,
      href,
      sourceLabel: sourceLabel(role, "Transfer pipeline"),
    }),
    makeEvent({
      key: makeKey(["transfer", transfer.id, "updated"]),
      entityType: "transfer",
      entityId: transfer.id,
      roleScope: role,
      eventType: "updated",
      label: `Transfer ${humanize(workflowStatus)}`,
      summary: `The transfer moved to ${statusLabel.toLowerCase()}.`,
      timestamp: "transfer_updated_at" in transfer ? transfer.transfer_updated_at : transfer.updated_at,
      href,
      sourceLabel: sourceLabel(role, "Transfer pipeline"),
    }),
    ready
      ? makeEvent({
          key: makeKey(["transfer", transfer.id, "ready"]),
          entityType: "transfer",
          entityId: transfer.id,
          roleScope: role,
          eventType: "updated",
          label: "Ready to close",
          summary: "Closeout readiness was stamped on the transfer.",
          timestamp: transfer.closeout_ready_at,
          href,
          sourceLabel: sourceLabel(role, "Closeout desk"),
        })
      : null,
    completed
      ? makeEvent({
          key: makeKey(["transfer", transfer.id, "completed"]),
          entityType: "transfer",
          entityId: transfer.id,
          roleScope: role,
          eventType: "completed",
          label: "Transfer completed",
          summary: "The transfer reached completion.",
          timestamp: transfer.completed_at ?? ("transfer_updated_at" in transfer ? transfer.transfer_updated_at : transfer.updated_at),
          href,
          sourceLabel: sourceLabel(role, "Closeout desk"),
          isCompleted: true,
        })
      : null,
    archived
      ? makeEvent({
          key: makeKey(["transfer", transfer.id, "archived"]),
          entityType: "transfer",
          entityId: transfer.id,
          roleScope: role,
          eventType: "archived",
          label: "Transfer archived",
          summary: "The completed transfer was archived.",
          timestamp: transfer.archived_at,
          href,
          sourceLabel: sourceLabel(role, "Archive"),
          isCompleted: true,
          isArchived: true,
        })
      : null,
  ]);
}

function dealEvents(record: DealLifecycleRecord, role: HistoryRole, href: string): HistoryEvent[] {
  const events = collect([
    record.portal_visible_at
      ? makeEvent({
          key: makeKey(["deal", record.id, "portal-visible"]),
          entityType: "deal",
          entityId: record.id,
          roleScope: role,
          eventType: "created",
          label: "Portal visible",
          summary: "The opportunity became visible in the portal.",
          timestamp: record.portal_visible_at,
          href,
          sourceLabel: sourceLabel(role, "Packaging"),
        })
      : null,
    record.interest_at
      ? makeEvent({
          key: makeKey(["deal", record.id, "interest"]),
          entityType: "deal",
          entityId: record.id,
          roleScope: role,
          eventType: "created",
          label: "Buyer interest recorded",
          summary: `${record.interest_count} interest event${record.interest_count === 1 ? "" : "s"} recorded.`,
          timestamp: record.interest_at,
          href,
          sourceLabel: sourceLabel(role, "Buyer interest"),
        })
      : null,
    record.submission_at
      ? makeEvent({
          key: makeKey(["deal", record.id, "submission"]),
          entityType: "deal",
          entityId: record.id,
          roleScope: role,
          eventType: "submitted",
          label: "Buyer offer submitted",
          summary: "A structured buyer offer entered the chain.",
          timestamp: record.submission_at,
          href,
          sourceLabel: sourceLabel(role, "Buyer offer"),
        })
      : null,
    record.offer_at
      ? makeEvent({
          key: makeKey(["deal", record.id, "offer"]),
          entityType: "deal",
          entityId: record.id,
          roleScope: role,
          eventType: "updated",
          label: "Internal offer created",
          summary: "An internal offer row was created from the buyer submission.",
          timestamp: record.offer_at,
          href,
          sourceLabel: sourceLabel(role, "Offer bridge"),
        })
      : null,
    record.contract_at
      ? makeEvent({
          key: makeKey(["deal", record.id, "contract"]),
          entityType: "deal",
          entityId: record.id,
          roleScope: role,
          eventType: "created",
          label: "Contract linked",
          summary: "The chain reached contract stage.",
          timestamp: record.contract_at,
          href,
          sourceLabel: sourceLabel(role, "Contract pipeline"),
        })
      : null,
    record.transfer_at
      ? makeEvent({
          key: makeKey(["deal", record.id, "transfer"]),
          entityType: "deal",
          entityId: record.id,
          roleScope: role,
          eventType: "created",
          label: "Transfer linked",
          summary: "The chain reached transfer stage.",
          timestamp: record.transfer_at,
          href,
          sourceLabel: sourceLabel(role, "Transfer pipeline"),
        })
      : null,
    record.ready_to_close_at
      ? makeEvent({
          key: makeKey(["deal", record.id, "ready-to-close"]),
          entityType: "deal",
          entityId: record.id,
          roleScope: role,
          eventType: "updated",
          label: "Ready to close",
          summary: "Closeout readiness has been stamped.",
          timestamp: record.ready_to_close_at,
          href,
          sourceLabel: sourceLabel(role, "Closeout desk"),
        })
      : null,
    record.completed_at
      ? makeEvent({
          key: makeKey(["deal", record.id, "completed"]),
          entityType: "deal",
          entityId: record.id,
          roleScope: role,
          eventType: "completed",
          label: "Completed",
          summary: "The deal reached completion.",
          timestamp: record.completed_at,
          href,
          sourceLabel: sourceLabel(role, "Closeout desk"),
          isCompleted: true,
        })
      : null,
    record.archived_at
      ? makeEvent({
          key: makeKey(["deal", record.id, "archived"]),
          entityType: "deal",
          entityId: record.id,
          roleScope: role,
          eventType: "archived",
          label: "Archived",
          summary: "The completed deal was archived.",
          timestamp: record.archived_at,
          href,
          sourceLabel: sourceLabel(role, "Archive"),
          isCompleted: true,
          isArchived: true,
        })
      : null,
  ]);

  return events;
}

async function loadApplicationRecord(role: "buyer" | "seller", applicationId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !applicationId) {
    return null;
  }

  const table = role === "buyer" ? "buyer_applications" : "seller_applications";
  const { data, error } = await adminClient.from(table).select("*").eq("id", applicationId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return (data as BuyerApplicationRow | SellerApplicationRow) ?? null;
}

async function loadDocuments(role: "buyer" | "seller", applicationId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !applicationId) {
    return [] as ApplicationDocumentRow[];
  }

  const { data, error } = await adminClient
    .from("application_documents")
    .select("*")
    .eq("application_type", role)
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as ApplicationDocumentRow[];
  }

  return data as ApplicationDocumentRow[];
}

async function loadBuyerSubmissions(applicationId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !applicationId) {
    return [] as BuyerOfferSubmissionRow[];
  }

  const { data, error } = await adminClient
    .from("buyer_offer_submissions")
    .select("*")
    .eq("buyer_application_id", applicationId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as BuyerOfferSubmissionRow[];
  }

  return data as BuyerOfferSubmissionRow[];
}

async function loadSellerSubmissions(applicationId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !applicationId) {
    return [] as BuyerOfferSubmissionRow[];
  }

  const packagingResult = await adminClient.from("asset_packaging").select("id").eq("seller_application_id", applicationId);

  if (packagingResult.error || !packagingResult.data) {
    return [] as BuyerOfferSubmissionRow[];
  }

  const packagingIds = (packagingResult.data as Array<Pick<AssetPackagingRow, "id">>).map((row) => row.id);
  if (packagingIds.length === 0) {
    return [] as BuyerOfferSubmissionRow[];
  }

  const { data, error } = await adminClient
    .from("buyer_offer_submissions")
    .select("*")
    .in("asset_packaging_id", packagingIds)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as BuyerOfferSubmissionRow[];
  }

  return data as BuyerOfferSubmissionRow[];
}

async function loadOfferRows() {
  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as OfferRow[];
  }

  const { data, error } = await adminClient.from("offers").select("*").order("created_at", { ascending: false });
  if (error || !data) {
    return [] as OfferRow[];
  }

  return data as OfferRow[];
}

async function loadContractRows() {
  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as ContractRow[];
  }

  const { data, error } = await adminClient.from("contracts").select("*").order("created_at", { ascending: false });
  if (error || !data) {
    return [] as ContractRow[];
  }

  return data as ContractRow[];
}

async function loadTransferRows() {
  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as TransferRow[];
  }

  const { data, error } = await adminClient.from("transfers").select("*").order("created_at", { ascending: false });
  if (error || !data) {
    return [] as TransferRow[];
  }

  return data as TransferRow[];
}

async function loadRequestSummaries() {
  return getAdminPortalRequests({ role: "all", requestType: "all", status: "all", state: "all" });
}

async function loadAdminApplications() {
  const [buyerApplications, sellerApplications] = await Promise.all([getBuyerApplicationRecords(), getSellerApplicationRecords()]);
  return {
    buyerApplications,
    sellerApplications,
  };
}

function applicationFeedRoleLabel(role: "buyer" | "seller") {
  return role === "buyer" ? "Buyer" : "Seller";
}

export function filterHistoryEvents(events: HistoryEvent[], filters: HistoryFilters = {}) {
  return sortDescending(
    dedupe(
      filterWindow(
        events.filter((event) => {
          if (filters.entity && filters.entity !== "all" && event.entity_type !== filters.entity) {
            return false;
          }

          if (filters.role && filters.role !== "all" && event.role_scope !== filters.role) {
            return false;
          }

          if (filters.event && filters.event !== "all" && event.event_type !== filters.event) {
            return false;
          }

          return true;
        }),
        filters.window ?? "all",
      ),
    ),
  );
}

export async function getAdminActivityHistory() {
  if (!hasSupabaseEnv()) {
    return [] as HistoryEvent[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as HistoryEvent[];
  }

  const [
    applicationData,
    requestSummaries,
    dealRecords,
    documentResult,
    submissionResult,
    offerResult,
    contractResult,
    transferResult,
  ] = await Promise.all([
    loadAdminApplications(),
    loadRequestSummaries(),
    getDealLifecycleRecords(),
    adminClient.from("application_documents").select("*").order("created_at", { ascending: false }),
    adminClient.from("buyer_offer_submissions").select("*").order("created_at", { ascending: false }),
    adminClient.from("offers").select("*").order("created_at", { ascending: false }),
    adminClient.from("contracts").select("*").order("created_at", { ascending: false }),
    adminClient.from("transfers").select("*").order("created_at", { ascending: false }),
  ]);

  const events: HistoryEvent[] = [];

  for (const record of applicationData.buyerApplications) {
    events.push(...applicationEvents(record, "admin", `/admin/applications/buyers/${record.id}`));
  }

  for (const record of applicationData.sellerApplications) {
    events.push(...applicationEvents(record, "admin", `/admin/applications/sellers/${record.id}`));
  }

  for (const request of requestSummaries) {
    events.push(...requestEvents(request, "admin", `/admin/requests/${request.id}`));
  }

  if (!documentResult.error && documentResult.data) {
    const documents = documentResult.data as ApplicationDocumentRow[];
    for (const document of documents) {
      const href = document.request_id
        ? `/admin/requests/${document.request_id}`
        : `/admin/applications/${document.application_type === "buyer" ? "buyers" : "sellers"}/${document.application_id}`;
      events.push(
        ...documentEvents(
          document,
          "admin",
          href,
          document.application_type === "buyer" ? "Buyer application" : "Seller application",
        ),
      );
    }
  }

  if (!submissionResult.error && submissionResult.data) {
    const submissions = submissionResult.data as BuyerOfferSubmissionRow[];
    for (const submission of submissions) {
      const offer = !offerResult.error && offerResult.data
        ? ((offerResult.data as OfferRow[]).find((row) => row.id === submission.offer_record_id) ?? null)
        : null;
      const contract = offer && !contractResult.error && contractResult.data
        ? ((contractResult.data as ContractRow[]).find((row) => row.id === offer.contract_row_id) ?? null)
        : null;
      const transfer = contract && !transferResult.error && transferResult.data
        ? ((transferResult.data as TransferRow[]).find((row) => row.id === contract.transfer_row_id) ?? null)
        : null;
      events.push(
        ...submissionEvents(submission, "admin", `/admin/buyer-offers/${submission.id}`),
      );
      if (offer) {
        events.push(...offerEvents(offer, "admin", `/admin/offers/${offer.id}`, submission.id, contract?.id ?? null));
      }
      if (contract) {
        events.push(...contractEvents(contract, "admin", `/admin/contracts/${contract.id}`, transfer?.id ?? null));
      }
      if (transfer) {
        events.push(...transferEvents(transfer, "admin", `/admin/transfers/${transfer.id}`));
      }
    }
  }

  if (!dealRecords.length) {
    return sortDescending(dedupe(events));
  }

  for (const record of dealRecords) {
    events.push(...dealEvents(record, "admin", `/admin/deals/${record.id}`));
  }

  return sortDescending(dedupe(events));
}

export async function getBuyerHistoryFeed(applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as HistoryEvent[];
  }

  const [application, requests, documents, submissions, contracts, transfers, deals] = await Promise.all([
    loadApplicationRecord("buyer", applicationId),
    getBuyerPortalRequests(applicationId),
    loadDocuments("buyer", applicationId),
    loadBuyerSubmissions(applicationId),
    getBuyerPortalContracts(applicationId),
    getBuyerPortalTransfers(applicationId),
    getDealLifecycleRecords(),
  ]);

  const events: HistoryEvent[] = [];

  if (application) {
    events.push(...applicationEvents(application, "buyer", applicationHref("buyer", application.id)));
  }

  for (const request of requests) {
    events.push(...requestEvents(request, "buyer", requestHref("buyer", request.id)));
  }

  for (const document of documents) {
    const href = document.request_id
      ? `/portal/buyer/requests/${document.request_id}`
      : "/portal/buyer/documents";
    events.push(...documentEvents(document, "buyer", href, "Buyer application"));
  }

  for (const submission of submissions) {
    events.push(...submissionEvents(submission, "buyer", `/portal/buyer/offers/${submission.id}`));
  }

  for (const contract of contracts) {
    events.push(
      ...collect([
        makeEvent({
          key: makeKey(["buyer-contract", contract.id, "created"]),
          entityType: "contract",
          entityId: contract.id,
          roleScope: "buyer",
          eventType: "created",
          label: "Contract created",
          summary: `The contract reached ${humanize(contract.portal_status)}.`,
          timestamp: contract.contract_created_at,
          href: `/portal/buyer/contracts/${contract.id}`,
          sourceLabel: sourceLabel("buyer", "Contract pipeline"),
        }),
        makeEvent({
          key: makeKey(["buyer-contract", contract.id, "updated"]),
          entityType: "contract",
          entityId: contract.id,
          roleScope: "buyer",
          eventType: "updated",
          label: "Contract updated",
          summary: `Next step: ${contract.safe_next_step}.`,
          timestamp: contract.contract_updated_at,
          href: `/portal/buyer/contracts/${contract.id}`,
          sourceLabel: sourceLabel("buyer", "Contract pipeline"),
        }),
        contract.transfer_row_id
          ? makeEvent({
              key: makeKey(["buyer-contract", contract.id, "transfer"]),
              entityType: "transfer",
              entityId: contract.transfer_row_id,
              roleScope: "buyer",
              eventType: "created",
              label: "Transfer linked",
              summary: "The contract moved into transfer readiness.",
                timestamp: contract.contract_updated_at,
              href: `/portal/buyer/contracts/${contract.id}`,
              sourceLabel: sourceLabel("buyer", "Transfer handoff"),
            })
          : null,
      ]),
    );
  }

  for (const transfer of transfers) {
    events.push(
      ...collect([
        makeEvent({
          key: makeKey(["buyer-transfer", transfer.id, "created"]),
          entityType: "transfer",
          entityId: transfer.id,
          roleScope: "buyer",
          eventType: "created",
          label: "Transfer created",
          summary: "A transfer record was created for the deal.",
          timestamp: transfer.transfer_created_at,
          href: `/portal/buyer/transfers/${transfer.id}`,
          sourceLabel: sourceLabel("buyer", "Transfer pipeline"),
        }),
        makeEvent({
          key: makeKey(["buyer-transfer", transfer.id, "updated"]),
          entityType: "transfer",
          entityId: transfer.id,
          roleScope: "buyer",
          eventType: "updated",
          label: `Transfer ${humanize(transfer.transfer_status)}`,
          summary: `Transfer status is ${transfer.status_label.toLowerCase()}.`,
          timestamp: transfer.transfer_updated_at,
          href: `/portal/buyer/transfers/${transfer.id}`,
          sourceLabel: sourceLabel("buyer", "Transfer pipeline"),
        }),
        transfer.closeout_ready_at
          ? makeEvent({
              key: makeKey(["buyer-transfer", transfer.id, "ready"]),
              entityType: "transfer",
              entityId: transfer.id,
              roleScope: "buyer",
              eventType: "updated",
              label: "Ready to close",
              summary: "The transfer reached closeout readiness.",
              timestamp: transfer.closeout_ready_at,
              href: `/portal/buyer/transfers/${transfer.id}`,
              sourceLabel: sourceLabel("buyer", "Closeout desk"),
            })
          : null,
        transfer.completed_at
          ? makeEvent({
              key: makeKey(["buyer-transfer", transfer.id, "completed"]),
              entityType: "transfer",
              entityId: transfer.id,
              roleScope: "buyer",
              eventType: "completed",
              label: "Completed",
              summary: "The transfer was completed.",
              timestamp: transfer.completed_at,
              href: `/portal/buyer/transfers/${transfer.id}`,
              sourceLabel: sourceLabel("buyer", "Closeout desk"),
              isCompleted: true,
            })
          : null,
        transfer.archived_at
          ? makeEvent({
              key: makeKey(["buyer-transfer", transfer.id, "archived"]),
              entityType: "transfer",
              entityId: transfer.id,
              roleScope: "buyer",
              eventType: "archived",
              label: "Archived",
              summary: "The completed transfer is archived.",
              timestamp: transfer.archived_at,
              href: `/portal/buyer/transfers/${transfer.id}`,
              sourceLabel: sourceLabel("buyer", "Archive"),
              isCompleted: true,
              isArchived: true,
            })
          : null,
      ]),
    );
  }

  for (const record of deals) {
    events.push(...dealEvents(record, "buyer", dealHref("buyer", record)));
  }

  return sortDescending(dedupe(events));
}

export async function getSellerHistoryFeed(applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as HistoryEvent[];
  }

  const [application, requests, documents, submissions, deals] = await Promise.all([
    loadApplicationRecord("seller", applicationId),
    getAdminPortalRequests({ role: "seller", requestType: "all", status: "all", state: "all" }),
    loadDocuments("seller", applicationId),
    loadSellerSubmissions(applicationId),
    getDealLifecycleRecords(),
  ]);

  const events: HistoryEvent[] = [];

  if (application) {
    events.push(...applicationEvents(application, "seller", applicationHref("seller", application.id)));
  }

  for (const request of requests) {
    if (request.seller_application_id !== applicationId) {
      continue;
    }
    events.push(...requestEvents(request, "seller", requestHref("seller", request.id)));
  }

  for (const document of documents) {
    const href = document.request_id
      ? `/portal/seller/requests/${document.request_id}`
      : "/portal/seller/documents";
    events.push(...documentEvents(document, "seller", href, "Seller application"));
  }

  for (const submission of submissions) {
    events.push(...submissionEvents(submission, "seller", `/portal/seller/offers/${submission.asset_packaging_id}`));
  }

  for (const record of deals) {
    if (record.seller_application_id !== applicationId) {
      continue;
    }
    events.push(...dealEvents(record, "seller", dealHref("seller", record)));
  }

  return sortDescending(dedupe(events));
}

async function loadRawApplication(role: "buyer" | "seller", applicationId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !applicationId) {
    return null;
  }

  const table = role === "buyer" ? "buyer_applications" : "seller_applications";
  const { data, error } = await adminClient.from(table).select("*").eq("id", applicationId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as BuyerApplicationRow | SellerApplicationRow;
}

async function loadRawRequest(requestId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !requestId) {
    return null;
  }

  const { data, error } = await adminClient.from("portal_requests").select("*").eq("id", requestId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as PortalRequestSummaryRecord;
}

async function loadRawOffer(offerId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !offerId) {
    return null;
  }

  const { data, error } = await adminClient.from("offers").select("*").eq("id", offerId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as OfferRow;
}

async function loadRawContract(contractId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !contractId) {
    return null;
  }

  const { data, error } = await adminClient.from("contracts").select("*").eq("id", contractId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ContractRow;
}

async function loadRawTransfer(transferId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !transferId) {
    return null;
  }

  const { data, error } = await adminClient.from("transfers").select("*").eq("id", transferId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as TransferRow;
}

async function loadSubmissionById(submissionId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !submissionId) {
    return null;
  }

  const { data, error } = await adminClient.from("buyer_offer_submissions").select("*").eq("id", submissionId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as BuyerOfferSubmissionRow;
}

async function loadSubmissionByOfferRecordId(offerId: string) {
  const adminClient = createAdminClient();
  if (!adminClient || !offerId) {
    return null;
  }

  const { data, error } = await adminClient.from("buyer_offer_submissions").select("*").eq("offer_record_id", offerId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as BuyerOfferSubmissionRow;
}

async function loadOfferBundleBySubmissionId(submissionId: string) {
  const submission = await loadSubmissionById(submissionId);
  if (!submission) {
    return null;
  }

  const offer = submission.offer_record_id ? await loadRawOffer(submission.offer_record_id) : null;
  const contract = offer?.contract_row_id ? await loadRawContract(offer.contract_row_id) : null;

  const transfer = contract?.transfer_row_id ? await loadRawTransfer(contract.transfer_row_id) : null;

  return {
    submission,
    offer,
    contract,
    transfer,
  };
}

async function loadOfferBundleByOfferId(offerId: string) {
  const offer = await loadRawOffer(offerId);
  if (!offer) {
    return null;
  }

  const [submission, contract] = await Promise.all([
    loadSubmissionByOfferRecordId(offer.id),
    offer.contract_row_id ? loadRawContract(offer.contract_row_id) : Promise.resolve(null),
  ]);

  const transfer = contract?.transfer_row_id ? await loadRawTransfer(contract.transfer_row_id) : null;

  return {
    submission,
    offer,
    contract,
    transfer,
  };
}

export async function getApplicationHistoryEvents(role: "buyer" | "seller", applicationId: string) {
  const [application, documents, requests, deals] = await Promise.all([
    loadRawApplication(role, applicationId),
    loadDocuments(role, applicationId),
    role === "buyer" ? getBuyerPortalRequests(applicationId) : getAdminPortalRequests({ role, requestType: "all", status: "all", state: "all" }),
    getDealLifecycleRecords(),
  ]);

  const events: HistoryEvent[] = [];

  if (application) {
    events.push(...applicationEvents(application, role, applicationHref(role, application.id)));
  }

  for (const document of documents) {
    events.push(
      ...documentEvents(
        document,
        role,
        document.request_id ? requestHref(role, document.request_id) : applicationHref(role, applicationId),
        applicationFeedRoleLabel(role),
      ),
    );
  }

  for (const request of requests) {
    const linkedApplicationId = role === "buyer" ? request.buyer_application_id : request.seller_application_id;
    if (request.target_role !== role || linkedApplicationId !== applicationId) {
      continue;
    }
    events.push(...requestEvents(request, role, requestHref(role, request.id)));
  }

  for (const record of deals) {
    if ((role === "buyer" && record.buyer_application_id !== applicationId) || (role === "seller" && record.seller_application_id !== applicationId)) {
      continue;
    }
    events.push(...dealEvents(record, role, dealHref(role, record)));
  }

  return sortDescending(dedupe(events));
}

export async function getRequestHistoryEvents(role: HistoryRole, requestId: string) {
  const request = await loadRawRequest(requestId);
  if (!request) {
    return [] as HistoryEvent[];
  }

  const documents = await loadDocuments(request.target_role, request.target_role === "buyer" ? request.buyer_application_id ?? "" : request.seller_application_id ?? "");
  const events = requestEvents(request, role, requestHref(role, request.id));

  for (const document of documents) {
    if (document.request_id !== request.id) {
      continue;
    }

    events.push(...documentEvents(document, role, requestHref(role, request.id), applicationFeedRoleLabel(request.target_role)));
  }

  const dealRecords = await getDealLifecycleRecords();
  const deal = dealRecords.find((record) => record.id === request.asset_packaging_id);
  if (deal) {
    events.push(...dealEvents(deal, role, dealHref(role, deal)));
  }

  return sortDescending(dedupe(events));
}

export async function getOfferHistoryEvents(role: HistoryRole, offerId: string) {
  const bundle = await loadOfferBundleByOfferId(offerId);

  if (!bundle) {
    return [] as HistoryEvent[];
  }

  const { submission, offer, contract, transfer } = bundle;
  if (!offer) {
    return [] as HistoryEvent[];
  }

  const events = submission ? submissionEvents(submission, role, offerHref(role, offer.id, submission.id)) : [];
  events.push(...offerEvents(offer, role, offerHref(role, offer.id, submission?.id ?? null), submission?.id ?? null, contract?.id ?? null));

  if (contract) {
    events.push(...contractEvents(contract, role, contractHref(role, contract.id), transfer?.id ?? null));
  }

  if (transfer) {
    events.push(...transferEvents(transfer, role, transferHref(role, transfer.id)));
  }

  return sortDescending(dedupe(events));
}

export async function getBuyerOfferSubmissionHistoryEvents(role: HistoryRole, submissionId: string) {
  const bundle = await loadOfferBundleBySubmissionId(submissionId);
  if (!bundle) {
    return [] as HistoryEvent[];
  }

  const { submission, offer, contract, transfer } = bundle;
  const submissionHref =
    role === "admin"
      ? `/admin/buyer-offers/${submission.id}`
      : role === "buyer"
        ? `/portal/buyer/offers/${submission.id}`
        : "/portal/seller/offers";
  const events = submissionEvents(submission, role, submissionHref);

  if (offer) {
    events.push(...offerEvents(offer, role, offerHref(role, offer.id, submission.id), submission.id, contract?.id ?? null));
  }

  if (contract) {
    events.push(...contractEvents(contract, role, contractHref(role, contract.id), transfer?.id ?? null));
  }

  if (transfer) {
    events.push(...transferEvents(transfer, role, transferHref(role, transfer.id)));
  }

  return sortDescending(dedupe(events));
}

export async function getContractHistoryEvents(role: HistoryRole, contractId: string) {
  const contract = await loadRawContract(contractId);
  if (!contract) {
    return [] as HistoryEvent[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as HistoryEvent[];
  }

  const [offerResult, transfer] = await Promise.all([
    adminClient.from("offers").select("*").eq("contract_row_id", contract.id).maybeSingle(),
    contract.transfer_row_id ? loadRawTransfer(contract.transfer_row_id) : Promise.resolve(null),
  ]);

  const offer = offerResult.data ? (offerResult.data as OfferRow) : null;
  const submissionResult = offer
    ? await adminClient.from("buyer_offer_submissions").select("*").eq("offer_record_id", offer.id).maybeSingle()
    : null;
  const submission = submissionResult?.data ? (submissionResult.data as BuyerOfferSubmissionRow) : null;

  const events = contractEvents(contract, role, contractHref(role, contract.id), transfer?.id ?? null);

  if (offer) {
    events.push(...offerEvents(offer, role, offerHref(role, offer.id, submission?.id ?? null), submission?.id ?? null, contract.id));
  }

  if (offer && submission) {
    events.push(...submissionEvents(submission, role, offerHref(role, offer.id, submission.id)));
  }

  if (transfer) {
    events.push(...transferEvents(transfer, role, transferHref(role, transfer.id)));
  }

  return sortDescending(dedupe(events));
}

export async function getTransferHistoryEvents(role: HistoryRole, transferId: string) {
  const transfer = await loadRawTransfer(transferId);
  if (!transfer) {
    return [] as HistoryEvent[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as HistoryEvent[];
  }

  const contractResult = await adminClient.from("contracts").select("*").eq("transfer_row_id", transfer.id).maybeSingle();
  const contract = contractResult.data ? (contractResult.data as ContractRow) : null;
  const offerResult = contract
    ? await adminClient.from("offers").select("*").eq("contract_row_id", contract.id).maybeSingle()
    : null;
  const offer = offerResult?.data ? (offerResult.data as OfferRow) : null;
  const submissionResult = offer
    ? await adminClient.from("buyer_offer_submissions").select("*").eq("offer_record_id", offer.id).maybeSingle()
    : null;
  const submission = submissionResult?.data ? (submissionResult.data as BuyerOfferSubmissionRow) : null;

  const events = transferEvents(transfer, role, transferHref(role, transfer.id));

  if (contract) {
    events.push(...contractEvents(contract, role, contractHref(role, contract.id), transfer.id));
  }

  if (offer) {
    events.push(...offerEvents(offer, role, offerHref(role, offer.id, submission?.id ?? null), submission?.id ?? null, contract?.id ?? null));
  }

  if (offer && submission) {
    events.push(...submissionEvents(submission, role, offerHref(role, offer.id, submission.id)));
  }

  return sortDescending(dedupe(events));
}

export async function getDealHistoryEvents(role: HistoryRole, dealId: string) {
  const records = await getDealLifecycleRecords();
  const record = records.find((item) => item.id === dealId);

  if (!record) {
    return [] as HistoryEvent[];
  }

  return dealEvents(record, role, dealHref(role, record));
}

export function summarizeHistory(events: HistoryEvent[]) {
  return {
    total: events.length,
    recent: events.filter((event) => {
      const ageMs = Date.now() - new Date(event.timestamp).getTime();
      return ageMs <= 7 * DAY_MS;
    }).length,
    completed: events.filter((event) => event.is_completed || event.is_archived).length,
    overdue: events.filter((event) => event.is_overdue).length,
  };
}
