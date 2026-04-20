import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { RequestCard } from "@/components/request-card";
import {
  createAdminPortalRequestAction,
  getAdminPortalRequests,
  portalRequestStatusLabels,
  portalRequestStatusOrder,
  portalRequestSummaryCount,
  portalRequestTypeLabels,
  portalRequestTypeOrder,
} from "@/lib/portal-requests";
import type { PortalRequestStatus, PortalRequestTargetRole, PortalRequestType } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type AdminRequestsPageProps = Readonly<{
  searchParams?: {
    role?: string;
    request_type?: string;
    status?: string;
    state?: string;
    saved?: string;
    error?: string;
  };
}>;

function validRole(value: string | undefined): PortalRequestTargetRole | "all" {
  return value === "buyer" || value === "seller" ? value : "all";
}

function validRequestType(value: string | undefined): PortalRequestType | "all" {
  return portalRequestTypeOrder.includes(value as PortalRequestType) ? (value as PortalRequestType) : "all";
}

function validStatus(value: string | undefined): PortalRequestStatus | "all" {
  return portalRequestStatusOrder.includes(value as PortalRequestStatus) ? (value as PortalRequestStatus) : "all";
}

function validState(value: string | undefined): "all" | "open" | "overdue" | "completed" {
  return value === "open" || value === "overdue" || value === "completed" ? value : "all";
}

function buildPath(searchParams: Record<string, string | undefined>) {
  const url = new URL("/admin/requests", "http://allura.local");

  for (const [key, value] of Object.entries(searchParams)) {
    if (value && value !== "all") {
      url.searchParams.set(key, value);
    }
  }

  return `${url.pathname}${url.search}`;
}

export default async function AdminRequestsPage({ searchParams }: AdminRequestsPageProps) {
  const role = validRole(searchParams?.role);
  const requestType = validRequestType(searchParams?.request_type);
  const status = validStatus(searchParams?.status);
  const state = validState(searchParams?.state);

  const requests = await getAdminPortalRequests({
    role,
    requestType,
    status,
    state,
  });

  const counts = portalRequestSummaryCount(requests);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Requests"
        description="Controlled request center for buyer and seller portal action items and document requests."
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

      <PageCard title="Overview" description="Track open, overdue, and completed portal requests from one place.">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="All requests" value={String(requests.length)} />
          <Metric label="Open" value={String(counts.open)} />
          <Metric label="Overdue" value={String(counts.overdue)} />
          <Metric label="Completed" value={String(counts.completed)} />
        </div>
      </PageCard>

      <PageCard title="Filters" description="Narrow the queue by role, request type, status, and lifecycle state.">
        <div className="grid gap-5">
          <FilterRow
            label="Role"
            currentValue={role}
            options={[
              { label: "All", value: "all" },
              { label: "Buyer", value: "buyer" },
              { label: "Seller", value: "seller" },
            ]}
            buildHref={(value) =>
              buildPath({
                role: value,
                request_type: requestType,
                status,
                state,
              })
            }
          />

          <FilterRow
            label="Request type"
            currentValue={requestType}
            options={[
              { label: "All", value: "all" },
              ...portalRequestTypeOrder.map((value) => ({ label: portalRequestTypeLabels[value], value })),
            ]}
            buildHref={(value) =>
              buildPath({
                role,
                request_type: value,
                status,
                state,
              })
            }
          />

          <FilterRow
            label="Status"
            currentValue={status}
            options={[
              { label: "All", value: "all" },
              ...portalRequestStatusOrder.map((value) => ({ label: portalRequestStatusLabels[value], value })),
            ]}
            buildHref={(value) =>
              buildPath({
                role,
                request_type: requestType,
                status: value,
                state,
              })
            }
          />

          <FilterRow
            label="State"
            currentValue={state}
            options={[
              { label: "All", value: "all" },
              { label: "Open", value: "open" },
              { label: "Overdue", value: "overdue" },
              { label: "Completed", value: "completed" },
            ]}
            buildHref={(value) =>
              buildPath({
                role,
                request_type: requestType,
                status,
                state: value,
              })
            }
          />

          <Link
            href="/admin/requests"
            className="inline-flex w-fit items-center justify-center rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
          >
            Clear filters
          </Link>
        </div>
      </PageCard>

      <PageCard title="Create request" description="Create a controlled request for an activated buyer or seller account.">
        <form action={createAdminPortalRequestAction} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Target role</span>
              <select
                name="target_role"
                required
                defaultValue="buyer"
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Request type</span>
              <select
                name="request_type"
                required
                defaultValue="document_request"
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              >
                {portalRequestTypeOrder.map((value) => (
                  <option key={value} value={value}>
                    {portalRequestTypeLabels[value]}
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
                required
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
                placeholder="Request supporting financials"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Due date</span>
              <input
                name="due_date"
                type="date"
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Linked application id</span>
            <input
              name="linked_application_id"
              required
              className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              placeholder="Buyer or seller application id"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Packaging id</span>
              <input
                name="asset_packaging_id"
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
                placeholder="Optional packaging id"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Offer id</span>
              <input
                name="offer_id"
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
                placeholder="Optional offer id"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Contract id</span>
              <input
                name="contract_id"
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
                placeholder="Optional contract id"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Transfer id</span>
              <input
                name="transfer_id"
                className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
                placeholder="Optional transfer id"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Portal instructions</span>
            <textarea
              name="portal_instructions"
              rows={5}
              required
              className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              placeholder="Tell the portal user exactly what to upload or complete next."
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Internal notes</span>
            <textarea
              name="admin_notes"
              rows={3}
              className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
              placeholder="Admin-only notes stay hidden from portal users."
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-5 py-2.5 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
            >
              Create request
            </button>
            <div className="text-sm leading-6 text-ink-600">
              The request is stored server-side and stays role-safe.
            </div>
          </div>
        </form>
      </PageCard>

      <PageCard title="Request queue" description="One row per controlled request.">
        {requests.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                record={request}
                href={`/admin/requests/${request.id}`}
                showAdminLinks
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
            No requests match the current filters.
          </div>
        )}
      </PageCard>
    </div>
  );
}

function Metric({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink-950">{value}</div>
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
                  ? "border-accent-200 bg-[rgba(160, 120, 50, 0.96)] text-accent-700"
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
