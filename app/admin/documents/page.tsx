import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { getDigitalAssets } from "@/lib/digital-assets";
import { createClient } from "@/lib/supabase/server";
import type { DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const assets = await getDigitalAssets();
  const client = createClient();
  const { data: buyerInterests } = await (client.from("digital_asset_buyer_interest") as any)
    .select("*")
    .order("created_at", { ascending: false });

  const buyers = (buyerInterests || []) as DigitalAssetBuyerInterestRow[];

  const templates = [
    {
      name: "Non-Disclosure Agreement (NDA)",
      description: "Legal confidentiality agreement. Auto-fills buyer name, asset name, date, and Florida law language.",
      type: "nda",
    },
    {
      name: "Buyer Summary",
      description: "2-3 page executive overview of the asset and opportunity.",
      type: "summary",
    },
    {
      name: "Buyer Presentation",
      description: "12-slide acquisition presentation with financial highlights.",
      type: "presentation",
    },
    {
      name: "Data Room Checklist",
      description: "5-tier document staging guide for due diligence.",
      type: "checklist",
    },
    {
      name: "Buyer Follow-Up Email",
      description: "Copy-ready email templates for buyer communications.",
      type: "email",
    },
  ];

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Documents"
        description="Generate and export documents for asset sales, NDA packages, and buyer communications."
      />

      <PageCard title="Available Templates" description={`${templates.length} document templates ready to generate`}>
        <div className="grid gap-4">
          {templates.map((template) => (
            <div key={template.type} className="rounded-2xl border border-accent-300 bg-accent-50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-ink-900">{template.name}</div>
                  <div className="mt-1 text-sm text-ink-600">{template.description}</div>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Ready</div>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {buyers.length > 0 ? (
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-ink-600 mb-2">Generate for:</label>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                      {buyers.slice(0, 5).map(buyer => (
                        <Link
                          key={`${template.type}-${buyer.id}`}
                          href={`/admin/digital-assets/${buyer.digital_asset_id}?tab=buyers&buyerId=${buyer.id}&template=${template.type}`}
                          className="text-left rounded px-3 py-2 text-xs font-medium text-accent-700 border border-accent-300 hover:bg-white transition"
                        >
                          {buyer.buyer_name || "Unnamed Buyer"} ({buyer.buyer_email})
                        </Link>
                      ))}
                      {buyers.length > 5 && (
                        <Link
                          href="/admin/buyers"
                          className="text-left rounded px-3 py-2 text-xs font-medium text-ink-600 border border-ink-300 hover:bg-white transition"
                        >
                          View all {buyers.length} buyers...
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-xs text-ink-600">
                      No buyers added yet.{" "}
                      <Link href="/admin/buyers" className="text-accent-600 hover:text-accent-700">
                        Add a buyer
                      </Link>{" "}
                      to generate documents.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </PageCard>

      <PageCard title="How Document Generation Works" description="">
        <div className="text-sm text-ink-600 space-y-3">
          <div>
            <h4 className="font-medium text-ink-900 mb-1">📄 NDA (Non-Disclosure Agreement)</h4>
            <p>Auto-fills: Buyer name, asset name, seller name (Allura), date, and Florida law language. Exports as PDF.</p>
          </div>
          <div>
            <h4 className="font-medium text-ink-900 mb-1">📊 Buyer Summary &amp; Presentation</h4>
            <p>Custom overviews tailored to the specific asset. Pre-populated with asset pricing, stage, and opportunity details.</p>
          </div>
          <div>
            <h4 className="font-medium text-ink-900 mb-1">📧 Email Templates</h4>
            <p>Copy-ready email text for buyer outreach. Includes buyer name and asset name placeholders.</p>
          </div>
          <div>
            <h4 className="font-medium text-ink-900 mb-1">✅ Workflow</h4>
            <ol className="list-decimal list-inside text-xs space-y-1 ml-2">
              <li>Select a template from the list above</li>
              <li>Choose a buyer</li>
              <li>Review the generated document</li>
              <li>Export as PDF or copy text</li>
              <li>Send or update the buyer's NDA status</li>
            </ol>
          </div>
        </div>
      </PageCard>
    </div>
  );
}
