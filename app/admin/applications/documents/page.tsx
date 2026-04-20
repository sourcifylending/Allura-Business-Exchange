import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { ApplicationDocumentQueueCard } from "@/components/application-document-queue-card";
import {
  applicationDocumentStatusLabels,
  applicationDocumentStatusOrder,
  applicationDocumentTypeFilterOptions,
  getAdminDocumentQueue,
} from "@/lib/application-documents";
import type { ApplicationDocumentApplicationType, ApplicationDocumentStatus } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type DocumentsQueuePageProps = Readonly<{
  searchParams?: {
    application_type?: string;
    status?: string;
    document_type?: string;
    document_saved?: string;
    error?: string;
  };
}>;

function validApplicationType(value: string | undefined): ApplicationDocumentApplicationType | "all" {
  return value === "buyer" || value === "seller" ? value : "all";
}

function validDocumentStatus(value: string | undefined): ApplicationDocumentStatus | "all" {
  return applicationDocumentStatusOrder.includes(value as ApplicationDocumentStatus)
    ? (value as ApplicationDocumentStatus)
    : "all";
}

function validDocumentType(value: string | undefined) {
  return value && applicationDocumentTypeFilterOptions.some((option) => option.value === value) ? value : "all";
}

function buildPath(searchParams: Record<string, string | undefined>) {
  const url = new URL("/admin/applications/documents", "http://allura.local");

  for (const [key, value] of Object.entries(searchParams)) {
    if (value && value !== "all") {
      url.searchParams.set(key, value);
    }
  }

  return `${url.pathname}${url.search}`;
}

function filterHref(searchParams: Record<string, string | undefined>) {
  return buildPath(searchParams);
}

export default async function ApplicationsDocumentsPage({ searchParams }: DocumentsQueuePageProps) {
  const applicationType = validApplicationType(searchParams?.application_type);
  const status = validDocumentStatus(searchParams?.status);
  const documentType = validDocumentType(searchParams?.document_type);

  const documents = await getAdminDocumentQueue({
    applicationType,
    status,
    documentType,
  });

  const returnTo = buildPath({
    application_type: applicationType,
    status,
    document_type: documentType,
  });

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Document queue"
        description="Central review queue for buyer and seller application documents with secure signed access."
      />

      {searchParams?.document_saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Document review saved successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <PageCard title="Filters" description="Narrow the queue by application type, document status, or document category.">
        <div className="grid gap-5">
          <FilterRow
            label="Application type"
            currentValue={applicationType}
            options={[
              { label: "All", value: "all" },
              { label: "Buyer", value: "buyer" },
              { label: "Seller", value: "seller" },
            ]}
            buildHref={(value) =>
              filterHref({
                application_type: value,
                status,
                document_type: documentType,
              })
            }
          />

          <FilterRow
            label="Status"
            currentValue={status}
            options={[
              { label: "All", value: "all" },
              ...applicationDocumentStatusOrder.map((value) => ({ label: applicationDocumentStatusLabels[value], value })),
            ]}
            buildHref={(value) =>
              filterHref({
                application_type: applicationType,
                status: value,
                document_type: documentType,
              })
            }
          />

          <form method="get" className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <input type="hidden" name="application_type" value={applicationType} />
            <input type="hidden" name="status" value={status} />
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                Document type
              </span>
              <select
                name="document_type"
                defaultValue={documentType}
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              >
                <option value="all">All</option>
                {applicationDocumentTypeFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="mt-auto rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-5 py-2.5 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
            >
              Apply
            </button>
            <Link
              href="/admin/applications/documents"
              className="mt-auto rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
            >
              Clear filters
            </Link>
          </form>
        </div>
      </PageCard>

      {documents.length > 0 ? (
        <div className="grid gap-5">
          {documents.map((document) => (
            <ApplicationDocumentQueueCard key={document.id} document={document} returnTo={returnTo} />
          ))}
        </div>
      ) : (
        <PageCard title="No documents found" description="There are no uploaded documents for the selected filters.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Try clearing one of the filters or checking another application type.</div>
            <div>The queue stays empty until portal users upload files.</div>
          </div>
        </PageCard>
      )}
    </div>
  );
}

function FilterRow({
  label,
  currentValue,
  options,
  buildHref,
}: Readonly<{
  label: string;
  currentValue: string;
  options: ReadonlyArray<{ label: string; value: string }>;
  buildHref: (value: string) => string;
}>) {
  return (
    <div className="grid gap-3">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = currentValue === option.value || (!currentValue && option.value === "all");
          return (
            <Link
              key={option.value}
              href={buildHref(option.value)}
              className={[
                "rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase transition",
                active
                  ? "border-accent-200 bg-[rgba(31,26,18,0.96)] text-accent-700"
                  : "border-ink-200 bg-[rgb(var(--surface))] text-ink-600 hover:border-accent-300 hover:text-accent-700",
              ].join(" ")}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
