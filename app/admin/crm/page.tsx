"use client";

import Link from "next/link";
import { PageCard } from "@/components/page-card";

export default function CrmPage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="CRM Hub"
        description="Consolidated buyer and lead management center"
      >
        <div className="grid gap-6">
          {/* CRM Quick Stats */}
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Total Inquiries
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
              <div className="mt-1 text-xs text-ink-500">Click to manage</div>
            </div>

            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Active Buyers
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
              <div className="mt-1 text-xs text-ink-500">With portal access</div>
            </div>

            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Pending NDAs
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
              <div className="mt-1 text-xs text-ink-500">Action needed</div>
            </div>

            <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
              <div className="text-xs font-semibold text-ink-600 uppercase">
                Applications
              </div>
              <div className="mt-2 text-2xl font-bold text-ink-900">—</div>
              <div className="mt-1 text-xs text-ink-500">Under review</div>
            </div>
          </div>

          {/* CRM Navigation */}
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-600 uppercase tracking-wide">
              CRM Sections
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              <Link
                href="/admin/inquiries"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Leads & Inquiries
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Manage inbound inquiries and lead pipeline
                </div>
              </Link>

              <Link
                href="/admin/buyers"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Buyer Management
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Track active buyers and their status
                </div>
              </Link>

              <Link
                href="/admin/applications"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Applications & Review
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Review and approve buyer/seller applications
                </div>
              </Link>

              <Link
                href="/admin/buyer-interest"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Buyer Interest Tracking
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Monitor buyer interest by asset
                </div>
              </Link>

              <Link
                href="/admin/opportunities"
                className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
              >
                <div className="text-sm font-semibold text-ink-900">
                  Opportunity Mapping
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  Assign and discover buyer-asset matches
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-600 uppercase tracking-wide">
              Recent Activity
            </p>
            <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 p-6 text-center">
              <p className="text-sm text-ink-600">
                No recent CRM activity to display
              </p>
            </div>
          </div>
        </div>
      </PageCard>
    </div>
  );
}
