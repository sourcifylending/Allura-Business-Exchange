alter table public.buyer_applications
  add column if not exists reviewed_at timestamptz null,
  add column if not exists reviewed_by uuid null,
  add column if not exists invited_at timestamptz null,
  add column if not exists invited_by uuid null,
  add column if not exists linked_user_id uuid null;

create index if not exists buyer_applications_status_created_at_idx
  on public.buyer_applications (status, created_at desc);

alter table public.seller_applications
  add column if not exists reviewed_at timestamptz null,
  add column if not exists reviewed_by uuid null,
  add column if not exists invited_at timestamptz null,
  add column if not exists invited_by uuid null,
  add column if not exists linked_user_id uuid null;

create index if not exists seller_applications_status_created_at_idx
  on public.seller_applications (status, created_at desc);
