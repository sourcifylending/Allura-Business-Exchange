create table if not exists public.business_underwriting (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  industry text not null,
  location text not null,
  years_in_business text not null,
  monthly_revenue_range text not null,
  cash_flow_range text not null,
  sde_owner_benefit text not null,
  debt_mca_lien_status text not null,
  customer_concentration text not null,
  owner_dependence text not null,
  transferability text not null,
  margin_quality text not null,
  growth_opportunity text not null,
  closing_friction text not null,
  spread_potential text not null,
  underwriting_status text not null default 'screening',
  risk_flags text[] not null default '{}'::text[],
  next_action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_underwriting_status_check check (
    underwriting_status in ('screening', 'reviewing', 'hold', 'approved', 'rejected')
  )
);

create trigger business_underwriting_touch_updated_at
before update on public.business_underwriting
for each row execute function public.touch_updated_at();

alter table public.business_underwriting enable row level security;

drop policy if exists "Authenticated access to business underwriting" on public.business_underwriting;
grant select, insert, update, delete on public.business_underwriting to authenticated;

create policy "Authenticated access to business underwriting"
on public.business_underwriting
for all
to authenticated
using (true)
with check (true);
