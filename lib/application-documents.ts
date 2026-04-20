import { Buffer } from "node:buffer";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireBuyerPortalAccess, requireSellerPortalAccess } from "@/lib/portal-access";
import {
  getBuyerPortalRequestForAccess,
  getSellerPortalRequestForAccess,
  portalRequestCenterRoute,
  portalRequestDetailRoute,
} from "@/lib/portal-requests";
import type {
  ApplicationDocumentApplicationType,
  ApplicationDocumentRow,
  ApplicationDocumentStatus,
  BuyerApplicationRow,
  SellerApplicationRow,
} from "@/lib/supabase/database.types";

export type ApplicationDocumentRole = ApplicationDocumentApplicationType;

const DOCUMENT_BUCKET = "application-documents";
const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
]);

const allowedExtensions = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".txt",
]);

export const applicationDocumentStatusLabels: Record<ApplicationDocumentStatus, string> = {
  uploaded: "Uploaded",
  received: "Received",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

export const applicationDocumentStatusOrder: ApplicationDocumentStatus[] = [
  "uploaded",
  "received",
  "under_review",
  "approved",
  "rejected",
];

export const buyerDocumentTypeOptions = [
  { value: "proof_of_funds", label: "Proof of funds" },
  { value: "id", label: "ID" },
  { value: "acquisition_criteria", label: "Acquisition criteria" },
  { value: "other", label: "Other" },
] as const;

export const sellerDocumentTypeOptions = [
  { value: "financials", label: "Financials" },
  { value: "tax_returns", label: "Tax returns" },
  { value: "bank_statements", label: "Bank statements" },
  { value: "business_summary", label: "Business summary" },
  { value: "other", label: "Other" },
] as const;

export const applicationDocumentTypeFilterOptions = [
  ...buyerDocumentTypeOptions,
  ...sellerDocumentTypeOptions,
].filter((option, index, options) => options.findIndex((candidate) => candidate.value === option.value) === index);

export type BuyerDocumentType = (typeof buyerDocumentTypeOptions)[number]["value"];
export type SellerDocumentType = (typeof sellerDocumentTypeOptions)[number]["value"];

type DocumentRecord = ApplicationDocumentRow;
type BuyerApplicationRecord = BuyerApplicationRow;
type SellerApplicationRecord = SellerApplicationRow;

export type ApplicationDocumentQueueItem = DocumentRecord & {
  application_label: string;
  application_summary: string;
  application_review_href: string;
  application_type_label: string;
};

function roleRoute(role: ApplicationDocumentRole) {
  return role === "buyer" ? "/portal/buyer/documents" : "/portal/seller/documents";
}

function adminRoute(role: ApplicationDocumentRole, applicationId: string) {
  return role === "buyer"
    ? `/admin/applications/buyers/${applicationId}`
    : `/admin/applications/sellers/${applicationId}`;
}

function adminDocumentsRoute() {
  return "/admin/applications/documents";
}

function adminDocumentRoute(role: ApplicationDocumentRole, documentId: string) {
  return `${adminDocumentsRoute()}/${documentId}`;
}

function buildRelativePath(path: string, searchParams: Record<string, string | undefined>) {
  const url = new URL(path, "http://allura.local");

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return `${url.pathname}${url.search}`;
}

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/_+/g, "_").slice(0, 96) || "document";
}

function getExtension(fileName: string) {
  const index = fileName.lastIndexOf(".");
  return index >= 0 ? fileName.slice(index).toLowerCase() : "";
}

function ensureValidDocumentFile(file: File) {
  if (!(file instanceof File)) {
    return "Please choose a file to upload.";
  }

  if (file.size <= 0) {
    return "The selected file is empty.";
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return "Files must be 10 MB or smaller.";
  }

  const extension = getExtension(file.name);

  if (!allowedMimeTypes.has(file.type) && !allowedExtensions.has(extension)) {
    return "Only standard document or image files are allowed.";
  }

  return null;
}

async function getSignedInUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

async function getPortalDocumentContext(role: ApplicationDocumentRole) {
  const user = await getSignedInUser();

  if (!user) {
    redirect("/portal?error=Please%20sign%20in%20again.");
  }

  if (role === "buyer") {
    const record = await requireBuyerPortalAccess();
    return { user, record };
  }

  const record = await requireSellerPortalAccess();
  return { user, record };
}

function documentTypeOptionsForRole(role: ApplicationDocumentRole) {
  return role === "buyer" ? buyerDocumentTypeOptions : sellerDocumentTypeOptions;
}

function documentTypeLabel(value: string) {
  const allOptions = [...buyerDocumentTypeOptions, ...sellerDocumentTypeOptions];
  return allOptions.find((option) => option.value === value)?.label ?? value.replaceAll("_", " ");
}

function applicationDocumentTypeLabel(role: ApplicationDocumentRole) {
  return role === "buyer" ? "Buyer application" : "Seller application";
}

function revalidateDocumentScopes(role: ApplicationDocumentRole, applicationId: string, requestId?: string | null) {
  revalidatePath(roleRoute(role));
  revalidatePath(adminRoute(role, applicationId));
  revalidatePath(adminDocumentsRoute());
  revalidatePath("/admin/requests");
  revalidatePath("/admin/risk");
  revalidatePath("/portal/buyer/notifications");
  revalidatePath("/portal/seller/notifications");

  if (requestId) {
    revalidatePath(portalRequestCenterRoute(role));
    revalidatePath(portalRequestDetailRoute(role, requestId));
    revalidatePath(`/admin/requests/${requestId}`);
  }
}

function readFormString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readDocumentStatus(formData: FormData) {
  const status = readFormString(formData, "status") as ApplicationDocumentStatus;
  return applicationDocumentStatusOrder.includes(status) ? status : null;
}

async function uploadApplicationDocument(
  role: ApplicationDocumentRole,
  documentType: string,
  file: File,
  ownerUserId: string,
  applicationId: string,
  fallbackReturnTo: string,
  requestId?: string | null,
) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    redirect(`${roleRoute(role)}?error=Document%20storage%20credentials%20are%20not%20configured.`);
  }

  const storagePath = `${role}/${applicationId}/${ownerUserId}/${randomUUID()}-${sanitizeFileName(file.name)}`;
  const { error: uploadError } = await adminClient.storage.from(DOCUMENT_BUCKET).upload(
    storagePath,
    Buffer.from(await file.arrayBuffer()),
    {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    },
  );

  if (uploadError) {
    redirect(
      `${roleRoute(role)}?error=${encodeURIComponent(
        "Unable to store the selected file. Please confirm the storage bucket exists and try again.",
      )}`,
    );
  }

  const { error: insertError } = await adminClient.from("application_documents").insert({
    application_type: role,
    application_id: applicationId,
    owner_user_id: ownerUserId,
    file_name: file.name,
    storage_path: storagePath,
    mime_type: file.type || "application/octet-stream",
    file_size: file.size,
    document_type: documentType,
    request_id: requestId ?? null,
    status: "uploaded",
    notes: null,
    reviewed_at: null,
    reviewed_by: null,
  } as never);

  if (insertError) {
    await adminClient.storage.from(DOCUMENT_BUCKET).remove([storagePath]);
    redirect(`${roleRoute(role)}?error=Unable%20to%20save%20the%20document%20record.`);
  }

  revalidateDocumentScopes(role, applicationId, requestId ?? null);
  redirect(fallbackReturnTo);
}

async function listDocuments(role: ApplicationDocumentRole, applicationId: string, ownerUserId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("application_documents")
    .select("*")
    .eq("application_type", role)
    .eq("application_id", applicationId)
    .eq("owner_user_id", ownerUserId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as DocumentRecord[];
  }

  return data as DocumentRecord[];
}

async function getPortalRequestIdIfValid(role: ApplicationDocumentRole, requestId: string, applicationId: string) {
  if (!requestId) {
    return null;
  }

  const request = role === "buyer" ? await getBuyerPortalRequestForAccess(requestId) : await getSellerPortalRequestForAccess(requestId);

  if (!request) {
    return null;
  }

  if ((role === "buyer" ? request.buyer_application_id : request.seller_application_id) !== applicationId) {
    return null;
  }

  if (request.status === "completed" || request.status === "cancelled") {
    return null;
  }

  return request.id;
}

async function listAdminDocuments(role: ApplicationDocumentRole, applicationId: string) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    return [] as DocumentRecord[];
  }

  const { data, error } = await adminClient
    .from("application_documents")
    .select("*")
    .eq("application_type", role)
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as DocumentRecord[];
  }

  return data as DocumentRecord[];
}

async function getPortalDocumentById(role: ApplicationDocumentRole, documentId: string) {
  const { user, record } = await getPortalDocumentContext(role);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("application_documents")
    .select("*")
    .eq("id", documentId)
    .eq("application_type", role)
    .eq("application_id", record.id)
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as DocumentRecord;
}

async function getAdminDocumentById(documentId: string) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    return null;
  }

  const { data, error } = await adminClient.from("application_documents").select("*").eq("id", documentId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as DocumentRecord;
}

async function getSignedDocumentUrl(storagePath: string, downloadName?: string) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    return null;
  }

  const { data, error } = await adminClient.storage.from(DOCUMENT_BUCKET).createSignedUrl(storagePath, 10 * 60);

  if (error || !data?.signedUrl) {
    return null;
  }

  if (!downloadName) {
    return data.signedUrl;
  }

  const url = new URL(data.signedUrl);
  url.searchParams.set("download", downloadName);
  return url.toString();
}

function ownerLabelForDocument(document: DocumentRecord) {
  return document.application_type === "buyer" ? "Buyer application" : "Seller application";
}

async function loadApplicationLabel(role: ApplicationDocumentRole, applicationId: string) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    return null;
  }

  if (role === "buyer") {
    const { data, error } = await adminClient
      .from("buyer_applications")
      .select("id, applicant_name, email, status")
      .eq("id", applicationId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const record = data as Pick<BuyerApplicationRecord, "id" | "applicant_name" | "email" | "status">;
    return {
      label: record.applicant_name,
      summary: record.email,
      href: adminRoute(role, record.id),
      typeLabel: applicationDocumentTypeLabel(role),
    };
  }

  const { data, error } = await adminClient
    .from("seller_applications")
    .select("id, applicant_name, business_name, email, status")
    .eq("id", applicationId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const record = data as Pick<SellerApplicationRecord, "id" | "applicant_name" | "business_name" | "email" | "status">;
  return {
    label: record.business_name || record.applicant_name,
    summary: record.email,
    href: adminRoute(role, record.id),
    typeLabel: applicationDocumentTypeLabel(role),
  };
}

export function portalDocumentViewHref(role: ApplicationDocumentRole, documentId: string) {
  return `${roleRoute(role)}/${documentId}/view`;
}

export function portalDocumentDownloadHref(role: ApplicationDocumentRole, documentId: string) {
  return `${roleRoute(role)}/${documentId}/download`;
}

export function adminDocumentViewHref(documentId: string) {
  return `${adminDocumentsRoute()}/${documentId}/view`;
}

export function adminDocumentDownloadHref(documentId: string) {
  return `${adminDocumentsRoute()}/${documentId}/download`;
}

export function adminApplicationReviewHref(role: ApplicationDocumentRole, applicationId: string) {
  return adminRoute(role, applicationId);
}

export function documentQueueDocumentTypes() {
  return applicationDocumentTypeFilterOptions;
}

export async function getPortalDocumentForAccess(role: ApplicationDocumentRole, documentId: string) {
  return getPortalDocumentById(role, documentId);
}

export async function getAdminDocumentForAccess(documentId: string) {
  return getAdminDocumentById(documentId);
}

export async function getSignedAccessUrlForDocument(document: DocumentRecord, download = false) {
  return getSignedDocumentUrl(document.storage_path, download ? document.file_name : undefined);
}

export async function getAdminDocumentQueue(filters: {
  applicationType?: ApplicationDocumentRole | "all";
  status?: ApplicationDocumentStatus | "all";
  documentType?: string | "all";
}) {
  const adminClient = createAdminClient();

  if (!adminClient) {
    return [] as ApplicationDocumentQueueItem[];
  }

  let query = adminClient.from("application_documents").select("*").order("created_at", { ascending: false });

  if (filters.applicationType && filters.applicationType !== "all") {
    query = query.eq("application_type", filters.applicationType);
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.documentType && filters.documentType !== "all") {
    query = query.eq("document_type", filters.documentType);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [] as ApplicationDocumentQueueItem[];
  }

  const documents = data as DocumentRecord[];
  const buyerIds = [...new Set(documents.filter((document) => document.application_type === "buyer").map((document) => document.application_id))];
  const sellerIds = [...new Set(documents.filter((document) => document.application_type === "seller").map((document) => document.application_id))];

  const buyerApplications = buyerIds.length
    ? (((await adminClient.from("buyer_applications").select("id, applicant_name, email, status").in("id", buyerIds)).data ??
        []) as BuyerApplicationRecord[])
    : [];
  const sellerApplications = sellerIds.length
    ? (((await adminClient
        .from("seller_applications")
        .select("id, applicant_name, business_name, email, status")
        .in("id", sellerIds)).data ?? []) as SellerApplicationRecord[])
    : [];
  const buyerMap = new Map(buyerApplications.map((record) => [record.id, record]));
  const sellerMap = new Map(sellerApplications.map((record) => [record.id, record]));

  return documents.map((document) => {
    if (document.application_type === "buyer") {
      const application = buyerMap.get(document.application_id);

      return {
        ...document,
        application_label: application?.applicant_name ?? "Buyer application",
        application_summary: application?.email ?? "No email available",
        application_review_href: adminRoute("buyer", document.application_id),
        application_type_label: applicationDocumentTypeLabel("buyer"),
      } satisfies ApplicationDocumentQueueItem;
    }

    const application = sellerMap.get(document.application_id);

    return {
      ...document,
      application_label: application?.business_name || application?.applicant_name || "Seller application",
      application_summary: application?.email ?? "No email available",
      application_review_href: adminRoute("seller", document.application_id),
      application_type_label: applicationDocumentTypeLabel("seller"),
    } satisfies ApplicationDocumentQueueItem;
  });
}

export async function saveApplicationDocumentReview(formData: FormData) {
  "use server";

  const documentId = readFormString(formData, "id");
  const applicationType = readFormString(formData, "application_type") as ApplicationDocumentRole;
  const status = readDocumentStatus(formData);
  const notes = readFormString(formData, "notes");
  const returnTo = readFormString(formData, "return_to") || null;

  if (!documentId || !status || !["buyer", "seller"].includes(applicationType)) {
    redirect("/admin/applications/documents?error=Please%20complete%20all%20required%20fields.");
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    redirect("/admin/applications/documents?error=Document%20review%20credentials%20are%20not%20configured.");
  }

  const { data: currentUser, error: currentUserError } = await createClient().auth.getUser();

  if (currentUserError || !currentUser.user?.id) {
    redirect("/login?error=Please%20sign%20in%20again.");
  }

  const { data: existing, error: existingError } = await adminClient
    .from("application_documents")
    .select("*")
    .eq("id", documentId)
    .eq("application_type", applicationType)
    .maybeSingle();

  const record = existing as DocumentRecord | null;

  if (existingError || !record) {
    redirect("/admin/applications/documents?error=Document%20record%20not%20found.");
  }

  const { error } = await adminClient
    .from("application_documents")
    .update({
      status,
      notes: notes || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: currentUser.user.id,
    } as never)
    .eq("id", documentId);

  if (error) {
    redirect("/admin/applications/documents?error=Unable%20to%20update%20the%20document.");
  }

  revalidatePath(adminDocumentsRoute());
  revalidatePath(adminRoute(applicationType, record.application_id));

  const safeReturnTo = returnTo && returnTo.startsWith("/admin/") ? returnTo : adminDocumentsRoute();
  redirect(buildRelativePath(safeReturnTo, { document_saved: "1" }));
}

async function updateDocumentReview(role: ApplicationDocumentRole, formData: FormData) {
  const documentId = readFormString(formData, "id");
  const status = readDocumentStatus(formData);
  const notes = readFormString(formData, "notes");

  if (!documentId || !status) {
    redirect(`/admin/applications?error=Please%20complete%20all%20required%20fields.`);
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    redirect(`/admin/applications?error=Document%20review%20credentials%20are%20not%20configured.`);
  }

  const { data: existing, error: existingError } = await adminClient
    .from("application_documents")
    .select("*")
    .eq("id", documentId)
    .eq("application_type", role)
    .maybeSingle();

  const record = existing as DocumentRecord | null;

  if (existingError || !record) {
    redirect(`/admin/applications?error=Document%20record%20not%20found.`);
  }

  const { error } = await adminClient
    .from("application_documents")
    .update({
      status,
      notes: notes || null,
    } as never)
    .eq("id", documentId);

  if (error) {
    redirect(`/admin/applications?error=Unable%20to%20update%20the%20document.`);
  }

  revalidateDocumentScopes(role, record.application_id);
  redirect(`${adminRoute(role, record.application_id)}?document_saved=1`);
}

function documentSizeLabel(fileSize: number) {
  if (fileSize < 1024) {
    return `${fileSize} B`;
  }

  if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(1)} KB`;
  }

  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

export function describeDocumentType(value: string) {
  return documentTypeLabel(value);
}

export function formatDocumentSize(fileSize: number) {
  return documentSizeLabel(fileSize);
}

export function portalDocumentOptions(role: ApplicationDocumentRole) {
  return documentTypeOptionsForRole(role);
}

export async function getPortalApplicationDocuments(role: ApplicationDocumentRole) {
  const { user, record } = await getPortalDocumentContext(role);
  return listDocuments(role, record.id, user.id);
}

export async function getBuyerApplicationDocuments() {
  return getPortalApplicationDocuments("buyer");
}

export async function getSellerApplicationDocuments() {
  return getPortalApplicationDocuments("seller");
}

export async function getAdminApplicationDocuments(role: ApplicationDocumentRole, applicationId: string) {
  return listAdminDocuments(role, applicationId);
}

export async function getBuyerApplicationDocumentForAccess(documentId: string) {
  return getPortalDocumentById("buyer", documentId);
}

export async function getSellerApplicationDocumentForAccess(documentId: string) {
  return getPortalDocumentById("seller", documentId);
}

export async function getAdminApplicationDocumentForAccess(documentId: string) {
  return getAdminDocumentById(documentId);
}

export async function createBuyerDocumentViewUrl(documentId: string) {
  const document = await getBuyerApplicationDocumentForAccess(documentId);

  if (!document) {
    return null;
  }

  return getSignedAccessUrlForDocument(document, false);
}

export async function createBuyerDocumentDownloadUrl(documentId: string) {
  const document = await getBuyerApplicationDocumentForAccess(documentId);

  if (!document) {
    return null;
  }

  return getSignedAccessUrlForDocument(document, true);
}

export async function createSellerDocumentViewUrl(documentId: string) {
  const document = await getSellerApplicationDocumentForAccess(documentId);

  if (!document) {
    return null;
  }

  return getSignedAccessUrlForDocument(document, false);
}

export async function createSellerDocumentDownloadUrl(documentId: string) {
  const document = await getSellerApplicationDocumentForAccess(documentId);

  if (!document) {
    return null;
  }

  return getSignedAccessUrlForDocument(document, true);
}

export async function createAdminDocumentViewUrl(documentId: string) {
  const document = await getAdminApplicationDocumentForAccess(documentId);

  if (!document) {
    return null;
  }

  return getSignedAccessUrlForDocument(document, false);
}

export async function createAdminDocumentDownloadUrl(documentId: string) {
  const document = await getAdminApplicationDocumentForAccess(documentId);

  if (!document) {
    return null;
  }

  return getSignedAccessUrlForDocument(document, true);
}

export async function uploadBuyerApplicationDocument(formData: FormData) {
  "use server";

  const { user, record } = await getPortalDocumentContext("buyer");
  const file = formData.get("file");
  const documentType = readFormString(formData, "document_type");
  const requestId = readFormString(formData, "request_id");

  if (!(file instanceof File)) {
    redirect("/portal/buyer/documents?error=Please%20choose%20a%20file%20to%20upload.");
  }

  const fileError = ensureValidDocumentFile(file);

  if (fileError) {
    redirect(`/portal/buyer/documents?error=${encodeURIComponent(fileError)}`);
  }

  if (!documentType || !buyerDocumentTypeOptions.some((option) => option.value === documentType)) {
    redirect("/portal/buyer/documents?error=Please%20choose%20a%20document%20type.");
  }

  const safeRequestId = await getPortalRequestIdIfValid("buyer", requestId, record.id);

  if (requestId && !safeRequestId) {
    redirect("/portal/buyer/documents?error=This%20request%20cannot%20accept%20documents%20right%20now.");
  }

  const returnTo = safeRequestId
    ? `/portal/buyer/requests/${safeRequestId}?saved=1`
    : "/portal/buyer/documents?uploaded=1";

  await uploadApplicationDocument("buyer", documentType, file, user.id, record.id, returnTo, safeRequestId);
}

export async function uploadSellerApplicationDocument(formData: FormData) {
  "use server";

  const { user, record } = await getPortalDocumentContext("seller");
  const file = formData.get("file");
  const documentType = readFormString(formData, "document_type");
  const requestId = readFormString(formData, "request_id");

  if (!(file instanceof File)) {
    redirect("/portal/seller/documents?error=Please%20choose%20a%20file%20to%20upload.");
  }

  const fileError = ensureValidDocumentFile(file);

  if (fileError) {
    redirect(`/portal/seller/documents?error=${encodeURIComponent(fileError)}`);
  }

  if (!documentType || !sellerDocumentTypeOptions.some((option) => option.value === documentType)) {
    redirect("/portal/seller/documents?error=Please%20choose%20a%20document%20type.");
  }

  const safeRequestId = await getPortalRequestIdIfValid("seller", requestId, record.id);

  if (requestId && !safeRequestId) {
    redirect("/portal/seller/documents?error=This%20request%20cannot%20accept%20documents%20right%20now.");
  }

  const returnTo = safeRequestId
    ? `/portal/seller/requests/${safeRequestId}?saved=1`
    : "/portal/seller/documents?uploaded=1";

  await uploadApplicationDocument("seller", documentType, file, user.id, record.id, returnTo, safeRequestId);
}

export async function saveBuyerDocumentReview(formData: FormData) {
  "use server";

  await updateDocumentReview("buyer", formData);
}

export async function saveSellerDocumentReview(formData: FormData) {
  "use server";

  await updateDocumentReview("seller", formData);
}
