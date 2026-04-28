"use client";

import Link from "next/link";
import { PageCard } from "@/components/page-card";

export default function DiligencePage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="Diligence Room"
        description="Manage due diligence processes, underwriting, and deal progression"
      >
        <div className="space-y-6">
          {/* Diligence Stats */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Active Deals in Diligence
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
            </div>

            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Pending Underwriting
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
            </div>

            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                In Transfer
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
            </div>
          </div>

          {/* Diligence Workflows */}
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-600 uppercase tracking-wide">
              Diligence Workflows
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Link
                href="/admin/underwriting"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Underwriting
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Manage underwriting requests and financial reviews
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
                  Track asset and ownership transfers
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

              <Link
                href="/admin/deal-room"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Deal Room
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Buyer access to deal documents and materials
                </div>
              </Link>
            </div>
          </div>

          {/* Empty State */}
          <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 p-6 text-center">
            <p className="text-sm text-ink-600">
              Active diligence processes will be tracked here as deals progress through underwriting, document exchange, and transfer completion.
            </p>
          </div>
        </div>
      </PageCard>
    </div>
  );
}
