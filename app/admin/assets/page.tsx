import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function AssetsPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Assets"
        description="Digital assets available for sale and in development."
      />

      <section className="grid gap-4">
        <AssetCard
          name="SourcifyLending"
          status="Ready to Sell"
          price="$650,000"
          buyers="0"
          ndas="0"
          href="/admin/digital-assets/sourcify"
        />
        <AssetCard
          name="CombatPilot AI"
          status="In Build"
          price="—"
          buyers="—"
          ndas="—"
          href="#"
        />
      </section>

      <PageCard title="Manage Assets" description="">
        <div className="text-sm text-ink-600">
          Additional digital assets will appear here as they are added to the pipeline.
        </div>
      </PageCard>
    </div>
  );
}

function AssetCard({
  name,
  status,
  price,
  buyers,
  ndas,
  href,
}: Readonly<{
  name: string;
  status: string;
  price: string;
  buyers: string;
  ndas: string;
  href: string;
}>) {
  const isActive = href !== "#";

  return (
    <Link href={href} className={isActive ? "" : "pointer-events-none"}>
      <div className={`rounded-2xl border p-6 transition ${
        isActive
          ? "border-accent-300 bg-accent-50 hover:border-accent-500 cursor-pointer"
          : "border-ink-200 bg-ink-50"
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold text-ink-900">{name}</div>
            <div className="mt-1 text-sm text-ink-600">{status}</div>
          </div>
          {isActive && <div className="text-sm font-medium text-accent-700">→ Open</div>}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-current border-opacity-10 pt-4">
          <div>
            <div className="text-xs font-semibold text-ink-500 uppercase">Asking Price</div>
            <div className="mt-1 text-sm font-semibold text-ink-900">{price}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-ink-500 uppercase">Buyers</div>
            <div className="mt-1 text-sm font-semibold text-ink-900">{buyers}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-ink-500 uppercase">NDAs</div>
            <div className="mt-1 text-sm font-semibold text-ink-900">{ndas}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
