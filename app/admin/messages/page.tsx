"use client";

import Link from "next/link";
import { PageCard } from "@/components/page-card";

export default function MessagesPage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="Messages & Insights"
        description="Monitor communications, market trends, and system activity"
      >
        <div className="space-y-6">
          {/* Communication Stats */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Unread Messages
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
            </div>

            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Open Inquiries
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
            </div>

            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Last Activity
              </div>
              <div className="mt-2 text-sm font-medium text-ink-900">—</div>
            </div>
          </div>

          {/* Insights & Activity */}
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-600 uppercase tracking-wide">
              Intelligence & Monitoring
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Link
                href="/admin/market-radar"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Market Radar
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Monitor market trends and opportunity signals
                </div>
              </Link>

              <Link
                href="/admin/activity"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Activity Log
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  System events and user actions audit trail
                </div>
              </Link>

              <Link
                href="/admin/inquiries"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Inquiries
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Manage buyer and seller inquiries and follow-ups
                </div>
              </Link>
            </div>
          </div>

          {/* Empty State */}
          <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 p-6 text-center">
            <p className="text-sm text-ink-600">
              Messages, communications, and insights will be consolidated here as your deal flow increases.
            </p>
          </div>
        </div>
      </PageCard>
    </div>
  );
}
