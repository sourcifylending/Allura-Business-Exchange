export function generateChecklistHTML({
  assetName = "SourcifyLending",
}: {
  assetName?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Room Checklist</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 0.75in auto;
      padding: 0;
      color: #1a202c;
      background: white;
    }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    h2 { font-size: 14px; font-weight: 700; margin-top: 20px; margin-bottom: 12px; border-bottom: 2px solid #d2d6dc; padding-bottom: 8px; }
    p { margin: 10px 0; font-size: 11px; line-height: 1.5; }
    ul { margin: 10px 0; padding-left: 20px; font-size: 11px; }
    li { margin: 6px 0; }
    .tier-box { border-left: 4px solid #4b5563; background: #f7fafc; padding: 12px 16px; margin: 12px 0; }
    .tier-box h3 { margin-top: 0; font-size: 12px; }
    .checklist-item { padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
    .checklist-item:last-child { border-bottom: none; }
    @media print { body { margin: 0.5in; } }
  </style>
</head>
<body>
  <h1>Data Room Checklist</h1>
  <p style="font-size: 13px; color: #718096; margin-bottom: 20px;">${assetName} – Buyer Due Diligence Materials</p>

  <h2>Overview</h2>
  <p>This checklist outlines what documents and materials to place in the buyer's data room folder, organized by access tier and timing.</p>

  <h2>Tier 1: Immediate Post-NDA (Days 1-3)</h2>
  <div class="tier-box">
    <h3>🟢 Safe to Share Immediately</h3>
    <p>These materials contain no sensitive data and are safe to share with any buyer post-NDA.</p>
  </div>

  <div style="margin-left: 12px;">
    <h3>Brand & Marketing</h3>
    <div class="checklist-item">☐ Brand guidelines document</div>
    <div class="checklist-item">☐ Logo files (PNG, SVG)</div>
    <div class="checklist-item">☐ Website copy and messaging</div>
    <div class="checklist-item">☐ Social media templates</div>
    <div class="checklist-item">☐ Company history timeline</div>

    <h3>Platform Overview</h3>
    <div class="checklist-item">☐ Feature list and capabilities</div>
    <div class="checklist-item">☐ Portal screenshots (anonymized)</div>
    <div class="checklist-item">☐ Admin dashboard overview</div>
    <div class="checklist-item">☐ Integration points documentation</div>
    <div class="checklist-item">☐ Tech stack summary</div>
    <div class="checklist-item">☐ System architecture diagram (high-level)</div>

    <h3>Content & Operations</h3>
    <div class="checklist-item">☐ Customer onboarding guide</div>
    <div class="checklist-item">☐ FAQ document</div>
    <div class="checklist-item">☐ Lending advisory workflow overview</div>
    <div class="checklist-item">☐ Educational materials samples</div>
  </div>

  <h2>Tier 2: Financial & Operational Review (Days 3-7)</h2>
  <div class="tier-box">
    <h3>🟡 Pre-Technical Access</h3>
    <p>Share after buyer's team begins financial and operational due diligence.</p>
  </div>

  <div style="margin-left: 12px;">
    <h3>Financial Records</h3>
    <div class="checklist-item">☐ Last 12 months P&L statement</div>
    <div class="checklist-item">☐ Monthly recurring revenue (MRR) by client (anonymized)</div>
    <div class="checklist-item">☐ Historical revenue trend (24 months)</div>
    <div class="checklist-item">☐ Customer acquisition cost (CAC)</div>
    <div class="checklist-item">☐ Customer lifetime value (LTV)</div>
    <div class="checklist-item">☐ Annual operating expenses breakdown</div>
    <div class="checklist-item">☐ Outstanding invoices and payment status</div>

    <h3>Customer & Lead Data</h3>
    <div class="checklist-item">☐ Customer list (anonymized: Client A, B, C)</div>
    <div class="checklist-item">☐ Active customer contracts (templates or summary)</div>
    <div class="checklist-item">☐ Customer renewal dates and terms</div>
    <div class="checklist-item">☐ Lead database statistics and segmentation</div>
    <div class="checklist-item">☐ Lead database sample (50-100 anonymized records)</div>
    <div class="checklist-item">☐ Lead source breakdown</div>

    <h3>Operations</h3>
    <div class="checklist-item">☐ Customer service procedures</div>
    <div class="checklist-item">☐ SLA documentation</div>
    <div class="checklist-item">☐ Workflow and process documentation</div>
    <div class="checklist-item">☐ Vendor and service list</div>
    <div class="checklist-item">☐ Third-party integration contracts (summary)</div>
  </div>

  <h2>Tier 3: Technical Due Diligence (Days 7-21)</h2>
  <div class="tier-box">
    <h3>🔵 Code & Infrastructure</h3>
    <p>Shared with buyer's technical team for platform assessment.</p>
  </div>

  <div style="margin-left: 12px;">
    <h3>Code & Architecture</h3>
    <div class="checklist-item">☐ Code repository access (GitHub)</div>
    <div class="checklist-item">☐ Tech stack detail and versions</div>
    <div class="checklist-item">☐ Database schema documentation</div>
    <div class="checklist-item">☐ API documentation and endpoints</div>
    <div class="checklist-item">☐ Deployment procedures</div>
    <div class="checklist-item">☐ Known issues and technical debt list</div>

    <h3>Infrastructure</h3>
    <div class="checklist-item">☐ Hosting setup (Vercel, Supabase)</div>
    <div class="checklist-item">☐ Backup and disaster recovery procedures</div>
    <div class="checklist-item">☐ System uptime and performance data (6 months)</div>
    <div class="checklist-item">☐ Infrastructure costs breakdown</div>
    <div class="checklist-item">☐ Scaling capability assessment</div>
  </div>

  <h2>Tier 4: Final Legal Review (Days 21-30)</h2>
  <div class="tier-box">
    <h3>🔴 Restricted Access</h3>
    <p>Shared with buyer's counsel only during final contract review.</p>
  </div>

  <div style="margin-left: 12px;">
    <h3>Contracts & Compliance</h3>
    <div class="checklist-item">☐ Active customer contracts (full, with names)</div>
    <div class="checklist-item">☐ Third-party service agreements</div>
    <div class="checklist-item">☐ Data privacy and compliance overview</div>
    <div class="checklist-item">☐ Known legal claims or disputes (if any)</div>
    <div class="checklist-item">☐ IP ownership documentation</div>

    <h3>Detailed Financials</h3>
    <div class="checklist-item">☐ Detailed P&L by month (24 months)</div>
    <div class="checklist-item">☐ Tax returns (2 years)</div>
    <div class="checklist-item">☐ Accounts payable and receivable detail</div>
    <div class="checklist-item">☐ Outstanding liabilities</div>
  </div>

  <h2>Tier 5: DO NOT SHARE (Ever)</h2>
  <div style="border-left: 4px solid #dc2626; background: #fee2e2; padding: 12px 16px; margin: 12px 0;">
    <p style="margin-top: 0; font-weight: 600; color: #991b1b;">Sensitive Materials – Keep Restricted</p>
  </div>

  <div style="margin-left: 12px;">
    <div class="checklist-item">☐ Source code credentials (API keys, database passwords)</div>
    <div class="checklist-item">☐ Third-party API tokens</div>
    <div class="checklist-item">☐ Admin login credentials</div>
    <div class="checklist-item">☐ Email account passwords</div>
    <div class="checklist-item">☐ Customer email addresses (until final agreement)</div>
    <div class="checklist-item">☐ Personal financial details or tax returns (founder)</div>
    <div class="checklist-item">☐ Internal communications or emails</div>
    <div class="checklist-item">☐ Founder personal information</div>
    <div class="checklist-item">☐ Attorney-client privileged materials</div>
  </div>

  <h2>Staging Timeline</h2>
  <ul>
    <li><strong>Days 1-3 (Post-NDA):</strong> Provide Tier 1 materials</li>
    <li><strong>Days 3-7:</strong> Provide Tier 2 materials as buyer reviews</li>
    <li><strong>Days 7-21:</strong> Provide Tier 3 (code/tech) materials</li>
    <li><strong>Days 21-30:</strong> Provide Tier 4 (legal/financial detail)</li>
    <li><strong>Closing Day:</strong> Transfer all Tier 5 credentials</li>
  </ul>

  <h2>Communication Protocol</h2>
  <p><strong>When Moving Tiers:</strong> "Thank you for your diligence. We're comfortable sharing the next level of materials. Access details below."</p>
  <p><strong>If Buyer Requests Early Access:</strong> "Those materials will be available at [next stage]. In the meantime, here's what we can address..."</p>

  <p style="margin-top: 24px; font-size: 10px; color: #718096; border-top: 1px solid #d2d6dc; padding-top: 12px;">This checklist protects both parties by staging document access appropriately and preventing over-disclosure during early evaluation stages.</p>
</body>
</html>
  `;
}
