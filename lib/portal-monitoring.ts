import { dealLifecycleStageLabel, type DealLifecycleRecord } from "@/lib/deals";
import {
  portalRequestDetailRoute,
  portalRequestNextStepLabel,
  portalRequestSummaryLabel,
  type PortalRequestSummaryRecord,
} from "@/lib/portal-requests";
import {
  transferCloseoutLabel,
  transferCloseoutNextStepLabel,
  transferCloseoutSummary,
  transferIsArchived,
  type TransferRecord,
} from "@/lib/closeout-ops";

export type MonitoringRole = "buyer" | "seller";

export type PortalNotificationRecord = Readonly<{
  key: string;
  kind: "request" | "deal";
  source_id: string;
  source_role: MonitoringRole;
  title: string;
  chain_label: string;
  chain_summary: string;
  status_label: string;
  next_step_label: string;
  summary: string;
  timestamp: string | null;
  timestamp_label: string;
  href: string;
  detail_href: string;
  is_open: boolean;
  is_overdue: boolean;
  is_completed: boolean;
  is_archived: boolean;
}>;

export type AdminRiskRecord = Readonly<{
  key: string;
  kind: "request" | "deal" | "transfer";
  source_id: string;
  title: string;
  role_label: string;
  chain_label: string;
  chain_summary: string;
  stage_label: string;
  status_label: string;
  next_step_label: string;
  risk_label: string;
  age_label: string;
  last_activity_at: string | null;
  href: string;
  is_open: boolean;
  is_overdue: boolean;
  is_stalled: boolean;
  is_completed: boolean;
  is_archived: boolean;
  linked_document_count: number;
}>;

export type AdminRiskDeskData = Readonly<{
  overdueRequests: AdminRiskRecord[];
  dueSoonRequests: AdminRiskRecord[];
  missingDocumentRequests: AdminRiskRecord[];
  stalledDeals: AdminRiskRecord[];
  closeoutReadyTransfers: AdminRiskRecord[];
  summary: {
    overdueRequests: number;
    dueSoonRequests: number;
    stalledDeals: number;
    closeoutReadyTransfers: number;
    missingDocumentRequests: number;
  };
}>;

export type PortalNotificationSummary = Readonly<{
  open: number;
  overdue: number;
  recent: number;
  completed: number;
}>;

const DAY_MS = 24 * 60 * 60 * 1000;
export const PORTAL_DUE_SOON_DAYS = 3;
export const PORTAL_STALLED_DAYS = 10;
export const PORTAL_RECENT_DAYS = 7;

function nowMs() {
  return Date.now();
}

function formatDateTime(value: string | null) {
  return value ? new Date(value).toLocaleString() : "Not set";
}

function daysSince(value: string | null) {
  if (!value) {
    return null;
  }

  return Math.floor((nowMs() - new Date(value).getTime()) / DAY_MS);
}

function daysUntil(value: string | null) {
  if (!value) {
    return null;
  }

  return Math.ceil((new Date(value).getTime() - nowMs()) / DAY_MS);
}

function ageLabel(value: string | null) {
  const days = daysSince(value);
  if (days === null) {
    return "No activity date";
  }

  if (days <= 0) {
    return "Today";
  }

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

function dueLabel(value: string | null) {
  const days = daysUntil(value);
  if (days === null) {
    return "No due date";
  }

  if (days < 0) {
    const overdueDays = Math.abs(days);
    return `Overdue by ${overdueDays} day${overdueDays === 1 ? "" : "s"}`;
  }

  if (days === 0) {
    return "Due today";
  }

  return `Due in ${days} day${days === 1 ? "" : "s"}`;
}

function isWithinRecentWindow(value: string | null, windowDays = PORTAL_RECENT_DAYS) {
  const days = daysSince(value);
  return days !== null && days <= windowDays;
}

function isDueSoon(value: string | null) {
  const days = daysUntil(value);
  return days !== null && days >= 0 && days <= PORTAL_DUE_SOON_DAYS;
}

function isStale(value: string | null) {
  const days = daysSince(value);
  return days !== null && days >= PORTAL_STALLED_DAYS;
}

function buildRequestChainLabel(request: PortalRequestSummaryRecord) {
  return request.chain_label || request.request_type_label;
}

function buildRequestSummary(request: PortalRequestSummaryRecord) {
  return request.safe_summary || portalRequestSummaryLabel(request);
}

function requestIsCompleted(request: PortalRequestSummaryRecord) {
  return request.status === "completed" || request.status === "cancelled";
}

function requestIsOpen(request: PortalRequestSummaryRecord) {
  return !requestIsCompleted(request);
}

function requestAgeLabel(request: PortalRequestSummaryRecord) {
  if (request.is_overdue) {
    return dueLabel(request.due_date);
  }

  if (request.due_date) {
    return dueLabel(request.due_date);
  }

  return ageLabel(request.updated_at ?? request.created_at);
}

function requestNotificationTimestamp(request: PortalRequestSummaryRecord) {
  return request.updated_at ?? request.completed_at ?? request.acknowledged_at ?? request.created_at;
}

function requestNotificationSummary(request: PortalRequestSummaryRecord) {
  return buildRequestSummary(request);
}

function buildPortalRequestNotification(role: MonitoringRole, request: PortalRequestSummaryRecord): PortalNotificationRecord {
  const detailHref = `/portal/${role}/notifications/request/${request.id}`;

  return {
    key: `request:${request.id}`,
    kind: "request",
    source_id: request.id,
    source_role: role,
    title: request.title,
    chain_label: buildRequestChainLabel(request),
    chain_summary: request.chain_summary,
    status_label: request.safe_status_label,
    next_step_label: portalRequestNextStepLabel(request),
    summary: requestNotificationSummary(request),
    timestamp: requestNotificationTimestamp(request),
    timestamp_label: formatDateTime(requestNotificationTimestamp(request)),
    href: portalRequestDetailRoute(role, request.id),
    detail_href: detailHref,
    is_open: requestIsOpen(request),
    is_overdue: request.is_overdue,
    is_completed: requestIsCompleted(request),
    is_archived: false,
  };
}

function buildDealNotification(role: MonitoringRole, record: DealLifecycleRecord): PortalNotificationRecord {
  const detailHref = `/portal/${role}/notifications/deal/${record.id}`;
  const href =
    record.transfer_id
      ? `/portal/${role}/transfers/${record.transfer_id}`
      : record.contract_id
        ? `/portal/${role}/contracts/${record.contract_id}`
        : record.offer_id
          ? `/portal/${role}/offers/${record.offer_id}`
          : role === "buyer"
            ? `/portal/buyer/opportunities/${record.id}`
            : `/portal/${role}`;

  const timestamp =
    record.last_meaningful_at ??
    record.archived_at ??
    record.completed_at ??
    record.transfer_at ??
    record.contract_at ??
    record.offer_at ??
    record.submission_at ??
    record.portal_visible_at;

  return {
    key: `deal:${record.id}`,
    kind: "deal",
    source_id: record.id,
    source_role: role,
    title: record.asset_name,
    chain_label: `${record.asset_name} · ${dealLifecycleStageLabel(record.stage)}`,
    chain_summary: record.current_summary,
    status_label: record.current_status_label,
    next_step_label: role === "buyer" ? record.buyer_status_label : record.seller_status_label,
    summary: record.current_summary,
    timestamp,
    timestamp_label: formatDateTime(timestamp),
    href,
    detail_href: detailHref,
    is_open: !record.is_completed && !record.is_archived,
    is_overdue: false,
    is_completed: record.is_completed,
    is_archived: record.is_archived,
  };
}

function buildTransferRiskRecord(transfer: TransferRecord): AdminRiskRecord {
  const archived = transferIsArchived(transfer);
  const completed = archived || transfer.workflow_status === "completed";
  const lastActivityAt = transfer.closeout_ready_at ?? transfer.completed_at ?? transfer.archived_at ?? null;
  const stale = !completed && !archived && isStale(lastActivityAt);
  const ready = transfer.workflow_status === "ready_to_close";
  const riskLabel = archived
    ? "Archived"
    : ready
      ? "Ready for closeout"
      : transfer.workflow_status === "completed"
        ? "Completed"
        : stale
          ? "Stalled transfer"
          : transfer.workflow_status === "pending_docs"
            ? "Awaiting documents"
            : transfer.workflow_status === "pending_admin"
              ? "Awaiting admin"
              : "In progress";

  return {
    key: `transfer:${transfer.id}`,
    kind: "transfer",
    source_id: transfer.id,
    title: transfer.asset_name,
    role_label: "Admin",
    chain_label: `${transfer.asset_name} · Transfer`,
    chain_summary: transferCloseoutSummary(transfer),
    stage_label: humanize(transfer.workflow_status),
    status_label: transferCloseoutLabel(transfer),
    next_step_label: transferCloseoutNextStepLabel(transfer),
    risk_label: riskLabel,
    age_label: ageLabel(lastActivityAt),
    last_activity_at: lastActivityAt,
    href: `/admin/closeout/${transfer.id}`,
    is_open: !completed,
    is_overdue: false,
    is_stalled: stale,
    is_completed: completed,
    is_archived: archived,
    linked_document_count: 0,
  };
}

function buildRequestRiskRecord(request: PortalRequestSummaryRecord): AdminRiskRecord {
  const lastActivityAt = request.updated_at ?? request.completed_at ?? request.acknowledged_at ?? request.created_at;
  const dueSoon = isDueSoon(request.due_date);
  const riskLabel = request.is_overdue
    ? "Overdue"
    : request.status === "blocked"
      ? "Blocked"
      : request.request_type === "document_request" && request.linked_document_count === 0 && request.status !== "completed" && request.status !== "cancelled"
        ? "Missing document"
        : dueSoon && request.status !== "completed" && request.status !== "cancelled"
          ? "Due soon"
          : request.status === "completed"
            ? "Completed"
            : "Open";

  return {
    key: `request:${request.id}`,
    kind: "request",
    source_id: request.id,
    title: request.title,
    role_label: request.target_role_label,
    chain_label: buildRequestChainLabel(request),
    chain_summary: request.chain_summary,
    stage_label: request.request_type_label,
    status_label: request.safe_status_label,
    next_step_label: request.safe_next_step,
    risk_label: riskLabel,
    age_label: requestAgeLabel(request),
    last_activity_at: lastActivityAt,
    href: `/admin/requests/${request.id}`,
    is_open: requestIsOpen(request),
    is_overdue: request.is_overdue,
    is_stalled: false,
    is_completed: requestIsCompleted(request),
    is_archived: false,
    linked_document_count: request.linked_document_count,
  };
}

function buildDealRiskRecord(record: DealLifecycleRecord): AdminRiskRecord {
  const lastActivityAt = record.last_meaningful_at;
  const stale = !record.is_completed && !record.is_archived && isStale(lastActivityAt);
  const riskLabel = record.is_archived
    ? "Archived"
    : record.stage === "closeout" && !record.is_completed
      ? "Closeout ready"
      : record.stage === "transfer" && stale
        ? "Stalled transfer"
        : record.stage === "contract" && stale
          ? "Stalled contract"
          : record.stage === "offer" && stale
            ? "Stalled offer"
            : record.is_completed
              ? "Completed"
              : stale
                ? "Stalled"
                : "In progress";

  return {
    key: `deal:${record.id}`,
    kind: "deal",
    source_id: record.id,
    title: record.asset_name,
    role_label:
      record.buyer_application_id && record.seller_application_id
        ? "Buyer / Seller"
        : record.buyer_application_id
          ? "Buyer"
          : record.seller_application_id
            ? "Seller"
            : "Admin",
    chain_label: `${record.asset_name} · ${dealLifecycleStageLabel(record.stage)}`,
    chain_summary: record.current_summary,
    stage_label: dealLifecycleStageLabel(record.stage),
    status_label: record.current_status_label,
    next_step_label: record.stage === "archived" ? "Archived" : record.buyer_status_label,
    risk_label: riskLabel,
    age_label: ageLabel(lastActivityAt),
    last_activity_at: lastActivityAt,
    href: `/admin/deals/${record.id}`,
    is_open: !record.is_completed && !record.is_archived,
    is_overdue: false,
    is_stalled: stale,
    is_completed: record.is_completed,
    is_archived: record.is_archived,
    linked_document_count: 0,
  };
}

function sortByTimestampDesc<T extends Readonly<{ timestamp?: string | null; last_activity_at?: string | null }>>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftTime = left.timestamp ?? left.last_activity_at ?? "";
    const rightTime = right.timestamp ?? right.last_activity_at ?? "";
    return rightTime.localeCompare(leftTime);
  });
}

export function buildPortalNotifications(role: MonitoringRole, requests: PortalRequestSummaryRecord[], deals: DealLifecycleRecord[]) {
  const notifications = [
    ...requests.map((request) => buildPortalRequestNotification(role, request)),
    ...deals.map((record) => buildDealNotification(role, record)),
  ];

  return sortByTimestampDesc(notifications);
}

export function summarizePortalNotifications(records: PortalNotificationRecord[]): PortalNotificationSummary {
  return {
    open: records.filter((record) => record.is_open).length,
    overdue: records.filter((record) => record.is_overdue).length,
    recent: records.filter((record) => isWithinRecentWindow(record.timestamp)).length,
    completed: records.filter((record) => record.is_completed || record.is_archived).length,
  };
}

export function portalNotificationCenterRoute(role: MonitoringRole) {
  return role === "buyer" ? "/portal/buyer/notifications" : "/portal/seller/notifications";
}

export function portalNotificationDetailRoute(role: MonitoringRole, kind: PortalNotificationRecord["kind"], id: string) {
  return `${portalNotificationCenterRoute(role)}/${kind}/${id}`;
}

export function buildAdminRiskDesk(
  requests: PortalRequestSummaryRecord[],
  deals: DealLifecycleRecord[],
  transfers: TransferRecord[],
): AdminRiskDeskData {
  const requestRecords = requests.map((request) => buildRequestRiskRecord(request));
  const overdueRequests = requestRecords.filter((record) => record.is_overdue);
  const dueSoonRequests = requestRecords.filter((record) => !record.is_overdue && record.is_open && record.kind === "request" && record.risk_label === "Due soon");
  const missingDocumentRequests = requestRecords.filter(
    (record) => record.kind === "request" && record.risk_label === "Missing document",
  );
  const stalledDeals = deals
    .map((record) => buildDealRiskRecord(record))
    .filter((record) => record.is_stalled);
  const closeoutReadyTransfers = transfers
    .map((transfer) => buildTransferRiskRecord(transfer))
    .filter((record) => record.risk_label === "Ready for closeout" || record.risk_label === "Completed");

  return {
    overdueRequests,
    dueSoonRequests,
    missingDocumentRequests,
    stalledDeals,
    closeoutReadyTransfers,
    summary: {
      overdueRequests: overdueRequests.length,
      dueSoonRequests: dueSoonRequests.length,
      stalledDeals: stalledDeals.length,
      closeoutReadyTransfers: closeoutReadyTransfers.length,
      missingDocumentRequests: missingDocumentRequests.length,
    },
  };
}
