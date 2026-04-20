import Link from "next/link";
import { redirect } from "next/navigation";
import { PageCard } from "@/components/page-card";
import { PortalAccessSummary } from "@/components/portal-access-summary";
import { PortalShell } from "@/components/portal-shell";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { resolvePortalAccessForSession } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

type PortalPageProps = Readonly<{
  searchParams?: {
    error?: string;
    activated?: string;
  };
}>;

export default async function PortalPage({ searchParams }: PortalPageProps) {
  if (searchParams?.error) {
    return (
      <PortalShell
        eyebrow="Invite portal"
        title="Portal access issue"
        description="The portal invite needs attention before access can continue."
        role="buyer"
        navItems={portalNavItemsForRole("buyer")}
        accountName="Allura account"
        accountEmail="Not linked"
      >
        <PageCard title="Access issue" description="The current invite could not be completed.">
          <p className="text-sm leading-6 text-ink-700">{searchParams.error}</p>
          <div className="mt-4">
            <Link href="/" className="font-semibold text-accent-700 hover:text-accent-600">
              Return to the public site
            </Link>
          </div>
        </PageCard>
      </PortalShell>
    );
  }

  const access = await resolvePortalAccessForSession();

  if (access.kind === "unauthenticated") {
    redirect("/");
  }

  if (access.kind === "conflict") {
    return (
      <PortalShell
        eyebrow="Invite portal"
        title="Portal access conflict"
        description="This account has conflicting buyer and seller application links."
        role="buyer"
        navItems={portalNavItemsForRole("buyer")}
        accountName="Conflicted portal access"
        accountEmail="Not available"
      >
        <PageCard title="Access conflict" description="Manual review is required to resolve this account.">
          <p className="text-sm leading-6 text-ink-700">
            We detected both buyer and seller portal records for the current account. To avoid
            guessing, portal access is paused until the application records are corrected.
          </p>
        </PageCard>
      </PortalShell>
    );
  }

  if (access.kind === "none") {
    return (
      <PortalShell
        eyebrow="Invite portal"
        title="No active portal access"
        description="This account is signed in, but no activated portal record is linked yet."
        role="buyer"
        navItems={portalNavItemsForRole("buyer")}
        accountName="Portal account"
        accountEmail="Not linked"
      >
        <PageCard title="Access not ready" description="Portal access is invite-only and must be approved first.">
          <p className="text-sm leading-6 text-ink-700">
            If you just received an invite, please open the invitation email and finish the
            activation flow. If you expected access already, contact the Allura team.
          </p>
        </PageCard>
      </PortalShell>
    );
  }

  if (access.kind === "buyer") {
    const record = access.record;

    return (
      <PortalShell
        eyebrow="Invite portal"
        title="Buyer portal hub"
        description="Controlled access for invited buyer users. This is the buyer portal foundation."
        role="buyer"
        navItems={portalNavItemsForRole("buyer")}
        accountName={record.applicant_name}
        accountEmail={record.email}
        accountType="Buyer portal"
        status={record.status}
      >
        {searchParams?.activated ? (
          <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
            Portal access activated successfully.
          </div>
        ) : null}

        {record.status === "invited" ? (
          <PageCard title="Activation pending" description="The invite has not been fully activated yet.">
            <p className="text-sm leading-6 text-ink-700">
              Please finish the invite email flow. Once the invited account authenticates successfully,
              the portal will activate.
            </p>
          </PageCard>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <PortalAccessSummary
              title="Buyer account summary"
              description="This linked application is the source of truth for your portal access."
              record={record}
              accountTypeLabel="Buyer portal"
              summaryItems={[
                { label: "Buyer type", value: record.buyer_type },
                { label: "Budget", value: record.budget_range },
                { label: "Niches of interest", value: record.niches_of_interest.join(", ") || "None" },
                { label: "Asset preferences", value: record.asset_preferences.join(", ") || "None" },
                { label: "Proof of funds", value: record.proof_of_funds_status },
                { label: "Urgency", value: record.urgency },
              ]}
            />

            <div className="grid gap-6">
              <PageCard title="Next steps" description="The buyer workspace grows from this foundation.">
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>Review your approved access details</div>
                  <div>Use the curated opportunities surface</div>
                  <div>Visit documents when supporting files are ready</div>
                </div>
              </PageCard>

              <PageCard title="Current access" description="Invite-only portal access remains controlled and role-safe.">
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>Status: {record.status.replaceAll("_", " ")}</div>
                  <div>Linked user: {record.linked_user_id ?? "Pending"}</div>
                  <div>Admin approval: required</div>
                </div>
              </PageCard>

              <PageCard title="Controlled foundation" description="No public signup or bypass route exists here.">
                <div className="grid gap-3 text-sm leading-6 text-ink-700">
                  <div>Portal access remains separate from public application submit.</div>
                  <div>Admin approval remains the gatekeeper.</div>
                  <div>More features will be layered in later phases.</div>
                </div>
              </PageCard>
            </div>
          </div>
        )}
      </PortalShell>
    );
  }

  const record = access.record;

  return (
    <PortalShell
      eyebrow="Invite portal"
      title="Seller portal hub"
      description="Controlled access for invited seller users. This is the seller portal foundation."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      {searchParams?.activated ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Portal access activated successfully.
        </div>
      ) : null}

      {record.status === "invited" ? (
        <PageCard title="Activation pending" description="The invite has not been fully activated yet.">
          <p className="text-sm leading-6 text-ink-700">
            Please finish the invite email flow. Once the invited account authenticates successfully,
            the portal will activate.
          </p>
        </PageCard>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <PortalAccessSummary
            title="Seller account summary"
            description="This linked application is the source of truth for your portal access."
            record={record}
            accountTypeLabel="Seller portal"
            summaryItems={[
              { label: "Business name", value: record.business_name },
              { label: "Industry", value: record.industry },
              { label: "Website", value: record.website || "Not provided" },
              { label: "Asset type", value: record.asset_type },
              { label: "Asking range", value: record.asking_price_range },
            ]}
          />

          <div className="grid gap-6">
            <PageCard title="Next steps" description="The seller workspace grows from this foundation.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>Review your approved access details</div>
                <div>Prepare the business summary and documents</div>
                <div>Use packaging and closeout tools later when ready</div>
              </div>
            </PageCard>

            <PageCard title="Review progress" description="The current access state and what happens next.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>Status: {record.status.replaceAll("_", " ")}</div>
                <div>Linked user: {record.linked_user_id ?? "Pending"}</div>
                <div>Invite-only activation: complete</div>
              </div>
            </PageCard>

            <PageCard title="Controlled foundation" description="No public signup or bypass route exists here.">
              <div className="grid gap-3 text-sm leading-6 text-ink-700">
                <div>Portal access remains separate from public application submit.</div>
                <div>Admin approval remains the gatekeeper.</div>
                <div>More features will be layered in later phases.</div>
              </div>
            </PageCard>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
