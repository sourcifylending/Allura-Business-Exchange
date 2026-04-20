import Link from "next/link";
import { ApplicationDocumentActions } from "@/components/application-document-actions";
import { ApplicationDocumentStatusPill } from "@/components/application-document-status-pill";
import {
  adminDocumentDownloadHref,
  adminDocumentViewHref,
  applicationDocumentStatusLabels,
  applicationDocumentStatusOrder,
  describeDocumentType,
  formatDocumentSize,
  saveApplicationDocumentReview,
  type ApplicationDocumentQueueItem,
} from "@/lib/application-documents";
import { formatApplicationDate } from "@/lib/application-review";

export function ApplicationDocumentQueueCard({
  document,
  returnTo,
}: Readonly<{
  document: ApplicationDocumentQueueItem;
  returnTo: string;
}>) {
  return (
    <article className="grid gap-5 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            {document.application_type_label}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-ink-950">{document.file_name}</h3>
          <div className="mt-1 text-sm text-ink-600">
            {describeDocumentType(document.document_type)} · {formatDocumentSize(document.file_size)} ·{" "}
            {document.mime_type}
          </div>
        </div>
        <ApplicationDocumentStatusPill status={document.status} />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Application" value={document.application_label} />
        <Field label="Summary" value={document.application_summary} />
        <Field label="Uploaded" value={formatApplicationDate(document.created_at)} />
        <Field label="Role" value={document.application_type} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={document.application_review_href}
          className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-ink-600 uppercase transition hover:border-accent-300 hover:text-accent-700"
        >
          Open application
        </Link>
        <ApplicationDocumentActions
          viewHref={adminDocumentViewHref(document.id)}
          downloadHref={adminDocumentDownloadHref(document.id)}
        />
      </div>

      <form action={saveApplicationDocumentReview} className="grid gap-4 rounded-[1.35rem] border border-ink-200 bg-[rgb(var(--surface))] p-4">
        <input type="hidden" name="id" value={document.id} />
        <input type="hidden" name="application_type" value={document.application_type} />
        <input type="hidden" name="return_to" value={returnTo} />

        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Status</span>
            <select
              name="status"
              defaultValue={document.status}
              className="rounded-2xl border border-ink-200 bg-[rgba(18,20,23,0.96)] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
            >
              {applicationDocumentStatusOrder.map((status) => (
                <option key={status} value={status}>
                  {applicationDocumentStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Internal notes</span>
            <textarea
              name="notes"
              rows={3}
              defaultValue={document.notes ?? ""}
              className="rounded-2xl border border-ink-200 bg-[rgba(18,20,23,0.96)] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              placeholder="Add internal context or review notes."
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-5 py-2.5 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
          >
            Save queue review
          </button>
          <div className="text-sm leading-6 text-ink-600">Queue edits stay admin-only and role-safe.</div>
        </div>
      </form>
    </article>
  );
}

function Field({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value || "Not set"}</div>
    </div>
  );
}
