import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { crmOperationsItems } from "@/lib/navigation";

export default function CrmPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="CRM / Operations"
        description="Central hub for asset management, buyer discovery, and business intake operations."
      />
      <PageCard
        title="Operations Hub"
        description="Access key operational workflows and pipelines."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {crmOperationsItems.filter((item) => item.href).map((item) => (
            <Link
              key={item.href}
              href={item.href!}
              className="flex items-center justify-between rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-medium text-ink-500 transition hover:border-accent-500 hover:text-accent-700"
            >
              <span>{item.label}</span>
              <span aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
