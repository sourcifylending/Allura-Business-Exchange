import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ApplicationDocumentActions } from "@/components/application-document-actions";
import { ApplicationDocumentStatusPill } from "@/components/application-document-status-pill";
import { HistoryFeed } from "@/components/history-feed";
import { PageCard } from "@/components/page-card";
import { RequestCard } from "@/components/request-card";
import {
  adminDocumentDownloadHref,
  adminDocumentViewHref,
  describeDocumentType,
  formatDocumentSize,
} from "@/lib/application-documents";
import {
  formatPortalRequestDate,
  formatPortalRequestDateTime,
  getAdminPortalRequestById,
  getAdminRequestDocuments,
  portalRequestStatusLabels,
  portalRequestStatusOrder,
  portalRequestTargetRoleText,
  portalRequestTypeLabels,
  portalRequestTypeOrder,
  saveAdminPortalRequestAction,
} from "@/lib/portal-requests";
import { getRequestHistoryEvents } from "@/lib/history";

export const dynamic = "force-dynamic";

type AdminRequestDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

export default async function AdminRequestDetailPage({ params, searchParams }: AdminRequestDetailPageProps) {
  const request = await getAdminPortalRequestById(params.id);

  if (!request) {
    redirect("/admin/requests?error=Request%20not%20found.");
  }

  const documents = await getAdminRequestDocuments(request.id);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Request Detail"
        description="Admin-managed request workflow with portal-visible instructions and linked documents."
      />

      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Request saved successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard title="Request summary" description="Command view for the portal request chain.">
          <RequestCard record={request} href={`/admin/requests/${request.id}`} showAdminLinks />

          <div className="mt-5 grid gap-3 text-sm leading-6 text-ink-700 sm:grid-cols-2 xl:grid-cols-4">
            <Info label="Created" value={formatPortalRequestDateTime(request.created_at)} />
            <Info label="Updated" value={formatPortalRequestDateTime(request.updated_at)} />
            <Info label="Due date" value={formatPortalRequestDate(request.due_date)} />
            <Info label="Status" value={request.safe_status_label} />
          </div>
        </PageCard>

        <PageCard title="Linked records" description="Follow the request back to the related admin chain.">
          <div className="grid gap-3">
            {request.application_href ? (
              <Link
                href={request.application_href}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open linked application
              </Link>
            ) : null}
            {request.packaging_href ? (
              <Link
                href={request.packaging_href}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open linked deal
              </Link>
            ) : null}
            {request.offer_href ? (
              <Link
                href={request.offer_href}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open linked offer
              </Link>
            ) : null}
            {request.contract_href ? (
              <Link
                href={request.contract_href}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open linked contract
              </Link>
            ) : null}
            {request.transfer_href ? (
              <Link
                href={request.transfer_href}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open linked transfer
              </Link>
            ) : null}
            {request.closeout_href ? (
              <Link
                href={request.closeout_href}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Open closeout desk
              </Link>
            ) : null}
          </div>
        </PageCard>
      </div>

      <PageCard title="Workflow" description="Update request status and portal-visible instructions.">
        <form action={saveAdminPortalRequestAction} className="grid gap-5">
          <input type="hidden" name="id" value={request.id} />
          <input type="hidden" name="target_role" value={request.target_role} />
          <input type="hidden" name="return_to" value={`/admin/requests/${request.id}?saved=1`} />
          <input
            type="hidden"
            name="linked_application_id"
            value={request.target_role === "buyer" ? request.buyer_application_id ?? "" : request.seller_application_id ?? ""}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Request type</span>
              <select
                name="request_type"
                required
                defaultValue={request.request_type}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              >
                {portalRequestTypeOrder.map((value) => (
                  <option key={value} value={value}>
                    {portalRequestTypeLabels[value]}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Status</span>
              <select
                name="status"
                required
                defaultValue={request.status}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              >
                {portalRequestStatusOrder.map((value) => (
                  <option key={value} value={value}>
                    {portalRequestStatusLabels[value]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Title</span>
              <input
                name="title"
                defaultValue={request.title}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Due date</span>
              <input
                name="due_date"
                type="date"
                defaultValue={request.due_date ? request.due_date.slice(0, 10) : ""}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Portal instructions</span>
            <textarea
              name="portal_instructions"
              rows={5}
              defaultValue={request.portal_instructions}
              className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Internal notes</span>
            <textarea
              name="admin_notes"
              rows={3}
              defaultValue={request.admin_notes ?? ""}
              className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Packaging id</span>
              <input
                name="asset_packaging_id"
                defaultValue={request.asset_packaging_id ?? ""}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Offer id</span>
              <input
                name="offer_id"
                defaultValue={request.offer_id ?? ""}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Contract id</span>
              <input
                name="contract_id"
                defaultValue={request.contract_id ?? ""}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Transfer id</span>
              <input
                name="transfer_id"
                defaultValue={request.transfer_id ?? ""}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-5 py-2.5 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
            >
              Save request
            </button>
            <div className="text-sm leading-6 text-ink-600">
              Status transitions remain server-side and admin-only.
            </div>
          </div>
        </form>
      </PageCard>

      <PageCard title="Linked documents" description="Uploaded files tied to this request are listed here.">
        {documents.length > 0 ? (
          <div className="grid gap-4">
            {documents.map((document) => (
              <article key={document.id} className="rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
                      {describeDocumentType(document.document_type)}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-ink-950">{document.file_name}</h3>
                    <div className="mt-1 text-sm text-ink-600">
                      {formatDocumentSize(document.file_size)} · {document.mime_type}
                    </div>
                  </div>
                  <ApplicationDocumentStatusPill status={document.status} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Info label="Uploaded" value={formatPortalRequestDateTime(document.created_at)} />
                  <Info label="Owner" value={document.owner_user_id} />
                  <Info label="Application" value={document.application_type} />
                  <Info label="Storage" value="Private bucket" />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm leading-6 text-ink-600">Admin-only review access remains short-lived and signed.</div>
                  <ApplicationDocumentActions
                    viewHref={adminDocumentViewHref(document.id)}
                    downloadHref={adminDocumentDownloadHref(document.id)}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-5">
            <div className="text-sm font-semibold text-ink-900">No linked documents yet</div>
            <div className="mt-1 text-sm leading-6 text-ink-600">
              Portal users will appear here once they upload request-specific support files.
            </div>
          </div>
        )}
      </PageCard>

      <PageCard title="History" description="Derived request activity with safe timestamps and event labels.">
        <HistoryFeed events={await getRequestHistoryEvents("admin", request.id)} compact />
      </PageCard>
    </div>
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
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}
