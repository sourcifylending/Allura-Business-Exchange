alter table public.asset_packaging
  add column if not exists portal_visible boolean not null default false,
  add column if not exists portal_summary text not null default '';

create index if not exists asset_packaging_portal_visible_idx
  on public.asset_packaging (portal_visible, created_at desc);

create table if not exists public.buyer_opportunity_interactions (
  id uuid primary key default gen_random_uuid(),
  buyer_application_id uuid not null references public.buyer_applications(id) on delete cascade,
  asset_packaging_id uuid not null references public.asset_packaging(id) on delete cascade,
  owner_user_id uuid not null,
  interaction_type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint buyer_opportunity_interactions_type_check check (interaction_type in ('interest', 'saved'))
);

create unique index if not exists buyer_opportunity_interactions_unique_idx
  on public.buyer_opportunity_interactions (buyer_application_id, asset_packaging_id, interaction_type);

create index if not exists buyer_opportunity_interactions_owner_idx
  on public.buyer_opportunity_interactions (owner_user_id, created_at desc);

create index if not exists buyer_opportunity_interactions_asset_idx
  on public.buyer_opportunity_interactions (asset_packaging_id, created_at desc);

create index if not exists buyer_opportunity_interactions_type_idx
  on public.buyer_opportunity_interactions (interaction_type, created_at desc);

drop trigger if exists buyer_opportunity_interactions_touch_updated_at on public.buyer_opportunity_interactions;
create trigger buyer_opportunity_interactions_touch_updated_at
before update on public.buyer_opportunity_interactions
for each row execute function public.touch_updated_at();

alter table public.buyer_opportunity_interactions enable row level security;

drop policy if exists "Authenticated users can view their buyer opportunity interactions" on public.buyer_opportunity_interactions;
drop policy if exists "Authenticated users can insert their buyer opportunity interactions" on public.buyer_opportunity_interactions;
drop policy if exists "Authenticated users can update their buyer opportunity interactions" on public.buyer_opportunity_interactions;

grant select, insert, update on public.buyer_opportunity_interactions to authenticated;

create policy "Authenticated users can view their buyer opportunity interactions"
on public.buyer_opportunity_interactions
for select
to authenticated
using (owner_user_id = auth.uid());

create policy "Authenticated users can insert their buyer opportunity interactions"
on public.buyer_opportunity_interactions
for insert
to authenticated
with check (owner_user_id = auth.uid());

create policy "Authenticated users can update their buyer opportunity interactions"
on public.buyer_opportunity_interactions
for update
to authenticated
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());
