"use client";

import Link from "next/link";
import { PageCard } from "@/components/page-card";

export default function NdaManagementPage() {
  return (
    <div className="grid gap-6">
      <PageCard
        title="NDA Management"
        description="Manage NDA templates and signatures"
      >
        <div className="grid gap-4">
          <Link
            href="/admin/nda-templates"
            className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
          >
            <div className="text-sm font-semibold text-ink-900">
              NDA Templates
            </div>
            <div className="mt-1 text-xs text-ink-600">
              Create and manage NDA templates
            </div>
          </Link>

          <Link
            href="/admin/nda-signatures"
            className="rounded-lg border border-ink-200 bg-white p-4 transition hover:border-accent-200 hover:bg-accent-50"
          >
            <div className="text-sm font-semibold text-ink-900">
              NDA Signatures
            </div>
            <div className="mt-1 text-xs text-ink-600">
              Track signed NDAs and signature requests
            </div>
          </Link>
        </div>
      </PageCard>
    </div>
  );
}
