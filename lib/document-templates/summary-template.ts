export function generateSummaryHTML({
  assetName = "SourcifyLending",
  asking_price = "$20,000",
  founded = "2019",
}: {
  assetName?: string;
  asking_price?: string;
  founded?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${assetName}: Asset Overview</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 0.75in auto;
      padding: 0;
      color: #1a202c;
      background: white;
    }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    .subtitle { font-size: 13px; color: #718096; margin-bottom: 24px; }
    h2 { font-size: 14px; font-weight: 700; margin-top: 20px; margin-bottom: 12px; border-bottom: 2px solid #d2d6dc; padding-bottom: 8px; }
    p { margin: 10px 0; font-size: 11px; line-height: 1.5; }
    .info-box { background: #f7fafc; border-left: 4px solid #4b5563; padding: 12px 16px; margin: 12px 0; font-size: 11px; }
    ul { margin: 10px 0; padding-left: 20px; font-size: 11px; }
    li { margin: 6px 0; }
    .badge { display: inline-block; background: #4b5563; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; margin-right: 6px; }
    @media print {
      body { margin: 0.5in; }
    }
  </style>
</head>
<body>
  <h1>${assetName}</h1>
  <p class="subtitle">Asset Overview for Evaluation</p>

  <h2>The Opportunity</h2>
  <p>${assetName} is an established software and advisory platform that was originally built as a funding advisory brand in ${founded}. It has since evolved into an AI-powered platform that provides lending sourcing and business funding advisory services.</p>

  <div class="info-box">
    <strong>Asking Price:</strong> ${asking_price}
  </div>

  <h2>What You're Acquiring</h2>
  <ul>
    <li><strong>Operating Software Platform</strong> – A production-grade SaaS system with client portal, admin tools, and integrated workflows</li>
    <li><strong>Brand Assets</strong> – Established brand identity, messaging, and collateral (${founded} - present)</li>
    <li><strong>Active Client Base</strong> – 3 active clients currently on a recurring monthly revenue model</li>
    <li><strong>Lead Database</strong> – Over 6,000 qualified MCA and business funding leads, aged and segmented</li>
    <li><strong>Content & Workflows</strong> – Proprietary advisory workflows, content library, and client onboarding systems</li>
    <li><strong>Technical Infrastructure</strong> – Hosted platform on modern cloud infrastructure, ready for transition</li>
  </ul>

  <h2>The Business Model</h2>
  <p><strong>Early Revenue Base:</strong> ${assetName} currently generates recurring monthly revenue from 3 active clients. This is a proven, scalable model.</p>

  <p><strong>Lead Monetization Opportunity:</strong> The 6,000+ lead database represents significant opportunity for the buyer to:</p>
  <ul>
    <li>Service leads with the platform</li>
    <li>Expand the client base</li>
    <li>Add complementary advisory services</li>
    <li>Explore partnership or affiliate channels</li>
  </ul>

  <h2>Platform & Assets</h2>
  <p><strong>Software:</strong> Operating SaaS platform (web-based, cloud-hosted)</p>
  <ul>
    <li>Customer-facing portal with account management</li>
    <li>Admin tools for operations and client management</li>
    <li>Integration frameworks for expanded functionality</li>
    <li>Modern tech stack (Next.js, React, PostgreSQL)</li>
  </ul>

  <p><strong>Data & Relationships:</strong></p>
  <ul>
    <li>Brand assets and marketing collateral</li>
    <li>Lead database (6,000+ records)</li>
    <li>Client relationships and active contracts</li>
    <li>Documentation and operational runbooks</li>
  </ul>

  <h2>What's Included</h2>
  <ul>
    <li>Operating SaaS platform and all source code</li>
    <li>Database schema and customer/lead data</li>
    <li>Hosting infrastructure and domain configuration</li>
    <li>All documentation and operational procedures</li>
    <li>Brand identity and marketing materials</li>
    <li>Customer relationships and contracts</li>
    <li>Lead database with segmentation</li>
    <li>Transition support (30-60 days)</li>
  </ul>

  <h2>What's Not Included</h2>
  <ul>
    <li>Client names and private account details (shared post-NDA only)</li>
    <li>Source code and technical implementation details (shared post-NDA only)</li>
    <li>System access credentials and API keys (transferred post-closing only)</li>
    <li>Personnel or contractor relationships (to be discussed post-NDA)</li>
  </ul>

  <h2>Next Steps</h2>
  <ol>
    <li><strong>Sign the NDA</strong> – Protects both parties' interests during evaluation</li>
    <li><strong>Detailed Presentation</strong> – Post-NDA, you'll receive a full acquisition presentation with platform details, client model, and technical overview</li>
    <li><strong>Data Room Access</strong> – Documents, financial records, and operational materials placed in secure folder</li>
    <li><strong>Due Diligence</strong> – Your team conducts thorough review of platform, operations, and financials</li>
    <li><strong>Purchase Agreement & Closing</strong> – Standard asset purchase terms, payment, and transition</li>
  </ol>

  <h2>Positioning</h2>
  <p>${assetName} is positioned as a <strong>software and advisory asset</strong>, not as a lending platform itself. The buyer is acquiring the technology, brand, lead database, and customer relationships to continue, scale, or repurpose within their own business model.</p>

  <hr style="border: none; border-top: 1px solid #d2d6dc; margin: 24px 0;">
  <p style="font-size: 10px; color: #718096; text-align: center;">This summary is not an offer or commitment. All material terms are subject to executed NDA and definitive purchase agreement.</p>
</body>
</html>
  `;
}
