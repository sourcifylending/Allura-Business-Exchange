import type { ReactNode } from "react";
import { AssetRegistryFormFields } from "@/components/asset-registry-form-fields";
import type { AssetRegistryRecord } from "@/lib/asset-registry";
import { assetStageLabels, updateAssetRegistryRecord } from "@/lib/asset-registry";

export function AssetRegistryTable({
  records,
}: Readonly<{
  records: AssetRegistryRecord[];
}>) {
  if (records.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
        No asset registry rows have been loaded yet. Add records in Supabase to populate this view.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-ink-200 bg-white shadow-soft">
      <table className="w-full border-collapse">
        <thead className="bg-ink-50">
          <tr className="text-left text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">
            <Th>Asset</Th>
            <Th>Stage</Th>
            <Th>Paths</Th>
            <Th>Readiness</Th>
            <Th>Notes</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.asset_id} className="border-t border-ink-200 align-top">
              <Td>
                <div className="font-semibold text-ink-950">{record.asset_name}</div>
                <div className="mt-1 text-sm text-ink-600">{record.slug}</div>
                <div className="mt-1 text-xs tracking-[0.16em] text-ink-500 uppercase">
                  {record.asset_id}
                </div>
              </Td>
              <Td>
                <Badge>{assetStageLabels[record.current_stage]}</Badge>
                <div className="mt-2 text-sm text-ink-600">{record.target_buyer_type}</div>
              </Td>
              <Td>
                <div className="text-sm text-ink-700">{record.local_path}</div>
                <div className="mt-1 text-sm text-ink-700">{record.repo_url}</div>
                <div className="mt-1 text-sm text-ink-700">{record.demo_url}</div>
              </Td>
              <Td>
                <div className="text-sm text-ink-700">Code: {record.code_status}</div>
                <div className="mt-1 text-sm text-ink-700">Packaging: {record.packaging_status}</div>
                <div className="mt-1 text-sm text-ink-700">Transfer: {record.transfer_status}</div>
              </Td>
              <Td>
                <div className="text-sm leading-6 text-ink-600">{record.notes}</div>
              </Td>
              <Td>
                <details className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-3">
                  <summary className="cursor-pointer text-xs font-semibold tracking-[0.18em] text-accent-700 uppercase">
                    Edit asset
                  </summary>
                  <form action={updateAssetRegistryRecord} className="mt-4 grid gap-4">
                    <AssetRegistryFormFields record={record} submitLabel="Save asset" />
                  </form>
                </details>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: Readonly<{ children: ReactNode }>) {
  return <th className="px-5 py-4">{children}</th>;
}

function Td({ children }: Readonly<{ children: ReactNode }>) {
  return <td className="px-5 py-5">{children}</td>;
}

function Badge({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span className="inline-flex rounded-full border border-accent-200 bg-[rgb(var(--accent-soft))] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-accent-800 uppercase">
      {children}
    </span>
  );
}
