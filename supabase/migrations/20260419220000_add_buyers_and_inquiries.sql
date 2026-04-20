create table if not exists public.buyers (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_type text not null,
  budget text not null,
  niches_of_interest text[] not null default '{}'::text[],
  asset_preferences text[] not null default '{}'::text[],
  proof_of_funds_status text not null default 'not_shown',
  operator_or_investor text not null,
  urgency text not null,
  inquiry_history text not null,
  current_stage text not null default 'new',
  next_action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint buyers_type_check check (buyer_type in ('operator', 'investor', 'hybrid')),
  constraint buyers_proof_of_funds_check check (proof_of_funds_status in ('not_shown', 'unverified', 'verified')),
  constraint buyers_operator_or_investor_check check (operator_or_investor in ('operator', 'investor', 'hybrid')),
  constraint buyers_urgency_check check (urgency in ('low', 'medium', 'high')),
  constraint buyers_stage_check check (current_stage in ('new', 'qualified', 'active', 'watching', 'closed'))
);

create trigger buyers_touch_updated_at
before update on public.buyers
for each row execute function public.touch_updated_at();

alter table public.buyers enable row level security;

drop policy if exists "Authenticated access to buyers" on public.buyers;
grant select, insert, update, delete on public.buyers to authenticated;

create policy "Authenticated access to buyers"
on public.buyers
for all
to authenticated
using (true)
with check (true);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  asset_interested_in text not null,
  buyer_id uuid references public.buyers(id) on delete set null,
  "timestamp" timestamptz not null default now(),
  qualification_status text not null default 'new',
  assigned_owner text not null,
  next_step text not null,
  response_sla text not null,
  stage text not null default 'inbox',
  notes_summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inquiries_qualification_status_check check (qualification_status in ('new', 'reviewing', 'qualified', 'not_fit', 'waiting')),
  constraint inquiries_stage_check check (stage in ('inbox', 'triage', 'qualified', 'handoff', 'closed'))
);

create trigger inquiries_touch_updated_at
before update on public.inquiries
for each row execute function public.touch_updated_at();

alter table public.inquiries enable row level security;

drop policy if exists "Authenticated access to inquiries" on public.inquiries;
grant select, insert, update, delete on public.inquiries to authenticated;

create policy "Authenticated access to inquiries"
on public.inquiries
for all
to authenticated
using (true)
with check (true);
