import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { getDigitalAssets } from "@/lib/digital-assets";
import { createClient } from "@/lib/supabase/server";
import type { DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let assets = [];
  let buyers: DigitalAssetBuyerInterestRow[] = [];
  let activeAssets = 0;
  let buyersAwaitingNda = 0;
  let ndasSent = 0;
  let openDeals = 0;
  let sourcifyAsset = null;

  try {
    assets = await getDigitalAssets();
    activeAssets = assets.filter(a => a.status === "for_sale").length;

    const client = createClient();
    const { data: buyerInterests, error } = await (client.from("digital_asset_buyer_interest") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && buyerInterests) {
      buyers = (buyerInterests || []) as DigitalAssetBuyerInterestRow[];
      buyersAwaitingNda = buyers.filter((b) => b?.nda_status === "not_sent" || b?.nda_status === "sent").length;
      ndasSent = buyers.filter((b) => b?.nda_status === "sent").length;
      openDeals = buyers.filter((b) => b?.nda_status === "signed" && b?.status !== "closed").length;
    }

    // Find SourcifyLending asset
    sourcifyAsset = assets.find(a => a.name.toLowerCase().includes("sourcify")) || null;
  } catch (err) {
    console.error("Error loading dashboard data:", err);
    // Continue with defaults - allow page to render with zero counts
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Allura Asset Sale Dashboard"
        description="Command center for managing digital asset sales. Track buyer pipeline, NDA status, and deal progress."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Active Assets" value={String(activeAssets)} icon="📦" />
        <MetricCard title="Buyers Awaiting NDA" value={String(buyersAwaitingNda)} icon="⏳" />
        <MetricCard title="NDAs Sent" value={String(ndasSent)} icon="📄" />
        <MetricCard title="Open Deals" value={String(openDeals)} icon="🤝" />
        <MetricCard title="Total Buyers" value={String(buyers.length)} icon="👥" />
      </section>

      <PageCard title="Quick Actions" description="">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/assets/new"
            className="flex-1 rounded-lg bg-accent-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-accent-700 transition"
          >
            + Add Asset
          </Link>
          <Link
            href="/admin/buyers/new"
            className="flex-1 rounded-lg border border-accent-300 bg-accent-50 px-4 py-3 text-center text-sm font-semibold text-accent-700 hover:bg-accent-100 transition"
          >
            + Add Buyer
          </Link>
          {sourcifyAsset && (
            <Link
              href={`/admin/digital-assets/${sourcifyAsset.id}`}
              className="flex-1 rounded-lg bg-ink-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-ink-800 transition"
            >
              Manage SourcifyLending
            </Link>
          )}
        </div>
      </PageCard>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: Readonly<{
  title: string;
  value: string;
  icon: string;
}>) {
  return (
    <div className="rounded-2xl border border-accent-400 bg-ink-50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-ink-950">{title}</div>
        <div className="text-xl">{icon}</div>
      </div>
      <div className="mt-2 text-3xl font-bold text-accent-500">{value}</div>
    </div>
  );
}
