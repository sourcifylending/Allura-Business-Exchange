import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { getAdminReportingDashboard } from "@/lib/reporting";

export const dynamic = "force-dynamic";

export default async function AdminReportingPage() {
  const report = await getAdminReportingDashboard();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Reporting"
        description="Admin-only operational reporting for pipeline health, conversion, compliance, and completion."
      />

      {report.kpis.length > 0 ? (
        <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-6 shadow-soft">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {report.kpis.map((metric) => (
              <KpiCard key={metric.label} metric={metric} />
            ))}
          </div>
        </section>
      ) : (
        <PageCard title="Reporting" description="No reporting data is currently available.">
          <div className="text-sm leading-6 text-ink-700">
            The reporting dashboard is admin-only and uses existing pipeline, request, and closeout rows.
          </div>
        </PageCard>
      )}

      <PageCard title="Stage conversion" description="Counts are derived from the existing packaging to archive chain.">
        <ReportingTable
          columns={["Stage", "Count", "Rate", "Note"]}
          rows={report.funnelRows.map((row) => [row.label, formatCount(row.count), row.rate, row.note])}
          emptyMessage="No stage conversion data is available yet."
        />
      </PageCard>

      <PageCard title="Aging and turnaround" description="Timing analysis uses existing submission, contract, transfer, and request timestamps.">
        <ReportingTable
          columns={["Area", "Count", "Average", "Median", "Note"]}
          rows={report.agingRows.map((row) => [row.label, formatCount(row.count), daysText(row.averageDays), daysText(row.medianDays), row.note])}
          emptyMessage="No aging data is available yet."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <StatPill label="Overdue request buckets" value={report.overdueBuckets.length.toString()} />
          <StatPill label="Due soon threshold" value="3 days" />
          <StatPill label="Stalled threshold" value="10 days" />
        </div>
        {report.overdueBuckets.length > 0 ? (
          <div className="mt-5">
            <ReportingTable
              columns={["Bucket", "Count", "Note"]}
              rows={report.overdueBuckets.map((row) => [row.label, formatCount(row.count), row.detail])}
              emptyMessage="No overdue bucket data is available yet."
            />
          </div>
        ) : null}
      </PageCard>

      <PageCard title="Request and document compliance" description="Request coverage and document review are tracked using existing portal request and upload rows.">
        <div className="grid gap-6 xl:grid-cols-2">
          <ReportingTable
            columns={["Request compliance", "Count", "Detail"]}
            rows={report.requestComplianceRows.map((row) => [row.label, formatCount(row.count), row.detail])}
            emptyMessage="No request compliance rows are available yet."
          />
          <ReportingTable
            columns={["Document compliance", "Count", "Detail"]}
            rows={report.documentComplianceRows.map((row) => [row.label, formatCount(row.count), row.detail])}
            emptyMessage="No document compliance rows are available yet."
          />
        </div>
      </PageCard>

      <PageCard title="Completion and archive" description="Closeout and archive metrics are grounded in the transfer workflow and archive timestamps.">
        <ReportingTable
          columns={["Completion row", "Count", "Detail"]}
          rows={report.completionRows.map((row) => [row.label, formatCount(row.count), row.detail])}
          emptyMessage="No completion rows are available yet."
        />
      </PageCard>

      <PageCard title="Export-ready tables" description="These tables are intentionally flat and copy-friendly. File export is not required to use them.">
        <div className="grid gap-5">
          {report.exportTables.map((table) => (
            <ReportingTableSection key={table.title} title={table.title} columns={table.columns} rows={table.rows} />
          ))}
        </div>
      </PageCard>

      <PageCard title="Reporting notes" description="Admin-only notes about what the dashboard is and is not doing.">
        <div className="grid gap-3 text-sm leading-6 text-ink-700">
          <div>All metrics are derived from existing operational tables.</div>
          <div>No public analytics, chat, payments, escrow, or direct buyer/seller exposure were added.</div>
          <div>Exports are table-ready; a separate export pipeline is intentionally deferred because it is not required here.</div>
        </div>
      </PageCard>
    </div>
  );
}

function KpiCard({
  metric,
}: Readonly<{
  metric: { label: string; value: number; detail: string; href: string };
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{metric.label}</div>
      <div className="mt-2 text-3xl font-semibold text-ink-950">{formatCount(metric.value)}</div>
      <div className="mt-2 text-sm leading-6 text-ink-600">{metric.detail}</div>
      <Link href={metric.href} className="mt-4 inline-flex text-sm font-semibold text-accent-700 transition hover:text-accent-600">
        View source
      </Link>
    </div>
  );
}

function StatPill({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink-950">{value}</div>
    </div>
  );
}

function ReportingTableSection({
  title,
  columns,
  rows,
}: Readonly<{
  title: string;
  columns: string[];
  rows: string[][];
}>) {
  return (
    <div className="rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5">
      <div className="mb-4 text-lg font-semibold text-ink-950">{title}</div>
      <ReportingTable columns={columns} rows={rows} emptyMessage="No data available." />
    </div>
  );
}

function ReportingTable({
  columns,
  rows,
  emptyMessage,
}: Readonly<{
  columns: string[];
  rows: string[][];
  emptyMessage: string;
}>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 px-5 py-6 text-sm leading-6 text-ink-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200">
      <table className="min-w-full divide-y divide-ink-200 text-left text-sm">
        <thead className="bg-[rgba(25,27,31,0.96)] text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-200 bg-[rgb(var(--surface))]">
          {rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row[0] ?? "row"}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top text-ink-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function daysText(value: number | null) {
  if (value === null) {
    return "Not enough data";
  }

  return `${value} day${value === 1 ? "" : "s"}`;
}
