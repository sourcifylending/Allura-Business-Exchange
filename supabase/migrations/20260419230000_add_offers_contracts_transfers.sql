create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  asset_name text not null,
  buyer_id uuid references public.buyers(id) on delete set null,
  buyer_name text not null,
  asking_price text not null,
  offer_amount text not null,
  counteroffer_status text not null,
  accepted_terms text not null,
  stage text not null default 'offered',
  next_action text not null,
  owner text not null,
  target_close_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_stage_check check (stage in ('offered', 'countered', 'accepted', 'waiting'))
);

create trigger offers_touch_updated_at
before update on public.offers
for each row execute function public.touch_updated_at();

alter table public.offers enable row level security;

drop policy if exists "Authenticated access to offers" on public.offers;
grant select, insert, update, delete on public.offers to authenticated;

create policy "Authenticated access to offers"
on public.offers
for all
to authenticated
using (true)
with check (true);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  contract_record_id text not null unique,
  asset_name text not null,
  buyer_id uuid references public.buyers(id) on delete set null,
  buyer_name text not null,
  contract_type text not null,
  status text not null default 'draft',
  sent_date date not null,
  signature_status text not null default 'not_sent',
  document_status text not null,
  payment_status text not null default 'pending',
  notes text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contracts_status_check check (status in ('draft', 'sent', 'signed', 'blocked')),
  constraint contracts_signature_status_check check (signature_status in ('not_sent', 'pending', 'complete')),
  constraint contracts_payment_status_check check (payment_status in ('pending', 'received', 'blocked'))
);

create trigger contracts_touch_updated_at
before update on public.contracts
for each row execute function public.touch_updated_at();

alter table public.contracts enable row level security;

drop policy if exists "Authenticated access to contracts" on public.contracts;
grant select, insert, update, delete on public.contracts to authenticated;

create policy "Authenticated access to contracts"
on public.contracts
for all
to authenticated
using (true)
with check (true);

create table if not exists public.transfers (
  id uuid primary key default gen_random_uuid(),
  asset_name text not null,
  buyer_id uuid references public.buyers(id) on delete set null,
  buyer_name text not null,
  repo_transfer_status text not null default 'not_started',
  domain_transfer_status text not null default 'not_started',
  hosting_transfer_status text not null default 'not_started',
  admin_account_transfer_status text not null default 'not_started',
  documentation_delivery text not null,
  support_window text not null,
  overall_transfer_status text not null default 'not_started',
  next_action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transfers_repo_status_check check (repo_transfer_status in ('not_started', 'in_progress', 'blocked', 'complete')),
  constraint transfers_domain_status_check check (domain_transfer_status in ('not_started', 'in_progress', 'blocked', 'complete')),
  constraint transfers_hosting_status_check check (hosting_transfer_status in ('not_started', 'in_progress', 'blocked', 'complete')),
  constraint transfers_admin_status_check check (admin_account_transfer_status in ('not_started', 'in_progress', 'blocked', 'complete')),
  constraint transfers_overall_status_check check (overall_transfer_status in ('not_started', 'in_progress', 'blocked', 'complete'))
);

create trigger transfers_touch_updated_at
before update on public.transfers
for each row execute function public.touch_updated_at();

alter table public.transfers enable row level security;

drop policy if exists "Authenticated access to transfers" on public.transfers;
grant select, insert, update, delete on public.transfers to authenticated;

create policy "Authenticated access to transfers"
on public.transfers
for all
to authenticated
using (true)
with check (true);
