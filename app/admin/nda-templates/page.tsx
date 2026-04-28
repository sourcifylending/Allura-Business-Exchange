"use client";

import { PageCard } from "@/components/page-card";

export default function NdaTemplatesPage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="NDA Templates"
        description="Create and manage NDA document templates for buyer access"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-ink-200 bg-white p-4">
            <button className="rounded-lg bg-accent-700 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-800">
              Create Template
            </button>
          </div>

          <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 p-8 text-center">
            <div className="text-sm font-semibold text-ink-900">No Templates</div>
            <p className="mt-2 text-sm text-ink-600">
              Create your first NDA template to enable buyer review workflows. Templates can be customized for different asset types.
            </p>
          </div>
        </div>
      </PageCard>
    </div>
  );
}
