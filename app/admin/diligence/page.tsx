"use client";

import Link from "next/link";
import { PageCard } from "@/components/page-card";

export default function DiligencePage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="Diligence"
        description="Manage due diligence processes and underwriting"
      >
        <div className="grid gap-3">
          <Link
            href="/admin/underwriting"
            className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
          >
            <div className="text-sm font-semibold text-ink-900">
              Underwriting
            </div>
            <div className="mt-1 text-xs text-ink-600">
              Manage underwriting requests and reviews
            </div>
          </Link>

          <Link
            href="/admin/transfers"
            className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
          >
            <div className="text-sm font-semibold text-ink-900">
              Transfers
            </div>
            <div className="mt-1 text-xs text-ink-600">
              Track asset and document transfers
            </div>
          </Link>

          <Link
            href="/admin/reporting"
            className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
          >
            <div className="text-sm font-semibold text-ink-900">
              Reporting
            </div>
            <div className="mt-1 text-xs text-ink-600">
              Diligence reports and documentation
            </div>
          </Link>
        </div>
      </PageCard>
    </div>
  );
}
