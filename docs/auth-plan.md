# Auth Plan

## Goal
Put internal admin access in place first, then expand to future buyer, seller, and free-account roles only when the shell is ready.

## Rollout Order
1. Internal admin access first.
2. Basic session and protected admin routes.
3. Future buyer accounts.
4. Future seller accounts.
5. Free-account user access.
6. Approval-based deal room access.

## What Will Eventually Need Protection
- `/admin`
- `/admin/market-radar`
- `/admin/asset-drafts`
- `/admin/build-pipeline`
- `/admin/packaging`
- `/admin/listings`
- `/admin/opportunities`
- `/admin/business-submissions`
- `/admin/underwriting`
- `/admin/buyers`
- `/admin/inquiries`
- `/admin/deal-room`
- `/admin/offers`
- `/admin/contracts`
- `/admin/transfers`
- `/admin/documents`
- `/admin/tasks`
- `/admin/crm`
- `/admin/dialer`
- `/admin/settings`

## What Remains Public
- Public marketing pages.
- Public browsing surfaces that do not expose private records.
- Sanitized opportunity pages until approval logic exists.

## Notes
- Admin access should be the first protected area.
- Public pages should remain usable without login until later phases are explicitly approved.
- No implementation should be added yet.

