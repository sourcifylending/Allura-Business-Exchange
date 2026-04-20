export type MarketRadarStatus = "idea" | "researching" | "approved" | "rejected" | "later";
export type MarketRadarLevel = "low" | "medium" | "high";
export type BuyerType = "operator" | "investor" | "hybrid";
export type BuyerStage = "new" | "qualified" | "active" | "watching" | "closed";
export type ProofOfFundsStatus = "not_shown" | "unverified" | "verified";
export type InquiryStatus = "new" | "reviewing" | "qualified" | "not_fit" | "waiting";
export type InquiryStage = "inbox" | "triage" | "qualified" | "handoff" | "closed";

export type AssetStage = "idea" | "research" | "build" | "packaging" | "ready_to_list" | "listed";
export type AssetHostingStatus = "not_deployed" | "local" | "staging" | "live" | "held";
export type AssetCodeStatus = "not_started" | "in_progress" | "ready" | "needs_work";
export type AssetPackagingStatus = "incomplete" | "draft_ready" | "approved";
export type AssetListingStatus = "not_ready" | "draft" | "listed";
export type OwnershipType = "individual" | "llc" | "dba";
export type AssetTransferStatus = "not_ready" | "drafting" | "ready" | "in_progress";
export type AssetPackagingRecordStatus = "incomplete" | "draft_ready" | "approved_for_listing";
export type OfferStage = "offered" | "countered" | "accepted" | "waiting";
export type OfferDispositionStatus =
  | "seller_review"
  | "seller_interested"
  | "seller_declined"
  | "request_follow_up"
  | "advance_to_contract"
  | "close_out";
export type ContractStatus =
  | "draft"
  | "sent"
  | "signed"
  | "blocked"
  | "in_review"
  | "awaiting_admin"
  | "ready_for_transfer"
  | "transferred"
  | "closed"
  | "cancelled";
export type SignatureStatus = "not_sent" | "pending" | "complete";
export type PaymentStatus = "pending" | "received" | "blocked";
export type TransferStatus = "not_started" | "in_progress" | "blocked" | "complete";
export type TransferWorkflowStatus =
  | "queued"
  | "in_progress"
  | "pending_docs"
  | "pending_admin"
  | "ready_to_close"
  | "completed"
  | "cancelled";
export type BuyerOpportunityInteractionType = "interest" | "saved";
export type BuyerOfferSubmissionStatus =
  | "submitted"
  | "under_review"
  | "needs_follow_up"
  | "approved_to_present"
  | "converted_to_offer"
  | "declined"
  | "withdrawn";
export type PortalRequestTargetRole = "buyer" | "seller";
export type PortalRequestType = "document_request" | "info_request" | "acknowledgment" | "next_step";
export type PortalRequestStatus = "open" | "acknowledged" | "in_progress" | "completed" | "blocked" | "cancelled";
export type ApplicationDocumentApplicationType = "buyer" | "seller";
export type ApplicationDocumentStatus = "uploaded" | "received" | "under_review" | "approved" | "rejected";

export type BusinessIntakeStatus = "new" | "in_review" | "needs_info" | "complete";
export type BusinessReviewStatus = "pending" | "clear" | "red_flags" | "hold";
export type BusinessUnderwritingStatus = "screening" | "reviewing" | "hold" | "approved" | "rejected";
export type ApplicationStatus = "submitted" | "under_review" | "approved" | "rejected" | "invited" | "activated";

type Timestamp = string;

type RowBase = {
  id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

type InsertRow<T extends RowBase> = Omit<T, "id" | "created_at" | "updated_at"> &
  Partial<Pick<T, "id" | "created_at" | "updated_at">>;

type UpdateRow<T extends RowBase> = Partial<Omit<T, "id" | "created_at" | "updated_at">> &
  Partial<Pick<T, "id" | "created_at" | "updated_at">>;

export type MarketRadarRow = RowBase & {
  niche_industry: string;
  problem_statement: string;
  target_buyer: string;
  urgency_of_pain: MarketRadarLevel;
  competition_level: MarketRadarLevel;
  build_complexity: MarketRadarLevel;
  speed_to_build_score: number;
  speed_to_sell_score: number;
  likely_sale_price_band: string;
  saleability_score: number;
  demand_notes: string;
  reason_to_build_now: string;
  status: MarketRadarStatus;
};

export type AssetRegistryRow = RowBase & {
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
  hosting_status: AssetHostingStatus;
  code_status: AssetCodeStatus;
  packaging_status: AssetPackagingStatus;
  listing_status: AssetListingStatus;
  asking_price: string;
  ownership_type: OwnershipType;
  transfer_status: AssetTransferStatus;
  notes: string;
};

export type BusinessIntakeRow = RowBase & {
  legal_business_name: string;
  dba: string;
  industry: string;
  location: string;
  years_in_business: string;
  monthly_revenue_range: string;
  cash_flow_profit_range: string;
  reason_for_selling: string;
  debt_liens_mca_disclosure: string;
  number_of_employees: string;
  owner_involvement: string;
  equipment_assets: string;
  transferability_notes: string;
  uploads_placeholder_list: string[];
  intake_status: BusinessIntakeStatus;
  review_status: BusinessReviewStatus;
  next_action: string;
};

export type BusinessUnderwritingRow = RowBase & {
  business_name: string;
  industry: string;
  location: string;
  years_in_business: string;
  monthly_revenue_range: string;
  cash_flow_range: string;
  sde_owner_benefit: string;
  debt_mca_lien_status: string;
  customer_concentration: string;
  owner_dependence: string;
  transferability: string;
  margin_quality: string;
  growth_opportunity: string;
  closing_friction: string;
  spread_potential: string;
  underwriting_status: BusinessUnderwritingStatus;
  risk_flags: string[];
  next_action: string;
};

export type AssetPackagingRow = RowBase & {
  asset_registry_id: string;
  seller_application_id: string | null;
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
  status: AssetPackagingRecordStatus;
  portal_visible: boolean;
  portal_summary: string;
};

export type BuyerRow = RowBase & {
  buyer_name: string;
  buyer_type: BuyerType;
  budget: string;
  niches_of_interest: string[];
  asset_preferences: string[];
  proof_of_funds_status: ProofOfFundsStatus;
  operator_or_investor: BuyerType;
  urgency: "low" | "medium" | "high";
  inquiry_history: string;
  current_stage: BuyerStage;
  next_action: string;
};

export type BuyerApplicationRow = RowBase & {
  applicant_name: string;
  email: string;
  phone: string;
  buyer_type: BuyerType;
  budget_range: string;
  niches_of_interest: string[];
  asset_preferences: string[];
  proof_of_funds_status: ProofOfFundsStatus;
  urgency: "low" | "medium" | "high";
  message: string;
  status: ApplicationStatus;
  admin_notes: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  invited_at: string | null;
  invited_by: string | null;
  linked_user_id: string | null;
};

export type SellerApplicationRow = RowBase & {
  applicant_name: string;
  email: string;
  phone: string;
  business_name: string;
  website: string;
  industry: string;
  asset_type: string;
  asking_price_range: string;
  summary: string;
  reason_for_selling: string;
  status: ApplicationStatus;
  admin_notes: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  invited_at: string | null;
  invited_by: string | null;
  linked_user_id: string | null;
};

export type InquiryRow = RowBase & {
  source: string;
  asset_interested_in: string;
  buyer_id: string | null;
  timestamp: string;
  qualification_status: InquiryStatus;
  assigned_owner: string;
  next_step: string;
  response_sla: string;
  stage: InquiryStage;
  notes_summary: string;
};

export type OfferRow = RowBase & {
  asset_name: string;
  buyer_id: string | null;
  buyer_name: string;
  asking_price: string;
  offer_amount: string;
  counteroffer_status: string;
  accepted_terms: string;
  stage: OfferStage;
  next_action: string;
  owner: string;
  target_close_date: string;
  disposition_status: OfferDispositionStatus | null;
  disposition_note: string | null;
  disposition_at: string | null;
  disposition_by: string | null;
  contract_row_id: string | null;
};

export type ContractRow = RowBase & {
  contract_record_id: string;
  asset_name: string;
  buyer_id: string | null;
  buyer_name: string;
  contract_type: string;
  status: ContractStatus;
  sent_date: string;
  signature_status: SignatureStatus;
  document_status: string;
  payment_status: PaymentStatus;
  notes: string;
  transfer_row_id: string | null;
};

export type TransferRow = RowBase & {
  asset_name: string;
  buyer_id: string | null;
  buyer_name: string;
  repo_transfer_status: TransferStatus;
  domain_transfer_status: TransferStatus;
  hosting_transfer_status: TransferStatus;
  admin_account_transfer_status: TransferStatus;
  documentation_delivery: string;
  support_window: string;
  overall_transfer_status: TransferStatus;
  workflow_status: TransferWorkflowStatus;
  next_action: string;
  internal_notes: string | null;
  closeout_ready_at: string | null;
  completed_at: string | null;
  archived_at: string | null;
  archived_by: string | null;
};

export type PortalRequestRow = RowBase & {
  target_role: PortalRequestTargetRole;
  request_type: PortalRequestType;
  title: string;
  portal_instructions: string;
  admin_notes: string | null;
  status: PortalRequestStatus;
  due_date: string | null;
  buyer_application_id: string | null;
  seller_application_id: string | null;
  asset_packaging_id: string | null;
  offer_id: string | null;
  contract_id: string | null;
  transfer_id: string | null;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  completed_at: string | null;
  completed_by: string | null;
  blocked_at: string | null;
  blocked_by: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
};

export type ApplicationDocumentRow = RowBase & {
  application_type: ApplicationDocumentApplicationType;
  application_id: string;
  owner_user_id: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  document_type: string;
  status: ApplicationDocumentStatus;
  notes: string | null;
  request_id: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

export type BuyerOpportunityInteractionRow = RowBase & {
  buyer_application_id: string;
  asset_packaging_id: string;
  owner_user_id: string;
  interaction_type: BuyerOpportunityInteractionType;
};

export type BuyerOfferSubmissionRow = RowBase & {
  buyer_application_id: string;
  asset_packaging_id: string;
  owner_user_id: string;
  proposed_price: string;
  structure_preference: string;
  financing_plan: string;
  target_close_date: string;
  notes: string;
  status: BuyerOfferSubmissionStatus;
  admin_notes: string;
  offer_record_id: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

export type Database = {
  public: {
    Tables: {
      market_radar: {
        Row: MarketRadarRow;
        Insert: InsertRow<MarketRadarRow>;
        Update: UpdateRow<MarketRadarRow>;
      };
      asset_registry: {
        Row: AssetRegistryRow;
        Insert: InsertRow<AssetRegistryRow>;
        Update: UpdateRow<AssetRegistryRow>;
      };
      business_intake: {
        Row: BusinessIntakeRow;
        Insert: InsertRow<BusinessIntakeRow>;
        Update: UpdateRow<BusinessIntakeRow>;
      };
      business_underwriting: {
        Row: BusinessUnderwritingRow;
        Insert: InsertRow<BusinessUnderwritingRow>;
        Update: UpdateRow<BusinessUnderwritingRow>;
      };
      asset_packaging: {
        Row: AssetPackagingRow;
        Insert: InsertRow<AssetPackagingRow>;
        Update: UpdateRow<AssetPackagingRow>;
      };
      buyer_opportunity_interactions: {
        Row: BuyerOpportunityInteractionRow;
        Insert: InsertRow<BuyerOpportunityInteractionRow>;
        Update: UpdateRow<BuyerOpportunityInteractionRow>;
      };
      buyer_offer_submissions: {
        Row: BuyerOfferSubmissionRow;
        Insert: InsertRow<BuyerOfferSubmissionRow>;
        Update: UpdateRow<BuyerOfferSubmissionRow>;
      };
      buyers: {
        Row: BuyerRow;
        Insert: InsertRow<BuyerRow>;
        Update: UpdateRow<BuyerRow>;
      };
      buyer_applications: {
        Row: BuyerApplicationRow;
        Insert: InsertRow<BuyerApplicationRow>;
        Update: UpdateRow<BuyerApplicationRow>;
      };
      seller_applications: {
        Row: SellerApplicationRow;
        Insert: InsertRow<SellerApplicationRow>;
        Update: UpdateRow<SellerApplicationRow>;
      };
      inquiries: {
        Row: InquiryRow;
        Insert: InsertRow<InquiryRow>;
        Update: UpdateRow<InquiryRow>;
      };
      offers: {
        Row: OfferRow;
        Insert: InsertRow<OfferRow>;
        Update: UpdateRow<OfferRow>;
      };
      contracts: {
        Row: ContractRow;
        Insert: InsertRow<ContractRow>;
        Update: UpdateRow<ContractRow>;
      };
      transfers: {
        Row: TransferRow;
        Insert: InsertRow<TransferRow>;
        Update: UpdateRow<TransferRow>;
      };
      portal_requests: {
        Row: PortalRequestRow;
        Insert: InsertRow<PortalRequestRow>;
        Update: UpdateRow<PortalRequestRow>;
      };
      application_documents: {
        Row: ApplicationDocumentRow;
        Insert: InsertRow<ApplicationDocumentRow>;
        Update: UpdateRow<ApplicationDocumentRow>;
      };
    };
  };
};
