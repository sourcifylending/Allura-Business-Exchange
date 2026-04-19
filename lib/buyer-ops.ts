export type BuyerType = "operator" | "investor" | "hybrid";

export type BuyerStage = "new" | "qualified" | "active" | "watching" | "closed";

export type ProofOfFundsStatus = "not_shown" | "unverified" | "verified";

export type BuyerRecord = Readonly<{
  id: string;
  buyer_name: string;
  buyer_type: BuyerType;
  budget: string;
  niches_of_interest: string[];
  asset_preferences: string[];
  proof_of_funds_status: ProofOfFundsStatus;
  operator_vs_investor: string;
  urgency: "low" | "medium" | "high";
  inquiry_history: string;
  current_stage: BuyerStage;
  next_action: string;
}>;

export type InquiryStatus = "new" | "reviewing" | "qualified" | "not_fit" | "waiting";

export type InquiryStage = "inbox" | "triage" | "qualified" | "handoff" | "closed";

export type InquiryRecord = Readonly<{
  id: string;
  source: string;
  asset_interested_in: string;
  timestamp: string;
  qualification_status: InquiryStatus;
  assigned_owner: string;
  next_step: string;
  response_sla: string;
  stage: InquiryStage;
  notes_summary: string;
}>;

export const buyerRecords: BuyerRecord[] = [
  {
    id: "buyer-01",
    buyer_name: "Jordan Lee",
    buyer_type: "operator",
    budget: "$20k - $35k",
    niches_of_interest: ["Service businesses", "AI workflow tools"],
    asset_preferences: ["Simple demos", "Fast transfer", "Clear support scope"],
    proof_of_funds_status: "verified",
    operator_vs_investor: "operator",
    urgency: "high",
    inquiry_history: "Viewed two assets and requested a follow-up.",
    current_stage: "qualified",
    next_action: "Send demo and schedule call",
  },
  {
    id: "buyer-02",
    buyer_name: "Maya Chen",
    buyer_type: "investor",
    budget: "$15k - $50k",
    niches_of_interest: ["Agencies", "Operations tools"],
    asset_preferences: ["Clean packaging", "Transfer readiness", "Low support burden"],
    proof_of_funds_status: "unverified",
    operator_vs_investor: "investor",
    urgency: "medium",
    inquiry_history: "Submitted profile and saved three listings.",
    current_stage: "watching",
    next_action: "Request proof-of-funds confirmation",
  },
  {
    id: "buyer-03",
    buyer_name: "Carlos Rivera",
    buyer_type: "hybrid",
    budget: "$10k - $25k",
    niches_of_interest: ["Local services", "Automation"],
    asset_preferences: ["Buy-and-run simplicity", "Quick handoff"],
    proof_of_funds_status: "not_shown",
    operator_vs_investor: "hybrid",
    urgency: "medium",
    inquiry_history: "One inquiry with light interest, waiting on response.",
    current_stage: "new",
    next_action: "Review qualification details",
  },
];

export const inquiryRecords: InquiryRecord[] = [
  {
    id: "inq-01",
    source: "Website contact form",
    asset_interested_in: "ReplyPilot",
    timestamp: "2026-04-18 09:10",
    qualification_status: "qualified",
    assigned_owner: "Allura Ops",
    next_step: "Send demo and call link",
    response_sla: "Same day",
    stage: "qualified",
    notes_summary: "Buyer is credible and wants a fast close.",
  },
  {
    id: "inq-02",
    source: "Direct email",
    asset_interested_in: "ScopeFlow",
    timestamp: "2026-04-18 10:42",
    qualification_status: "reviewing",
    assigned_owner: "Allura Ops",
    next_step: "Confirm budget and proof of funds",
    response_sla: "4 hours",
    stage: "triage",
    notes_summary: "Interest is real but qualification is incomplete.",
  },
  {
    id: "inq-03",
    source: "Saved listing follow-up",
    asset_interested_in: "BriefSpark",
    timestamp: "2026-04-17 15:25",
    qualification_status: "waiting",
    assigned_owner: "Allura Ops",
    next_step: "Await buyer reply",
    response_sla: "Next business day",
    stage: "inbox",
    notes_summary: "Potential buyer went quiet after initial review.",
  },
];

export const buyerStageLabels: Record<BuyerStage, string> = {
  new: "New",
  qualified: "Qualified",
  active: "Active",
  watching: "Watching",
  closed: "Closed",
};

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  qualified: "Qualified",
  not_fit: "Not Fit",
  waiting: "Waiting",
};

export const buyerStageOrder: BuyerStage[] = ["new", "qualified", "active", "watching", "closed"];
export const inquiryStageOrder: InquiryStage[] = ["inbox", "triage", "qualified", "handoff", "closed"];

export const inquiryStageLabels: Record<InquiryStage, string> = {
  inbox: "Inbox",
  triage: "Triage",
  qualified: "Qualified",
  handoff: "Handoff",
  closed: "Closed",
};

