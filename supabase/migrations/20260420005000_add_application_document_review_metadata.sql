alter table public.application_documents
  add column if not exists reviewed_at timestamptz null,
  add column if not exists reviewed_by uuid null;

create index if not exists application_documents_queue_idx
  on public.application_documents (application_type, status, document_type, created_at desc);

create index if not exists application_documents_access_idx
  on public.application_documents (application_type, application_id, owner_user_id, created_at desc);
