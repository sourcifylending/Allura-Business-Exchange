import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export const dynamic = "force-dynamic";

export default async function AdminDealsPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Deals"
        description="Track buyer-to-asset deals from NDA through closing."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <Metric label="Total Deals" value="0" />
        <Metric label="Active" value="0" />
        <Metric label="Closed" value="0" />
      </section>

      <PageCard title="SourcifyLending Deals" description="Active buyer-to-SourcifyLending connections">
        <div className="rounded-lg border border-ink-200 bg-ink-50 p-8 text-center">
          <div className="text-sm text-ink-600">No active deals yet.</div>
          <Link
            href="/admin/assets"
            className="mt-4 inline-block rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
          >
            Manage Sale
          </Link>
        </div>
      </PageCard>

      <PageCard title="Deal Stages" description="">
        <div className="grid gap-3 sm:grid-cols-2">
          <Stage label="NDA Sent" count="0" />
          <Stage label="NDA Signed" count="0" />
          <Stage label="Reviewing" count="0" />
          <Stage label="Offer Stage" count="0" />
          <Stage label="Contract" count="0" />
          <Stage label="Closed" count="0" />
        </div>
      </PageCard>
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
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="text-xs font-semibold text-ink-500 uppercase">{label}</div>
      <div className="mt-2 text-2xl font-bold text-ink-900">{value}</div>
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
