"use client";

import Link from "next/link";
import { PageCard } from "@/components/page-card";

export default function MessagesPage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="Messages & Insights"
        description="Communications, market data, and activity logs"
      >
        <div className="grid gap-3">
          <Link
            href="/admin/market-radar"
            className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
          >
            <div className="text-sm font-semibold text-ink-900">
              Market Radar
            </div>
            <div className="mt-1 text-xs text-ink-600">
              Monitor market opportunities and trends
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
              System activity and user actions
            </div>
          </Link>
        </div>
      </PageCard>
    </div>
  );
}
