import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BuyerPortalPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-900">Invalid Access</h2>
        <p className="mt-2 text-sm text-red-700">No invitation token provided.</p>
      </div>
    );
  }

  const client = createAdminClient();
  const crypto = require("crypto");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const { data: buyer, error } = await (client.from("digital_asset_buyer_interest") as any)
    .select("*, digital_assets(*)")
    .eq("invite_token_hash", tokenHash)
    .single();

  if (error || !buyer) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-900">Access Denied</h2>
        <p className="mt-2 text-sm text-red-700">Invitation token not found or expired.</p>
      </div>
    );
  }

  // Check if token has expired
  if (buyer.invite_token_expires_at && new Date(buyer.invite_token_expires_at) < new Date()) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-900">Invitation Expired</h2>
        <p className="mt-2 text-sm text-red-700">
          This invitation link has expired. Please request a new invitation from the admin.
        </p>
      </div>
    );
  }

  const asset = buyer.digital_assets;
  const ndaSigned = buyer.nda_status === "signed";

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-ink-900">{asset.name}</h1>
        <p className="mt-2 text-ink-600">{asset.short_description}</p>
      </div>

      {!ndaSigned ? (
        <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-amber-900">NDA Required</h2>
            <p className="mt-2 text-sm text-amber-700">
              To access materials, you must first review and sign the NDA.
            </p>
          </div>
          <a
            href={`/portal/buyer/nda?token=${token}`}
            className="inline-block rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Review & Sign NDA
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-800">✓ NDA Signed by {buyer.nda_signed_name}</p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-ink-200 bg-white p-4">
              <h3 className="font-semibold text-ink-900">Asset Summary</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-600">Type</dt>
                  <dd className="text-ink-900">{asset.asset_type || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-600">Price</dt>
                  <dd className="text-ink-900">${asset.asking_price?.toLocaleString() || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-600">Stage</dt>
                  <dd className="text-ink-900">{asset.revenue_stage || "—"}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-ink-200 bg-white p-4">
              <h3 className="font-semibold text-ink-900">Materials</h3>
              <p className="mt-2 text-sm text-ink-600">
                Full presentation, financial data, and deal room access are available after NDA signature.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-ink-500">
        <p>Portal Access ID: {buyer.id}</p>
        <p>Buyer: {buyer.buyer_email}</p>
      </div>
    </div>
  );
}
