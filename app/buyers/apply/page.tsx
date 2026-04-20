import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";
import { BuyerApplicationForm } from "@/components/buyer-application-form";
import { createBuyerApplication } from "@/lib/applications";
import Link from "next/link";

type BuyerApplyPageProps = Readonly<{
  searchParams?: {
    submitted?: string;
    error?: string;
  };
}>;

export default function BuyerApplyPage({ searchParams }: BuyerApplyPageProps) {
  return (
    <SiteShell
      eyebrow="Buyers"
      title="Apply to buy through Allura"
      description="Buyer access is approval-first. Submit an application, then wait for internal review and invitation."
    >
      {searchParams?.submitted ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgba(160, 120, 50, 0.96)] px-5 py-4 text-sm font-medium text-accent-700 shadow-soft">
          Application submitted. Our team will review it before any access is granted.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-[rgba(52,18,26,0.96)] px-5 py-4 text-sm font-medium text-rose-700 shadow-soft">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard
          title="Buyer application"
          description="Applications are stored as submissions only. No live portal account is created until approval."
        >
          <form action={createBuyerApplication} className="grid gap-5">
            <BuyerApplicationForm />
          </form>
        </PageCard>

        <PageCard
          title="What happens next"
          description="A simple review path keeps buyer access controlled and deliberate."
        >
          <div className="grid gap-3">
            {[
              "Submitted to the application queue",
              "Reviewed by the internal team",
              "Approved or rejected manually",
              "Invited only after approval",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--surface-strong))] text-xs font-semibold text-accent-700 shadow-sm">
                  0{index + 1}
                </span>
                <span className="text-sm font-medium text-ink-800">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-600">
            Already exploring?{" "}
            <Link href="/buyers" className="font-semibold text-accent-700 hover:text-accent-600">
              Return to the buyer overview
            </Link>
            .
          </div>
        </PageCard>
      </div>
    </SiteShell>
  );
}
