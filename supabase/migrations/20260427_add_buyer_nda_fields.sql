alter table public.digital_asset_buyer_interest
add column if not exists invite_status text default 'not_sent',
add column if not exists invite_sent_at timestamptz,
add column if not exists invite_token_hash text,
add column if not exists linked_user_id uuid,
add column if not exists portal_access_status text default 'invited',
add column if not exists last_viewed_at timestamptz,
add column if not exists nda_signed_name text,
add column if not exists nda_signed_ip text,
add column if not exists nda_signed_user_agent text,
add column if not exists nda_version text default 'sourcify-asset-sale-v1',
add column if not exists nda_signed_date timestamptz;

create index if not exists digital_asset_buyer_interest_email_idx on public.digital_asset_buyer_interest(buyer_email);
create index if not exists digital_asset_buyer_interest_invite_token_idx on public.digital_asset_buyer_interest(invite_token_hash);
create index if not exists digital_asset_buyer_interest_user_id_idx on public.digital_asset_buyer_interest(linked_user_id);
