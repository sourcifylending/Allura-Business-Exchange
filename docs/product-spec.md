# Allura Business Exchange Product Spec

## Product Summary
Allura Business Exchange is a private exchange for buying and selling:
- pre-revenue AI tools and digital assets as the primary lane
- selected operating business opportunities as the secondary lane

It is an idea-to-sale operating system, not a public free-for-all marketplace.

## Core Principles
- Allura controls intake, approval, listing visibility, buyer access, packaging, and deal flow.
- AI asset sales are the main growth engine.
- Operating business deals remain secondary in version 1.
- The system should optimize for speed, organization, and low friction.
- Do not build external integrations in Phase 0.
- AI is internal admin-only and must not be required for customer-facing routes.
- Default internal AI target is local Ollama first, behind provider abstraction.

## Main System Modules
1. Market Radar
2. Asset Factory
3. Asset Registry
4. Listing Engine
5. Buyer Discovery Engine
6. Sales Engine
7. Transfer Engine

## Asset Factory Model
The platform should support a repeatable workflow:
- Idea
- Research
- Approved to Build
- Branding
- MVP Build
- Demo Ready
- Packaging
- Listed
- Buyer Inquiry
- Buyer Qualified
- Demo Sent
- Call Booked
- Offer Received
- Offer Accepted
- Contract Sent
- Signed
- Payment Pending
- Paid
- Transfer In Progress
- Transfer Complete

## Asset Registry Fields
The registry should track:
- asset_id
- asset_name
- slug
- niche
- target_buyer_type
- current_stage
- local_path
- repo_url
- live_url
- demo_url
- domain
- hosting_status
- code_status
- packaging_status
- listing_status
- asking_price
- ownership_type
- transfer_status
- notes

## Market Radar
Track:
- niche industry
- problem statement
- target buyer
- urgency of pain
- competition level
- build complexity
- speed-to-build score
- speed-to-sell score
- likely sale price band
- saleability score
- demand notes
- reason to build now
- status: idea, researching, approved, rejected, later

## Buyer Discovery Engine
For each ready-for-sale AI asset, generate:
- ideal buyer profile
- likely decision-maker
- likely buyer company type
- recommended promotion channels
- recommended communities, directories, and events
- comparable software categories
- target-company ideas or target-buyer segments
- suggested positioning angle
- best places to promote the asset
- where buyers already gather and research similar software

Do not build unauthorized scraping or spam automation.

## Sales Engine
Track:
- buyer CRM
- inquiry inbox
- demo center
- offer desk
- transfer desk

Every AI asset must have:
- buyer type
- asking price
- demo assets
- transfer checklist
before it can go live.

## Packaging Center
Track:
- one-line pitch
- short listing description
- full summary
- buyer type
- screenshots
- demo link
- logo and brand kit
- feature summary
- stack summary
- support scope
- transfer checklist
- asking price
- status: incomplete, draft ready, approved for listing

## AI Asset Requirements
Required fields:
- product or asset name
- brand name
- owner name
- ownership type
- entity name if any
- DBA name if any
- asset category
- niche / industry target
- target buyer type
- live URL if any
- code repository status
- domain control status
- hosting provider
- deployment status
- screenshots or demo available
- logo or brand files available
- feature summary
- revenue status
- third-party APIs/tools used
- documentation status
- admin/account transferability
- training/support availability
- transfer checklist status

## Visibility Rules
### AI Asset Listings
Public by default when controlled by Allura:
- product name
- brand name
- short description
- category
- asking price
- screenshots or logo if available
- short feature summary
- status

### Operating Business Listings
Shown as sanitized teasers by default:
- category
- industry
- region
- short description
- price or price range
- optional high-level revenue or SDE range if approved

Do not show publicly by default:
- exact business name
- seller identity
- confidential documents
- deeper diligence materials

## Public Pages
- /
- /about
- /how-it-works
- /buyers
- /sellers
- /digital-assets
- /opportunities
- /contact
- /login

## Internal Admin Modules
- Dashboard
- Market Radar
- AI Asset Drafts
- AI Asset Build Pipeline
- AI Asset Listings
- Business Seller Submissions
- Buyers
- Opportunities
- Underwriting / Evaluation
- Packaging Center
- Inquiry Inbox
- Offer Desk
- Transfer Desk
- Contracts
- Documents
- Tasks
- CRM placeholder
- Dialer placeholder
- Settings

## AI Architecture
The platform should treat AI as an internal staff tool only:
- public site, buyer portal, and seller portal must function without AI
- internal admin modules may later use an abstract AI provider interface
- default future provider path should support ollama, openai, anthropic, and self_hosted
- do not connect any AI provider in Phase 0

## Phase 0 Scope
Create docs only. Do not build app code, backend code, integrations, or external connections yet.
