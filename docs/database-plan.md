# Database Plan

## Goal
Define a first-pass schema that supports the current shell without overbuilding.

## First-Pass Tables

### `profiles`
- `id`
- `user_id`
- `role`
- `display_name`
- `email`
- `account_status`
- `created_at`
- `updated_at`

### `market_radar_ideas`
- `id`
- `niche_industry`
- `problem_statement`
- `target_buyer`
- `urgency_of_pain`
- `competition_level`
- `build_complexity`
- `speed_to_build_score`
- `speed_to_sell_score`
- `sale_price_band`
- `saleability_score`
- `demand_notes`
- `reason_to_build_now`
- `status`
- `created_at`
- `updated_at`

### `ai_assets`
- `id`
- `asset_name`
- `brand_name`
- `slug`
- `niche`
- `target_buyer_type`
- `current_stage`
- `local_path`
- `repo_url`
- `live_url`
- `demo_url`
- `domain`
- `hosting_status`
- `code_status`
- `packaging_status`
- `listing_status`
- `asking_price`
- `ownership_type`
- `transfer_status`
- `notes`
- `created_at`
- `updated_at`

### `packaging_records`
- `id`
- `asset_id`
- `one_line_pitch`
- `short_listing_description`
- `full_summary`
- `buyer_type`
- `screenshots`
- `demo_link`
- `logo_brand_kit`
- `feature_summary`
- `stack_summary`
- `support_scope`
- `transfer_checklist`
- `asking_price`
- `status`
- `created_at`
- `updated_at`

### `buyers`
- `id`
- `display_name`
- `buyer_type`
- `budget`
- `niches_of_interest`
- `asset_preferences`
- `proof_of_funds_status`
- `operator_vs_investor`
- `urgency`
- `inquiry_history`
- `current_stage`
- `next_action`
- `created_at`
- `updated_at`

### `inquiries`
- `id`
- `buyer_id`
- `asset_id`
- `source`
- `timestamp`
- `qualification_status`
- `assigned_owner`
- `next_step`
- `response_sla`
- `stage`
- `notes_summary`
- `created_at`
- `updated_at`

### `offers`
- `id`
- `asset_id`
- `buyer_id`
- `asking_price`
- `offer_amount`
- `counteroffer_status`
- `accepted_terms`
- `stage`
- `next_action`
- `owner`
- `target_close_date`
- `created_at`
- `updated_at`

### `contracts`
- `id`
- `contract_record_id`
- `asset_id`
- `buyer_id`
- `contract_type`
- `status`
- `sent_date`
- `signature_status`
- `document_status`
- `payment_status`
- `notes`
- `created_at`
- `updated_at`

### `transfers`
- `id`
- `asset_id`
- `buyer_id`
- `repo_transfer_status`
- `domain_transfer_status`
- `hosting_transfer_status`
- `admin_account_transfer_status`
- `documentation_delivery`
- `support_window`
- `overall_transfer_status`
- `next_action`
- `created_at`
- `updated_at`

### `business_intake`
- `id`
- `legal_business_name`
- `dba`
- `industry`
- `location`
- `years_in_business`
- `monthly_revenue_range`
- `cash_flow_profit_range`
- `reason_for_selling`
- `debt_liens_mca_disclosure`
- `number_of_employees`
- `owner_involvement`
- `equipment_assets`
- `transferability_notes`
- `uploads_placeholder`
- `intake_status`
- `review_status`
- `next_action`
- `created_at`
- `updated_at`

### `business_underwriting`
- `id`
- `business_intake_id`
- `business_name`
- `industry`
- `location`
- `years_in_business`
- `monthly_revenue_range`
- `cash_flow_profit_range`
- `sde_owner_benefit_placeholder`
- `debt_mca_lien_status`
- `customer_concentration`
- `owner_dependence`
- `transferability`
- `margin_quality`
- `growth_opportunity`
- `closing_friction`
- `spread_potential`
- `overall_underwriting_status`
- `risk_flags`
- `next_action`
- `created_at`
- `updated_at`

### `deal_rooms`
- `id`
- `opportunity_name`
- `listing_type`
- `visibility_mode`
- `approved_viewer_id`
- `access_status`
- `nda_required_status`
- `approval_status`
- `summary_section`
- `documents_section`
- `notes_qna`
- `timeline_milestones`
- `transfer_or_diligence_status`
- `next_action`
- `created_at`
- `updated_at`

## Relationship Overview
- `profiles` links to auth users later.
- `ai_assets` can feed `packaging_records`, `inquiries`, `offers`, `contracts`, `transfers`, and `deal_rooms`.
- `buyers` link to `inquiries`, `offers`, `contracts`, `transfers`, and `deal_rooms`.
- `business_intake` feeds `business_underwriting`.
- `business_underwriting` can later feed `deal_rooms` for approved access.

## What Can Wait
- Activity logs.
- Notifications.
- Comments.
- File storage tables.
- Audit trails beyond the basics.
- Analytics summaries.
- Advanced workflow history.

