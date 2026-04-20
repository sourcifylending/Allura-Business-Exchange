create table if not exists public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_type text not null check (application_type in ('buyer', 'seller')),
  application_id uuid not null,
  owner_user_id uuid not null,
  file_name text not null,
  storage_path text not null,
  mime_type text not null,
  file_size integer not null check (file_size > 0),
  document_type text not null,
  status text not null default 'uploaded' check (status in ('uploaded', 'received', 'under_review', 'approved', 'rejected')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists application_documents_storage_path_key
  on public.application_documents (storage_path);

create index if not exists application_documents_application_lookup_idx
  on public.application_documents (application_type, application_id, created_at desc);

create index if not exists application_documents_owner_lookup_idx
  on public.application_documents (owner_user_id, created_at desc);

create index if not exists application_documents_status_lookup_idx
  on public.application_documents (status, created_at desc);

drop trigger if exists application_documents_updated_at on public.application_documents;
create trigger application_documents_updated_at
before update on public.application_documents
for each row
execute function public.touch_updated_at();

alter table public.application_documents enable row level security;

drop policy if exists "Authenticated users can view their application documents" on public.application_documents;
create policy "Authenticated users can view their application documents"
on public.application_documents
for select
to authenticated
using (owner_user_id = auth.uid());

drop policy if exists "Authenticated users can upload their application documents" on public.application_documents;
create policy "Authenticated users can upload their application documents"
on public.application_documents
for insert
to authenticated
with check (owner_user_id = auth.uid());
