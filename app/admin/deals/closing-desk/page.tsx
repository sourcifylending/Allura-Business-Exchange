import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { closingStatusLabels, closingStatusOrder, getClosingDeskRecords } from "@/lib/closing-ops";

export const dynamic = "force-dynamic";

export default async function AdminClosingDeskPage() {
  const closings = await getClosingDeskRecords();
  const activeClosings = closings.filter((closing) => closing.closing_status !== "closed" && closing.closing_status !== "cancelled");
  const activeCount = activeClosings.length;
  const closedCount = closings.filter((closing) => closing.closing_status === "closed").length;
  const paymentReceivedCount = closings.filter((closing) => closing.payment_status === "payment_received").length;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Closing Desk"
        description="Track purchase agreement, payment, transfer checklist, and closure in one operator view."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <Metric label="Active" value={activeCount} />
        <Metric label="Payment received" value={paymentReceivedCount} />
        <Metric label="Closed" value={closedCount} />
      </section>

      <PageCard
        title="Active closings"
        description="Each card shows the current closing stage, buyer-visible status, and the next operator action."
      >
        {activeClosings.length > 0 ? (
          <div className="grid gap-4">
            {activeClosings.map((closing) => (
              <article key={closing.id} className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">{closing.asset_name}</div>
                    <div className="mt-1 text-sm leading-6 text-ink-600">
                      Buyer: {closing.buyer_name} {closing.buyer_email ? `• ${closing.buyer_email}` : ""}
                    </div>
                  </div>
                  <div className="grid justify-items-end gap-2">
                    <StatusPill label={closingStatusLabels[closing.closing_status]} tone={closing.closing_status === "closed" ? "emerald" : "default"} />
                    <StatusPill label={closing.buyer_visible_status} tone="muted" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Info label="Purchase agreement" value={closing.purchase_agreement_status.replaceAll("_", " ")} />
                  <Info label="Payment" value={closing.payment_status.replaceAll("_", " ")} />
                  <Info label="Transfer" value={closing.transfer_status.replaceAll("_", " ")} />
                  <Info label="Checklist complete" value={`${closing.checklist_complete}/${closing.checklist_total}`} />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/admin/deals/closing-desk/${closing.id}`}
                    className="rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-600"
                  >
                    Open closing desk
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
            No active closings are loaded yet.
          </div>
        )}
      </PageCard>

      <PageCard title="Closing stages" description="Canonical closing stages tracked in the desk.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {closingStatusOrder.map((status) => (
            <div key={status} className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{status.replaceAll("_", " ")}</div>
              <div className="mt-1 text-sm font-semibold text-ink-800">{closingStatusLabels[status]}</div>
            </div>
          ))}
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
  value: number;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-ink-950">{value}</div>
    </div>
  );
}

function StatusPill({
  label,
  tone = "default",
}: Readonly<{
  label: string;
  tone?: "default" | "muted" | "emerald";
}>) {
  const className =
    tone === "emerald"
      ? "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700"
      : tone === "muted"
        ? "border-ink-200 bg-[rgb(var(--surface))] text-ink-700"
        : "border-accent-200 bg-[rgba(160,120,50,0.96)] text-accent-700";

  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${className}`}>
      {label}
    </span>
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
