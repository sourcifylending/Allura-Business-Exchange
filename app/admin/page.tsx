import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default async function AdminPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Admin Dashboard"
        description="Asset sale command center for managing SourcifyLending and future digital assets."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <OperatingCard
          title="SourcifyLending Asset Sale"
          status="Active"
          detail="Ready for buyer acquisition"
          color="bg-green-50 border-green-200"
        />
        <OperatingCard
          title="CombatPilot AI"
          status="In Build"
          detail="Development in progress"
          color="bg-blue-50 border-blue-200"
        />
        <OperatingCard title="Buyers Awaiting NDA" status="0" detail="No active pending" color="bg-amber-50 border-amber-200" />
        <OperatingCard title="Follow-Ups Due" status="0" detail="All current" color="bg-purple-50 border-purple-200" />
        <OperatingCard title="Open Deals" status="0" detail="Pipeline ready" color="bg-pink-50 border-pink-200" />
      </section>

      <PageCard title="Quick Actions" description="">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/assets"
            className="flex-1 rounded-lg bg-accent-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-accent-700 transition"
          >
            Manage SourcifyLending Sale
          </Link>
          <Link
            href="/admin/buyers"
            className="flex-1 rounded-lg border border-accent-300 bg-accent-50 px-4 py-3 text-center text-sm font-semibold text-accent-700 hover:bg-accent-100 transition"
          >
            Add Buyer
          </Link>
        </div>
      </PageCard>
    </div>
  );
}

function OperatingCard({
  title,
  status,
  detail,
  color,
}: Readonly<{
  title: string;
  status: string;
  detail: string;
  color: string;
}>) {
  return (
    <div className={`rounded-2xl border p-4 ${color}`}>
      <div className="text-sm font-medium text-ink-900">{title}</div>
      <div className="mt-2 text-2xl font-bold text-ink-950">{status}</div>
      <div className="mt-1 text-xs text-ink-600">{detail}</div>
    </div>
  );
}
