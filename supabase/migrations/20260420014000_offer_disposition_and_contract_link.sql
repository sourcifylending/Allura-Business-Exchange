alter table public.offers
add column if not exists disposition_status text,
add column if not exists disposition_note text,
add column if not exists disposition_at timestamptz,
add column if not exists disposition_by uuid,
add column if not exists contract_row_id uuid references public.contracts(id) on delete set null;

alter table public.offers
drop constraint if exists offers_disposition_status_check;

alter table public.offers
add constraint offers_disposition_status_check check (
  disposition_status is null
  or disposition_status in (
    'seller_review',
    'seller_interested',
    'seller_declined',
    'request_follow_up',
    'advance_to_contract',
    'close_out'
  )
);

create unique index if not exists offers_contract_row_id_key
  on public.offers (contract_row_id)
  where contract_row_id is not null;

create index if not exists offers_disposition_status_idx
  on public.offers (disposition_status, updated_at desc);
