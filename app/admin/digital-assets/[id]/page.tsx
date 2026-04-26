import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import {
  getDigitalAsset,
  getDigitalAssetTasks,
  getDigitalAssetBuyerInterests,
  getStatusColor,
  getStatusLabel,
} from "@/lib/digital-assets";
import type { DigitalAssetRow } from "@/lib/supabase/database.types";
import { TasksSection } from "@/components/digital-asset-tasks-section";
import { BuyerInterestSection } from "@/components/digital-asset-buyer-interest-section";
import { NotesSection } from "@/components/digital-asset-notes-section";

export const dynamic = "force-dynamic";

type PageProps = Readonly<{
  params: {
    id: string;
  };
}>;

export default async function DigitalAssetDetailPage({ params }: PageProps) {
  const asset = await getDigitalAsset(params.id);
  const tasks = await getDigitalAssetTasks(params.id);
  const buyerInterests = await getDigitalAssetBuyerInterests(params.id);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title={asset.name}
        description={asset.short_description || "Digital asset under management"}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 grid gap-6">
          <AssetOverviewSection asset={asset} />
          <SaleInformationSection asset={asset} />
          <LinksAndPathSection asset={asset} />
        </div>

        <div className="grid gap-6">
          <StatusSection asset={asset} />
          <ReadinessSection asset={asset} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TasksSection assetId={asset.id} initialTasks={tasks} />
        <BuyerInterestSection assetId={asset.id} initialInterests={buyerInterests} />
      </div>

      <NotesSection asset={asset} assetId={asset.id} />
    </div>
  );
}

function AssetOverviewSection({ asset }: Readonly<{ asset: DigitalAssetRow }>) {
  return (
    <PageCard title="Overview" description="Core asset information">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Asset Type</label>
          <p className="text-sm text-ink-900">{asset.asset_type || "—"}</p>
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Build Status</label>
          <p className="text-sm text-ink-900">{asset.build_status || "—"}</p>
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Revenue Stage</label>
          <p className="text-sm text-ink-900">{asset.revenue_stage || "—"}</p>
        </div>
        {asset.short_description && (
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Description</label>
            <p className="text-sm text-ink-700">{asset.short_description}</p>
          </div>
        )}
      </div>
    </PageCard>
  );
}

function SaleInformationSection({ asset }: Readonly<{ asset: DigitalAssetRow }>) {
  return (
    <PageCard title="Sale Information" description="Pricing and buyer materials">
      <div className="grid gap-4">
        {asset.asking_price && (
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Asking Price</label>
            <p className="text-2xl font-bold text-ink-950">${asset.asking_price.toLocaleString()}</p>
          </div>
        )}
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Visibility</label>
          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                asset.visibility === "public"
                  ? "bg-green-100 text-green-900 border-green-200"
                  : "bg-amber-100 text-amber-900 border-amber-200"
              }`}
            >
              {asset.visibility === "public" ? "Public" : "Private"}
            </span>
            {asset.nda_required && (
              <span className="rounded-full px-3 py-1 text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-900">
                NDA Required
              </span>
            )}
          </div>
        </div>
        {asset.buyer_summary && (
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Buyer Summary</label>
            <p className="text-sm text-ink-700">{asset.buyer_summary}</p>
          </div>
        )}
      </div>
    </PageCard>
  );
}

function LinksAndPathSection({ asset }: Readonly<{ asset: DigitalAssetRow }>) {
  const links = [
    { label: "Public URL", value: asset.public_url || undefined },
    { label: "Admin URL", value: asset.admin_url || undefined },
    { label: "GitHub Repo", value: asset.github_repo_url || undefined },
    { label: "Vercel Project", value: asset.vercel_project_url || undefined },
    { label: "Supabase Project", value: asset.supabase_project_url || undefined },
  ];

  return (
    <PageCard title="Links & Access" description="External links and resources (admin only)">
      <div className="grid gap-3">
        {links
          .filter((link) => link.value)
          .map((link) => (
            <div key={link.label}>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">{link.label}</label>
              <a
                href={link.value || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-600 hover:text-accent-700 break-all"
              >
                {link.value}
              </a>
            </div>
          ))}
        {asset.local_path && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Local Path</label>
            <p className="text-xs text-ink-600 font-mono">{asset.local_path}</p>
          </div>
        )}
        {links.filter((link) => link.value).length === 0 && !asset.local_path && (
          <p className="text-sm text-ink-600">No links configured yet.</p>
        )}
      </div>
    </PageCard>
  );
}

function StatusSection({ asset }: Readonly<{ asset: DigitalAssetRow }>) {
  return (
    <PageCard title="Status" description="">
      <div className={`rounded-xl border p-4 text-center ${getStatusColor(asset.status)}`}>
        <p className="text-xs font-semibold uppercase tracking-wide">Current Status</p>
        <p className="mt-2 text-2xl font-bold">{getStatusLabel(asset.status)}</p>
      </div>
    </PageCard>
  );
}

function ReadinessSection({ asset }: Readonly<{ asset: DigitalAssetRow }>) {
  const readinessPercentage = asset.sale_readiness_score || 0;

  return (
    <PageCard title="Sale Readiness" description="">
      <div className="grid gap-3">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-600">Readiness Score</span>
            <span className="text-sm font-bold text-ink-900">{readinessPercentage}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-ink-200 overflow-hidden">
            <div
              className="h-full bg-accent-500 transition-all"
              style={{ width: `${Math.min(readinessPercentage, 100)}%` }}
            />
          </div>
        </div>
        <div className="text-xs text-ink-600">
          {readinessPercentage === 0 && "No readiness assessment yet."}
          {readinessPercentage > 0 && readinessPercentage < 50 && "Early stage preparation."}
          {readinessPercentage >= 50 && readinessPercentage < 80 && "Good progress toward readiness."}
          {readinessPercentage >= 80 && "Nearly ready for sale."}
        </div>
      </div>
    </PageCard>
  );
}
