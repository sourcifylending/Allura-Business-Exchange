import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { DealLifecycleCard } from "@/components/deal-lifecycle-card";
import { PageCard } from "@/components/page-card";
import { getDealLifecycleRecords, dealLifecycleStageLabel } from "@/lib/deals";

export const dynamic = "force-dynamic";

type AdminDealsPageProps = Readonly<{
  searchParams?: {
    stage?: string;
    archive?: string;
    buyer_status?: string;
    seller_status?: string;
  };
}>;

const stageOptions = ["all", "opportunity", "interest", "offer", "contract", "transfer", "closeout", "archived"] as const;
const archiveOptions = ["all", "active", "archived"] as const;

export default async function AdminDealsPage({ searchParams }: AdminDealsPageProps) {
  const records = await getDealLifecycleRecords();
  const buyerStatusOptions = ["all", ...new Set(records.map((record) => record.buyer_status_label))];
  const sellerStatusOptions = ["all", ...new Set(records.map((record) => record.seller_status_label))];

  const selectedStage = stageOptions.includes((searchParams?.stage ?? "all") as (typeof stageOptions)[number])
    ? (searchParams?.stage ?? "all")
    : "all";
  const selectedArchive = archiveOptions.includes((searchParams?.archive ?? "all") as (typeof archiveOptions)[number])
    ? (searchParams?.archive ?? "all")
    : "all";
  const selectedBuyerStatus = searchParams?.buyer_status ?? "all";
  const selectedSellerStatus = searchParams?.seller_status ?? "all";

  const filteredRecords = records.filter((record) => {
    if (selectedStage !== "all" && record.stage !== selectedStage) {
      return false;
    }

    if (selectedArchive === "active" && record.is_archived) {
      return false;
    }

    if (selectedArchive === "archived" && !record.is_archived) {
      return false;
    }

    if (selectedBuyerStatus !== "all" && record.buyer_status_label !== selectedBuyerStatus) {
      return false;
    }

    if (selectedSellerStatus !== "all" && record.seller_status_label !== selectedSellerStatus) {
      return false;
    }

    return true;
  });

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Deal Lifecycle"
        description="Unified admin desk tying packaging, offers, contracts, transfers, closeout, and archive together."
      />

      <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-6 shadow-soft">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="All deals" value={String(records.length)} />
          <Metric label="Active" value={String(records.filter((record) => !record.is_archived).length)} />
          <Metric label="Archived" value={String(records.filter((record) => record.is_archived).length)} />
          <Metric label="Completed" value={String(records.filter((record) => record.is_completed).length)} />
        </div>

        <form className="grid gap-3 xl:grid-cols-4" method="get">
          <Field label="Stage" name="stage" value={selectedStage} options={stageOptions.map((value) => ({ value, label: value === "all" ? "All stages" : dealLifecycleStageLabel(value) }))} />
          <Field label="State" name="archive" value={selectedArchive} options={archiveOptions.map((value) => ({ value, label: value === "all" ? "All records" : value === "active" ? "Active only" : "Archived only" }))} />
          <Field label="Buyer status" name="buyer_status" value={selectedBuyerStatus} options={buyerStatusOptions.map((value) => ({ value, label: value === "all" ? "All buyer statuses" : value }))} />
          <Field label="Seller status" name="seller_status" value={selectedSellerStatus} options={sellerStatusOptions.map((value) => ({ value, label: value === "all" ? "All seller statuses" : value }))} />
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-5 py-3 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
            >
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <PageCard title="Deal queue" description="One row per packaging-anchored lifecycle chain.">
        {filteredRecords.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredRecords.map((record) => (
              <DealLifecycleCard key={record.id} record={record} href={`/admin/deals/${record.id}`} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
            No deal lifecycle records match the current filters.
          </div>
        )}
      </PageCard>

      <PageCard title="Desk notes" description="Admin-only lifecycle summary.">
        <div className="grid gap-3 text-sm leading-6 text-ink-700">
          <div>The desk follows the linked chain from packaging through archive.</div>
          <div>Portal users only see their own sanitized progress labels.</div>
          <div>Native detail pages remain the place for edits and workflow actions.</div>
        </div>
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

function Field({
  label,
  name,
  value,
  options,
}: Readonly<{
  label: string;
  name: string;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}>) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
