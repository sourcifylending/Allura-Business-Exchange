alter table public.asset_packaging
add column if not exists seller_application_id uuid references public.seller_applications(id) on delete set null;

create index if not exists asset_packaging_seller_application_idx
  on public.asset_packaging (seller_application_id, portal_visible, created_at desc);

alter table public.buyer_offer_submissions
drop constraint if exists buyer_offer_submissions_status_check;

alter table public.buyer_offer_submissions
add constraint buyer_offer_submissions_status_check check (
  status in (
    'submitted',
    'under_review',
    'needs_follow_up',
    'approved_to_present',
    'converted_to_offer',
    'declined',
    'withdrawn'
  )
);
