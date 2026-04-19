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

export type AssetRegistryRecord = Readonly<{
  asset_id: string;
  asset_name: string;
  slug: string;
  niche: string;
  target_buyer_type: string;
  current_stage: AssetStage;
  local_path: string;
  repo_url: string;
  live_url: string;
  demo_url: string;
  domain: string;
  hosting_status: string;
  code_status: CodeStatus;
  packaging_status: "incomplete" | "draft_ready" | "approved";
  listing_status: "not_ready" | "draft" | "listed";
  asking_price: string;
  ownership_type: OwnershipType;
  transfer_status: TransferStatus;
  notes: string;
}>;

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

export const assetRegistryRecords: AssetRegistryRecord[] = [
  {
    asset_id: "A-001",
    asset_name: "ReplyPilot",
    slug: "replypilot",
    niche: "Service businesses",
    target_buyer_type: "Owner-operators",
    current_stage: "ready_to_list",
    local_path: "02-assets/replypilot",
    repo_url: "https://repo.local/replypilot",
    live_url: "https://replypilot.example",
    demo_url: "https://demo.local/replypilot",
    domain: "replypilot.example",
    hosting_status: "staging",
    code_status: "ready",
    packaging_status: "draft_ready",
    listing_status: "draft",
    asking_price: "$18,000",
    ownership_type: "individual",
    transfer_status: "drafting",
    notes: "Strong candidate for first listing batch.",
  },
  {
    asset_id: "A-002",
    asset_name: "ScopeFlow",
    slug: "scopeflow",
    niche: "Agencies",
    target_buyer_type: "Agency founders",
    current_stage: "build",
    local_path: "02-assets/scopeflow",
    repo_url: "https://repo.local/scopeflow",
    live_url: "https://scopeflow.example",
    demo_url: "https://demo.local/scopeflow",
    domain: "scopeflow.example",
    hosting_status: "local",
    code_status: "in_progress",
    packaging_status: "incomplete",
    listing_status: "not_ready",
    asking_price: "$24,500",
    ownership_type: "llc",
    transfer_status: "not_ready",
    notes: "Needs packaging and transfer checklist completion.",
  },
  {
    asset_id: "A-003",
    asset_name: "BriefSpark",
    slug: "briefspark",
    niche: "Operations teams",
    target_buyer_type: "Ops managers",
    current_stage: "research",
    local_path: "02-assets/briefspark",
    repo_url: "https://repo.local/briefspark",
    live_url: "https://briefspark.example",
    demo_url: "https://demo.local/briefspark",
    domain: "briefspark.example",
    hosting_status: "local",
    code_status: "needs_work",
    packaging_status: "incomplete",
    listing_status: "not_ready",
    asking_price: "$12,000",
    ownership_type: "dba",
    transfer_status: "not_ready",
    notes: "Hold until documentation and admin transferability improve.",
  },
];

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

