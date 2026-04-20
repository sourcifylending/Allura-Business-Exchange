import type { ReactNode } from "react";
import {
  assetCodeStatusLabels,
  assetHostingStatusLabels,
  assetListingStatusLabels,
  assetOwnershipTypeLabels,
  assetPackagingStatusLabels,
  assetStageLabels,
  assetTransferStatusLabels,
} from "@/lib/asset-registry";
import type { AssetRegistryRecord } from "@/lib/asset-registry";

const stageOptions = Object.entries(assetStageLabels) as Array<[keyof typeof assetStageLabels, string]>;
const hostingOptions = Object.entries(assetHostingStatusLabels) as Array<
  [keyof typeof assetHostingStatusLabels, string]
>;
const codeOptions = Object.entries(assetCodeStatusLabels) as Array<[keyof typeof assetCodeStatusLabels, string]>;
const packagingOptions = Object.entries(assetPackagingStatusLabels) as Array<
  [keyof typeof assetPackagingStatusLabels, string]
>;
const listingOptions = Object.entries(assetListingStatusLabels) as Array<
  [keyof typeof assetListingStatusLabels, string]
>;
const ownershipOptions = Object.entries(assetOwnershipTypeLabels) as Array<
  [keyof typeof assetOwnershipTypeLabels, string]
>;
const transferOptions = Object.entries(assetTransferStatusLabels) as Array<
  [keyof typeof assetTransferStatusLabels, string]
>;

export function AssetRegistryFormFields({
  record,
  submitLabel,
}: Readonly<{
  record?: Partial<AssetRegistryRecord>;
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Asset name">
          <input name="asset_name" defaultValue={record?.asset_name ?? ""} required className={inputClass} />
        </Field>
        <Field label="Slug">
          <input name="slug" defaultValue={record?.slug ?? ""} required className={inputClass} />
        </Field>
        <Field label="Niche">
          <input name="niche" defaultValue={record?.niche ?? ""} required className={inputClass} />
        </Field>
        <Field label="Target buyer type">
          <input
            name="target_buyer_type"
            defaultValue={record?.target_buyer_type ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Current stage">
          <select name="current_stage" defaultValue={record?.current_stage ?? "idea"} required className={inputClass}>
            {stageOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ownership type">
          <select name="ownership_type" defaultValue={record?.ownership_type ?? "individual"} required className={inputClass}>
            {ownershipOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Local path">
          <input name="local_path" defaultValue={record?.local_path ?? ""} required className={inputClass} />
        </Field>
        <Field label="Repository URL">
          <input name="repo_url" defaultValue={record?.repo_url ?? ""} required className={inputClass} />
        </Field>
        <Field label="Live URL">
          <input name="live_url" defaultValue={record?.live_url ?? ""} required className={inputClass} />
        </Field>
        <Field label="Demo URL">
          <input name="demo_url" defaultValue={record?.demo_url ?? ""} required className={inputClass} />
        </Field>
        <Field label="Domain">
          <input name="domain" defaultValue={record?.domain ?? ""} required className={inputClass} />
        </Field>
        <Field label="Asking price">
          <input name="asking_price" defaultValue={record?.asking_price ?? ""} required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Hosting status">
          <select
            name="hosting_status"
            defaultValue={record?.hosting_status ?? "not_deployed"}
            required
            className={inputClass}
          >
            {hostingOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Code status">
          <select name="code_status" defaultValue={record?.code_status ?? "not_started"} required className={inputClass}>
            {codeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Packaging status">
          <select
            name="packaging_status"
            defaultValue={record?.packaging_status ?? "incomplete"}
            required
            className={inputClass}
          >
            {packagingOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Listing status">
          <select
            name="listing_status"
            defaultValue={record?.listing_status ?? "not_ready"}
            required
            className={inputClass}
          >
            {listingOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Transfer status">
          <select
            name="transfer_status"
            defaultValue={record?.transfer_status ?? "not_ready"}
            required
            className={inputClass}
          >
            {transferOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Notes">
        <textarea name="notes" defaultValue={record?.notes ?? ""} required rows={4} className={inputClass} />
      </Field>

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
