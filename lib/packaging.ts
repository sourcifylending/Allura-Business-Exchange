export type PackagingStatus = "incomplete" | "draft_ready" | "approved_for_listing";

export type PackagingRecord = Readonly<{
  id: string;
  asset_name: string;
  one_line_pitch: string;
  short_listing_description: string;
  full_summary: string;
  buyer_type: string;
  screenshots: string;
  demo_link: string;
  logo_brand_kit: string;
  feature_summary: string;
  stack_summary: string;
  support_scope: string;
  transfer_checklist: string;
  asking_price: string;
  status: PackagingStatus;
}>;

export const packagingRecords: PackagingRecord[] = [
  {
    id: "pack-01",
    asset_name: "ReplyPilot",
    one_line_pitch: "AI inbox triage for service teams that need faster routing and cleaner intake.",
    short_listing_description:
      "A focused workflow tool for service businesses that want to keep response times fast.",
    full_summary:
      "A branded digital asset with a narrow buyer story, simple demo, and clear transfer path.",
    buyer_type: "Owner-operators",
    screenshots: "Screenshots ready",
    demo_link: "https://demo.local/replypilot",
    logo_brand_kit: "Logo + brand kit saved",
    feature_summary: "Inbox triage, routing, and intake handling.",
    stack_summary: "Forms, email provider, internal workflow logic.",
    support_scope: "One short handoff call and written notes.",
    transfer_checklist: "Draft checklist in progress.",
    asking_price: "$18,000",
    status: "draft_ready",
  },
  {
    id: "pack-02",
    asset_name: "ScopeFlow",
    one_line_pitch: "Turn discovery calls into cleaner scoping outputs for agencies.",
    short_listing_description:
      "A sales-support asset designed to shorten the distance between call and proposal.",
    full_summary:
      "A packaging-ready concept that needs a few more readiness items before it can list cleanly.",
    buyer_type: "Agency founders",
    screenshots: "Prototype screenshots ready",
    demo_link: "https://demo.local/scopeflow",
    logo_brand_kit: "Brand files saved",
    feature_summary: "Discovery-to-scope assistant.",
    stack_summary: "Calendar, docs, internal content assembly.",
    support_scope: "Basic transition notes and setup guide.",
    transfer_checklist: "Not complete yet.",
    asking_price: "$24,500",
    status: "incomplete",
  },
  {
    id: "pack-03",
    asset_name: "BriefSpark",
    one_line_pitch: "Summarize internal tasks and handoffs for operations teams.",
    short_listing_description:
      "A simple internal operations asset with a clear structure for sale preparation.",
    full_summary:
      "A sale-ready shell with weaker execution readiness, best treated as an internal packaging hold.",
    buyer_type: "Ops managers",
    screenshots: "No screenshots yet",
    demo_link: "https://demo.local/briefspark",
    logo_brand_kit: "Brand assets partial",
    feature_summary: "Task summarization and handoff notes.",
    stack_summary: "Internal workflow components.",
    support_scope: "Not yet defined.",
    transfer_checklist: "Not ready.",
    asking_price: "$12,000",
    status: "approved_for_listing",
  },
];

export const packagingStatusLabels: Record<PackagingStatus, string> = {
  incomplete: "Incomplete",
  draft_ready: "Draft Ready",
  approved_for_listing: "Approved for Listing",
};

