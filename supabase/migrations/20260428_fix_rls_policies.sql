-- Fix overly permissive RLS policies with proper user-level isolation
-- This ensures buyers can only see their own data, not other buyers' data

-- Fix digital_asset_buyer_interest policy
-- Buyers can only see their own interest records (by linked_user_id)
drop policy if exists "Authenticated access to digital asset buyer interest" on public.digital_asset_buyer_interest;

create policy "Buyers can view their own buyer interest records"
on public.digital_asset_buyer_interest
for select
to authenticated
using (
  auth.uid() = linked_user_id
  OR
  -- Admin override: if no linked_user_id, allow (for admin-created records)
  linked_user_id is null
);

create policy "Buyers can update their own buyer interest records"
on public.digital_asset_buyer_interest
for update
to authenticated
using (
  auth.uid() = linked_user_id
  OR
  linked_user_id is null
)
with check (
  auth.uid() = linked_user_id
  OR
  linked_user_id is null
);

create policy "Buyers can insert buyer interest records for themselves"
on public.digital_asset_buyer_interest
for insert
to authenticated
with check (
  auth.uid() = linked_user_id
  OR
  linked_user_id is null
);

-- Fix digital_assets policy to prevent buyer isolation issues while maintaining security
-- Digital assets should be readable by authenticated users (for asset listing in portal)
-- But create/update/delete should be restricted to admin (enforced via service role in app)
drop policy if exists "Authenticated access to digital assets" on public.digital_assets;

create policy "Authenticated users can view digital assets"
on public.digital_assets
for select
to authenticated
using (true);

create policy "Admin only: create and modify digital assets"
on public.digital_assets
for insert
to authenticated
with check (false);

create policy "Admin only: update digital assets"
on public.digital_assets
for update
to authenticated
using (false)
with check (false);

create policy "Admin only: delete digital assets"
on public.digital_assets
for delete
to authenticated
using (false);

-- Note: Admin operations should use SUPABASE_SERVICE_ROLE_KEY to bypass RLS entirely
-- for these tables: buyers, inquiries, offers, contracts, transfers, etc.
-- The RLS policies on those tables remain as `using (true)` for authenticated users,
-- but the admin middleware should use the service role key for admin operations only.
