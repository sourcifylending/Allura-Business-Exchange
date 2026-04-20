import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";
import Link from "next/link";

export default function BuyersPage() {
  return (
    <SiteShell
      eyebrow="Buyers"
      title="Browse curated assets with clear access rules"
      description="Free accounts can browse, save opportunities, and request deeper access where required."
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard
          title="Buyer access"
          description="Approval-first buyer access. Applications are reviewed before invitation or activation."
        >
          <div className="grid gap-3">
            {[
              "Browse public opportunities",
              "Save time with a vetted application",
              "Wait for manual review and invitation",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
                <div className="text-sm font-medium text-ink-900">{item}</div>
              </div>
            ))}
          </div>
        </PageCard>
        <PageCard
          title="Apply to buy"
          description="Use the vetted application path instead of a public instant signup."
        >
          <div className="grid gap-3">
            <Link
              href="/buyers/apply"
              className="flex items-center justify-between rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-medium text-ink-500 transition hover:border-accent-500 hover:text-accent-700"
            >
              <span>Open buyer application</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </PageCard>
      </div>
    </SiteShell>
  );
}
