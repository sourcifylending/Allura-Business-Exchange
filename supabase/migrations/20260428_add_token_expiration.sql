-- Add token expiration to digital_asset_buyer_interest for secure invite flow
alter table public.digital_asset_buyer_interest
add column if not exists invite_token_expires_at timestamptz;

-- Create index for efficient token expiration queries
create index if not exists digital_asset_buyer_interest_token_expires_idx
on public.digital_asset_buyer_interest(invite_token_expires_at);
