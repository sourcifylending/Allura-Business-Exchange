export type OfferStage = "offered" | "countered" | "accepted" | "waiting";

export type ContractStatus = "draft" | "sent" | "signed" | "blocked";

export type SignatureStatus = "not_sent" | "pending" | "complete";

export type PaymentStatus = "pending" | "received" | "blocked";

export type TransferStatus = "not_started" | "in_progress" | "blocked" | "complete";

export type OfferRecord = Readonly<{
  id: string;
  asset_name: string;
  buyer_name: string;
  asking_price: string;
  offer_amount: string;
  counteroffer_status: string;
  accepted_terms: string;
  stage: OfferStage;
  next_action: string;
  owner: string;
  target_close_date: string;
}>;

export type ContractRecord = Readonly<{
  id: string;
  contract_record_id: string;
  asset_name: string;
  buyer_name: string;
  contract_type: string;
  status: ContractStatus;
  sent_date: string;
  signature_status: SignatureStatus;
  document_status: string;
  payment_status: PaymentStatus;
  notes: string;
}>;

export type TransferRecord = Readonly<{
  id: string;
  asset_name: string;
  buyer_name: string;
  repo_transfer_status: TransferStatus;
  domain_transfer_status: TransferStatus;
  hosting_transfer_status: TransferStatus;
  admin_account_transfer_status: TransferStatus;
  documentation_delivery: string;
  support_window: string;
  overall_transfer_status: TransferStatus;
  next_action: string;
}>;

export const offerRecords: OfferRecord[] = [
  {
    id: "offer-01",
    asset_name: "ReplyPilot",
    buyer_name: "Jordan Lee",
    asking_price: "$18,000",
    offer_amount: "$16,500",
    counteroffer_status: "countered once",
    accepted_terms: "Cash upfront, 7-day close",
    stage: "countered",
    next_action: "Wait for response",
    owner: "Allura Ops",
    target_close_date: "2026-04-22",
  },
  {
    id: "offer-02",
    asset_name: "ScopeFlow",
    buyer_name: "Maya Chen",
    asking_price: "$24,500",
    offer_amount: "$24,500",
    counteroffer_status: "accepted",
    accepted_terms: "Full price, standard transfer window",
    stage: "accepted",
    next_action: "Move to contract",
    owner: "Allura Ops",
    target_close_date: "2026-04-26",
  },
  {
    id: "offer-03",
    asset_name: "BriefSpark",
    buyer_name: "Carlos Rivera",
    asking_price: "$12,000",
    offer_amount: "$10,000",
    counteroffer_status: "awaiting counter",
    accepted_terms: "None yet",
    stage: "offered",
    next_action: "Review offer terms",
    owner: "Allura Ops",
    target_close_date: "2026-04-28",
  },
];

export const contractRecords: ContractRecord[] = [
  {
    id: "ctr-01",
    contract_record_id: "C-001",
    asset_name: "ReplyPilot",
    buyer_name: "Jordan Lee",
    contract_type: "Asset purchase agreement",
    status: "sent",
    sent_date: "2026-04-18",
    signature_status: "pending",
    document_status: "draft sent",
    payment_status: "pending",
    notes: "Awaiting signature before payment request.",
  },
  {
    id: "ctr-02",
    contract_record_id: "C-002",
    asset_name: "ScopeFlow",
    buyer_name: "Maya Chen",
    contract_type: "Asset purchase agreement",
    status: "signed",
    sent_date: "2026-04-17",
    signature_status: "complete",
    document_status: "final signed PDF",
    payment_status: "received",
    notes: "Ready for transfer desk unlock.",
  },
  {
    id: "ctr-03",
    contract_record_id: "C-003",
    asset_name: "BriefSpark",
    buyer_name: "Carlos Rivera",
    contract_type: "Letter of intent",
    status: "blocked",
    sent_date: "2026-04-16",
    signature_status: "not_sent",
    document_status: "draft hold",
    payment_status: "blocked",
    notes: "Waiting on final offer terms.",
  },
];

export const transferRecords: TransferRecord[] = [
  {
    id: "trf-01",
    asset_name: "ReplyPilot",
    buyer_name: "Jordan Lee",
    repo_transfer_status: "in_progress",
    domain_transfer_status: "not_started",
    hosting_transfer_status: "not_started",
    admin_account_transfer_status: "blocked",
    documentation_delivery: "Ready to send",
    support_window: "7 days",
    overall_transfer_status: "in_progress",
    next_action: "Unlock after payment receipt",
  },
  {
    id: "trf-02",
    asset_name: "ScopeFlow",
    buyer_name: "Maya Chen",
    repo_transfer_status: "complete",
    domain_transfer_status: "complete",
    hosting_transfer_status: "in_progress",
    admin_account_transfer_status: "in_progress",
    documentation_delivery: "Delivered",
    support_window: "14 days",
    overall_transfer_status: "in_progress",
    next_action: "Complete admin handoff",
  },
  {
    id: "trf-03",
    asset_name: "BriefSpark",
    buyer_name: "Carlos Rivera",
    repo_transfer_status: "not_started",
    domain_transfer_status: "not_started",
    hosting_transfer_status: "not_started",
    admin_account_transfer_status: "not_started",
    documentation_delivery: "Not started",
    support_window: "Not set",
    overall_transfer_status: "blocked",
    next_action: "Wait for signed contract",
  },
];

export const offerStageLabels: Record<OfferStage, string> = {
  offered: "Offered",
  countered: "Countered",
  accepted: "Accepted",
  waiting: "Waiting",
};

export const contractStatusLabels: Record<ContractStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  signed: "Signed",
  blocked: "Blocked",
};

export const transferStatusLabels: Record<TransferStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  complete: "Complete",
};

