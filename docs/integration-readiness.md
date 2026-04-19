# Integration Readiness

## What Is Already Complete
- Local Next.js App Router scaffold is in place.
- Public shell pages exist for the main marketing routes.
- Internal admin shell exists with route-level placeholders.
- Core admin workflows are represented as static shells:
  - Market Radar
  - AI Asset Drafts
  - Packaging Center
  - Buyer Discovery
  - Business Intake
  - Underwriting
  - Buyer and inquiry workflow
  - Offer, contract, and transfer workflow
  - Private deal room shell

## What Must Be Connected Later
- GitHub repo for the new Allura project.
- Local install and run verification.
- Vercel project for deployment.
- Supabase project for persistence and auth.
- Auth provider and session handling.
- Payment and e-sign vendors later, only if approved.

## Required Connection Order
1. GitHub repo.
2. Local install and run verification.
3. Vercel project.
4. Supabase project.
5. Auth.
6. Payment and e-sign later.

## Non-Negotiable Rule
- Nothing in this workspace may connect to, reuse, or reference any SourcifyLending project.
- Every integration must be created as new Allura infrastructure only.
- No existing repo, project ID, database, key, deployment, or config from SourcifyLending may be copied over.

