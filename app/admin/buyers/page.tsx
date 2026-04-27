import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { getDigitalAssets } from "@/lib/digital-assets";
import { createClient } from "@/lib/supabase/server";
import type { DigitalAssetBuyerInterestRow, DigitalAssetRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export default async function BuyersPage() {
  let assets: DigitalAssetRow[] = [];
  let buyers: DigitalAssetBuyerInterestRow[] = [];
  let error: string | null = null;

  try {
    assets = await getDigitalAssets();
    const client = createClient();
    const { data: buyerInterests, error: dbError } = await (client.from("digital_asset_buyer_interest") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (dbError) {
      error = "Unable to load buyers. The database may still be initializing.";
      console.error("Database error:", dbError);
    } else {
      buyers = (buyerInterests || []) as DigitalAssetBuyerInterestRow[];
    }
  } catch (err) {
    error = "Error loading buyer data";
    console.error("Error:", err);
  }

  const buyersAwaitingNda = buyers.filter((b) => b?.nda_status === "sent" || b?.nda_status === "not_sent").length;
  const buyersWithSignedNda = buyers.filter((b) => b?.nda_status === "signed").length;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Buyers"
        description="Manage buyer inquiries, NDA status, and deal pipeline for all assets."
      />

      {error && (
        <PageCard title="Notice" description="">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {error}
          </div>
        </PageCard>
      )}

      <PageCard title="Add New Buyer" description="">
        <Link
          href="/admin/buyers/new"
          className="inline-block rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 transition"
        >
          + Add Buyer
        </Link>
      </PageCard>

      <PageCard title="Buyer Pipeline Status" description="">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <PipelineStage label="Total Buyers" count={buyers.length} />
          <PipelineStage label="Awaiting NDA" count={buyers.filter(b => b.nda_status === "not_sent" || b.nda_status === "sent").length} />
          <PipelineStage label="NDA Signed" count={buyersWithSignedNda} />
          <PipelineStage label="New Leads" count={buyers.filter(b => b.status === "new").length} />
          <PipelineStage label="Interested" count={buyers.filter(b => b.status === "interested").length} />
          <PipelineStage label="Closed" count={buyers.filter(b => b.status === "closed" || b.nda_status === "declined").length} />
        </div>
      </PageCard>

      {buyers.length > 0 && (
        <PageCard title="Recent Buyers" description={`${buyers.length} total buyer${buyers.length !== 1 ? "s" : ""}`}>
          <div className="grid gap-3">
            {buyers.slice(0, 10).map(buyer => (
              <Link
                key={buyer.id}
                href={`/admin/digital-assets/${buyer.digital_asset_id}?tab=buyers&buyerId=${buyer.id}`}
                className="rounded-lg border border-ink-200 bg-white p-4 hover:bg-ink-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-ink-900">{buyer.buyer_name || "Unnamed Buyer"}</h3>
                    <p className="text-xs text-ink-600">{buyer.buyer_email}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">NDA Status</div>
                    <div className={`mt-1 rounded px-2 py-1 text-xs font-medium ${
                      buyer.nda_status === "signed"
                        ? "bg-green-100 text-green-800"
                        : buyer.nda_status === "sent"
                        ? "bg-blue-100 text-blue-800"
                        : buyer.nda_status === "declined"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {buyer.nda_status}
                    </div>
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

function PipelineStage({
  label,
  count,
}: Readonly<{
  label: string;
  count: string | number;
}>) {
  return (
    <div className="rounded-lg border border-accent-300 bg-accent-50 p-4">
      <div className="text-xs font-semibold text-ink-600 uppercase">{label}</div>
      <div className="mt-2 text-2xl font-bold text-accent-700">{count}</div>
    </div>
  );
}
