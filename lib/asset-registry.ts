import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AssetRegistryRow } from "@/lib/supabase/database.types";

export type OwnershipType = "individual" | "llc" | "dba";

export type CodeStatus = "not_started" | "in_progress" | "ready" | "needs_work";

export type DeploymentStatus = "not_deployed" | "staging" | "live" | "held";

export type TransferStatus = "not_ready" | "drafting" | "ready" | "in_progress";

export type AssetStage =
  | "idea"
  | "research"
  | "build"
  | "packaging"
  | "ready_to_list"
  | "listed";

export type AssetIntakeRecord = Readonly<{
  id: string;
  product_asset_name: string;
  brand_name: string;
  owner_name: string;
  ownership_type: OwnershipType;
  entity_llc: string;
  dba: string;
  asset_category: string;
  niche_target: string;
  target_buyer_type: string;
  live_url: string;
  code_repo_status: CodeStatus;
  domain_control: string;
  hosting_provider: string;
  deployment_status: DeploymentStatus;
  screenshots_demo: string;
  logo_brand_files: string;
  feature_summary: string;
  revenue_status: "pre-revenue" | "early revenue" | "MRR";
  third_party_apis_tools: string;
  documentation_status: string;
  admin_transferability: string;
  support_training_availability: string;
  transfer_checklist_status: TransferStatus;
  risk_flags: string[];
  local_path: string;
  repo_url: string;
  demo_url: string;
}>;

export type AssetRegistryRecord = Readonly<Omit<AssetRegistryRow, "created_at" | "updated_at">>;

export const assetHostingStatusLabels = {
  not_deployed: "Not Deployed",
  local: "Local",
  staging: "Staging",
  live: "Live",
  held: "Held",
} as const;

export const assetCodeStatusLabels = {
  not_started: "Not Started",
  in_progress: "In Progress",
  ready: "Ready",
  needs_work: "Needs Work",
} as const;

export const assetPackagingStatusLabels = {
  incomplete: "Incomplete",
  draft_ready: "Draft Ready",
  approved: "Approved",
} as const;

export const assetListingStatusLabels = {
  not_ready: "Not Ready",
  draft: "Draft",
  listed: "Listed",
} as const;

export const assetOwnershipTypeLabels = {
  individual: "Individual",
  llc: "LLC",
  dba: "DBA",
} as const;

export const assetTransferStatusLabels = {
  not_ready: "Not Ready",
  drafting: "Drafting",
  ready: "Ready",
  in_progress: "In Progress",
} as const;

export const assetIntakeRecords: AssetIntakeRecord[] = [
  {
    id: "asset-01",
    product_asset_name: "ReplyPilot",
    brand_name: "ReplyPilot",
    owner_name: "Allura",
    ownership_type: "individual",
    entity_llc: "",
    dba: "",
    asset_category: "AI Workflow Tool",
    niche_target: "Service businesses",
    target_buyer_type: "Owner-operators",
    live_url: "https://replypilot.example",
    code_repo_status: "ready",
    domain_control: "secured",
    hosting_provider: "local",
    deployment_status: "staging",
    screenshots_demo: "Demo screenshots available",
    logo_brand_files: "Logo + brand kit saved",
    feature_summary: "AI inbox triage and intake routing.",
    revenue_status: "pre-revenue",
    third_party_apis_tools: "Email provider, forms",
    documentation_status: "draft ready",
    admin_transferability: "clear",
    support_training_availability: "basic handoff notes",
    transfer_checklist_status: "drafting",
    risk_flags: ["no live customer data"],
    local_path: "02-assets/replypilot",
    repo_url: "https://repo.local/replypilot",
    demo_url: "https://demo.local/replypilot",
  },
  {
    id: "asset-02",
    product_asset_name: "ScopeFlow",
    brand_name: "ScopeFlow",
    owner_name: "Allura",
    ownership_type: "llc",
    entity_llc: "Allura Labs LLC",
    dba: "ScopeFlow",
    asset_category: "AI Sales Tool",
    niche_target: "Agencies",
    target_buyer_type: "Agency founders",
    live_url: "https://scopeflow.example",
    code_repo_status: "in_progress",
    domain_control: "secured",
    hosting_provider: "local",
    deployment_status: "held",
    screenshots_demo: "Prototype demo available",
    logo_brand_files: "Brand files saved",
    feature_summary: "Discovery-to-scope assistant.",
    revenue_status: "pre-revenue",
    third_party_apis_tools: "Calendar, docs",
    documentation_status: "draft ready",
    admin_transferability: "partial",
    support_training_availability: "one-page guide",
    transfer_checklist_status: "not_ready",
    risk_flags: ["feature scope still moving"],
    local_path: "02-assets/scopeflow",
    repo_url: "https://repo.local/scopeflow",
    demo_url: "https://demo.local/scopeflow",
  },
  {
    id: "asset-03",
    product_asset_name: "BriefSpark",
    brand_name: "BriefSpark",
    owner_name: "Allura",
    ownership_type: "dba",
    entity_llc: "",
    dba: "BriefSpark",
    asset_category: "Operations Tool",
    niche_target: "Operations teams",
    target_buyer_type: "Ops managers",
    live_url: "https://briefspark.example",
    code_repo_status: "needs_work",
    domain_control: "secured",
    hosting_provider: "local",
    deployment_status: "not_deployed",
    screenshots_demo: "No demo yet",
    logo_brand_files: "Brand assets in folder",
    feature_summary: "Internal task summarization and handoff notes.",
    revenue_status: "pre-revenue",
    third_party_apis_tools: "None",
    documentation_status: "in progress",
    admin_transferability: "unclear",
    support_training_availability: "none",
    transfer_checklist_status: "not_ready",
    risk_flags: ["documentation gap", "transfer path unclear"],
    local_path: "02-assets/briefspark",
    repo_url: "https://repo.local/briefspark",
    demo_url: "https://demo.local/briefspark",
  },
];

function hasSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return Boolean(
    url &&
      key &&
      (() => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      })(),
  );
}

function mapAssetRegistryRowToRecord(row: AssetRegistryRow): AssetRegistryRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;
  return record;
}

type AssetRegistryFormValues = Omit<AssetRegistryRow, "id" | "asset_id" | "created_at" | "updated_at">;

function readAssetRegistryFormData(formData: FormData) {
  const readText = (name: keyof AssetRegistryFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const asset_name = readText("asset_name");
  const slug = readText("slug");
  const niche = readText("niche");
  const target_buyer_type = readText("target_buyer_type");
  const current_stage = readText("current_stage");
  const local_path = readText("local_path");
  const repo_url = readText("repo_url");
  const live_url = readText("live_url");
  const demo_url = readText("demo_url");
  const domain = readText("domain");
  const hosting_status = readText("hosting_status");
  const code_status = readText("code_status");
  const packaging_status = readText("packaging_status");
  const listing_status = readText("listing_status");
  const asking_price = readText("asking_price");
  const ownership_type = readText("ownership_type");
  const transfer_status = readText("transfer_status");
  const notes = readText("notes");

  const validStages: AssetStage[] = ["idea", "research", "build", "packaging", "ready_to_list", "listed"];
  const validHostingStatuses = ["not_deployed", "local", "staging", "live", "held"] as const;
  const validCodeStatuses = ["not_started", "in_progress", "ready", "needs_work"] as const;
  const validPackagingStatuses = ["incomplete", "draft_ready", "approved"] as const;
  const validListingStatuses = ["not_ready", "draft", "listed"] as const;
  const validOwnershipTypes = ["individual", "llc", "dba"] as const;
  const validTransferStatuses = ["not_ready", "drafting", "ready", "in_progress"] as const;

  const invalid =
    !asset_name ||
    !slug ||
    !niche ||
    !target_buyer_type ||
    !validStages.includes(current_stage as AssetStage) ||
    !local_path ||
    !repo_url ||
    !live_url ||
    !demo_url ||
    !domain ||
    !validHostingStatuses.includes(hosting_status as (typeof validHostingStatuses)[number]) ||
    !validCodeStatuses.includes(code_status as (typeof validCodeStatuses)[number]) ||
    !validPackagingStatuses.includes(packaging_status as (typeof validPackagingStatuses)[number]) ||
    !validListingStatuses.includes(listing_status as (typeof validListingStatuses)[number]) ||
    !asking_price ||
    !validOwnershipTypes.includes(ownership_type as (typeof validOwnershipTypes)[number]) ||
    !validTransferStatuses.includes(transfer_status as (typeof validTransferStatuses)[number]) ||
    !notes;

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  return {
    data: {
      asset_name,
      slug,
      niche,
      target_buyer_type,
      current_stage: current_stage as AssetStage,
      local_path,
      repo_url,
      live_url,
      demo_url,
      domain,
      hosting_status: hosting_status as AssetRegistryRow["hosting_status"],
      code_status: code_status as AssetRegistryRow["code_status"],
      packaging_status: packaging_status as AssetRegistryRow["packaging_status"],
      listing_status: listing_status as AssetRegistryRow["listing_status"],
      asking_price,
      ownership_type: ownership_type as AssetRegistryRow["ownership_type"],
      transfer_status: transfer_status as AssetRegistryRow["transfer_status"],
      notes,
    } satisfies AssetRegistryFormValues,
  } as const;
}

function readAssetRegistryId(formData: FormData) {
  const idValue = formData.get("id");
  return typeof idValue === "string" ? idValue.trim() : "";
}

export async function getAssetRegistryRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("asset_registry").select("*").order("created_at", {
      ascending: false,
    });

    if (error || !data) {
      return [];
    }

    return data.map(mapAssetRegistryRowToRecord);
  } catch {
    return [];
  }
}

export async function createAssetRegistryRecord(formData: FormData) {
  "use server";

  const parsed = readAssetRegistryFormData(formData);

  if ("error" in parsed) {
    redirect(
      `/admin/asset-drafts?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("asset_registry").insert({
      id: randomUUID(),
      asset_id: `asset-${randomUUID()}`,
      ...parsed.data,
    } as never);

    if (error) {
      redirect("/admin/asset-drafts?error=Unable%20to%20save%20the%20new%20asset.");
    }

    revalidatePath("/admin/asset-drafts");
    redirect("/admin/asset-drafts?saved=created");
  } catch {
    redirect("/admin/asset-drafts?error=Unable%20to%20save%20the%20new%20asset.");
  }
}

export async function updateAssetRegistryRecord(formData: FormData) {
  "use server";

  const id = readAssetRegistryId(formData);
  const parsed = readAssetRegistryFormData(formData);

  if (!id) {
    redirect("/admin/asset-drafts?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(
      `/admin/asset-drafts?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("asset_registry").update(parsed.data as never).eq("id", id);

    if (error) {
      redirect("/admin/asset-drafts?error=Unable%20to%20update%20the%20asset.");
    }

    revalidatePath("/admin/asset-drafts");
    redirect("/admin/asset-drafts?saved=updated");
  } catch {
    redirect("/admin/asset-drafts?error=Unable%20to%20update%20the%20asset.");
  }
}

export const assetStageOrder: AssetStage[] = [
  "idea",
  "research",
  "build",
  "packaging",
  "ready_to_list",
  "listed",
];

export const assetStageLabels: Record<AssetStage, string> = {
  idea: "Idea",
  research: "Research",
  build: "Build",
  packaging: "Packaging",
  ready_to_list: "Ready to List",
  listed: "Listed",
};
