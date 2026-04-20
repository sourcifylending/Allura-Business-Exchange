import type { ReactNode } from "react";
import type { AssetRegistryRecord } from "@/lib/asset-registry";
import { packagingStatusLabels } from "@/lib/packaging";
import type { PackagingRecord, SellerApplicationOption } from "@/lib/packaging";

const statusOptions = Object.entries(packagingStatusLabels) as Array<
  [keyof typeof packagingStatusLabels, string]
>;

export function PackagingFormFields({
  record,
  assetOptions,
  sellerOptions,
  submitLabel,
}: Readonly<{
  record?: Partial<PackagingRecord>;
  assetOptions: AssetRegistryRecord[];
  sellerOptions: SellerApplicationOption[];
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Asset">
          <select
            name="asset_registry_id"
            defaultValue={record?.asset_registry_id ?? assetOptions[0]?.id ?? ""}
            required
            className={inputClass}
          >
            {assetOptions.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.asset_name} — {asset.slug}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={record?.status ?? "incomplete"} required className={inputClass}>
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Seller application">
        <select
          name="seller_application_id"
          defaultValue={record?.seller_application_id ?? ""}
          className={inputClass}
        >
          <option value="">No seller link yet</option>
          {sellerOptions.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.business_name} — {seller.applicant_name} ({seller.status.replaceAll("_", " ")})
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="One-line pitch">
          <input name="one_line_pitch" defaultValue={record?.one_line_pitch ?? ""} required className={inputClass} />
        </Field>
        <Field label="Buyer type">
          <input name="buyer_type" defaultValue={record?.buyer_type ?? ""} required className={inputClass} />
        </Field>
        <Field label="Short listing description">
          <textarea
            name="short_listing_description"
            defaultValue={record?.short_listing_description ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Full summary">
          <textarea
            name="full_summary"
            defaultValue={record?.full_summary ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Screenshots">
          <textarea
            name="screenshots"
            defaultValue={record?.screenshots ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Demo link">
          <input name="demo_link" defaultValue={record?.demo_link ?? ""} required className={inputClass} />
        </Field>
        <Field label="Logo / brand kit">
          <textarea
            name="logo_brand_kit"
            defaultValue={record?.logo_brand_kit ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Feature summary">
          <textarea
            name="feature_summary"
            defaultValue={record?.feature_summary ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Stack summary">
          <textarea
            name="stack_summary"
            defaultValue={record?.stack_summary ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Support scope">
          <textarea
            name="support_scope"
            defaultValue={record?.support_scope ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Transfer checklist">
          <textarea
            name="transfer_checklist"
            defaultValue={record?.transfer_checklist ?? ""}
            required
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Asking price">
          <input name="asking_price" defaultValue={record?.asking_price ?? ""} required className={inputClass} />
        </Field>
        <Field label="Portal visibility">
          <label className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-700">
            <input
              type="checkbox"
              name="portal_visible"
              defaultChecked={record?.portal_visible ?? false}
              className="h-4 w-4 rounded border-ink-300 text-accent-700 focus:ring-accent-200"
            />
            Visible to activated buyer portal users
          </label>
        </Field>
        <Field label="Portal teaser summary">
          <textarea
            name="portal_summary"
            defaultValue={record?.portal_summary ?? ""}
            rows={3}
            className={inputClass}
            placeholder="Sanitized summary for buyer portal users"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-accent-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          {submitLabel}
        </button>
        <span className="text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">
          Internal admin only
        </span>
      </div>
    </>
  );
}

function Field({
  label,
  children,
}: Readonly<{
  label: string;
  children: ReactNode;
}>) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
