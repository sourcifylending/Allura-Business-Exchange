import type { PackagingRecord } from "@/lib/packaging";
import type { AssetRegistryRecord } from "@/lib/asset-registry";
import type { SellerApplicationOption } from "@/lib/packaging";
import { PackagingFormFields } from "@/components/packaging-form-fields";
import { PackagingStatusPill } from "@/components/packaging-status-pill";
import { updatePackagingRecord } from "@/lib/packaging";

export function PackagingCard({
  record,
  editable = false,
  assetOptions = [],
  sellerOptions = [],
}: Readonly<{
  record: PackagingRecord;
  editable?: boolean;
  assetOptions?: AssetRegistryRecord[];
  sellerOptions?: SellerApplicationOption[];
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Packaging Queue
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{record.asset_name}</h3>
          <div className="mt-1 text-sm text-ink-600">{record.asset_slug}</div>
        </div>
        <PackagingStatusPill status={record.status} />
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-600">{record.full_summary}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Info label="One-line pitch" value={record.one_line_pitch} />
        <Info label="Buyer type" value={record.buyer_type} />
        <Info label="Asking price" value={record.asking_price} />
        <Info label="Portal visibility" value={record.portal_visible ? "Visible" : "Hidden"} />
        <Info label="Screenshots" value={record.screenshots} />
        <Info label="Demo link" value={record.demo_link} />
        <Info label="Brand kit" value={record.logo_brand_kit} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4 sm:grid-cols-2">
        <Mini label="Feature summary" value={record.feature_summary} />
        <Mini label="Stack summary" value={record.stack_summary} />
        <Mini label="Support scope" value={record.support_scope} />
        <Mini label="Transfer checklist" value={record.transfer_checklist} />
      </div>

      <div className="mt-5 rounded-2xl border border-ink-200 bg-white p-4 text-sm text-ink-600">
        Short listing description: {record.short_listing_description}
      </div>

      <div className="mt-4 rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
        Portal teaser summary: {record.portal_summary || "Not set yet. Add a sanitized teaser for buyer portal users."}
      </div>

      <div className="mt-4 rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
        Seller link:{" "}
        {record.seller_application_id
          ? sellerOptions.find((seller) => seller.id === record.seller_application_id)?.business_name ??
            "Linked seller application"
          : "Not linked yet"}
      </div>

      {editable ? (
        <details className="mt-5 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold tracking-[0.16em] text-accent-700 uppercase">
            Edit packaging
          </summary>
          <form action={updatePackagingRecord} className="mt-5 grid gap-5">
            <PackagingFormFields
              record={record}
              assetOptions={assetOptions}
              sellerOptions={sellerOptions}
              submitLabel="Save packaging"
            />
          </form>
        </details>
      ) : null}
    </article>
  );
}

function Info({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

function Mini({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-700">{value}</div>
    </div>
  );
}
