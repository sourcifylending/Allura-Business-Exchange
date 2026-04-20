create or replace function public.is_allura_admin()
returns boolean
language sql
stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = 'abelf305@gmail.com', false)
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

grant execute on function public.is_allura_admin() to anon, authenticated;

drop policy if exists "Authenticated access to buyer applications" on public.buyer_applications;
drop policy if exists "Authenticated access to seller applications" on public.seller_applications;

drop policy if exists "Admin review buyer applications" on public.buyer_applications;
create policy "Admin review buyer applications"
on public.buyer_applications
for select
to authenticated
using (public.is_allura_admin());

create policy "Admin update buyer applications"
on public.buyer_applications
for update
to authenticated
using (public.is_allura_admin())
with check (public.is_allura_admin());

drop policy if exists "Admin review seller applications" on public.seller_applications;
create policy "Admin review seller applications"
on public.seller_applications
for select
to authenticated
using (public.is_allura_admin());

create policy "Admin update seller applications"
on public.seller_applications
for update
to authenticated
using (public.is_allura_admin())
with check (public.is_allura_admin());
