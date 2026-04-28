"use client";

import { PageCard } from "@/components/page-card";

export default function NdaSignaturesPage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="NDA Signatures"
        description="Track signed NDAs and pending signatures"
      >
        <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 p-8 text-center">
          <p className="text-sm text-ink-600">NDA signatures feature coming soon</p>
        </div>
      </PageCard>
    </div>
  );
}
