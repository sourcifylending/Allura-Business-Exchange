alter table public.contracts
add column if not exists transfer_row_id uuid references public.transfers(id) on delete set null;

alter table public.contracts
drop constraint if exists contracts_status_check;

alter table public.contracts
add constraint contracts_status_check check (
  status in (
    'draft',
    'sent',
    'signed',
    'blocked',
    'in_review',
    'awaiting_admin',
    'ready_for_transfer',
    'transferred',
    'closed',
    'cancelled'
  )
);

create unique index if not exists contracts_transfer_row_id_key
  on public.contracts (transfer_row_id)
  where transfer_row_id is not null;

create index if not exists contracts_status_idx
  on public.contracts (status, updated_at desc);
