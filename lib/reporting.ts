import { createAdminClient } from "@/lib/supabase/admin";
import type { ApplicationDocumentRow, BuyerOfferSubmissionRow, PortalRequestRow } from "@/lib/supabase/database.types";
import { buildAdminRiskDesk } from "@/lib/portal-monitoring";
import {
  dealLifecycleStageLabel,
  getDealLifecycleRecords,
  type DealLifecycleRecord,
} from "@/lib/deals";
import {
  getAdminBuyerOfferSubmissions,
} from "@/lib/buyer-offers";
import { getCloseoutDeskTransferRecords } from "@/lib/closeout-ops";
import {
  getAdminPortalRequests,
  portalRequestStatusText,
  portalRequestTargetRoleText,
  portalRequestTypeText,
} from "@/lib/portal-requests";

const DAY_MS = 24 * 60 * 60 * 1000;

export type ReportingKpi = Readonly<{
  label: string;
  value: number;
  detail: string;
  href: string;
}>;

export type ReportingFunnelRow = Readonly<{
  label: string;
  count: number;
  rate: string;
  note: string;
}>;

export type ReportingAgingRow = Readonly<{
  label: string;
  count: number;
  averageDays: number | null;
  medianDays: number | null;
  note: string;
}>;

export type ReportingComplianceRow = Readonly<{
  label: string;
  count: number;
  detail: string;
}>;

export type ReportingCompletionRow = Readonly<{
  label: string;
  count: number;
  detail: string;
}>;

export type ReportingExportTable = Readonly<{
  title: string;
  columns: string[];
  rows: string[][];
}>;

export type AdminReportingDashboard = Readonly<{
  kpis: ReportingKpi[];
  funnelRows: ReportingFunnelRow[];
  agingRows: ReportingAgingRow[];
  overdueBuckets: ReportingComplianceRow[];
  requestComplianceRows: ReportingComplianceRow[];
  documentComplianceRows: ReportingComplianceRow[];
  completionRows: ReportingCompletionRow[];
  exportTables: ReportingExportTable[];
  summary: {
    opportunities: number;
    submissions: number;
    offers: number;
    contracts: number;
    transfers: number;
    closeoutReady: number;
    archived: number;
    openRequests: number;
    overdueRequests: number;
    documentsPendingReview: number;
  };
}>;

type ReportingDocumentRow = ApplicationDocumentRow;

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

function percentage(count: number, total: number) {
  if (total <= 0) {
    return "0%";
  }

  return `${Math.round((count / total) * 100)}%`;
}

function daysBetween(start: string | null, end: string | null = new Date().toISOString()) {
  if (!start || !end) {
    return null;
  }

  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / DAY_MS));
}

function averageDays(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round((total / values.length) * 10) / 10;
}

function medianDays(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2) * 10) / 10;
  }

  return sorted[middle] ?? null;
}

function requestIsOverdue(request: PortalRequestRow) {
  if (!request.due_date) {
    return false;
  }

  if (request.status === "completed" || request.status === "cancelled") {
    return false;
  }

  return new Date(request.due_date).getTime() < Date.now();
}

function requestIsOpen(request: PortalRequestRow) {
  return request.status !== "completed" && request.status !== "cancelled";
}

function requestOverdueDays(request: PortalRequestRow) {
  if (!requestIsOverdue(request) || !request.due_date) {
    return null;
  }

  return Math.max(0, Math.round((Date.now() - new Date(request.due_date).getTime()) / DAY_MS));
}

function requestOverdueBucket(days: number | null) {
  if (days === null) {
    return "No due date";
  }

  if (days <= 3) {
    return "1-3 days";
  }

  if (days <= 7) {
    return "4-7 days";
  }

  if (days <= 14) {
    return "8-14 days";
  }

  return "15+ days";
}

function isActiveSubmission(row: any) {
  return row && ["submitted", "under_review", "needs_follow_up", "approved_to_present"].includes(row.status);
}

function isActiveOffer(record: DealLifecycleRecord) {
  return Boolean(record.has_offer) && !record.is_completed && !record.is_archived;
}

function isActiveContract(record: DealLifecycleRecord) {
  return Boolean(record.has_contract) && !record.is_completed && !record.is_archived;
}

function isActiveTransfer(record: DealLifecycleRecord) {
  return Boolean(record.has_transfer) && !record.is_completed && !record.is_archived;
}

function buildAgingRow(label: string, values: number[], note: string): ReportingAgingRow {
  return {
    label,
    count: values.length,
    averageDays: averageDays(values),
    medianDays: medianDays(values),
    note,
  };
}

function rateLabel(count: number, total: number) {
  return `${percentage(count, total)} of prior stage`;
}

function buildDocumentRows(documents: ReportingDocumentRow[]) {
  const statusBuckets = ["uploaded", "received", "under_review", "approved", "rejected"] as const;

  return statusBuckets.map((status) => ({
    label: status === "under_review" ? "Pending review" : portalDocumentStatusLabel(status),
    count: documents.filter((document) => document.status === status).length,
    detail: `${portalDocumentStatusLabel(status)} uploads`,
  }));
}

function portalDocumentStatusLabel(value: ReportingDocumentRow["status"]) {
  switch (value) {
    case "uploaded":
      return "Uploaded";
    case "received":
      return "Received";
    case "under_review":
      return "Under review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return value;
  }
}

function countBy<T>(items: T[], keyFn: (item: T) => string) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return map;
}

function buildExportTables(
  deals: DealLifecycleRecord[],
  requests: PortalRequestRow[],
  stalledDeals: ReturnType<typeof buildAdminRiskDesk>["stalledDeals"],
  closeoutReadyTransfers: ReturnType<typeof buildAdminRiskDesk>["closeoutReadyTransfers"],
  archivedDeals: DealLifecycleRecord[],
) {
  const stageOrder: DealLifecycleRecord["stage"][] = ["opportunity", "interest", "offer", "contract", "transfer", "closeout", "archived"];
  const stageRows = deals
    .map((record) => record.stage)
    .reduce((acc, stage) => {
      acc.set(stage, (acc.get(stage) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());

  return [
    {
      title: "Stage counts",
      columns: ["Stage", "Count", "Archive state", "Last activity"],
      rows: stageOrder.filter((stage) => stageRows.has(stage)).map((stage) => {
        const count = stageRows.get(stage) ?? 0;
        const record = deals.find((item) => item.stage === stage);
        return [
          dealLifecycleStageLabel(stage as DealLifecycleRecord["stage"]),
          String(count),
          record?.is_archived ? "Archived" : "Active",
          record?.last_meaningful_at ? new Date(record.last_meaningful_at).toLocaleString() : "Not set",
        ];
      }),
    },
    {
      title: "Overdue requests",
      columns: ["Title", "Role", "Type", "Status", "Due date", "Age", "Chain"],
      rows: requests
        .filter((request) => requestIsOverdue(request))
        .map((request) => [
          request.title,
          portalRequestTargetRoleText(request.target_role),
          portalRequestTypeText(request.request_type),
          portalRequestStatusText(request.status),
          request.due_date ? new Date(request.due_date).toLocaleDateString() : "Not set",
          `${requestOverdueDays(request) ?? 0} day${requestOverdueDays(request) === 1 ? "" : "s"}`,
          request.asset_packaging_id ?? request.buyer_application_id ?? request.seller_application_id ?? "Unlinked",
        ]),
    },
    {
      title: "Stalled deals",
      columns: ["Title", "Stage", "Status", "Age", "Next step"],
      rows: stalledDeals.map((record) => [
        record.title,
        record.stage_label,
        record.status_label,
        record.age_label,
        record.next_step_label,
      ]),
    },
    {
      title: "Closeout and archive",
      columns: ["Title", "Workflow", "Ready", "Completed", "Archived"],
      rows: closeoutReadyTransfers.map((record) => [
        record.title,
        record.status_label,
        record.kind === "transfer" ? "Yes" : "No",
        record.is_completed ? "Yes" : "No",
        record.is_archived ? "Yes" : "No",
      ]),
    },
    {
      title: "Completed deals",
      columns: ["Title", "Stage", "Status", "Completed", "Archived"],
      rows: archivedDeals.map((record) => [
        record.asset_name,
        dealLifecycleStageLabel(record.stage),
        record.current_status_label,
        record.completed_at ? new Date(record.completed_at).toLocaleString() : "Not set",
        record.archived_at ? new Date(record.archived_at).toLocaleString() : "Not set",
      ]),
    },
  ];
}

export async function getAdminReportingDashboard(): Promise<AdminReportingDashboard> {
  if (!hasSupabaseEnv()) {
    return emptyDashboard();
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return emptyDashboard();
  }

  const [requests, deals, submissions, documentsResult] = await Promise.all([
    getAdminPortalRequests({ role: "all", requestType: "all", status: "all", state: "all" }),
    getDealLifecycleRecords(),
    getAdminBuyerOfferSubmissions("all"),
    adminClient.from("application_documents").select("*").order("created_at", { ascending: false }),
  ]);

  if (documentsResult.error || !documentsResult.data) {
    return emptyDashboard();
  }

  const documents = documentsResult.data as ReportingDocumentRow[];
  const transferRecords = await getCloseoutDeskTransferRecords();
  const riskDesk = buildAdminRiskDesk(requests, deals, transferRecords);

  const activeBuyerSubmissions = submissions.filter(isActiveSubmission);
  const activeOpportunities = deals.filter((record) => record.portal_visible && !record.is_archived && record.stage === "opportunity");
  const activeInternalOffers = deals.filter((record) => isActiveOffer(record));
  const activeContracts = deals.filter((record) => isActiveContract(record));
  const activeTransfers = deals.filter((record) => isActiveTransfer(record));
  const closeoutReadyDeals = deals.filter((record) => record.transfer_workflow_status === "ready_to_close");
  const archivedDeals = deals.filter((record) => record.is_archived || record.is_completed);
  const openRequests = requests.filter((request) => requestIsOpen(request));
  const overdueRequests = requests.filter((request) => requestIsOverdue(request));
  const documentsPendingReview = documents.filter((document) => ["uploaded", "received", "under_review"].includes(document.status));

  const kpis: ReportingKpi[] = [
    { label: "Active opportunities", value: activeOpportunities.length, detail: "Portal-visible and still active.", href: "/admin/deals" },
    { label: "Active buyer submissions", value: activeBuyerSubmissions.length, detail: "Buyer submissions in an active state.", href: "/admin/buyer-offers" },
    { label: "Active internal offers", value: activeInternalOffers.length, detail: "Deal chains with an internal offer stage.", href: "/admin/offers" },
    { label: "Active contracts", value: activeContracts.length, detail: "Contract-stage deals still in motion.", href: "/admin/contracts" },
    { label: "Active transfers", value: activeTransfers.length, detail: "Transfer-stage deals still in motion.", href: "/admin/transfers" },
    { label: "Closeout-ready deals", value: closeoutReadyDeals.length, detail: "Transfers waiting on closeout completion.", href: "/admin/closeout" },
    { label: "Archived / completed deals", value: archivedDeals.length, detail: "Closed deals moved into archive state.", href: "/admin/closeout/archive" },
    { label: "Open requests", value: openRequests.length, detail: "Portal requests not yet completed or cancelled.", href: "/admin/requests" },
    { label: "Overdue requests", value: overdueRequests.length, detail: "Requests past their due date.", href: "/admin/requests?state=overdue" },
    { label: "Documents pending review", value: documentsPendingReview.length, detail: "Uploaded documents not yet approved or rejected.", href: "/admin/applications/documents" },
  ];

  const funnelRows: ReportingFunnelRow[] = [
    { label: "Portal-visible opportunities", count: activeOpportunities.length, rate: "100%", note: "Active and visible chains." },
    {
      label: "Buyer interests recorded",
      count: deals.filter((record) => record.interest_count > 0).length,
      rate: rateLabel(deals.filter((record) => record.interest_count > 0).length, activeOpportunities.length),
      note: "Unique chains with buyer interest.",
    },
    {
      label: "Buyer offer submissions",
      count: activeBuyerSubmissions.length,
      rate: rateLabel(activeBuyerSubmissions.length, deals.filter((record) => record.interest_count > 0).length || activeOpportunities.length),
      note: "Buyer-submitted offer intent records.",
    },
    {
      label: "Internal offers created",
      count: activeInternalOffers.length,
      rate: rateLabel(activeInternalOffers.length, activeBuyerSubmissions.length || activeOpportunities.length),
      note: "Promotion into the internal offer chain.",
    },
    {
      label: "Contracts created",
      count: activeContracts.length,
      rate: rateLabel(activeContracts.length, activeInternalOffers.length || activeBuyerSubmissions.length),
      note: "Contract-stage lifecycle records.",
    },
    {
      label: "Transfers created",
      count: activeTransfers.length,
      rate: rateLabel(activeTransfers.length, activeContracts.length || activeInternalOffers.length),
      note: "Transfer-stage lifecycle records.",
    },
    {
      label: "Archived / completed deals",
      count: archivedDeals.length,
      rate: rateLabel(archivedDeals.length, activeTransfers.length || activeContracts.length),
      note: "Closed chains that reached archive.",
    },
  ];

  const submissionToOfferDays = deals
    .filter((record) => record.submission_at && record.offer_at)
    .map((record) => daysBetween(record.submission_at, record.offer_at))
    .filter((value): value is number => typeof value === "number");

  const contractAgingDays = deals
    .filter((record) => isActiveContract(record))
    .map((record) => daysBetween(record.contract_at))
    .filter((value): value is number => typeof value === "number");

  const transferAgingDays = deals
    .filter((record) => isActiveTransfer(record))
    .map((record) => daysBetween(record.transfer_at))
    .filter((value): value is number => typeof value === "number");

  const closeoutAgingDays = deals
    .filter((record) => record.transfer_workflow_status === "ready_to_close" || record.transfer_workflow_status === "completed")
    .map((record) => daysBetween(record.ready_to_close_at ?? record.completed_at ?? record.transfer_at))
    .filter((value): value is number => typeof value === "number");

  const overdueAgingDays = overdueRequests
    .map((request) => requestOverdueDays(request))
    .filter((value): value is number => typeof value === "number");

  const agingRows: ReportingAgingRow[] = [
    buildAgingRow("Offer submission to internal offer", submissionToOfferDays, "Time between buyer submission and internal offer creation."),
    buildAgingRow("Active contracts", contractAgingDays, "Age of active contract-stage chains."),
    buildAgingRow("Active transfers", transferAgingDays, "Age of active transfer-stage chains."),
    buildAgingRow("Closeout-ready transfers", closeoutAgingDays, "Age of transfers that are ready to close."),
    buildAgingRow("Overdue requests", overdueAgingDays, "How far overdue open requests are."),
  ];

  const overdueBuckets = [...countBy(overdueRequests, (request) => requestOverdueBucket(requestOverdueDays(request))).entries()]
    .map(([label, count]) => ({ label, count, detail: `${label} overdue bucket` }))
    .sort((left, right) => left.label.localeCompare(right.label));

  const requestComplianceRows: ReportingComplianceRow[] = [
    {
      label: "Buyer open requests",
      count: requests.filter((request) => request.target_role === "buyer" && requestIsOpen(request)).length,
      detail: "Open portal requests targeting buyers.",
    },
    {
      label: "Seller open requests",
      count: requests.filter((request) => request.target_role === "seller" && requestIsOpen(request)).length,
      detail: "Open portal requests targeting sellers.",
    },
    {
      label: "Buyer overdue requests",
      count: requests.filter((request) => request.target_role === "buyer" && requestIsOverdue(request)).length,
      detail: "Buyer requests past due.",
    },
    {
      label: "Seller overdue requests",
      count: requests.filter((request) => request.target_role === "seller" && requestIsOverdue(request)).length,
      detail: "Seller requests past due.",
    },
    {
      label: "Buyer completed requests",
      count: requests.filter((request) => request.target_role === "buyer" && request.status === "completed").length,
      detail: "Buyer requests marked complete.",
    },
    {
      label: "Seller completed requests",
      count: requests.filter((request) => request.target_role === "seller" && request.status === "completed").length,
      detail: "Seller requests marked complete.",
    },
  ];

  const documentComplianceRows: ReportingComplianceRow[] = [
    {
      label: "Request-linked uploads",
      count: documents.filter((document) => Boolean(document.request_id)).length,
      detail: "Uploaded documents tied to a portal request.",
    },
    {
      label: "Open document requests",
      count: requests.filter((request) => request.request_type === "document_request" && requestIsOpen(request)).length,
      detail: "Open requests asking for a document upload.",
    },
    ...buildDocumentRows(documents),
  ];

  const completionRows: ReportingCompletionRow[] = [
    {
      label: "Ready to close",
      count: deals.filter((record) => record.transfer_workflow_status === "ready_to_close").length,
      detail: "Deals waiting on closeout completion.",
    },
    {
      label: "Completed transfers",
      count: deals.filter((record) => record.transfer_workflow_status === "completed").length,
      detail: "Transfer-stage deals marked complete.",
    },
    {
      label: "Archived transfers",
      count: deals.filter((record) => record.is_archived).length,
      detail: "Archived deal chains.",
    },
    {
      label: "Closeout desk queue",
      count: riskDesk.closeoutReadyTransfers.length,
      detail: "Transfers still visible in the closeout desk.",
    },
  ];

  const exportTables = buildExportTables(
    deals,
    requests,
    riskDesk.stalledDeals,
    riskDesk.closeoutReadyTransfers,
    archivedDeals,
  );

  return {
    kpis,
    funnelRows,
    agingRows,
    overdueBuckets,
    requestComplianceRows,
    documentComplianceRows,
    completionRows,
    exportTables,
    summary: {
      opportunities: activeOpportunities.length,
      submissions: activeBuyerSubmissions.length,
      offers: activeInternalOffers.length,
      contracts: activeContracts.length,
      transfers: activeTransfers.length,
      closeoutReady: closeoutReadyDeals.length,
      archived: archivedDeals.length,
      openRequests: openRequests.length,
      overdueRequests: overdueRequests.length,
      documentsPendingReview: documentsPendingReview.length,
    },
  };
}

function emptyDashboard(): AdminReportingDashboard {
  return {
    kpis: [],
    funnelRows: [],
    agingRows: [],
    overdueBuckets: [],
    requestComplianceRows: [],
    documentComplianceRows: [],
    completionRows: [],
    exportTables: [],
    summary: {
      opportunities: 0,
      submissions: 0,
      offers: 0,
      contracts: 0,
      transfers: 0,
      closeoutReady: 0,
      archived: 0,
      openRequests: 0,
      overdueRequests: 0,
      documentsPendingReview: 0,
    },
  };
}
