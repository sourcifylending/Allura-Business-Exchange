create table if not exists public.asset_packaging (
  id uuid primary key default gen_random_uuid(),
  asset_registry_id uuid not null unique references public.asset_registry(id) on delete cascade,
  one_line_pitch text not null,
  short_listing_description text not null,
  full_summary text not null,
  buyer_type text not null,
  screenshots text not null,
  demo_link text not null,
  logo_brand_kit text not null,
  feature_summary text not null,
  stack_summary text not null,
  support_scope text not null,
  transfer_checklist text not null,
  asking_price text not null,
  status text not null default 'incomplete',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint asset_packaging_status_check check (status in ('incomplete', 'draft_ready', 'approved_for_listing'))
);

create trigger asset_packaging_touch_updated_at
before update on public.asset_packaging
for each row execute function public.touch_updated_at();

alter table public.asset_packaging enable row level security;

drop policy if exists "Authenticated access to asset packaging" on public.asset_packaging;
grant select, insert, update, delete on public.asset_packaging to authenticated;

create policy "Authenticated access to asset packaging"
on public.asset_packaging
for all
to authenticated
using (true)
with check (true);
