import { ApplicationDocumentActions } from "@/components/application-document-actions";
import { PageCard } from "@/components/page-card";
import { ApplicationDocumentStatusPill } from "@/components/application-document-status-pill";
import {
  adminDocumentDownloadHref,
  adminDocumentViewHref,
  applicationDocumentStatusLabels,
  applicationDocumentStatusOrder,
  describeDocumentType,
  formatDocumentSize,
  saveApplicationDocumentReview,
} from "@/lib/application-documents";
import { formatApplicationDate } from "@/lib/application-review";
import type { ApplicationDocumentRole } from "@/lib/application-documents";
import type { ApplicationDocumentRow } from "@/lib/supabase/database.types";

export function ApplicationDocumentReviewSection({
  role,
  applicationId,
  documents,
}: Readonly<{
  role: ApplicationDocumentRole;
  applicationId: string;
  documents: ApplicationDocumentRow[];
}>) {
  return (
    <PageCard title="Portal documents" description="Uploaded portal files remain visible here for internal review only.">
      {documents.length > 0 ? (
        <div className="grid gap-4">
          {documents.map((document) => (
            <form
              key={document.id}
              action={saveApplicationDocumentReview}
              className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5"
            >
              <input type="hidden" name="id" value={document.id} />
              <input type="hidden" name="application_type" value={role} />
              <input type="hidden" name="application_id" value={applicationId} />
              <input
                type="hidden"
                name="return_to"
                value={`/admin/applications/${role === "buyer" ? "buyers" : "sellers"}/${applicationId}`}
              />

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

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm leading-6 text-ink-600">Admin review remains internal and role-safe.</div>
                <ApplicationDocumentActions
                  viewHref={adminDocumentViewHref(document.id)}
                  downloadHref={adminDocumentDownloadHref(document.id)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Uploaded" value={formatApplicationDate(document.created_at)} />
                <Field label="Owner" value={document.owner_user_id} />
                <Field label="Application" value={document.application_type} />
                <Field label="Storage" value="Private bucket" />
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
                <label className="grid gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                    Status
                  </span>
                  <select
                    name="status"
                    defaultValue={document.status}
                    className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
                  >
                    {applicationDocumentStatusOrder.map((status) => (
                      <option key={status} value={status}>
                        {applicationDocumentStatusLabels[status]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                    Internal notes
                  </span>
                  <textarea
                    name="notes"
                    rows={4}
                    defaultValue={document.notes ?? ""}
                    className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
                    placeholder="Add internal review context, missing-file notes, or approval guidance."
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-5 py-2.5 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Save document review
                </button>
                <div className="text-sm leading-6 text-ink-600">
                  Document visibility remains admin-only and role-safe.
                </div>
              </div>
            </form>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-5">
          <div className="text-sm font-semibold text-ink-900">No uploaded documents yet</div>
          <div className="mt-1 text-sm leading-6 text-ink-600">
            Portal users will appear here once they upload files into the controlled document room.
          </div>
        </div>
      )}
    </PageCard>
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
