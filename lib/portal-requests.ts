import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireBuyerPortalAccess, requireSellerPortalAccess } from "@/lib/portal-access";
import { dealLifecycleStageLabel, getDealLifecycleRecords, type DealLifecycleRecord } from "@/lib/deals";
import type {
  ApplicationDocumentRow,
  PortalRequestRow,
  PortalRequestStatus,
  PortalRequestTargetRole,
  PortalRequestType,
  BuyerApplicationRow,
  SellerApplicationRow,
} from "@/lib/supabase/database.types";

export const portalRequestTypeLabels: Record<PortalRequestType, string> = {
  document_request: "Document Request",
  info_request: "Info Request",
  acknowledgment: "Acknowledgment",
  next_step: "Next Step",
};

export const portalRequestTargetRoleLabels: Record<PortalRequestTargetRole, string> = {
  buyer: "Buyer",
  seller: "Seller",
};

export const portalRequestStatusLabels: Record<PortalRequestStatus, string> = {
  open: "Open",
  acknowledged: "Acknowledged",
  in_progress: "In Progress",
  completed: "Completed",
  blocked: "Blocked",
  cancelled: "Cancelled",
};

export const portalRequestStatusOrder: PortalRequestStatus[] = [
  "open",
  "acknowledged",
  "in_progress",
  "completed",
  "blocked",
  "cancelled",
];

export const portalRequestTypeOrder: PortalRequestType[] = [
  "document_request",
  "info_request",
  "acknowledgment",
  "next_step",
];

type PortalRequestRecord = PortalRequestRow;

type PortalRequestApplicationRecord = BuyerApplicationRow | SellerApplicationRow;

export type PortalRequestSummaryRecord = PortalRequestRecord & {
  target_role_label: string;
  request_type_label: string;
  application_label: string;
  application_summary: string;
  application_href: string | null;
  chain_label: string;
  chain_summary: string;
  packaging_href: string | null;
  offer_href: string | null;
  contract_href: string | null;
  transfer_href: string | null;
  closeout_href: string | null;
  safe_status_label: string;
  safe_next_step: string;
  safe_summary: string;
  is_overdue: boolean;
  linked_document_count: number;
};

type RequestContext = {
  user: { id: string };
  record: PortalRequestApplicationRecord;
};

type RequestFilters = Readonly<{
  role?: PortalRequestTargetRole | "all";
  requestType?: PortalRequestType | "all";
  status?: PortalRequestStatus | "all";
  state?: "all" | "open" | "overdue" | "completed";
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

function truncate(value: string, limit = 160) {
  const trimmed = value.trim();
  if (trimmed.length <= limit) {
    return trimmed;
  }

  return `${trimmed.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "Not set";
}

function formatDateTime(value: string | null) {
  return value ? new Date(value).toLocaleString() : "Not set";
}

function requestRoleRoute(role: PortalRequestTargetRole) {
  return role === "buyer" ? "/portal/buyer/requests" : "/portal/seller/requests";
}

function requestDetailRoute(role: PortalRequestTargetRole, id: string) {
  return `${requestRoleRoute(role)}/${id}`;
}

function adminRequestRoute(id: string) {
  return `/admin/requests/${id}`;
}

function adminRequestsRoute() {
  return "/admin/requests";
}

function requestTypeLabel(value: PortalRequestType) {
  return portalRequestTypeLabels[value];
}

function targetRoleLabel(value: PortalRequestTargetRole) {
  return portalRequestTargetRoleLabels[value];
}

function requestStatusLabel(value: PortalRequestStatus) {
  return portalRequestStatusLabels[value];
}

function requestIsOverdue(request: PortalRequestRecord) {
  if (!request.due_date) {
    return false;
  }

  if (request.status === "completed" || request.status === "cancelled") {
    return false;
  }

  return new Date(request.due_date).getTime() < Date.now();
}

function requestSafeStatusLabel(request: PortalRequestRecord) {
  if (requestIsOverdue(request)) {
    return "Overdue";
  }

  return requestStatusLabel(request.status);
}

function requestSafeNextStepLabel(request: PortalRequestRecord) {
  if (request.status === "completed") {
    return "Request complete";
  }

  if (request.status === "cancelled") {
    return "Request closed";
  }

  if (requestIsOverdue(request)) {
    return "Resolve the overdue request";
  }

  switch (request.status) {
    case "open":
      return "Acknowledge the request";
    case "acknowledged":
      return "Continue working on the request";
    case "in_progress":
      return "Finish and mark complete";
    case "blocked":
      return "Resolve the blocker";
    default:
      return "Review the request";
  }
}

function requestSafeSummary(request: PortalRequestRecord) {
  if (request.status === "completed") {
    return "This request has been marked complete.";
  }

  if (request.status === "cancelled") {
    return "This request is closed.";
  }

  if (requestIsOverdue(request)) {
    return "This request is past its due date.";
  }

  return truncate(request.portal_instructions, 150);
}

async function getSignedInUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

async function getPortalContext(role: PortalRequestTargetRole): Promise<RequestContext> {
  const user = await getSignedInUser();
  if (!user) {
    redirect("/portal?error=Please%20sign%20in%20again.");
  }

  if (role === "buyer") {
    return {
      user,
      record: await requireBuyerPortalAccess(),
    };
  }

  return {
    user,
    record: await requireSellerPortalAccess(),
  };
}

function requestChainLabels(request: PortalRequestRecord, dealRecord?: DealLifecycleRecord | null) {
  if (dealRecord) {
    return {
      chain_label: `${dealRecord.asset_name} · ${dealLifecycleStageLabel(dealRecord.stage)}`,
      chain_summary: dealRecord.current_summary,
      packaging_href: `/admin/deals/${dealRecord.id}`,
      offer_href: dealRecord.offer_id ? `/admin/offers/${dealRecord.offer_id}` : null,
      contract_href: dealRecord.contract_id ? `/admin/contracts/${dealRecord.contract_id}` : null,
      transfer_href: dealRecord.transfer_id ? `/admin/transfers/${dealRecord.transfer_id}` : null,
      closeout_href: dealRecord.transfer_id ? `/admin/closeout/${dealRecord.transfer_id}` : null,
    };
  }

  if (request.offer_id) {
    return {
      chain_label: `Internal offer ${request.offer_id.slice(0, 8).toUpperCase()}`,
      chain_summary: "Linked to the internal offer pipeline.",
      packaging_href: null,
      offer_href: `/admin/offers/${request.offer_id}`,
      contract_href: request.contract_id ? `/admin/contracts/${request.contract_id}` : null,
      transfer_href: request.transfer_id ? `/admin/transfers/${request.transfer_id}` : null,
      closeout_href: request.transfer_id ? `/admin/closeout/${request.transfer_id}` : null,
    };
  }

  if (request.contract_id) {
    return {
      chain_label: `Contract ${request.contract_id.slice(0, 8).toUpperCase()}`,
      chain_summary: "Linked to the contract workflow.",
      packaging_href: null,
      offer_href: null,
      contract_href: `/admin/contracts/${request.contract_id}`,
      transfer_href: request.transfer_id ? `/admin/transfers/${request.transfer_id}` : null,
      closeout_href: request.transfer_id ? `/admin/closeout/${request.transfer_id}` : null,
    };
  }

  if (request.transfer_id) {
    return {
      chain_label: `Transfer ${request.transfer_id.slice(0, 8).toUpperCase()}`,
      chain_summary: "Linked to the transfer workflow.",
      packaging_href: null,
      offer_href: null,
      contract_href: null,
      transfer_href: `/admin/transfers/${request.transfer_id}`,
      closeout_href: `/admin/closeout/${request.transfer_id}`,
    };
  }

  return {
    chain_label: "No linked deal chain",
    chain_summary: "This request is tied to the application only.",
    packaging_href: null,
    offer_href: null,
    contract_href: null,
    transfer_href: null,
    closeout_href: null,
  };
}

async function loadDealRecordMap() {
  const records = await getDealLifecycleRecords();
  return new Map(records.map((record) => [record.id, record]));
}

async function loadRequestDocuments(requestIds: string[]) {
  const adminClient = createAdminClient();

  if (!adminClient || requestIds.length === 0) {
    return new Map<string, number>();
  }

  const { data, error } = await adminClient
    .from("application_documents")
    .select("id, request_id")
    .in("request_id", requestIds);

  if (error || !data) {
    return new Map<string, number>();
  }

  const counts = new Map<string, number>();

  for (const row of data as Array<Pick<ApplicationDocumentRow, "id" | "request_id">>) {
    if (!row.request_id) {
      continue;
    }

    counts.set(row.request_id, (counts.get(row.request_id) ?? 0) + 1);
  }

  return counts;
}

async function loadRequestApplications(requests: PortalRequestRecord[]) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    return {
      buyerMap: new Map<string, BuyerApplicationRow>(),
      sellerMap: new Map<string, SellerApplicationRow>(),
    };
  }

  const buyerIds = [...new Set(requests.map((request) => request.buyer_application_id).filter((value): value is string => Boolean(value)))];
  const sellerIds = [...new Set(requests.map((request) => request.seller_application_id).filter((value): value is string => Boolean(value)))];

  const [buyerResult, sellerResult] = await Promise.all([
    buyerIds.length
      ? adminClient.from("buyer_applications").select("id, applicant_name, email, status").in("id", buyerIds)
      : Promise.resolve({ data: [], error: null }),
    sellerIds.length
      ? adminClient.from("seller_applications").select("id, applicant_name, business_name, email, status").in("id", sellerIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const buyerMap = new Map(
    ((buyerResult.data ?? []) as BuyerApplicationRow[]).map((record) => [record.id, record]),
  );
  const sellerMap = new Map(
    ((sellerResult.data ?? []) as SellerApplicationRow[]).map((record) => [record.id, record]),
  );

  return { buyerMap, sellerMap };
}

function filterRequests(requests: PortalRequestRecord[], filters: RequestFilters) {
  return requests.filter((request) => {
    if (filters.role && filters.role !== "all" && request.target_role !== filters.role) {
      return false;
    }

    if (filters.requestType && filters.requestType !== "all" && request.request_type !== filters.requestType) {
      return false;
    }

    if (filters.status && filters.status !== "all" && request.status !== filters.status) {
      return false;
    }

    if (filters.state === "open" && (request.status === "completed" || request.status === "cancelled" || requestIsOverdue(request))) {
      return false;
    }

    if (filters.state === "overdue" && !requestIsOverdue(request)) {
      return false;
    }

    if (filters.state === "completed" && request.status !== "completed") {
      return false;
    }

    return true;
  });
}

function mapRequestSummary(
  request: PortalRequestRecord,
  application:
    | BuyerApplicationRow
    | SellerApplicationRow
    | null
    | undefined,
  dealRecord?: DealLifecycleRecord | null,
  documentCount = 0,
): PortalRequestSummaryRecord {
  const chain = requestChainLabels(request, dealRecord);
  const applicationLabel =
    request.target_role === "buyer"
      ? ((application as BuyerApplicationRow | null | undefined)?.applicant_name ?? "Buyer application")
      : (((application as SellerApplicationRow | null | undefined)?.business_name ??
          (application as SellerApplicationRow | null | undefined)?.applicant_name ??
          "Seller application") as string);

  const applicationSummary =
    request.target_role === "buyer"
      ? ((application as BuyerApplicationRow | null | undefined)?.email ?? "No email available")
      : ((application as SellerApplicationRow | null | undefined)?.email ?? "No email available");

  const applicationHref =
    request.target_role === "buyer"
      ? request.buyer_application_id
        ? `/admin/applications/buyers/${request.buyer_application_id}`
        : null
      : request.seller_application_id
        ? `/admin/applications/sellers/${request.seller_application_id}`
        : null;

  return {
    ...request,
    target_role_label: targetRoleLabel(request.target_role),
    request_type_label: requestTypeLabel(request.request_type),
    application_label: applicationLabel,
    application_summary: applicationSummary,
    application_href: applicationHref,
    chain_label: chain.chain_label,
    chain_summary: chain.chain_summary,
    packaging_href: chain.packaging_href,
    offer_href: chain.offer_href,
    contract_href: chain.contract_href,
    transfer_href: chain.transfer_href,
    closeout_href: chain.closeout_href,
    safe_status_label: requestSafeStatusLabel(request),
    safe_next_step: requestSafeNextStepLabel(request),
    safe_summary: requestSafeSummary(request),
    is_overdue: requestIsOverdue(request),
    linked_document_count: documentCount,
  };
}

async function loadAdminRequestSummaries(filters: RequestFilters) {
  if (!hasSupabaseEnv()) {
    return [] as PortalRequestSummaryRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as PortalRequestSummaryRecord[];
  }

  const [requestResult, dealRecords] = await Promise.all([
    adminClient.from("portal_requests").select("*").order("created_at", { ascending: false }),
    getDealLifecycleRecords(),
  ]);

  if (requestResult.error || !requestResult.data) {
    return [] as PortalRequestSummaryRecord[];
  }

  const requests = filterRequests(requestResult.data as PortalRequestRecord[], filters);
  const { buyerMap, sellerMap } = await loadRequestApplications(requests);
  const dealMap = new Map(dealRecords.map((record) => [record.id, record]));
  const documentCounts = await loadRequestDocuments(requests.map((request) => request.id));

  return requests.map((request) => {
    const application = request.target_role === "buyer"
      ? buyerMap.get(request.buyer_application_id ?? "")
      : sellerMap.get(request.seller_application_id ?? "");
    const dealRecord = request.asset_packaging_id ? dealMap.get(request.asset_packaging_id) ?? null : null;

    return mapRequestSummary(request, application, dealRecord, documentCounts.get(request.id) ?? 0);
  });
}

async function loadPortalRequestSummaries(role: PortalRequestTargetRole, applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as PortalRequestSummaryRecord[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as PortalRequestSummaryRecord[];
  }

  const requestField = role === "buyer" ? "buyer_application_id" : "seller_application_id";
  const [requestResult, dealRecords] = await Promise.all([
    adminClient.from("portal_requests").select("*").eq("target_role", role).eq(requestField, applicationId).order("created_at", { ascending: false }),
    getDealLifecycleRecords(),
  ]);

  if (requestResult.error || !requestResult.data) {
    return [] as PortalRequestSummaryRecord[];
  }

  const requests = requestResult.data as PortalRequestRecord[];
  const { buyerMap, sellerMap } = await loadRequestApplications(requests);
  const dealMap = new Map(dealRecords.map((record) => [record.id, record]));
  const documentCounts = await loadRequestDocuments(requests.map((request) => request.id));

  return requests.map((request) => {
    const application = request.target_role === "buyer"
      ? buyerMap.get(request.buyer_application_id ?? "")
      : sellerMap.get(request.seller_application_id ?? "");
    const dealRecord = request.asset_packaging_id ? dealMap.get(request.asset_packaging_id) ?? null : null;

    return mapRequestSummary(request, application, dealRecord, documentCounts.get(request.id) ?? 0);
  });
}

async function loadPortalRequestForAccess(role: PortalRequestTargetRole, requestId: string, applicationId?: string) {
  if (!hasSupabaseEnv() || !requestId) {
    return null;
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return null;
  }

  let query = adminClient.from("portal_requests").select("*").eq("id", requestId).eq("target_role", role);

  if (applicationId) {
    query = query.eq(role === "buyer" ? "buyer_application_id" : "seller_application_id", applicationId);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as PortalRequestRecord;
}

function readFormString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readReturnTo(formData: FormData, fallback: string) {
  const value = readFormString(formData, "return_to");
  return value.startsWith("/") ? value : fallback;
}

function readOptionalDate(formData: FormData, name: string) {
  const value = readFormString(formData, name);
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function readPortalRequestType(formData: FormData) {
  const value = readFormString(formData, "request_type") as PortalRequestType;
  return portalRequestTypeOrder.includes(value) ? value : null;
}

function readPortalRequestStatus(formData: FormData) {
  const value = readFormString(formData, "status") as PortalRequestStatus;
  return portalRequestStatusOrder.includes(value) ? value : null;
}

function readPortalRequestRole(formData: FormData) {
  const value = readFormString(formData, "target_role") as PortalRequestTargetRole;
  return value === "buyer" || value === "seller" ? value : null;
}

function readPortalRequestPayload(formData: FormData, mode: "create" | "update") {
  const targetRole = readPortalRequestRole(formData);
  const requestType = readPortalRequestType(formData);
  const title = readFormString(formData, "title");
  const portalInstructions = readFormString(formData, "portal_instructions");
  const adminNotes = readFormString(formData, "admin_notes");
  const status = readPortalRequestStatus(formData) ?? "open";
  const linkedApplicationId = readFormString(formData, "linked_application_id");
  const assetPackagingId = readFormString(formData, "asset_packaging_id");
  const offerId = readFormString(formData, "offer_id");
  const contractId = readFormString(formData, "contract_id");
  const transferId = readFormString(formData, "transfer_id");
  const dueDate = readOptionalDate(formData, "due_date");

  if (!targetRole || !requestType || !title || !portalInstructions) {
    return { error: "Please complete all required fields." } as const;
  }

  if (mode === "create" && !linkedApplicationId) {
    return { error: "Please choose a linked application id." } as const;
  }

  if (mode === "update" && !readFormString(formData, "id")) {
    return { error: "Missing request id." } as const;
  }

  return {
    data: {
      targetRole,
      requestType,
      title,
      portalInstructions,
      adminNotes: adminNotes || null,
      status,
      linkedApplicationId: linkedApplicationId || null,
      assetPackagingId: assetPackagingId || null,
      offerId: offerId || null,
      contractId: contractId || null,
      transferId: transferId || null,
      dueDate,
    },
  } as const;
}

function revalidateRequestScopes(role: PortalRequestTargetRole, applicationId: string, requestId?: string | null) {
  revalidatePath(adminRequestsRoute());
  revalidatePath("/admin/deals");
  revalidatePath("/admin/risk");
  revalidatePath("/portal/buyer/notifications");
  revalidatePath("/portal/seller/notifications");
  revalidatePath("/portal/buyer");
  revalidatePath("/portal/seller");

  if (requestId) {
    revalidatePath(adminRequestRoute(requestId));
  }

  revalidatePath(requestRoleRoute(role));
  revalidatePath(requestDetailRoute(role, requestId ?? ""));
}

function requestTimestampPatch(status: PortalRequestStatus, existing?: PortalRequestRecord | null) {
  const now = new Date().toISOString();

  return {
    acknowledged_at:
      status === "acknowledged" || status === "in_progress"
        ? existing?.acknowledged_at ?? now
        : existing?.acknowledged_at ?? null,
    acknowledged_by: status === "acknowledged" || status === "in_progress" ? existing?.acknowledged_by ?? null : existing?.acknowledged_by ?? null,
    completed_at: status === "completed" ? existing?.completed_at ?? now : existing?.completed_at ?? null,
    completed_by: status === "completed" ? existing?.completed_by ?? null : existing?.completed_by ?? null,
    blocked_at: status === "blocked" ? existing?.blocked_at ?? now : existing?.blocked_at ?? null,
    blocked_by: status === "blocked" ? existing?.blocked_by ?? null : existing?.blocked_by ?? null,
    cancelled_at: status === "cancelled" ? existing?.cancelled_at ?? now : existing?.cancelled_at ?? null,
    cancelled_by: status === "cancelled" ? existing?.cancelled_by ?? null : existing?.cancelled_by ?? null,
  };
}

async function savePortalRequestMutation(
  mode: "create" | "update",
  formData: FormData,
  routeBase: string,
  fallbackReturnTo: string,
) {
  const parsed = readPortalRequestPayload(formData, mode);

  if ("error" in parsed) {
    redirect(`${routeBase}?error=${encodeURIComponent(parsed.error ?? "Please complete all required fields.")}`);
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    redirect(`${routeBase}?error=Request%20credentials%20are%20not%20configured.`);
  }

  const returnTo = readReturnTo(formData, fallbackReturnTo);

  const { data: userData } = await createClient().auth.getUser();
  const adminUserId = userData.user?.id ?? null;

  const now = new Date().toISOString();
  const requestId = mode === "create" ? randomUUID() : readFormString(formData, "id");

  if (mode === "update" && !requestId) {
    redirect(`${routeBase}?error=Missing%20request%20id.`);
  }

  const targetApplicationId = parsed.data.linkedApplicationId;
  const payload =
    parsed.data.targetRole === "buyer"
      ? {
          id: requestId,
          target_role: "buyer" as const,
          request_type: parsed.data.requestType,
          title: parsed.data.title,
          portal_instructions: parsed.data.portalInstructions,
          admin_notes: parsed.data.adminNotes,
          status: parsed.data.status,
          due_date: parsed.data.dueDate,
          buyer_application_id: targetApplicationId,
          seller_application_id: null,
          asset_packaging_id: parsed.data.assetPackagingId || null,
          offer_id: parsed.data.offerId || null,
          contract_id: parsed.data.contractId || null,
          transfer_id: parsed.data.transferId || null,
          acknowledged_at: null,
          acknowledged_by: null,
          completed_at: null,
          completed_by: null,
          blocked_at: null,
          blocked_by: null,
          cancelled_at: null,
          cancelled_by: null,
          created_at: now,
          updated_at: now,
        }
      : {
          id: requestId,
          target_role: "seller" as const,
          request_type: parsed.data.requestType,
          title: parsed.data.title,
          portal_instructions: parsed.data.portalInstructions,
          admin_notes: parsed.data.adminNotes,
          status: parsed.data.status,
          due_date: parsed.data.dueDate,
          buyer_application_id: null,
          seller_application_id: targetApplicationId,
          asset_packaging_id: parsed.data.assetPackagingId || null,
          offer_id: parsed.data.offerId || null,
          contract_id: parsed.data.contractId || null,
          transfer_id: parsed.data.transferId || null,
          acknowledged_at: null,
          acknowledged_by: null,
          completed_at: null,
          completed_by: null,
          blocked_at: null,
          blocked_by: null,
          cancelled_at: null,
          cancelled_by: null,
          created_at: now,
          updated_at: now,
        };

  const existing = mode === "update" && requestId ? await loadPortalRequestForAccess(parsed.data.targetRole, requestId) : null;
  if (mode === "update" && requestId && !existing) {
    redirect(`${routeBase}?error=Request%20not%20found.`);
  }

  const statusPatch = requestTimestampPatch(parsed.data.status, existing);
  const buyerApplicationId = parsed.data.targetRole === "buyer" ? parsed.data.linkedApplicationId ?? existing?.buyer_application_id ?? null : null;
  const sellerApplicationId = parsed.data.targetRole === "seller" ? parsed.data.linkedApplicationId ?? existing?.seller_application_id ?? null : null;
  const resolvedApplicationId = buyerApplicationId ?? sellerApplicationId;

  if (!resolvedApplicationId) {
    redirect(`${routeBase}?error=Please%20choose%20a%20linked%20application%20id.`);
  }

  const writePayload =
    mode === "create"
      ? payload
      : {
          ...payload,
          created_at: existing?.created_at ?? now,
          buyer_application_id: buyerApplicationId,
          seller_application_id: sellerApplicationId,
          updated_at: now,
          acknowledged_at: statusPatch.acknowledged_at,
          acknowledged_by:
            statusPatch.acknowledged_at && existing?.acknowledged_at !== statusPatch.acknowledged_at
              ? adminUserId
              : existing?.acknowledged_by ?? null,
          completed_at: statusPatch.completed_at,
          completed_by:
            statusPatch.completed_at && existing?.completed_at !== statusPatch.completed_at
              ? adminUserId
              : existing?.completed_by ?? null,
          blocked_at: statusPatch.blocked_at,
          blocked_by:
            statusPatch.blocked_at && existing?.blocked_at !== statusPatch.blocked_at
              ? adminUserId
              : existing?.blocked_by ?? null,
          cancelled_at: statusPatch.cancelled_at,
          cancelled_by:
            statusPatch.cancelled_at && existing?.cancelled_at !== statusPatch.cancelled_at
              ? adminUserId
              : existing?.cancelled_by ?? null,
        };

  const { error } =
    mode === "create"
      ? await adminClient.from("portal_requests").insert(writePayload as never)
      : await adminClient.from("portal_requests").update(writePayload as never).eq("id", requestId!);

  if (error) {
    redirect(`${routeBase}?error=Unable%20to%20save%20the%20request.`);
  }

  revalidateRequestScopes(parsed.data.targetRole, resolvedApplicationId, requestId);
  redirect(returnTo);
}

async function updatePortalRequestStatus(role: PortalRequestTargetRole, formData: FormData, nextStatus: PortalRequestStatus) {
  const requestId = readFormString(formData, "id");

  if (!requestId) {
    redirect(`${requestRoleRoute(role)}?error=Missing%20request%20id.`);
  }

  const context = await getPortalContext(role);
  const request = await loadPortalRequestForAccess(role, requestId, context.record.id);

  if (!request) {
    redirect(`${requestRoleRoute(role)}?error=Request%20not%20found.`);
  }

  if (request.status === "completed" || request.status === "cancelled") {
    redirect(`${requestDetailRoute(role, requestId)}?error=This%20request%20is%20already%20closed.`);
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    redirect(`${requestRoleRoute(role)}?error=Request%20credentials%20are%20not%20configured.`);
  }

  const { data: userData } = await createClient().auth.getUser();
  const userId = userData.user?.id ?? null;
  const now = new Date().toISOString();

  const statusPatch = requestTimestampPatch(nextStatus, request);
  const { error } = await adminClient
    .from("portal_requests")
    .update({
      status: nextStatus,
      updated_at: now,
      acknowledged_at: statusPatch.acknowledged_at,
      acknowledged_by: nextStatus === "acknowledged" || nextStatus === "in_progress" ? request.acknowledged_by ?? userId : request.acknowledged_by,
      completed_at: statusPatch.completed_at,
      completed_by: nextStatus === "completed" ? request.completed_by ?? userId : request.completed_by,
      blocked_at: statusPatch.blocked_at,
      blocked_by: nextStatus === "blocked" ? request.blocked_by ?? userId : request.blocked_by,
      cancelled_at: statusPatch.cancelled_at,
      cancelled_by: nextStatus === "cancelled" ? request.cancelled_by ?? userId : request.cancelled_by,
    } as never)
    .eq("id", requestId)
    .eq("target_role", role)
    .eq(role === "buyer" ? "buyer_application_id" : "seller_application_id", context.record.id);

  if (error) {
    redirect(`${requestDetailRoute(role, requestId)}?error=Unable%20to%20update%20the%20request.`);
  }

  revalidateRequestScopes(role, context.record.id, requestId);
  redirect(`${requestDetailRoute(role, requestId)}?saved=1`);
}

export async function getAdminPortalRequests(filters: RequestFilters = {}) {
  return loadAdminRequestSummaries(filters);
}

export async function getAdminPortalRequestById(id: string) {
  const requests = await getAdminPortalRequests({ role: "all", requestType: "all", status: "all", state: "all" });
  return requests.find((request) => request.id === id) ?? null;
}

export async function getBuyerPortalRequests(applicationId: string) {
  return loadPortalRequestSummaries("buyer", applicationId);
}

export async function getSellerPortalRequests(applicationId: string) {
  return loadPortalRequestSummaries("seller", applicationId);
}

export async function getBuyerPortalRequestById(applicationId: string, requestId: string) {
  const requests = await getBuyerPortalRequests(applicationId);
  return requests.find((request) => request.id === requestId) ?? null;
}

export async function getSellerPortalRequestById(applicationId: string, requestId: string) {
  const requests = await getSellerPortalRequests(applicationId);
  return requests.find((request) => request.id === requestId) ?? null;
}

export async function getBuyerPortalRequestDocuments(requestId: string) {
  const { user, record } = await getPortalContext("buyer");
  const adminClient = createAdminClient();

  if (!adminClient) {
    return [] as ApplicationDocumentRow[];
  }

  const { data, error } = await adminClient
    .from("application_documents")
    .select("*")
    .eq("request_id", requestId)
    .eq("application_type", "buyer")
    .eq("application_id", record.id)
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as ApplicationDocumentRow[];
  }

  return data as ApplicationDocumentRow[];
}

export async function getSellerPortalRequestDocuments(requestId: string) {
  const { user, record } = await getPortalContext("seller");
  const adminClient = createAdminClient();

  if (!adminClient) {
    return [] as ApplicationDocumentRow[];
  }

  const { data, error } = await adminClient
    .from("application_documents")
    .select("*")
    .eq("request_id", requestId)
    .eq("application_type", "seller")
    .eq("application_id", record.id)
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as ApplicationDocumentRow[];
  }

  return data as ApplicationDocumentRow[];
}

export async function getAdminRequestDocuments(requestId: string) {
  const adminClient = createAdminClient();

  if (!adminClient || !requestId) {
    return [] as ApplicationDocumentRow[];
  }

  const { data, error } = await adminClient
    .from("application_documents")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as ApplicationDocumentRow[];
  }

  return data as ApplicationDocumentRow[];
}

export function portalRequestSummaryCount(records: PortalRequestSummaryRecord[]) {
  return {
    open: records.filter((request) => request.status === "open" || request.status === "acknowledged" || request.status === "in_progress").length,
    overdue: records.filter((request) => request.is_overdue).length,
    completed: records.filter((request) => request.status === "completed").length,
  };
}

export function portalRequestDetailRoute(role: PortalRequestTargetRole, requestId: string) {
  return requestDetailRoute(role, requestId);
}

export function portalRequestCenterRoute(role: PortalRequestTargetRole) {
  return requestRoleRoute(role);
}

export function portalRequestStatusPillLabel(request: PortalRequestRecord) {
  return requestSafeStatusLabel(request);
}

export function portalRequestNextStepLabel(request: PortalRequestRecord) {
  return requestSafeNextStepLabel(request);
}

export function portalRequestSummaryLabel(request: PortalRequestRecord) {
  return requestSafeSummary(request);
}

export function portalRequestTypeText(value: PortalRequestType) {
  return requestTypeLabel(value);
}

export function portalRequestTargetRoleText(value: PortalRequestTargetRole) {
  return targetRoleLabel(value);
}

export function portalRequestStatusText(value: PortalRequestStatus) {
  return requestStatusLabel(value);
}

export function formatPortalRequestDate(value: string | null) {
  return formatDate(value);
}

export function formatPortalRequestDateTime(value: string | null) {
  return formatDateTime(value);
}

export async function createAdminPortalRequestAction(formData: FormData) {
  "use server";

  await savePortalRequestMutation("create", formData, "/admin/requests", "/admin/requests?saved=1");
}

export async function saveAdminPortalRequestAction(formData: FormData) {
  "use server";

  await savePortalRequestMutation("update", formData, "/admin/requests", "/admin/requests?saved=1");
}

export async function acknowledgeBuyerPortalRequestAction(formData: FormData) {
  "use server";

  await updatePortalRequestStatus("buyer", formData, "acknowledged");
}

export async function completeBuyerPortalRequestAction(formData: FormData) {
  "use server";

  await updatePortalRequestStatus("buyer", formData, "completed");
}

export async function acknowledgeSellerPortalRequestAction(formData: FormData) {
  "use server";

  await updatePortalRequestStatus("seller", formData, "acknowledged");
}

export async function completeSellerPortalRequestAction(formData: FormData) {
  "use server";

  await updatePortalRequestStatus("seller", formData, "completed");
}

export async function getBuyerPortalRequestForAccess(requestId: string) {
  const { record } = await getPortalContext("buyer");
  return loadPortalRequestForAccess("buyer", requestId, record.id);
}

export async function getSellerPortalRequestForAccess(requestId: string) {
  const { record } = await getPortalContext("seller");
  return loadPortalRequestForAccess("seller", requestId, record.id);
}

export async function getAdminPortalRequestForAccess(requestId: string) {
  const buyerRequest = await loadPortalRequestForAccess("buyer", requestId);
  if (buyerRequest) {
    return buyerRequest;
  }

  return loadPortalRequestForAccess("seller", requestId);
}
