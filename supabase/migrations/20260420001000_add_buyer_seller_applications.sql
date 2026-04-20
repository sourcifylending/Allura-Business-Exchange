create table if not exists public.buyer_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_name text not null,
  email text not null,
  phone text not null,
  buyer_type text not null,
  budget_range text not null,
  niches_of_interest text[] not null default '{}'::text[],
  asset_preferences text[] not null default '{}'::text[],
  proof_of_funds_status text not null default 'not_shown',
  urgency text not null default 'medium',
  message text not null,
  status text not null default 'submitted',
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint buyer_applications_buyer_type_check check (buyer_type in ('operator', 'investor', 'hybrid')),
  constraint buyer_applications_proof_of_funds_status_check check (
    proof_of_funds_status in ('not_shown', 'unverified', 'verified')
  ),
  constraint buyer_applications_urgency_check check (urgency in ('low', 'medium', 'high')),
  constraint buyer_applications_status_check check (
    status in ('submitted', 'under_review', 'approved', 'rejected', 'invited', 'activated')
  )
);

create trigger buyer_applications_touch_updated_at
before update on public.buyer_applications
for each row execute function public.touch_updated_at();

alter table public.buyer_applications enable row level security;

drop policy if exists "Public insert buyer applications" on public.buyer_applications;
drop policy if exists "Authenticated access to buyer applications" on public.buyer_applications;

grant insert on public.buyer_applications to anon;
grant select, update on public.buyer_applications to authenticated;

create policy "Public insert buyer applications"
on public.buyer_applications
for insert
to anon
with check (true);

create policy "Authenticated select buyer applications"
on public.buyer_applications
for select
to authenticated
using (true);

create policy "Authenticated update buyer applications"
on public.buyer_applications
for update
to authenticated
using (true)
with check (true);

create table if not exists public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_name text not null,
  email text not null,
  phone text not null,
  business_name text not null,
  website text not null default '',
  industry text not null,
  asset_type text not null,
  asking_price_range text not null,
  summary text not null,
  reason_for_selling text not null,
  status text not null default 'submitted',
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seller_applications_status_check check (
    status in ('submitted', 'under_review', 'approved', 'rejected', 'invited', 'activated')
  )
);

create trigger seller_applications_touch_updated_at
before update on public.seller_applications
for each row execute function public.touch_updated_at();

alter table public.seller_applications enable row level security;

drop policy if exists "Public insert seller applications" on public.seller_applications;
drop policy if exists "Authenticated access to seller applications" on public.seller_applications;

grant insert on public.seller_applications to anon;
grant select, update on public.seller_applications to authenticated;

create policy "Public insert seller applications"
on public.seller_applications
for insert
to anon
with check (true);

create policy "Authenticated select seller applications"
on public.seller_applications
for select
to authenticated
using (true);

create policy "Authenticated update seller applications"
on public.seller_applications
for update
to authenticated
using (true)
with check (true);
