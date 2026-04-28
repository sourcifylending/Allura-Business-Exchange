import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { createClient } from "@/lib/supabase/server";
import type { DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export default async function DealRoomPage() {
  const client = createClient();

  const { data: buyers, error } = await (client.from("digital_asset_buyer_interest") as any)
    .select("id, buyer_email, digital_asset_id, nda_status, nda_signed_at, created_at, digital_assets(id, name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const records = (buyers || []) as (DigitalAssetBuyerInterestRow & { digital_assets: any })[];

  // Compute action counts
  const accessPending = records.filter(r => !r.nda_status || r.nda_status === "not_sent").length;
  const awaitingSignature = records.filter(r => r.nda_status === "sent").length;
  const diligenceOpen = records.filter(r => r.nda_status === "signed").length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Deal Room Command Center"
        description="Manage buyer access, NDA status, and deal progression from one place."
      />

      {/* Action Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Awaiting Access" value={accessPending} />
        <StatCard label="Awaiting NDA Signature" value={awaitingSignature} />
        <StatCard label="Diligence Open" value={diligenceOpen} />
        <StatCard label="Total Buyers" value={records.length} />
      </div>

      {/* Buyer Access Table */}
      <div className="rounded-lg border border-ink-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-200">
          <h2 className="text-lg font-semibold text-ink-900">Buyer Access Status</h2>
          <p className="mt-1 text-sm text-ink-600">Track buyer access, NDA status, and next actions</p>
        </div>

        {records.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-ink-600">No buyers yet. Start by adding a buyer to the system.</p>
            <Link
              href="/admin/buyers"
              className="mt-4 inline-block text-sm font-semibold text-accent-600 hover:text-accent-700"
            >
              Go to Buyers →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink-50 border-b border-ink-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Buyer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Asset</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Access Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">NDA Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Next Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-ink-900">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {records.map((buyer) => {
                  const ndaStatus = buyer.nda_status || "not_sent";
                  const accessStatus = ndaStatus === "signed" ? "Approved" : ndaStatus === "sent" ? "NDA Sent" : "Pending";
                  const nextAction =
                    ndaStatus === "not_sent" ? "Send NDA" :
                    ndaStatus === "sent" ? "Await Signature" :
                    ndaStatus === "signed" ? "Open Diligence" : "—";

                  return (
                    <tr key={buyer.id} className="hover:bg-ink-50">
                      <td className="px-6 py-4 text-sm text-ink-900">{buyer.buyer_email}</td>
                      <td className="px-6 py-4 text-sm text-ink-600">{(buyer.digital_assets as any)?.name || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          accessStatus === "Approved" ? "bg-green-100 text-green-800" :
                          accessStatus === "NDA Sent" ? "bg-amber-100 text-amber-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {accessStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-600">{ndaStatus}</td>
                      <td className="px-6 py-4">
                        <button className="text-sm font-semibold text-accent-600 hover:text-accent-700">
                          {nextAction}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-500">
                        {new Date(buyer.created_at || "").toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-ink-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-ink-900">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/buyers"
            className="inline-block px-4 py-2 rounded-lg bg-accent-600 text-white text-sm font-semibold hover:bg-accent-700"
          >
            Add Buyer
          </Link>
          <Link
            href="/admin/nda-management"
            className="inline-block px-4 py-2 rounded-lg border border-accent-300 bg-accent-50 text-accent-700 text-sm font-semibold hover:bg-accent-100"
          >
            Manage NDAs
          </Link>
          <Link
            href="/admin/assets"
            className="inline-block px-4 py-2 rounded-lg border border-ink-200 bg-white text-ink-900 text-sm font-semibold hover:bg-ink-50"
          >
            Manage Assets
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-4">
      <div className="text-sm font-medium text-ink-600">{label}</div>
      <div className="mt-2 text-3xl font-bold text-ink-900">{value}</div>
    </div>
  );
}

