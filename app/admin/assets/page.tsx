import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { getDigitalAssets } from "@/lib/digital-assets";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const assets = await getDigitalAssets();
  const saleAssets = assets.filter(a => a.status === "for_sale");

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Assets"
        description="Digital assets available for sale and manage buyer interest."
      />

      <PageCard title="Add New Asset" description="">
        <Link
          href="/admin/assets/new"
          className="inline-block rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 transition"
        >
          + Add Asset
        </Link>
      </PageCard>

      {saleAssets.length === 0 ? (
        <PageCard title="Assets for Sale" description="">
          <div className="rounded-lg border border-ink-200 bg-ink-50 p-8 text-center">
            <p className="text-sm text-ink-600">No assets available for sale yet. Create one to get started.</p>
          </div>
        </PageCard>
      ) : (
        <PageCard title="Assets for Sale" description={`${saleAssets.length} asset${saleAssets.length !== 1 ? "s" : ""}`}>
          <div className="grid gap-4">
            {saleAssets.map(asset => (
              <Link
                key={asset.id}
                href={`/admin/digital-assets/${asset.id}`}
                className="rounded-2xl border border-accent-300 bg-accent-50 p-6 hover:border-accent-500 hover:bg-accent-100 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold text-ink-900">{asset.name}</div>
                    <div className="mt-1 text-sm text-ink-600">{asset.asset_type || "Digital Asset"}</div>
                  </div>
                  <div className="text-sm font-medium text-accent-700">→ Manage</div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 border-t border-current border-opacity-10 pt-4">
                  <div>
                    <div className="text-xs font-semibold text-ink-500 uppercase">Asking Price</div>
                    <div className="mt-1 text-sm font-semibold text-ink-900">
                      {asset.asking_price ? `$${asset.asking_price.toLocaleString()}` : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-ink-500 uppercase">Stage</div>
                    <div className="mt-1 text-sm font-semibold text-ink-900">{asset.revenue_stage || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-ink-500 uppercase">Status</div>
                    <div className="mt-1 text-sm font-semibold text-ink-900">{asset.status}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </PageCard>
      )}
    </div>
  );
}
