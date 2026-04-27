import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function DocumentsPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Documents"
        description="Generated documents for asset sales, NDA packages, and buyer communications."
      />

      <section className="grid gap-4">
        <DocumentCard
          name="Non-Disclosure Agreement (NDA)"
          description="Legal confidentiality agreement for buyers"
          status="Ready"
          action="Generate from buyer workspace"
        />
        <DocumentCard
          name="Pre-NDA Buyer Summary"
          description="2-3 page overview of the asset"
          status="Ready"
          action="Generate from buyer workspace"
        />
        <DocumentCard
          name="Post-NDA Presentation"
          description="12-slide acquisition presentation"
          status="Ready"
          action="Generate from buyer workspace"
        />
        <DocumentCard
          name="Data Room Checklist"
          description="5-tier document staging guide"
          status="Ready"
          action="Generate from buyer workspace"
        />
        <DocumentCard
          name="Buyer Follow-Up Email"
          description="Copy-ready email templates"
          status="Ready"
          action="Generate from buyer workspace"
        />
      </section>

      <PageCard title="How to Use" description="">
        <div className="text-sm text-ink-600 space-y-2">
          <p>All documents are generated dynamically from the buyer workspace.</p>
          <p>Click "Manage SourcifyLending Sale" from the dashboard to open the workspace and generate documents for any buyer.</p>
          <p>Documents render in the dashboard and can be exported as PDF using your browser's print function.</p>
        </div>
      </PageCard>
    </div>
  );
}

function DocumentCard({
  name,
  description,
  status,
  action,
}: Readonly<{
  name: string;
  description: string;
  status: string;
  action: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-ink-900">{name}</div>
          <div className="mt-1 text-sm text-ink-600">{description}</div>
        </div>
        <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">{status}</div>
      </div>
      <div className="mt-4 text-xs font-medium text-ink-600">{action}</div>
    </div>
  );
}
