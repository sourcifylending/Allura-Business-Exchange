create extension if not exists pgcrypto;

grant usage on schema public to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.market_radar (
  id uuid primary key default gen_random_uuid(),
  niche_industry text not null,
  problem_statement text not null,
  target_buyer text not null,
  urgency_of_pain text not null,
  competition_level text not null,
  build_complexity text not null,
  speed_to_build_score integer not null check (speed_to_build_score between 0 and 10),
  speed_to_sell_score integer not null check (speed_to_sell_score between 0 and 10),
  likely_sale_price_band text not null,
  saleability_score integer not null check (saleability_score between 0 and 100),
  demand_notes text not null,
  reason_to_build_now text not null,
  status text not null default 'idea',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint market_radar_urgency_check check (urgency_of_pain in ('low', 'medium', 'high')),
  constraint market_radar_competition_check check (competition_level in ('low', 'medium', 'high')),
  constraint market_radar_complexity_check check (build_complexity in ('low', 'medium', 'high')),
  constraint market_radar_status_check check (status in ('idea', 'researching', 'approved', 'rejected', 'later'))
);

create trigger market_radar_touch_updated_at
before update on public.market_radar
for each row execute function public.touch_updated_at();

alter table public.market_radar enable row level security;

drop policy if exists "Authenticated access to market radar" on public.market_radar;
grant select, insert, update, delete on public.market_radar to authenticated;

create policy "Authenticated access to market radar"
on public.market_radar
for all
to authenticated
using (true)
with check (true);

create table if not exists public.asset_registry (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null unique,
  asset_name text not null,
  slug text not null unique,
  niche text not null,
  target_buyer_type text not null,
  current_stage text not null,
  local_path text not null,
  repo_url text not null,
  live_url text not null,
  demo_url text not null,
  domain text not null,
  hosting_status text not null,
  code_status text not null,
  packaging_status text not null,
  listing_status text not null,
  asking_price text not null,
  ownership_type text not null,
  transfer_status text not null,
  notes text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint asset_registry_stage_check check (current_stage in ('idea', 'research', 'build', 'packaging', 'ready_to_list', 'listed')),
  constraint asset_registry_hosting_check check (hosting_status in ('not_deployed', 'local', 'staging', 'live', 'held')),
  constraint asset_registry_code_check check (code_status in ('not_started', 'in_progress', 'ready', 'needs_work')),
  constraint asset_registry_packaging_check check (packaging_status in ('incomplete', 'draft_ready', 'approved')),
  constraint asset_registry_listing_check check (listing_status in ('not_ready', 'draft', 'listed')),
  constraint asset_registry_ownership_check check (ownership_type in ('individual', 'llc', 'dba')),
  constraint asset_registry_transfer_check check (transfer_status in ('not_ready', 'drafting', 'ready', 'in_progress'))
);

create trigger asset_registry_touch_updated_at
before update on public.asset_registry
for each row execute function public.touch_updated_at();

alter table public.asset_registry enable row level security;

drop policy if exists "Authenticated access to asset registry" on public.asset_registry;
grant select, insert, update, delete on public.asset_registry to authenticated;

create policy "Authenticated access to asset registry"
on public.asset_registry
for all
to authenticated
using (true)
with check (true);

create table if not exists public.business_intake (
  id uuid primary key default gen_random_uuid(),
  legal_business_name text not null,
  dba text not null,
  industry text not null,
  location text not null,
  years_in_business text not null,
  monthly_revenue_range text not null,
  cash_flow_profit_range text not null,
  reason_for_selling text not null,
  debt_liens_mca_disclosure text not null,
  number_of_employees text not null,
  owner_involvement text not null,
  equipment_assets text not null,
  transferability_notes text not null,
  uploads_placeholder_list text[] not null default '{}'::text[],
  intake_status text not null default 'new',
  review_status text not null default 'pending',
  next_action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_intake_status_check check (intake_status in ('new', 'in_review', 'needs_info', 'complete')),
  constraint business_review_status_check check (review_status in ('pending', 'clear', 'red_flags', 'hold'))
);

create trigger business_intake_touch_updated_at
before update on public.business_intake
for each row execute function public.touch_updated_at();

alter table public.business_intake enable row level security;

drop policy if exists "Authenticated access to business intake" on public.business_intake;
grant select, insert, update, delete on public.business_intake to authenticated;

create policy "Authenticated access to business intake"
on public.business_intake
for all
to authenticated
using (true)
with check (true);
