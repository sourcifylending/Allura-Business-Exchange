create table if not exists public.buyer_offer_submissions (
  id uuid primary key default gen_random_uuid(),
  buyer_application_id uuid not null references public.buyer_applications(id) on delete cascade,
  asset_packaging_id uuid not null references public.asset_packaging(id) on delete cascade,
  owner_user_id uuid not null,
  proposed_price text not null,
  structure_preference text not null,
  financing_plan text not null,
  target_close_date date not null,
  notes text not null,
  status text not null default 'submitted',
  admin_notes text not null default '',
  offer_record_id uuid references public.offers(id) on delete set null,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint buyer_offer_submissions_status_check check (
    status in ('submitted', 'under_review', 'needs_follow_up', 'approved_to_present', 'declined', 'withdrawn')
  )
);

create unique index if not exists buyer_offer_submissions_unique_idx
  on public.buyer_offer_submissions (buyer_application_id, asset_packaging_id);

create index if not exists buyer_offer_submissions_owner_idx
  on public.buyer_offer_submissions (owner_user_id, created_at desc);

create index if not exists buyer_offer_submissions_status_idx
  on public.buyer_offer_submissions (status, created_at desc);

create index if not exists buyer_offer_submissions_asset_idx
  on public.buyer_offer_submissions (asset_packaging_id, created_at desc);

drop trigger if exists buyer_offer_submissions_touch_updated_at on public.buyer_offer_submissions;
create trigger buyer_offer_submissions_touch_updated_at
before update on public.buyer_offer_submissions
for each row execute function public.touch_updated_at();

alter table public.buyer_offer_submissions enable row level security;

drop policy if exists "Authenticated users can view their buyer offer submissions" on public.buyer_offer_submissions;
drop policy if exists "Authenticated users can insert their buyer offer submissions" on public.buyer_offer_submissions;
drop policy if exists "Authenticated users can update their buyer offer submissions" on public.buyer_offer_submissions;

grant select, insert, update on public.buyer_offer_submissions to authenticated;

create policy "Authenticated users can view their buyer offer submissions"
on public.buyer_offer_submissions
for select
to authenticated
using (owner_user_id = auth.uid());

create policy "Authenticated users can insert their buyer offer submissions"
on public.buyer_offer_submissions
for insert
to authenticated
with check (owner_user_id = auth.uid());

create policy "Authenticated users can update their buyer offer submissions"
on public.buyer_offer_submissions
for update
to authenticated
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());
