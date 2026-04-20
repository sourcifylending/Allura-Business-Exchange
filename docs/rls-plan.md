# RLS Plan

## Goal
Define row-level security direction now so the later implementation can be controlled and predictable.

## Access Model
- Internal admin access first.
- Buyer access later.
- Seller access later.
- Free-account access later.
- Approved-only deal room access for private records.

## Policy Direction for Later

### Admin Access
- Admins can read and write all internal records they are allowed to manage.
- Admin-only modules should be blocked from public users by default.

### Buyer Access
- Buyers should only see their approved opportunities, inquiries, offers, contracts, transfers, and deal rooms later.

### Seller Access
- Sellers should only see their own intake, deal status, and approved access surfaces later.

### Deal Room Access
- Deal rooms should be accessible only to approved viewers.
- NDA-required records should remain hidden until approval logic is satisfied.

### Business Opportunity Visibility
- Business records should remain controlled and sanitized by default.
- Full details should only appear after approval and scoped access later.

## Policies to Exist Later
- Admin full-access policy.
- Buyer own-record read policy.
- Buyer own-record write policy where needed.
- Seller own-record read policy.
- Seller own-record write policy where needed.
- Approved deal room read policy.
- Approved deal room document read policy.
- Sanitized business opportunity read policy.
- Internal admin write policies for each workflow table.

## Notes
- Do not implement policies yet.
- Do not create auth hooks yet.
- This is only the planning layer for future Supabase work.

