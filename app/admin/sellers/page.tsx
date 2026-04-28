"use client";

import { PageCard } from "@/components/page-card";

export default function SellersPage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="Sellers"
        description="Manage seller accounts and submissions"
      >
        <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 p-8 text-center">
          <p className="text-sm text-ink-600">Sellers feature coming soon</p>
        </div>
      </PageCard>
    </div>
  );
}
