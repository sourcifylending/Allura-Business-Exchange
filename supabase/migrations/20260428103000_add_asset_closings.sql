create table if not exists public.asset_closings (
  id uuid primary key default gen_random_uuid(),
  digital_asset_id uuid not null references public.digital_assets(id) on delete cascade,
  buyer_interest_id uuid not null references public.digital_asset_buyer_interest(id) on delete cascade,
  buyer_application_id uuid references public.buyer_applications(id) on delete set null,
  buyer_offer_submission_id uuid references public.buyer_offer_submissions(id) on delete set null,
  offer_id uuid references public.offers(id) on delete set null,
  contract_row_id uuid references public.contracts(id) on delete set null,
  transfer_row_id uuid references public.transfers(id) on delete set null,
  asset_packaging_id uuid references public.asset_packaging(id) on delete set null,
  asset_registry_id uuid references public.asset_registry(id) on delete set null,
  accepted_offer_amount numeric,
  closing_status text not null default 'offer_accepted',
  purchase_agreement_status text not null default 'not_sent',
  payment_status text not null default 'not_requested',
  transfer_status text not null default 'not_started',
  buyer_visible_status text not null default 'Offer accepted. Purchase agreement pending.',
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint asset_closings_buyer_interest_id_key unique (buyer_interest_id),
  constraint asset_closings_closing_status_check check (
    closing_status in (
      'offer_accepted',
      'pa_sent',
      'pa_signed',
      'awaiting_payment',
      'payment_received',
      'transfer_in_progress',
      'buyer_reviewing_transfer',
      'transfer_complete',
      'closed',
      'cancelled'
    )
  ),
  constraint asset_closings_purchase_agreement_status_check check (
    purchase_agreement_status in ('not_sent', 'sent', 'signed', 'cancelled')
  ),
  constraint asset_closings_payment_status_check check (
    payment_status in ('not_requested', 'invoice_sent', 'awaiting_payment', 'payment_received', 'payment_failed', 'refunded')
  ),
  constraint asset_closings_transfer_status_check check (
    transfer_status in ('not_started', 'preparing', 'in_progress', 'waiting_on_buyer', 'complete')
  )
);

create trigger asset_closings_touch_updated_at
before update on public.asset_closings
for each row execute function public.touch_updated_at();

alter table public.asset_closings enable row level security;

drop policy if exists "Authenticated access to asset closings" on public.asset_closings;
grant select, insert, update, delete on public.asset_closings to authenticated;

create policy "Authenticated access to asset closings"
on public.asset_closings
for all
to authenticated
using (true)
with check (true);

create index asset_closings_digital_asset_id_idx on public.asset_closings(digital_asset_id);
create index asset_closings_buyer_application_id_idx on public.asset_closings(buyer_application_id);
create index asset_closings_offer_id_idx on public.asset_closings(offer_id);
create index asset_closings_contract_row_id_idx on public.asset_closings(contract_row_id);
create index asset_closings_transfer_row_id_idx on public.asset_closings(transfer_row_id);
create index asset_closings_status_idx on public.asset_closings(closing_status, payment_status, transfer_status);

create table if not exists public.asset_transfer_checklist_items (
  id uuid primary key default gen_random_uuid(),
  asset_closing_id uuid not null references public.asset_closings(id) on delete cascade,
  label text not null,
  status text not null default 'not_started',
  is_buyer_visible boolean not null default false,
  buyer_visible_label text not null default '',
  internal_notes text not null default '',
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint asset_transfer_checklist_items_status_check check (
    status in ('not_started', 'in_progress', 'waiting_on_buyer', 'complete', 'blocked')
  )
);

create trigger asset_transfer_checklist_items_touch_updated_at
before update on public.asset_transfer_checklist_items
for each row execute function public.touch_updated_at();

alter table public.asset_transfer_checklist_items enable row level security;

drop policy if exists "Authenticated access to asset transfer checklist items" on public.asset_transfer_checklist_items;
grant select, insert, update, delete on public.asset_transfer_checklist_items to authenticated;

create policy "Authenticated access to asset transfer checklist items"
on public.asset_transfer_checklist_items
for all
to authenticated
using (true)
with check (true);

create index asset_transfer_checklist_items_closing_id_idx on public.asset_transfer_checklist_items(asset_closing_id);
create index asset_transfer_checklist_items_status_idx on public.asset_transfer_checklist_items(status);
create index asset_transfer_checklist_items_sort_order_idx on public.asset_transfer_checklist_items(asset_closing_id, sort_order, created_at);

notify pgrst, 'reload schema';
