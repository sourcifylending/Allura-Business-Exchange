import { PageCard } from "@/components/page-card";
import { ApplicationDocumentActions } from "@/components/application-document-actions";
import { ApplicationDocumentStatusPill } from "@/components/application-document-status-pill";
import {
  describeDocumentType,
  formatDocumentSize,
  portalDocumentDownloadHref,
  portalDocumentViewHref,
} from "@/lib/application-documents";
import { formatApplicationDate } from "@/lib/application-review";
import type { ApplicationDocumentRole } from "@/lib/application-documents";
import type { ApplicationDocumentRow } from "@/lib/supabase/database.types";

export function ApplicationDocumentList({
  role,
  title,
  description,
  documents,
  emptyStateTitle,
  emptyStateDescription,
}: Readonly<{
  role: ApplicationDocumentRole;
  title: string;
  description: string;
  documents: ApplicationDocumentRow[];
  emptyStateTitle: string;
  emptyStateDescription: string;
}>) {
  return (
    <PageCard title={title} description={description}>
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

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Field label="Uploaded" value={formatApplicationDate(document.created_at)} />
                <Field label="Storage" value="Private bucket" />
                <Field label="Application" value={document.application_type} />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm leading-6 text-ink-600">Signed access is issued only after portal authorization.</div>
                <ApplicationDocumentActions
                  viewHref={portalDocumentViewHref(role, document.id)}
                  downloadHref={portalDocumentDownloadHref(role, document.id)}
                />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-5">
          <div className="text-sm font-semibold text-ink-900">{emptyStateTitle}</div>
          <div className="mt-1 text-sm leading-6 text-ink-600">{emptyStateDescription}</div>
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
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}
