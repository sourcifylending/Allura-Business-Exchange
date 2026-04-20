create table if not exists public.portal_requests (
  id uuid primary key,
  target_role text not null,
  request_type text not null,
  title text not null,
  portal_instructions text not null,
  admin_notes text,
  status text not null default 'open',
  due_date timestamptz,
  buyer_application_id uuid references public.buyer_applications(id) on delete set null,
  seller_application_id uuid references public.seller_applications(id) on delete set null,
  asset_packaging_id uuid references public.asset_packaging(id) on delete set null,
  offer_id uuid references public.offers(id) on delete set null,
  contract_id uuid references public.contracts(id) on delete set null,
  transfer_id uuid references public.transfers(id) on delete set null,
  acknowledged_at timestamptz,
  acknowledged_by uuid,
  completed_at timestamptz,
  completed_by uuid,
  blocked_at timestamptz,
  blocked_by uuid,
  cancelled_at timestamptz,
  cancelled_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint portal_requests_target_role_check check (target_role in ('buyer', 'seller')),
  constraint portal_requests_request_type_check check (request_type in ('document_request', 'info_request', 'acknowledgment', 'next_step')),
  constraint portal_requests_status_check check (status in ('open', 'acknowledged', 'in_progress', 'completed', 'blocked', 'cancelled')),
  constraint portal_requests_target_application_check check (
    (
      target_role = 'buyer'
      and buyer_application_id is not null
      and seller_application_id is null
    )
    or (
      target_role = 'seller'
      and seller_application_id is not null
      and buyer_application_id is null
    )
  )
);

create index if not exists portal_requests_target_role_idx
  on public.portal_requests (target_role);

create index if not exists portal_requests_status_idx
  on public.portal_requests (status);

create index if not exists portal_requests_due_date_idx
  on public.portal_requests (due_date);

create index if not exists portal_requests_buyer_application_id_idx
  on public.portal_requests (buyer_application_id);

create index if not exists portal_requests_seller_application_id_idx
  on public.portal_requests (seller_application_id);

create index if not exists portal_requests_asset_packaging_id_idx
  on public.portal_requests (asset_packaging_id);

create index if not exists portal_requests_offer_id_idx
  on public.portal_requests (offer_id);

create index if not exists portal_requests_contract_id_idx
  on public.portal_requests (contract_id);

create index if not exists portal_requests_transfer_id_idx
  on public.portal_requests (transfer_id);

alter table public.application_documents
add column if not exists request_id uuid references public.portal_requests(id) on delete set null;

create index if not exists application_documents_request_id_idx
  on public.application_documents (request_id);
