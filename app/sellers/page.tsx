import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";
import Link from "next/link";

export default function SellersPage() {
  return (
    <SiteShell
      eyebrow="Sellers"
      title="Submit assets through a controlled intake"
      description="This shell supports controlled submissions for digital assets and selected business opportunities."
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard
          title="Submission path"
          description="Approval-first seller submissions keep the catalog controlled and credible."
        >
          <div className="grid gap-3">
            {[
              "Submit asset details for review",
              "Wait for an internal decision",
              "Receive an invite only if approved",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
                <div className="text-sm font-medium text-ink-900">{item}</div>
              </div>
            ))}
          </div>
        </PageCard>
        <PageCard
          title="Apply to sell"
          description="Use the vetted application path instead of a public instant signup."
        >
          <div className="grid gap-3">
            <Link
              href="/sellers/apply"
              className="flex items-center justify-between rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-medium text-ink-500 transition hover:border-accent-500 hover:text-accent-700"
            >
              <span>Open seller application</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </PageCard>
      </div>
    </SiteShell>
  );
}
