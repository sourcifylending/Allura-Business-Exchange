export type MarketRadarStatus = "idea" | "researching" | "approved" | "rejected" | "later";
export type MarketRadarLevel = "low" | "medium" | "high";
export type BuyerType = "operator" | "investor" | "hybrid";
export type PortalContactMethod = "email" | "phone" | "portal";
export type PortalPreferences = {
  preferred_contact_method: PortalContactMethod;
  email_updates: boolean;
  portal_reminders: boolean;
};
export type BuyerCuratedOpportunityStatus = "assigned" | "archived";
export type BuyerCuratedOpportunityActionStatus = "viewed" | "saved" | "interested" | "passed";
export type BuyerCuratedOpportunityMatchTier = "strong" | "good" | "moderate" | "light";
export type BuyerCuratedOpportunityReason = {
  code: string;
  label: string;
  detail: string;
  weight: number;
  safe_label: string;
};
export type BuyerOpportunityAccessStatus = "granted" | "viewed" | "expired" | "revoked";
export type BuyerOpportunityAccessAcknowledgementStatus = "not_required" | "required" | "acknowledged" | "expired" | "revoked";
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
export type ContractReadinessStatus =
  | "not_started"
  | "collecting_items"
  | "buyer_ready"
  | "seller_ready"
  | "ready_for_contract"
  | "blocked";
export type ContractPartyReadinessStatus = "not_started" | "collecting_items" | "ready" | "blocked";
export type ContractPacketStatus = "not_started" | "collecting_items" | "ready" | "released" | "blocked";
export type ContractExecutionStatus =
  | "not_started"
  | "preparing"
  | "buyer_review"
  | "seller_review"
  | "pending_admin"
  | "fully_executed"
  | "blocked"
  | "cancelled";
export type ContractPacketAudienceRole = "buyer" | "seller";
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
export type BuyerOfferPackageStatus = "submitted" | "under_review" | "needs_revision" | "complete" | "withdrawn";
export type BuyerOfferInvitationStatus = "invited" | "viewed" | "offer_submitted" | "expired" | "withdrawn";
export type BuyerOfferInvitationResponseStatus = "viewed" | "offer_submitted" | null;
export type BuyerOfferPresentationStatus = "not_presented" | "ready_to_present" | "presented" | "withdrawn";
export type BuyerOfferSellerReviewStatus =
  | "not_reviewed"
  | "seller_reviewing"
  | "seller_interested"
  | "seller_declined"
  | "accepted_for_offer_record"
  | "withdrawn";
export type PortalRequestTargetRole = "buyer" | "seller";
export type PortalRequestType = "document_request" | "info_request" | "acknowledgment" | "next_step";
export type PortalRequestStatus = "open" | "acknowledged" | "in_progress" | "completed" | "blocked" | "cancelled";
export type ApplicationDocumentApplicationType = "buyer" | "seller";
export type ApplicationDocumentStatus = "uploaded" | "received" | "under_review" | "approved" | "rejected";
export type BuyerOpportunityAccessDocumentReleaseStatus = "released" | "hidden" | "archived";

export type BusinessIntakeStatus = "new" | "in_review" | "needs_info" | "complete";
export type BusinessReviewStatus = "pending" | "clear" | "red_flags" | "hold";
export type BusinessUnderwritingStatus = "screening" | "reviewing" | "hold" | "approved" | "rejected";
export type ApplicationStatus = "submitted" | "under_review" | "approved" | "rejected" | "invited" | "activated";

export type DigitalAssetStatus = "for_sale" | "in_build" | "sold" | "paused" | "internal";
export type DigitalAssetVisibility = "private" | "public";
export type DigitalAssetTaskStatus = "open" | "in_progress" | "done" | "blocked";
export type DigitalAssetTaskPriority = "low" | "normal" | "high" | "urgent";
export type DigitalAssetBuyerInterestStatus = "new" | "contacted" | "interested" | "qualified" | "not_fit" | "closed";
export type DigitalAssetBuyerInterestNDAStatus = "not_sent" | "sent" | "signed" | "declined";
export type DigitalAssetBuyerInterestProofOfFundsStatus = "not_requested" | "requested" | "submitted" | "verified" | "rejected";
export type DigitalAssetBuyerStage = "new" | "nda_sent" | "nda_signed" | "reviewing" | "offer" | "closed" | "dead";
export type AssetClosingStatus =
  | "offer_accepted"
  | "pa_sent"
  | "pa_signed"
  | "awaiting_payment"
  | "payment_received"
  | "transfer_in_progress"
  | "buyer_reviewing_transfer"
  | "transfer_complete"
  | "closed"
  | "cancelled";
export type AssetClosingPurchaseAgreementStatus = "not_sent" | "sent" | "signed" | "cancelled";
export type AssetClosingPaymentStatus =
  | "not_requested"
  | "invoice_sent"
  | "awaiting_payment"
  | "payment_received"
  | "payment_failed"
  | "refunded";
export type AssetClosingTransferStatus = "not_started" | "preparing" | "in_progress" | "waiting_on_buyer" | "complete";
export type AssetTransferChecklistItemStatus =
  | "not_started"
  | "in_progress"
  | "waiting_on_buyer"
  | "complete"
  | "blocked";

type Timestamp = string;

type RowBase = {
  id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type InsertRow<T extends RowBase> = Omit<T, "id" | "created_at" | "updated_at"> &
  Partial<Pick<T, "id" | "created_at" | "updated_at">>;

export type UpdateRow<T extends RowBase> = Partial<Omit<T, "id" | "created_at" | "updated_at">> &
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
  portal_preferences: PortalPreferences;
};

export type BuyerCuratedOpportunityRow = RowBase & {
  buyer_application_id: string;
  asset_packaging_id: string;
  status: BuyerCuratedOpportunityStatus;
  match_score: number;
  match_tier: BuyerCuratedOpportunityMatchTier;
  match_reasons: BuyerCuratedOpportunityReason[];
  safe_reasons: string[];
  assigned_at: string;
  assigned_by: string;
  buyer_last_viewed_at: string | null;
  buyer_action_status: BuyerCuratedOpportunityActionStatus | null;
  buyer_action_at: string | null;
  portal_note: string;
};

export type BuyerOpportunityAccessRow = RowBase & {
  buyer_application_id: string;
  asset_packaging_id: string;
  curated_assignment_id: string | null;
  status: BuyerOpportunityAccessStatus;
  granted_at: string;
  granted_by: string;
  expires_at: string | null;
  buyer_last_opened_at: string | null;
  portal_note: string;
  acknowledgement_required: boolean;
  acknowledgement_status: BuyerOpportunityAccessAcknowledgementStatus;
  acknowledgement_label: string;
  acknowledgement_text: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  review_due_at: string | null;
  revoked_at: string | null;
  revoked_by: string | null;
};

export type BuyerOpportunityAccessDocumentRow = RowBase & {
  buyer_opportunity_access_id: string;
  application_document_id: string;
  release_status: BuyerOpportunityAccessDocumentReleaseStatus;
  released_at: string;
  released_by: string;
  display_order: number;
  portal_label: string;
};

export type BuyerOpportunityAccessEventType =
  | "access_opened"
  | "document_viewed"
  | "document_downloaded"
  | "acknowledged"
  | "grant_extended"
  | "grant_revoked";
export type BuyerDiligenceRequestType =
  | "document_clarification"
  | "additional_material_request"
  | "financial_question"
  | "operations_question"
  | "other";
export type BuyerDiligenceRequestStatus = "submitted" | "under_review" | "fulfilled" | "declined" | "closed";

export type BuyerOpportunityAccessEventRow = RowBase & {
  buyer_opportunity_access_id: string;
  event_type: BuyerOpportunityAccessEventType;
  application_document_id: string | null;
  metadata: Record<string, unknown>;
};

export type BuyerDiligenceRequestRow = RowBase & {
  buyer_opportunity_access_id: string;
  application_document_id: string | null;
  request_type: BuyerDiligenceRequestType;
  title: string;
  buyer_message: string;
  status: BuyerDiligenceRequestStatus;
  admin_response_summary: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
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
  portal_preferences: PortalPreferences;
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
  readiness_status: ContractReadinessStatus;
  buyer_readiness_status: ContractPartyReadinessStatus;
  seller_readiness_status: ContractPartyReadinessStatus;
  readiness_reviewed_at: string | null;
  readiness_reviewed_by: string | null;
  buyer_packet_status: ContractPacketStatus;
  seller_packet_status: ContractPacketStatus;
  execution_status: ContractExecutionStatus;
  buyer_execution_status: ContractExecutionStatus;
  seller_execution_status: ContractExecutionStatus;
  execution_ready_at: string | null;
  execution_completed_at: string | null;
  execution_reviewed_by: string | null;
};

export type ContractPacketDocumentRow = RowBase & {
  contract_row_id: string;
  application_document_id: string;
  audience_role: ContractPacketAudienceRole;
  release_status: BuyerOpportunityAccessDocumentReleaseStatus;
  released_at: string;
  released_by: string;
  display_order: number;
  portal_label: string;
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

export type InvestorLeadVerificationStatus = "unverified" | "needs_review" | "verified" | "blocked";
export type InvestorLeadOutreachStatus = "draft" | "pending_approval" | "approved" | "blocked";
export type InvestorLeadSourceType =
  | "manual_entry"
  | "manual_import"
  | "crm_history"
  | "company_website"
  | "public_directory"
  | "investor_directory"
  | "marketplace_profile"
  | "public_search"
  | "uploaded_csv"
  | "purchased_list"
  | "other";
export type InvestorLeadOutreachChannel = "email" | "sms" | "linkedin" | "call";
export type InvestorLeadScoreBand = "strong" | "good" | "possible" | "manual_review";

export type InvestorLeadRow = RowBase & {
  asset_registry_id: string;
  full_name: string;
  company_name: string;
  title: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  location: string;
  industry: string;
  buyer_category: string;
  likely_asset_fit: string;
  estimated_capital_capacity: string | null;
  source_url: string;
  source_type: InvestorLeadSourceType;
  verification_status: InvestorLeadVerificationStatus;
  confidence_score: number;
  last_verified_date: string | null;
  outreach_owner: string;
  outreach_status: InvestorLeadOutreachStatus;
  outreach_draft: string;
  notes: string;
};

export type AssetLeadListRow = RowBase & {
  asset_registry_id: string;
  investor_lead_id: string;
  lead_score: number;
  lead_rank: number;
  generation_source: string;
  notes: string;
};

export type LeadSourceRow = RowBase & {
  investor_lead_id: string;
  asset_registry_id: string | null;
  source_type: InvestorLeadSourceType;
  source_url: string;
  source_title: string;
  proof_notes: string;
  verified_by: string;
};

export type LeadScoreRow = RowBase & {
  investor_lead_id: string;
  asset_registry_id: string;
  score: number;
  score_band: InvestorLeadScoreBand;
  score_breakdown: Record<string, unknown>;
  rationale: string;
  scored_by: string;
};

export type LeadOutreachTaskRow = RowBase & {
  investor_lead_id: string;
  asset_registry_id: string;
  channel: InvestorLeadOutreachChannel;
  subject: string;
  draft_body: string;
  approval_status: InvestorLeadOutreachStatus;
  approved_at: string | null;
  approved_by: string | null;
  notes: string;
};

export type LeadVerificationLogRow = RowBase & {
  investor_lead_id: string;
  asset_registry_id: string | null;
  verification_status: InvestorLeadVerificationStatus;
  source_url: string;
  source_type: InvestorLeadSourceType;
  verified_by: string;
  notes: string;
  metadata: Record<string, unknown>;
};

export type DoNotContactRow = RowBase & {
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin_url: string | null;
  reason: string;
  added_by: string;
  active: boolean;
};

export type DigitalAssetRow = RowBase & {
  name: string;
  slug: string;
  status: DigitalAssetStatus;
  asset_type: string | null;
  revenue_stage: string | null;
  build_status: string | null;
  asking_price: number | null;
  local_path: string | null;
  public_url: string | null;
  admin_url: string | null;
  github_repo_url: string | null;
  vercel_project_url: string | null;
  supabase_project_url: string | null;
  short_description: string | null;
  buyer_summary: string | null;
  visibility: DigitalAssetVisibility;
  nda_required: boolean;
  sale_readiness_score: number | null;
  notes: string | null;
};

export type DigitalAssetTaskRow = RowBase & {
  digital_asset_id: string;
  title: string;
  status: DigitalAssetTaskStatus;
  priority: DigitalAssetTaskPriority;
  due_date?: string | null;
  notes?: string | null;
};

export type DigitalAssetBuyerInterestRow = RowBase & {
  digital_asset_id: string;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  status: DigitalAssetBuyerInterestStatus;
  nda_status: DigitalAssetBuyerInterestNDAStatus;
  proof_of_funds_status: DigitalAssetBuyerInterestProofOfFundsStatus;
  last_contacted_at?: string | null;
  notes?: string | null;
  nda_sent_date?: string | null;
  nda_signed_date?: string | null;
  signed_nda_url?: string | null;
  next_follow_up_date?: string | null;
  buyer_stage?: DigitalAssetBuyerStage | null;
  document_generated_at?: string | null;
  invite_status?: string | null;
  invite_sent_at?: string | null;
  invite_token_hash?: string | null;
  invite_token_expires_at?: string | null;
  linked_user_id?: string | null;
  portal_access_status?: string | null;
  last_viewed_at?: string | null;
  nda_signed_name?: string | null;
  nda_signed_ip?: string | null;
  nda_signed_user_agent?: string | null;
  nda_version?: string | null;
};

export type AssetClosingRow = RowBase & {
  digital_asset_id: string;
  buyer_interest_id: string;
  buyer_application_id?: string | null;
  buyer_offer_submission_id?: string | null;
  offer_id?: string | null;
  contract_row_id?: string | null;
  transfer_row_id?: string | null;
  asset_packaging_id?: string | null;
  asset_registry_id?: string | null;
  accepted_offer_amount?: string | null;
  closing_status: AssetClosingStatus;
  purchase_agreement_status: AssetClosingPurchaseAgreementStatus;
  payment_status: AssetClosingPaymentStatus;
  transfer_status: AssetClosingTransferStatus;
  buyer_visible_status: string;
  internal_notes: string;
};

export type AssetTransferChecklistItemRow = RowBase & {
  asset_closing_id: string;
  label: string;
  status: AssetTransferChecklistItemStatus;
  is_buyer_visible: boolean;
  buyer_visible_label: string;
  internal_notes: string;
  completed_at?: string | null;
  sort_order: number;
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
  buyer_offer_invitation_id: string | null;
  proposed_price: string;
  structure_preference: string;
  financing_plan: string;
  target_close_date: string;
  notes: string;
  status: BuyerOfferSubmissionStatus;
  admin_notes: string;
  package_status: BuyerOfferPackageStatus;
  package_summary_note: string;
  presentation_status: BuyerOfferPresentationStatus;
  presented_at: string | null;
  presented_by: string | null;
  seller_review_status: BuyerOfferSellerReviewStatus;
  seller_reviewed_at: string | null;
  seller_response_summary: string;
  offer_record_id: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

export type BuyerOfferInvitationRow = RowBase & {
  buyer_opportunity_access_id: string;
  buyer_diligence_request_id: string | null;
  status: BuyerOfferInvitationStatus;
  invited_at: string;
  invited_by: string;
  expires_at: string | null;
  buyer_last_opened_at: string | null;
  buyer_response_status: BuyerOfferInvitationResponseStatus;
  buyer_response_at: string | null;
  portal_note: string;
  linked_offer_submission_id: string | null;
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
      buyer_curated_opportunities: {
        Row: BuyerCuratedOpportunityRow;
        Insert: InsertRow<BuyerCuratedOpportunityRow>;
        Update: UpdateRow<BuyerCuratedOpportunityRow>;
      };
      buyer_opportunity_access: {
        Row: BuyerOpportunityAccessRow;
        Insert: InsertRow<BuyerOpportunityAccessRow>;
        Update: UpdateRow<BuyerOpportunityAccessRow>;
      };
      buyer_opportunity_access_documents: {
        Row: BuyerOpportunityAccessDocumentRow;
        Insert: InsertRow<BuyerOpportunityAccessDocumentRow>;
        Update: UpdateRow<BuyerOpportunityAccessDocumentRow>;
      };
      buyer_opportunity_access_events: {
        Row: BuyerOpportunityAccessEventRow;
        Insert: InsertRow<BuyerOpportunityAccessEventRow>;
        Update: UpdateRow<BuyerOpportunityAccessEventRow>;
      };
      buyer_diligence_requests: {
        Row: BuyerDiligenceRequestRow;
        Insert: InsertRow<BuyerDiligenceRequestRow>;
        Update: UpdateRow<BuyerDiligenceRequestRow>;
      };
      buyer_offer_invitations: {
        Row: BuyerOfferInvitationRow;
        Insert: InsertRow<BuyerOfferInvitationRow>;
        Update: UpdateRow<BuyerOfferInvitationRow>;
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
      contract_packet_documents: {
        Row: ContractPacketDocumentRow;
        Insert: InsertRow<ContractPacketDocumentRow>;
        Update: UpdateRow<ContractPacketDocumentRow>;
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
      investor_leads: {
        Row: InvestorLeadRow;
        Insert: InsertRow<InvestorLeadRow>;
        Update: UpdateRow<InvestorLeadRow>;
      };
      asset_lead_lists: {
        Row: AssetLeadListRow;
        Insert: InsertRow<AssetLeadListRow>;
        Update: UpdateRow<AssetLeadListRow>;
      };
      lead_sources: {
        Row: LeadSourceRow;
        Insert: InsertRow<LeadSourceRow>;
        Update: UpdateRow<LeadSourceRow>;
      };
      lead_scores: {
        Row: LeadScoreRow;
        Insert: InsertRow<LeadScoreRow>;
        Update: UpdateRow<LeadScoreRow>;
      };
      lead_outreach_tasks: {
        Row: LeadOutreachTaskRow;
        Insert: InsertRow<LeadOutreachTaskRow>;
        Update: UpdateRow<LeadOutreachTaskRow>;
      };
      lead_verification_logs: {
        Row: LeadVerificationLogRow;
        Insert: InsertRow<LeadVerificationLogRow>;
        Update: UpdateRow<LeadVerificationLogRow>;
      };
      do_not_contact: {
        Row: DoNotContactRow;
        Insert: InsertRow<DoNotContactRow>;
        Update: UpdateRow<DoNotContactRow>;
      };
      digital_assets: {
        Row: DigitalAssetRow;
        Insert: InsertRow<DigitalAssetRow>;
        Update: UpdateRow<DigitalAssetRow>;
      };
      digital_asset_tasks: {
        Row: DigitalAssetTaskRow;
        Insert: InsertRow<DigitalAssetTaskRow>;
        Update: UpdateRow<DigitalAssetTaskRow>;
      };
      digital_asset_buyer_interest: {
        Row: DigitalAssetBuyerInterestRow;
        Insert: InsertRow<DigitalAssetBuyerInterestRow>;
        Update: UpdateRow<DigitalAssetBuyerInterestRow>;
      };
      asset_closings: {
        Row: AssetClosingRow;
        Insert: InsertRow<AssetClosingRow>;
        Update: UpdateRow<AssetClosingRow>;
      };
      asset_transfer_checklist_items: {
        Row: AssetTransferChecklistItemRow;
        Insert: InsertRow<AssetTransferChecklistItemRow>;
        Update: UpdateRow<AssetTransferChecklistItemRow>;
      };
    };
  };
};
