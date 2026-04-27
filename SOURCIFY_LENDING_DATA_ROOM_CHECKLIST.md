# SOURCIFYLENDING: DATA ROOM CHECKLIST

**Purpose:** Document staging for buyer due diligence. This checklist defines what materials to place in shared folder, when, and what to withhold.

**Folder Structure:**
```
/SourcifyLending_DataRoom/
├── /Public (NDA-safe, shareable immediately)
├── /Operational (Post-NDA, buyer access)
├── /Financial (Post-NDA, financial review)
├── /Technical (Post-NDA, technical due diligence)
├── /Legal (For final closing review)
└── /Sensitive (DO NOT SHARE - for closing only)
```

---

## TIER 1: PUBLIC/NDA-SAFE (Share Immediately Post-NDA)

These materials are safe to share with buyer once NDA is signed.

### Marketing & Brand
- [ ] Brand guidelines document
- [ ] Logo files (PNG, SVG, EPS)
- [ ] Website copy and messaging
- [ ] Social media templates
- [ ] Customer-facing case studies (anonymized or with permission)
- [ ] Company history document (timeline 2019-present)
- [ ] Public website screenshots

### Content & Educational
- [ ] Content library index (topics, length, format)
- [ ] Customer onboarding guide (process document, no PII)
- [ ] FAQ document
- [ ] Lending advisory workflow guide (high-level overview)
- [ ] Educational materials sample (rate guides, lending glossary, etc.)

### Platform Overview
- [ ] Platform feature list (what the software does)
- [ ] Customer portal walkthrough (screenshots, no live data)
- [ ] Admin dashboard overview (screenshots, no live data)
- [ ] Integration points document (API endpoints, webhook capabilities)
- [ ] Tech stack summary (languages, frameworks, hosting)
- [ ] System architecture diagram (high-level, no credentials)

---

## TIER 2: OPERATIONAL/FINANCIAL (Share Post-NDA, Before Technical Access)

Materials requiring buyer evaluation before platform access.

### Financial Records
- [ ] Last 12 months of P&L statement
- [ ] Current MRR breakdown by client (anonymized: Client A, Client B, Client C)
- [ ] Customer acquisition cost (historical, if tracked)
- [ ] Customer lifetime value estimates (if tracked)
- [ ] Historical monthly revenue trend (chart or table, last 24 months)
- [ ] Outstanding invoices and payment status
- [ ] Annual operating expenses (hosting, tools, services)
- [ ] Tax filings (if applicable, for verification)

### Customer & Lead Data
- [ ] Customer list (anonymized names: Customer 1, 2, 3 / Client A, B, C)
- [ ] Active customer contracts (template or summary, no names)
- [ ] Customer renewal dates and terms
- [ ] Lead database statistics (count, segmentation, age)
- [ ] Lead database sample (50-100 anonymized records showing data structure)
- [ ] Lead source breakdown (where leads came from)
- [ ] Customer churn analysis (if applicable)

### Operations
- [ ] Operational runbook (customer service procedures)
- [ ] SLA document (service level agreements for customers)
- [ ] Customer support procedures and escalation process
- [ ] Workflow documentation (how leads are processed, served)
- [ ] Vendor and service list (software tools, integrations, monthly costs)
- [ ] Current contracts with third parties (summary, no confidential terms)

---

## TIER 3: TECHNICAL (Post-Financial Review, Before Closing)

Technical materials for buyer's development and infrastructure team.

### Code & Infrastructure
- [ ] Code repository access (GitHub link, buyer sets up their own account)
- [ ] Tech stack detail (versions, dependencies, maintenance status)
- [ ] Database schema documentation
- [ ] API documentation (endpoints, auth, rate limits)
- [ ] Webhook integration guide
- [ ] Hosting infrastructure detail (Vercel, Supabase setup)
- [ ] Environment variables list (names only, no values)
- [ ] Deployment procedures
- [ ] Backup and disaster recovery procedures

### Data & Security
- [ ] Data security overview (encryption, access controls)
- [ ] Current data export (anonymized customer and lead data)
- [ ] Database backup sample
- [ ] User roles and permissions structure
- [ ] Audit log sample (showing what activity data exists)
- [ ] Security best practices document (password reset, 2FA, etc.)
- [ ] Third-party API integrations (documentation, no keys)

### Maintenance & Performance
- [ ] System uptime and performance metrics (last 6 months)
- [ ] Current known issues or technical debt (transparency list)
- [ ] Planned maintenance schedule
- [ ] Infrastructure costs breakdown
- [ ] Scaling capability assessment

---

## TIER 4: LEGAL & FINAL (For Closing Team Review Only)

Materials for final legal and financial review before closing.

### Contracts
- [ ] Active customer contracts (full, with client names)
- [ ] Third-party service agreements (SaaS, hosting, integrations)
- [ ] Vendor contracts and payment terms
- [ ] Insurance policies (if applicable)
- [ ] Employee or contractor agreements (if applicable, none currently)

### Compliance & Risk
- [ ] Data privacy and compliance overview
- [ ] GDPR/CCPA compliance status (if applicable)
- [ ] Customer data location and residency
- [ ] Known legal claims or disputes (if any)
- [ ] IP ownership documentation
- [ ] Trademark registrations (if any)

### Financial Detail
- [ ] Detailed P&L by month (last 24 months)
- [ ] Tax returns (last 2 years)
- [ ] Bank statements (last 3 months, transaction summary)
- [ ] Accounts payable and receivable detail
- [ ] Outstanding liabilities or commitments
- [ ] Customer refund/churn history

---

## TIER 5: SENSITIVE (DO NOT SHARE - Seller Keeps)

Materials to withhold completely or share only in closing room.

### DO NOT SHARE:
- [ ] ❌ Source code credentials (API keys, database passwords)
- [ ] ❌ Third-party API keys or tokens
- [ ] ❌ Admin login credentials (temporary access only post-closing)
- [ ] ❌ Email account passwords
- [ ] ❌ Supabase/Vercel account admin passwords
- [ ] ❌ Customer names and email addresses (until final purchase agreement)
- [ ] ❌ Personally identifiable information (customer contact info beyond numbers)
- [ ] ❌ Individual lead contact details (database fields, yes; actual phone/email, no)
- [ ] ❌ Private business strategies or long-term roadmaps
- [ ] ❌ Confidential vendor terms or pricing
- [ ] ❌ Personal financial details or tax returns of founders/sellers
- [ ] ❌ Internal communications or emails
- [ ] ❌ Founder personal information
- [ ] ❌ Any material marked "Attorney-Client Privileged"

### SHARE ONLY IN FINAL PURCHASE AGREEMENT:
- [ ] Full customer contract agreements (post-signature)
- [ ] Full lead database with actual contact information
- [ ] System access credentials (post-closing, transfer day)
- [ ] Full financial statements with all detail
- [ ] Any known undisclosed liabilities or claims

---

## STAGING TIMELINE

### Week 1: Pre-NDA to Signed NDA
- Buyer reviews Pre-NDA Summary
- Buyer signs NDA
- **Share:** Nothing yet (NDA is the gate)

### Week 2-3: Post-NDA, Pre-Presentation
- Buyer receives Presentation slides
- Buyer has access to Tier 1 (Public/Brand/Marketing) materials
- Buyer begins initial evaluation
- Buyer submits questions

### Week 3-4: Initial Due Diligence
- Buyer reviews Tier 2 (Operational/Financial) materials
- Financial review team conducts due diligence
- Buyer builds valuation model
- Buyer may request references or customer calls (limited, with customer permission)

### Week 4-6: Technical Review
- Buyer's technical team requests Tier 3 access
- Code repository access granted
- Infrastructure walkthrough scheduled
- Technical assessment completed

### Week 6-8: Final Due Diligence
- Buyer and counsel review Purchase Agreement draft
- Tier 4 (Legal) materials shared with buyer's counsel
- Final questions answered
- Deal terms finalized

### Week 8-10: Closing
- Final Payment Agreement signed
- Tier 5 (Sensitive) materials exchanged
- System credentials transferred
- Transition begins

---

## NOTES ON DATA PRIVACY & SECURITY

**Customer Data Handling:**
- Never share customer names before signed Purchase Agreement
- Share only anonymized or aggregated customer data during due diligence
- Full customer list provided only to buyer's counsel/finance team for final review
- Customer notification/consent handled post-closing

**Lead Database Handling:**
- Share lead counts and segmentation immediately
- Provide sample records (anonymized) showing data structure and quality
- Full database (with contact info) transferred only post-closing
- Lead usage rights clarified in Purchase Agreement

**Credentials & Access:**
- No credentials shared before Purchase Agreement
- Temporary access provided only for technical verification
- All credentials rotated at closing
- Seller removes all access immediately post-closing

---

## BUYER COMMUNICATION TEMPLATE

When moving buyer to next tier, use this language:

*"Thank you for your [initial/continued] interest in SourcifyLending. We've completed [review stage] and are comfortable moving forward with [next tier] materials. Access details below. Please let us know your questions within [X days]."*

---

## FINAL CHECKLIST FOR SELLER

Before closing:
- [ ] All materials reviewed for over-disclosure
- [ ] No credentials included in any shared documents
- [ ] No customer names in Tier 1-3 materials
- [ ] No private financial data shared unnecessarily
- [ ] Buyer's team confirmed under NDA
- [ ] Schedule for staged releases confirmed with buyer
- [ ] Legal team has reviewed all contracts before sharing
- [ ] Financial data verified for accuracy
- [ ] Lead database sample quality-checked
- [ ] Platform screenshots current and accurate
- [ ] Credentials stored separately in secure location
- [ ] Transition plan documented and ready

