alter table public.transfers
add column if not exists archived_at timestamptz;

alter table public.transfers
add column if not exists archived_by uuid;

create index if not exists transfers_archived_at_idx
  on public.transfers (archived_at desc);
