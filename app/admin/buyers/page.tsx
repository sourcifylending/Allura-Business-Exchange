import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default async function BuyersPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Buyers"
        description="Manage buyer inquiries, NDA status, and deal pipeline for all assets."
      />

      <PageCard title="SourcifyLending Buyers" description="Active prospects for SourcifyLending sale">
        <div className="rounded-lg border border-ink-200 bg-ink-50 p-8 text-center">
          <div className="text-sm text-ink-600">No buyers have shown interest yet.</div>
          <Link
            href="/admin/digital-assets"
            className="mt-4 inline-block rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
          >
            Add Buyer Interest
          </Link>
        </div>
      </PageCard>

      <PageCard title="Buyer Pipeline Status" description="">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Stage label="New Leads" count="0" />
          <Stage label="NDA Sent" count="0" />
          <Stage label="NDA Signed" count="0" />
          <Stage label="Reviewing" count="0" />
          <Stage label="Offer Stage" count="0" />
          <Stage label="Closed / Dead" count="0" />
        </div>
      </PageCard>

      <PageCard title="About Buyers" description="">
        <div className="text-sm text-ink-600 space-y-2">
          <p>Buyers are added from the Assets page when they show interest in a specific asset.</p>
          <p>From this view, manage buyer communications, track NDA signatures, and move deals through the pipeline.</p>
        </div>
      </PageCard>
    </div>
  );
}

function Stage({
  label,
  count,
}: Readonly<{
  label: string;
  count: string | number;
}>) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-4">
      <div className="text-xs font-semibold text-ink-500 uppercase">{label}</div>
      <div className="mt-2 text-2xl font-bold text-ink-900">{count}</div>
    </div>
  );
}
