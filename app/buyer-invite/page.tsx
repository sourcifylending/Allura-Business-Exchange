import { SiteShell } from "@/components/site-shell";
import { PageCard } from "@/components/page-card";
import { BuyerNdaSignForm } from "@/components/buyer-nda-sign-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyBuyerInviteToken } from "@/lib/invite-tokens";

export const dynamic = "force-dynamic";

const SOURCIFY_PRESENTATION_URL = "https://www.beautiful.ai/player/-OrJXUfzHcgg6tdTg_z-?showControls=true";

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
    presentation_title?: string | null;
    presentation_embed_url?: string | null;
    presentation_public_url?: string | null;
    presentation_status?: string | null;
  } | null;
};

type LoadInviteResult =
  | { error: string }
  | { record: BuyerInviteRecord };

function getPresentation(asset: BuyerInviteRecord["digital_assets"], assetName: string) {
  const dbPresentationUrl = asset?.presentation_status === "active" ? asset.presentation_embed_url : null;
  const dbPublicUrl = asset?.presentation_status === "active" ? asset.presentation_public_url : null;

  if (dbPresentationUrl) {
    return {
      title: asset?.presentation_title || `${assetName} Asset Presentation`,
      embedUrl: dbPresentationUrl,
      publicUrl: dbPublicUrl || dbPresentationUrl,
    };
  }

  if (assetName.toLowerCase().includes("sourcifylending")) {
    return {
      title: "SourcifyLending Asset Sale Presentation",
      embedUrl: SOURCIFY_PRESENTATION_URL,
      publicUrl: SOURCIFY_PRESENTATION_URL,
    };
  }

  return null;
}

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
    .select("id,buyer_name,buyer_email,nda_status,nda_signed_date,digital_asset_id,digital_assets(*)")
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
  const presentation = getPresentation(asset, assetName);

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

              {presentation ? (
                <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-xs font-semibold tracking-[0.18em] text-ink-500 uppercase">Presentation</div>
                      <h2 className="mt-1 text-lg font-semibold text-ink-950">{presentation.title}</h2>
                    </div>
                    <a
                      href={presentation.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-accent-600 px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-accent-700"
                    >
                      Open Full Presentation
                    </a>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-ink-200 bg-black">
                    <iframe
                      src={presentation.embedUrl}
                      title={presentation.title}
                      className="h-[420px] w-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
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
