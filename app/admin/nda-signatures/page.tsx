import { createClient } from "@/lib/supabase/server";
import { PageCard } from "@/components/page-card";
import type { DigitalAssetRow } from "@/lib/supabase/database.types";

interface NdaRecord {
  id: string;
  buyer_email: string;
  nda_status: string | null;
  nda_signed_at: string | null;
  nda_signed_name: string | null;
  digital_assets: DigitalAssetRow | null;
}

export default async function NdaSignaturesPage() {
  const supabase = createClient();

  const { data: ndaRecords } = (await supabase
    .from("digital_asset_buyer_interest")
    .select("id, buyer_email, nda_status, nda_signed_at, nda_signed_name, digital_assets(name)")
    .order("nda_signed_at", { ascending: false })
    .limit(50)) as unknown as { data: NdaRecord[] | null };

  const records = (ndaRecords || []) as NdaRecord[];
  const signedCount = records.filter((r) => r.nda_status === "signed").length;
  const pendingCount = records.filter((r) => r.nda_status !== "signed" && r.nda_status !== "rejected").length;

  return (
    <div className="grid gap-6">
      <PageCard
        title="NDA Signatures"
        description="Track signed, pending, and rejected NDA records"
      >
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Total Records
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">{records.length}</div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50/50 p-4">
              <div className="text-xs font-semibold text-green-600 uppercase">
                Signed
              </div>
              <div className="mt-2 text-2xl font-bold text-green-900">{signedCount}</div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
              <div className="text-xs font-semibold text-amber-600 uppercase">
                Pending
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-900">{pendingCount}</div>
            </div>
          </div>

          {/* Records Table */}
          {records.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-ink-200">
              <table className="w-full text-sm">
                <thead className="bg-ink-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-ink-900">Buyer Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-ink-900">Asset</th>
                    <th className="px-4 py-3 text-left font-semibold text-ink-900">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-ink-900">Signed By</th>
                    <th className="px-4 py-3 text-left font-semibold text-ink-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-ink-50">
                      <td className="px-4 py-3 text-ink-600">{record.buyer_email}</td>
                      <td className="px-4 py-3 text-ink-900 font-medium">
                        {(record.digital_assets as any)?.name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            record.nda_status === "signed"
                              ? "bg-green-100 text-green-800"
                              : record.nda_status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {record.nda_status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-600">{record.nda_signed_name || "—"}</td>
                      <td className="px-4 py-3 text-ink-600">
                        {record.nda_signed_at
                          ? new Date(record.nda_signed_at).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 p-8 text-center">
              <div className="text-sm font-semibold text-ink-900">No NDA Records</div>
              <p className="mt-2 text-sm text-ink-600">
                NDA signature records will appear here as buyers review and sign NDAs for assets.
              </p>
            </div>
          )}
        </div>
      </PageCard>
    </div>
  );
}
