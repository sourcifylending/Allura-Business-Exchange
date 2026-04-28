"use client";

import Link from "next/link";
import { PageCard } from "@/components/page-card";

export default function SellersPage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="Sellers & Asset Sources"
        description="Manage seller relationships and asset submissions"
      >
        <div className="grid gap-6">
          {/* Seller Stats */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Total Sellers
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
            </div>

            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                New Submissions
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
            </div>

            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Active Assets
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
            </div>
          </div>

          {/* Seller Operations */}
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-600 uppercase tracking-wide">
              Operations
            </p>
            <div className="grid gap-2">
              <Link
                href="/admin/business-submissions"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Business Submissions
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Review and manage incoming asset submissions
                </div>
              </Link>
            </div>
          </div>

          {/* Empty State */}
          <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 p-6 text-center">
            <p className="text-sm text-ink-600">
              Seller accounts and submission data will appear here once integrated with your seller pipeline.
            </p>
          </div>
        </div>
      </PageCard>
    </div>
  );
}
