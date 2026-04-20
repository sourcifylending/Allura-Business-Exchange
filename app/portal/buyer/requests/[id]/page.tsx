import { redirect } from "next/navigation";
import { ApplicationDocumentList } from "@/components/application-document-list";
import { ApplicationDocumentUploadForm } from "@/components/application-document-upload-form";
import { HistoryFeed } from "@/components/history-feed";
import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { RequestCard } from "@/components/request-card";
import {
  acknowledgeBuyerPortalRequestAction,
  completeBuyerPortalRequestAction,
  getBuyerPortalRequestById,
  getBuyerPortalRequestDocuments,
  portalRequestDetailRoute,
  portalRequestTypeLabels,
} from "@/lib/portal-requests";
import { getRequestHistoryEvents } from "@/lib/history";
import {
  portalDocumentOptions,
  uploadBuyerApplicationDocument,
} from "@/lib/application-documents";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireBuyerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

type BuyerRequestDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

export default async function BuyerRequestDetailPage({ params, searchParams }: BuyerRequestDetailPageProps) {
  const record = await requireBuyerPortalAccess();
  const request = record.status === "activated" ? await getBuyerPortalRequestById(record.id, params.id) : null;

  if (!request) {
    redirect("/portal/buyer/requests?error=Request%20not%20found.");
  }

  const requestDocs = await getBuyerPortalRequestDocuments(request.id);
  const canUpload = request.request_type === "document_request" && request.status !== "completed" && request.status !== "cancelled";
  const canAcknowledge = request.status !== "completed" && request.status !== "cancelled" && request.status !== "acknowledged" && request.status !== "in_progress";
  const canComplete = request.status !== "completed" && request.status !== "cancelled";

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title="Buyer request detail"
      description="Review the request, complete the task, and upload supporting files if required."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Request updated successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <PageCard title="Request summary" description="Only safe buyer-facing request details are shown here.">
          <RequestCard record={request} href={portalRequestDetailRoute("buyer", request.id)} />

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Info label="Type" value={portalRequestTypeLabels[request.request_type]} />
            <Info label="Status" value={request.safe_status_label} />
            <Info label="Due date" value={request.due_date ? new Date(request.due_date).toLocaleDateString() : "Not set"} />
            <Info label="Documents" value={String(request.linked_document_count)} />
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5 text-sm leading-6 text-ink-700">
            {request.portal_instructions}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {canAcknowledge ? (
              <form action={acknowledgeBuyerPortalRequestAction}>
                <input type="hidden" name="id" value={request.id} />
                <button
                  type="submit"
                  className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-5 py-2.5 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Acknowledge request
                </button>
              </form>
            ) : null}
            {canComplete ? (
              <form action={completeBuyerPortalRequestAction}>
                <input type="hidden" name="id" value={request.id} />
                <button
                  type="submit"
                  className="rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-600"
                >
                  Mark completed
                </button>
              </form>
            ) : null}
          </div>
        </PageCard>

        <div className="grid gap-6">
          <PageCard title="Request status" description="Safe status labels only, with no internal notes exposed.">
            <div className="grid gap-3 text-sm leading-6 text-ink-700">
              <div>Current status: {request.safe_status_label}</div>
              <div>Next step: {request.safe_next_step}</div>
              <div>Created: {new Date(request.created_at).toLocaleString()}</div>
              <div>Updated: {new Date(request.updated_at).toLocaleString()}</div>
            </div>
          </PageCard>

          {canUpload ? (
            <ApplicationDocumentUploadForm
              title="Upload supporting document"
              description="Attach the requested file directly to this action item."
              action={uploadBuyerApplicationDocument}
              documentTypes={portalDocumentOptions("buyer")}
              buttonLabel="Upload request document"
              helperText="The file stays private and is linked only to this request."
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.txt,application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
              hiddenFields={[{ name: "request_id", value: request.id }]}
            />
          ) : (
            <PageCard title="Supporting documents" description="Document upload is disabled once the request is closed.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>This request is not currently accepting supporting uploads.</div>
                <div>Completed and cancelled requests stay read-only.</div>
              </div>
            </PageCard>
          )}

          <ApplicationDocumentList
            role="buyer"
            title="Linked documents"
            description="Files attached to this request are listed here with their current review status."
            documents={requestDocs}
            emptyStateTitle="No request documents uploaded yet"
            emptyStateDescription="Upload a supporting file to keep it attached to this action item."
          />

          <PageCard title="History" description="Safe request activity with timestamps and sanitized labels.">
            <HistoryFeed events={await getRequestHistoryEvents("buyer", request.id)} compact />
          </PageCard>
        </div>
      </div>
    </PortalShell>
  );
}

function Info({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}
