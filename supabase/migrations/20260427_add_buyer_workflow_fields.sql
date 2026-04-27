-- Add buyer workflow tracking fields to digital_asset_buyer_interest
alter table if exists public.digital_asset_buyer_interest
add column if not exists nda_sent_date timestamptz,
add column if not exists nda_signed_date timestamptz,
add column if not exists signed_nda_url text,
add column if not exists next_follow_up_date date,
add column if not exists buyer_stage text default 'new',
add column if not exists document_generated_at timestamptz;

-- Add constraint for buyer_stage values
alter table public.digital_asset_buyer_interest
drop constraint if exists digital_asset_buyer_interest_buyer_stage_check;

alter table public.digital_asset_buyer_interest
add constraint digital_asset_buyer_interest_buyer_stage_check
check (buyer_stage in ('new', 'nda_sent', 'nda_signed', 'reviewing', 'offer', 'closed', 'dead'));
