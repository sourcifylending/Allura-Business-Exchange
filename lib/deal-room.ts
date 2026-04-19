export type ListingType = "ai_asset" | "business";

export type VisibilityMode = "fully_public" | "public_teaser" | "approved_only";

export type AccessStatus = "pending" | "approved" | "restricted";

export type ApprovalStatus = "requested" | "approved" | "blocked";

export type DealTimelineStatus = "queued" | "active" | "waiting" | "ready" | "complete" | "locked";

export type DocumentStatus = "available" | "pending" | "locked";

export type DealRoomRecord = Readonly<{
  id: string;
  opportunity_name: string;
  listing_type: ListingType;
  visibility_mode: VisibilityMode;
  approved_viewer: string;
  access_status: AccessStatus;
  nda_required_status: "required" | "not_required";
  approval_status: ApprovalStatus;
  summary_section: string;
  documents_section: string[];
  notes_qna_placeholder: string;
  timeline_milestones: { label: string; status: DealTimelineStatus }[];
  transfer_or_diligence_status: string;
  next_action: string;
  document_status: DocumentStatus;
}>;

export const dealRoomRecords: DealRoomRecord[] = [
  {
    id: "deal-01",
    opportunity_name: "ReplyPilot",
    listing_type: "ai_asset",
    visibility_mode: "approved_only",
    approved_viewer: "Jordan Lee",
    access_status: "approved",
    nda_required_status: "not_required",
    approval_status: "approved",
    summary_section: "Approved access for a branded AI asset with clear transfer readiness.",
    documents_section: ["Asset summary", "Demo notes", "Transfer checklist draft"],
    notes_qna_placeholder: "Buyer asks about support scope and transfer timing.",
    timeline_milestones: [
      { label: "Access approved", status: "complete" },
      { label: "Docs shared", status: "ready" },
      { label: "Q&A open", status: "active" },
      { label: "Transfer prep", status: "waiting" },
    ],
    transfer_or_diligence_status: "Transfer prep in progress",
    next_action: "Answer final questions and unlock next review step",
    document_status: "available",
  },
  {
    id: "deal-02",
    opportunity_name: "North Shore Home Services LLC",
    listing_type: "business",
    visibility_mode: "approved_only",
    approved_viewer: "Approved buyer team",
    access_status: "approved",
    nda_required_status: "required",
    approval_status: "approved",
    summary_section: "Controlled business access with sanitized details and deeper diligence materials locked behind approval.",
    documents_section: ["NDA placeholder", "Financial summary placeholder", "Diligence checklist placeholder"],
    notes_qna_placeholder: "Buyer requests customer concentration and debt clarification.",
    timeline_milestones: [
      { label: "NDA executed", status: "complete" },
      { label: "Diligence docs", status: "active" },
      { label: "Q&A log", status: "waiting" },
      { label: "Transfer prep", status: "queued" },
    ],
    transfer_or_diligence_status: "Diligence review active",
    next_action: "Review documents and prepare for underwriting handoff",
    document_status: "available",
  },
  {
    id: "deal-03",
    opportunity_name: "Metro Fleet Solutions LLC",
    listing_type: "business",
    visibility_mode: "approved_only",
    approved_viewer: "Investor review placeholder",
    access_status: "restricted",
    nda_required_status: "required",
    approval_status: "requested",
    summary_section: "Access request received, but approval is still pending.",
    documents_section: ["Access request placeholder", "No documents unlocked yet"],
    notes_qna_placeholder: "Waiting for approval and NDA confirmation.",
    timeline_milestones: [
      { label: "Access request", status: "complete" },
      { label: "Approval review", status: "active" },
      { label: "NDA", status: "queued" },
      { label: "Vault unlock", status: "locked" },
    ],
    transfer_or_diligence_status: "Approval pending",
    next_action: "Approve access before any documents are visible",
    document_status: "locked",
  },
];

export const accessStatusLabels: Record<AccessStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  restricted: "Restricted",
};

export const approvalStatusLabels: Record<ApprovalStatus, string> = {
  requested: "Requested",
  approved: "Approved",
  blocked: "Blocked",
};

export const dealTimelineStatusLabels: Record<DealTimelineStatus, string> = {
  queued: "Queued",
  active: "Active",
  waiting: "Waiting",
  ready: "Ready",
  complete: "Complete",
  locked: "Locked",
};

export const dealDocumentStatusLabels: Record<DocumentStatus, string> = {
  available: "Available",
  pending: "Pending",
  locked: "Locked",
};
