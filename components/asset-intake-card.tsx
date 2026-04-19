import type { AssetIntakeRecord } from "@/lib/asset-registry";

export function AssetIntakeCard({
  record,
}: Readonly<{
  record: AssetIntakeRecord;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-accent-200 bg-[rgb(var(--accent-soft))] p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        New Asset Intake
      </div>
      <h3 className="mt-2 text-2xl font-semibold text-ink-950">{record.product_asset_name}</h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">{record.feature_summary}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Detail label="Brand" value={record.brand_name} />
        <Detail label="Owner" value={record.owner_name} />
        <Detail label="Ownership" value={record.ownership_type} />
        <Detail label="Entity / LLC" value={record.entity_llc || "none"} />
        <Detail label="DBA" value={record.dba || "none"} />
        <Detail label="Revenue" value={record.revenue_status} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniBlock label="Repo" value={record.repo_url} />
        <MiniBlock label="Demo" value={record.demo_url} />
        <MiniBlock label="Path" value={record.local_path} />
        <MiniBlock label="Risks" value={record.risk_flags.join(", ")} />
      </div>
    </article>
  );
}

function Detail({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink-900">{value}</div>
    </div>
  );
}

function MiniBlock({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-700">{value}</div>
    </div>
  );
}

