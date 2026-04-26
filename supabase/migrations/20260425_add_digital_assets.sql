create table if not exists public.digital_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'for_sale',
  asset_type text,
  revenue_stage text,
  build_status text,
  asking_price numeric,
  local_path text,
  public_url text,
  admin_url text,
  github_repo_url text,
  vercel_project_url text,
  supabase_project_url text,
  short_description text,
  buyer_summary text,
  visibility text not null default 'private',
  nda_required boolean not null default true,
  sale_readiness_score integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint digital_assets_status_check check (status in ('for_sale', 'in_build', 'sold', 'paused', 'internal')),
  constraint digital_assets_visibility_check check (visibility in ('private', 'public'))
);

create trigger digital_assets_touch_updated_at
before update on public.digital_assets
for each row execute function public.touch_updated_at();

alter table public.digital_assets enable row level security;

drop policy if exists "Authenticated access to digital assets" on public.digital_assets;
grant select, insert, update, delete on public.digital_assets to authenticated;

create policy "Authenticated access to digital assets"
on public.digital_assets
for all
to authenticated
using (true)
with check (true);

create table if not exists public.digital_asset_tasks (
  id uuid primary key default gen_random_uuid(),
  digital_asset_id uuid not null references public.digital_assets(id) on delete cascade,
  title text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint digital_asset_tasks_status_check check (status in ('open', 'in_progress', 'done', 'blocked')),
  constraint digital_asset_tasks_priority_check check (priority in ('low', 'normal', 'high', 'urgent'))
);

create trigger digital_asset_tasks_touch_updated_at
before update on public.digital_asset_tasks
for each row execute function public.touch_updated_at();

alter table public.digital_asset_tasks enable row level security;

drop policy if exists "Authenticated access to digital asset tasks" on public.digital_asset_tasks;
grant select, insert, update, delete on public.digital_asset_tasks to authenticated;

create policy "Authenticated access to digital asset tasks"
on public.digital_asset_tasks
for all
to authenticated
using (true)
with check (true);

create table if not exists public.digital_asset_buyer_interest (
  id uuid primary key default gen_random_uuid(),
  digital_asset_id uuid not null references public.digital_assets(id) on delete cascade,
  buyer_name text,
  buyer_email text,
  buyer_phone text,
  status text not null default 'new',
  nda_status text not null default 'not_sent',
  proof_of_funds_status text not null default 'not_requested',
  last_contacted_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint digital_asset_buyer_interest_status_check check (status in ('new', 'contacted', 'interested', 'qualified', 'not_fit', 'closed')),
  constraint digital_asset_buyer_interest_nda_check check (nda_status in ('not_sent', 'sent', 'signed', 'declined')),
  constraint digital_asset_buyer_interest_pof_check check (proof_of_funds_status in ('not_requested', 'requested', 'submitted', 'verified', 'rejected'))
);

create trigger digital_asset_buyer_interest_touch_updated_at
before update on public.digital_asset_buyer_interest
for each row execute function public.touch_updated_at();

alter table public.digital_asset_buyer_interest enable row level security;

drop policy if exists "Authenticated access to digital asset buyer interest" on public.digital_asset_buyer_interest;
grant select, insert, update, delete on public.digital_asset_buyer_interest to authenticated;

create policy "Authenticated access to digital asset buyer interest"
on public.digital_asset_buyer_interest
for all
to authenticated
using (true)
with check (true);

create index digital_assets_status_idx on public.digital_assets(status);
create index digital_asset_tasks_asset_id_idx on public.digital_asset_tasks(digital_asset_id);
create index digital_asset_buyer_interest_asset_id_idx on public.digital_asset_buyer_interest(digital_asset_id);
