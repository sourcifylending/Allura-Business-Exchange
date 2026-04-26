import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { getDigitalAssets, getStatusColor, getStatusLabel } from "@/lib/digital-assets";

export const dynamic = "force-dynamic";

export default async function DigitalAssetsPage() {
  const assets = await getDigitalAssets();

  const statusGroups = {
    for_sale: assets.filter((a) => a.status === "for_sale"),
    in_build: assets.filter((a) => a.status === "in_build"),
    sold: assets.filter((a) => a.status === "sold"),
    paused: assets.filter((a) => a.status === "paused"),
    internal: assets.filter((a) => a.status === "internal"),
  };

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Digital Assets"
        description="Manage software assets for sale without merging codebases. Track packaging, buyer interest, and sale readiness."
      />

      <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-6 shadow-soft">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Total Assets" value={String(assets.length)} />
          <Metric label="For Sale" value={String(statusGroups.for_sale.length)} />
          <Metric label="In Build" value={String(statusGroups.in_build.length)} />
        </div>
      </section>

      <PageCard title="All Assets" description="Complete inventory of digital assets under management.">
        {assets.length === 0 ? (
          <div className="rounded-lg border border-ink-200 bg-ink-50 p-6 text-center">
            <p className="text-sm text-ink-600">No assets yet. Create one to get started.</p>
            <Link
              href="/admin/digital-assets/new"
              className="mt-3 inline-block rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
            >
              Create Asset
            </Link>
          </div>
        ) : (
          <div className="grid gap-2">
            {assets.map((asset) => (
              <Link
                key={asset.id}
                href={`/admin/digital-assets/${asset.id}`}
                className="group flex items-center justify-between rounded-lg border border-ink-200 bg-ink-50/50 p-4 hover:bg-ink-50"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-ink-950 group-hover:text-accent-600">{asset.name}</h3>
                  <p className="text-xs text-ink-600">{asset.asset_type || "No type specified"}</p>
                </div>
                <div className="flex items-center gap-3">
                  {asset.asking_price && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-ink-900">${asset.asking_price.toLocaleString()}</p>
                      <p className="text-xs text-ink-600">{asset.revenue_stage || "-"}</p>
                    </div>
                  )}
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold border ${getStatusColor(asset.status)}`}>
                    {getStatusLabel(asset.status)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageCard>

      <div className="grid gap-4 md:grid-cols-2">
        {["for_sale", "in_build", "sold", "paused", "internal"].map((status) => {
          const statusAssets = statusGroups[status as keyof typeof statusGroups];
          if (statusAssets.length === 0) return null;

          return (
            <PageCard
              key={status}
              title={getStatusLabel(status)}
              description={`${statusAssets.length} asset${statusAssets.length !== 1 ? "s" : ""}`}
            >
              <div className="grid gap-2">
                {statusAssets.map((asset) => (
                  <Link
                    key={asset.id}
                    href={`/admin/digital-assets/${asset.id}`}
                    className="rounded-lg border border-ink-200 bg-ink-50/50 p-3 text-sm hover:bg-ink-50"
                  >
                    <p className="font-medium text-ink-950">{asset.name}</p>
                    {asset.asking_price && (
                      <p className="text-xs text-ink-600">${asset.asking_price.toLocaleString()}</p>
                    )}
                  </Link>
                ))}
              </div>
            </PageCard>
          );
        })}
      </div>
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
