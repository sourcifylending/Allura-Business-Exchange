import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default async function AdminPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Allura Asset Sale Dashboard"
        description="Command center for managing digital asset sales. Track buyer pipeline, NDA status, and deal progress."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Active Assets" value="1" icon="📦" />
        <MetricCard title="Buyers Awaiting NDA" value="0" icon="⏳" />
        <MetricCard title="NDAs Sent" value="0" icon="📄" />
        <MetricCard title="Open Deals" value="0" icon="🤝" />
        <MetricCard title="Follow-Ups Due" value="0" icon="📞" />
      </section>

      <PageCard title="Quick Actions" description="">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/assets"
            className="flex-1 rounded-lg bg-accent-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-accent-700 transition"
          >
            Add Asset
          </Link>
          <Link
            href="/admin/buyers"
            className="flex-1 rounded-lg border border-accent-300 bg-accent-50 px-4 py-3 text-center text-sm font-semibold text-accent-700 hover:bg-accent-100 transition"
          >
            Add Buyer
          </Link>
          <Link
            href="/admin/digital-assets"
            className="flex-1 rounded-lg bg-ink-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-ink-800 transition"
          >
            Manage SourcifyLending
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
    <div className="rounded-2xl border border-accent-400 bg-ink-900 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-white">{title}</div>
        <div className="text-xl">{icon}</div>
      </div>
      <div className="mt-2 text-3xl font-bold text-accent-400">{value}</div>
    </div>
  );
}
