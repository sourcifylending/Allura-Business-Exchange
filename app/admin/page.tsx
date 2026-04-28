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

  // Get action items
  const needsActions = buyers.filter(b =>
    !b.nda_status || b.nda_status === "not_sent" || b.nda_status === "sent"
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Allura Asset Sale Dashboard"
        description="Command center for managing digital asset sales. Track buyer pipeline, NDA status, and deal progress."
      />

      {/* Priority Action Summary */}
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-semibold text-amber-900">Today's Priority Actions</h2>
        {needsActions.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {needsActions.slice(0, 3).map(buyer => {
              const action = !buyer.nda_status || buyer.nda_status === "not_sent"
                ? "Send NDA"
                : "Follow up on NDA signature";
              return (
                <li key={buyer.id} className="flex items-center justify-between text-sm">
                  <span className="text-amber-900">{buyer.buyer_email}: {action}</span>
                  <button className="text-amber-700 hover:text-amber-900 font-semibold">→</button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-amber-800">No urgent actions needed. All buyers are on track.</p>
        )}
      </section>

      {/* Metrics */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Active Assets" value={String(activeAssets)} icon="📦" />
        <MetricCard title="Buyers Awaiting NDA" value={String(buyersAwaitingNda)} icon="⏳" />
        <MetricCard title="NDAs Sent" value={String(ndasSent)} icon="📄" />
        <MetricCard title="Open Deals" value={String(openDeals)} icon="🤝" />
        <MetricCard title="Total Buyers" value={String(buyers.length)} icon="👥" />
      </section>

      {/* Quick Actions */}
      <PageCard title="Quick Actions" description="">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/assets"
            className="flex-1 rounded-lg bg-accent-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-accent-700 transition"
          >
            Manage Assets
          </Link>
          <Link
            href="/admin/deal-room"
            className="flex-1 rounded-lg border border-accent-300 bg-accent-50 px-4 py-3 text-center text-sm font-semibold text-accent-700 hover:bg-accent-100 transition"
          >
            View Deal Room
          </Link>
          <Link
            href="/admin/buyers"
            className="flex-1 rounded-lg border border-ink-200 bg-white px-4 py-3 text-center text-sm font-semibold text-ink-900 hover:bg-ink-50 transition"
          >
            Manage Buyers
          </Link>
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
