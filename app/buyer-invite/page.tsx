import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";
import { BuyerNdaSignForm } from "@/components/buyer-nda-sign-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyBuyerInviteToken } from "@/lib/invite-tokens";

export const dynamic = "force-dynamic";

type BuyerInvitePageProps = Readonly<{
  searchParams?: {
    token?: string;
    signed?: string;
  };
}>;

type BuyerInviteRecord = {
  id: string;
  buyer_name?: string | null;
  buyer_email?: string | null;
  nda_status: string;
  nda_signed_date?: string | null;
  digital_asset_id: string;
  digital_assets?: {
    name?: string | null;
    asking_price?: number | null;
    short_description?: string | null;
    buyer_summary?: string | null;
  } | null;
};

type LoadInviteResult = { error: string } | { record: BuyerInviteRecord };

const SOURCIFY_SLIDES = [
  {
    title: "SourcifyLending Asset Sale",
    body: "Software asset, established brand, operating workflows, portal infrastructure, and early recurring revenue model for qualified buyers.",
  },
  {
    title: "Asset Overview",
    body: "SourcifyLending was established in 2019 and repositioned into an AI-powered business credit advisory platform.",
  },
  {
    title: "What Is Included",
    body: "Public website, client portal, analyzer, admin tools, onboarding workflows, business process assets, and documented operating structure.",
  },
  {
    title: "Revenue Model",
    body: "Recurring advisory model with active paying clients and room to scale through monthly programs, buyer execution, partner referrals, and lead reactivation.",
  },
  {
    title: "Buyer Opportunity",
    body: "Best fit for fintech operators, business credit companies, funding advisors, agencies, SaaS operators, and service providers working with small business owners.",
  },
  {
    title: "Platform Components",
    body: "Analyzer, onboarding, task tracking, client portal, admin dashboard, partner infrastructure, billing-ready structure, support workflow, and internal operations tools.",
  },
  {
    title: "Lead Database",
    body: "Includes an aged MCA/business funding lead database that may support reactivation and outbound campaigns, depending on buyer execution and compliance.",
  },
  {
    title: "Growth Path",
    body: "Reactivate leads, run partner campaigns, improve SEO, recruit sales support, strengthen onboarding, increase conversion, and grow recurring revenue.",
  },
  {
    title: "Transition Plan",
    body: "Asset handoff, system walkthrough, workflow explanation, account transfer coordination where applicable, and limited post-closing support.",
  },
  {
    title: "Next Steps",
    body: "Review materials, ask questions, schedule a buyer call, submit offer, and proceed to purchase agreement if both sides agree.",
  },
];

async function loadInvite(token: string): Promise<LoadInviteResult> {
  const verified = verifyBuyerInviteToken(token);

  if (!verified.ok) {
    return { error: verified.error || "Invalid invite link." };
  }

  const client = createAdminClient();

  if (!client) {
    return { error: "Portal access is temporarily unavailable." };
  }

  const { data, error } = await (client.from("digital_asset_buyer_interest") as any)
    .select("id,buyer_name,buyer_email,nda_status,nda_signed_date,digital_asset_id,digital_assets(name,asking_price,short_description,buyer_summary)")
    .eq("id", verified.buyerId)
    .single();

  if (error || !data) {
    return { error: "Invite record was not found." };
  }

  return { record: data as BuyerInviteRecord };
}

export default async function BuyerInvitePage({ searchParams }: BuyerInvitePageProps) {
  const token = searchParams?.token;

  if (!token) {
    return <InviteError message="Invite token is missing." />;
  }

  const result = await loadInvite(token);

  if ("error" in result) {
    return <InviteError message={result.error} />;
  }

  const { record } = result;
  const asset = record.digital_assets;
  const assetName = asset?.name || "Asset Review";
  const isSigned = record.nda_status === "signed";
  const isSourcify = assetName.toLowerCase().includes("sourcifylending");

  return (
    <SiteShell
      eyebrow="Secure Buyer Access"
      title={`${assetName} Deal Room`}
      description="Private asset review access through Allura Business Exchange."
      showPublicNav={false}
      showSignInCta={false}
      showHeroPanel={false}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PageCard title="Buyer access" description="This secure link is tied to one buyer and one asset.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div><strong>Buyer:</strong> {record.buyer_name || record.buyer_email || "Invited buyer"}</div>
            <div><strong>Email:</strong> {record.buyer_email || "Not provided"}</div>
            <div><strong>Asset:</strong> {assetName}</div>
            <div><strong>NDA Status:</strong> {record.nda_status.replaceAll("_", " ")}</div>
          </div>
        </PageCard>

        {!isSigned ? (
          <PageCard title="NDA required" description="You must sign the NDA before full materials are unlocked.">
            <div className="grid gap-5">
              <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
                <p>
                  By signing below, you agree to keep all information about {assetName} confidential and to use it only to evaluate a potential asset acquisition through Allura Business Exchange.
                </p>
                <p className="mt-3">
                  You also agree not to contact clients, leads, vendors, partners, affiliates, or related parties without written permission from Allura Business Exchange.
                </p>
              </div>

              <BuyerNdaSignForm token={token} />
            </div>
          </PageCard>
        ) : (
          <PageCard title="Materials unlocked" description="NDA signed. You may now review the approved buyer materials for this asset.">
            <div className="grid gap-4 text-sm leading-6 text-ink-700">
              {searchParams?.signed ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 font-medium text-green-900">
                  NDA signed successfully. Materials are now unlocked.
                </div>
              ) : null}

              {isSourcify ? (
                <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
                  <div className="text-xs font-semibold tracking-[0.18em] text-ink-500 uppercase">Presentation</div>
                  <h2 className="mt-1 text-lg font-semibold text-ink-950">SourcifyLending Asset Sale Presentation</h2>
                  <div className="mt-4 grid gap-3">
                    {SOURCIFY_SLIDES.map((slide, index) => (
                      <div key={slide.title} className="rounded-2xl border border-ink-200 bg-[rgba(17,19,22,0.92)] p-4 text-white">
                        <div className="text-xs font-semibold tracking-[0.18em] text-accent-300 uppercase">Slide {index + 1}</div>
                        <h3 className="mt-2 text-lg font-semibold">{slide.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-ink-300">{slide.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
                <div className="text-xs font-semibold tracking-[0.18em] text-ink-500 uppercase">Buyer Summary</div>
                <p className="mt-2">{asset?.buyer_summary || asset?.short_description || "Buyer summary is being prepared."}</p>
              </div>
              <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
                <div className="text-xs font-semibold tracking-[0.18em] text-ink-500 uppercase">Asking Price</div>
                <p className="mt-2 font-semibold text-ink-950">
                  {typeof asset?.asking_price === "number" ? `$${asset.asking_price.toLocaleString()}` : "Available upon review"}
                </p>
              </div>
              <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
                <div className="text-xs font-semibold tracking-[0.18em] text-ink-500 uppercase">Next Step</div>
                <p className="mt-2">Reply to the invitation email with any questions or to schedule the next buyer review call.</p>
              </div>
            </div>
          </PageCard>
        )}
      </div>
    </SiteShell>
  );
}

function InviteError({ message }: Readonly<{ message: string }>) {
  return (
    <SiteShell
      eyebrow="Secure Buyer Access"
      title="Invite access issue"
      description="This secure invite cannot be opened."
      showPublicNav={false}
      showSignInCta={false}
      showHeroPanel={false}
    >
      <PageCard title="Access issue" description="The invite link could not be verified.">
        <p className="text-sm leading-6 text-ink-700">{message}</p>
      </PageCard>
    </SiteShell>
  );
}
