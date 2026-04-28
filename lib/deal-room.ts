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

/**
 * @deprecated - DEPRECATED: Fake demo data removed in production hardening.
 * Deal room now uses real database queries from digital_asset_buyer_interest table.
 * Do not use this data.
 */
export const dealRoomRecords: DealRoomRecord[] = [];

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
