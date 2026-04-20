alter table public.transfers
add column if not exists workflow_status text not null default 'queued';

alter table public.transfers
add column if not exists closeout_ready_at timestamptz;

alter table public.transfers
add column if not exists completed_at timestamptz;

alter table public.transfers
add column if not exists internal_notes text;

update public.transfers
set workflow_status = case overall_transfer_status
  when 'not_started' then 'queued'
  when 'in_progress' then 'in_progress'
  when 'blocked' then 'pending_admin'
  when 'complete' then 'completed'
  else workflow_status
end
where workflow_status = 'queued';

alter table public.transfers
drop constraint if exists transfers_workflow_status_check;

alter table public.transfers
add constraint transfers_workflow_status_check check (
  workflow_status in (
    'queued',
    'in_progress',
    'pending_docs',
    'pending_admin',
    'ready_to_close',
    'completed',
    'cancelled'
  )
);

create index if not exists transfers_workflow_status_idx
  on public.transfers (workflow_status, updated_at desc);
