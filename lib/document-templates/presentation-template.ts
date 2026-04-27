export function generatePresentationHTML({
  assetName = "SourcifyLending",
  founded = "2019",
  asking_price = "$20,000",
}: {
  assetName?: string;
  founded?: string;
  asking_price?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${assetName} Acquisition Presentation</title>
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
    h2 { font-size: 16px; font-weight: 700; margin-top: 24px; margin-bottom: 12px; border-bottom: 2px solid #d2d6dc; padding-bottom: 8px; }
    h3 { font-size: 14px; font-weight: 600; margin-top: 16px; margin-bottom: 10px; }
    p { margin: 10px 0; font-size: 11px; line-height: 1.5; }
    ul { margin: 10px 0; padding-left: 20px; font-size: 11px; }
    li { margin: 6px 0; }
    .slide { page-break-after: always; padding-bottom: 24px; margin-bottom: 24px; }
    .slide:last-child { page-break-after: avoid; }
    .slide-number { font-size: 10px; color: #718096; margin-top: 12px; text-align: right; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid #d2d6dc; padding: 8px; text-align: left; font-size: 11px; }
    th { background: #f7fafc; font-weight: 600; }
    .highlight { background: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; margin: 12px 0; }
    @media print { body { margin: 0.5in; } .slide { page-break-after: always; } }
  </style>
</head>
<body>
  <div class="slide">
    <h1>${assetName}</h1>
    <p style="font-size: 13px; color: #718096; margin-bottom: 20px;">Acquisition Presentation</p>
    <p><strong>Founded:</strong> ${founded}</p>
    <p><strong>Current Status:</strong> Operational, Early Revenue</p>
    <p><strong>Asking Price:</strong> ${asking_price}</p>
    <p><strong>Active Clients:</strong> 3 (recurring monthly model)</p>
    <p><strong>Lead Database:</strong> 6,000+ qualified leads</p>
    <div class="slide-number">Slide 1</div>
  </div>

  <div class="slide">
    <h2>Overview: What You're Acquiring</h2>
    <p>${assetName} is an established software and advisory platform originally built as a funding advisory brand in ${founded}. It has evolved into an AI-powered platform that provides lending sourcing and business funding advisory services.</p>
    <h3>Key Components</h3>
    <ul>
      <li><strong>Operating SaaS Platform</strong> – Production-grade, cloud-hosted system</li>
      <li><strong>3 Active Clients</strong> – Generating recurring monthly revenue</li>
      <li><strong>6,000+ Leads</strong> – Qualified MCA and business funding prospects</li>
      <li><strong>Brand Assets</strong> – 5 years of brand development and collateral</li>
      <li><strong>Tech Infrastructure</strong> – Modern stack, ready for scale</li>
    </ul>
    <div class="slide-number">Slide 2</div>
  </div>

  <div class="slide">
    <h2>History & Evolution</h2>
    <p><strong>${founded} – ${new Date().getFullYear() - 3}:</strong> Original positioning as business funding advisory and referral platform</p>
    <p><strong>${new Date().getFullYear() - 2} – Present:</strong> Evolution into AI-powered software platform with SaaS model</p>
    <h3>Established Brand</h3>
    <p>The ${assetName} brand has 5+ years of market presence, customer relationships, and lead generation success.</p>
    <h3>Ready for Transfer</h3>
    <p>Platform is operational and ready for ownership transition. All systems documented and configured.</p>
    <div class="slide-number">Slide 3</div>
  </div>

  <div class="slide">
    <h2>Platform Components</h2>
    <h3>Client-Facing Tools</h3>
    <ul>
      <li>Secure customer portal with account dashboard</li>
      <li>Application tracking and document upload</li>
      <li>Integrated communication and notification system</li>
    </ul>
    <h3>Admin Systems</h3>
    <ul>
      <li>Comprehensive operations dashboard</li>
      <li>Client and lead management tools</li>
      <li>Workflow automation and reporting</li>
    </ul>
    <h3>Technical Stack</h3>
    <ul>
      <li><strong>Frontend:</strong> Next.js, React, TypeScript, Tailwind CSS</li>
      <li><strong>Backend:</strong> Node.js, PostgreSQL via Supabase</li>
      <li><strong>Hosting:</strong> Vercel (global CDN, auto-scaling)</li>
    </ul>
    <div class="slide-number">Slide 4</div>
  </div>

  <div class="slide">
    <h2>The Revenue Model</h2>
    <h3>Current Clients: 3 Active</h3>
    <p>The platform generates recurring monthly revenue from 3 active clients on a subscription model.</p>
    <div class="highlight">
      <strong>Model Type:</strong> Monthly recurring revenue (MRR)<br>
      <strong>Client Base:</strong> Small business owners and entrepreneurs seeking lending solutions<br>
      <strong>Retention:</strong> Historical client relationships documented
    </div>
    <h3>Baseline Assumption</h3>
    <p>Buyer should expect to maintain baseline revenue from existing clients. Growth depends on buyer execution and market strategy.</p>
    <div class="slide-number">Slide 5</div>
  </div>

  <div class="slide">
    <h2>Lead Database Opportunity</h2>
    <h3>Asset: 6,000+ Qualified Leads</h3>
    <ul>
      <li><strong>Source:</strong> 5+ years of direct outreach and partnerships</li>
      <li><strong>Segmentation:</strong> By funding type, business size, industry, stage</li>
      <li><strong>Ownership:</strong> Buyer acquires full rights to use and monetize</li>
    </ul>
    <h3>Monetization Paths</h3>
    <ul>
      <li>Direct client outreach and advisory services</li>
      <li>Lead wholesale or partnership channels</li>
      <li>Integration into buyer's existing services</li>
      <li>Affiliate or partnership programs</li>
    </ul>
    <p style="margin-top: 12px;"><strong>Note:</strong> Lead quality reflects 5+ years of real engagement and segmentation. Not a cleaned or validated list.</p>
    <div class="slide-number">Slide 6</div>
  </div>

  <div class="slide">
    <h2>What's Included</h2>
    <h3>Technology & Platform</h3>
    <ul>
      <li>✓ Complete source code and codebase</li>
      <li>✓ Database schema and all data</li>
      <li>✓ Hosting infrastructure transfers</li>
      <li>✓ Domain and all configuration</li>
    </ul>
    <h3>Brand & Content</h3>
    <ul>
      <li>✓ Brand identity and assets</li>
      <li>✓ Website and marketing materials</li>
      <li>✓ Content library and templates</li>
    </ul>
    <h3>Business Assets</h3>
    <ul>
      <li>✓ Active customer contracts and relationships</li>
      <li>✓ Lead database (6,000+ records)</li>
      <li>✓ Operational documentation and runbooks</li>
      <li>✓ 30-60 day transition support</li>
    </ul>
    <div class="slide-number">Slide 7</div>
  </div>

  <div class="slide">
    <h2>What's Not Included</h2>
    <ul>
      <li>✗ Personnel or contractor relationships</li>
      <li>✗ Third-party service integrations (buyer configures own)</li>
      <li>✗ Ongoing service delivery post-transition</li>
      <li>✗ Founder involvement (transition support only)</li>
      <li>✗ Future roadmap or feature development obligations</li>
    </ul>
    <p style="margin-top: 16px;"><strong>Clean Asset Transfer:</strong> This is an asset sale. Buyer owns outright with no ongoing liabilities or ongoing relationship.</p>
    <div class="slide-number">Slide 8</div>
  </div>

  <div class="slide">
    <h2>Buyer Opportunity & Use Cases</h2>
    <h3>Multiple Value Drivers</h3>
    <ul>
      <li><strong>Immediate Revenue:</strong> Take over 3 active clients</li>
      <li><strong>Lead Monetization:</strong> 6,000 prospects ready to be serviced</li>
      <li><strong>Turnkey Operations:</strong> No build required</li>
      <li><strong>Brand Leverage:</strong> Established brand or rebranding optionality</li>
      <li><strong>Scalable Infrastructure:</strong> Modern tech, ready for growth</li>
    </ul>
    <h3>Potential Buyer Profiles</h3>
    <ul>
      <li>Advisory/service provider expanding into software</li>
      <li>Lending platform seeking advisory complement</li>
      <li>Lead aggregator monetizing through software</li>
      <li>Strategic consolidation/bolt-on acquisition</li>
    </ul>
    <div class="slide-number">Slide 9</div>
  </div>

  <div class="slide">
    <h2>Investment Summary</h2>
    <table>
      <tr>
        <th>Item</th>
        <th>Details</th>
      </tr>
      <tr>
        <td><strong>Purchase Price</strong></td>
        <td>${asking_price}</td>
      </tr>
      <tr>
        <td><strong>Terms</strong></td>
        <td>Clean asset purchase, single payment at closing</td>
      </tr>
      <tr>
        <td><strong>Timeline</strong></td>
        <td>30-60 days from agreement to closing</td>
      </tr>
      <tr>
        <td><strong>Earnout/Contingency</strong></td>
        <td>None – fixed price, clean deal</td>
      </tr>
      <tr>
        <td><strong>Support Period</strong></td>
        <td>30-60 days transition (standard)</td>
      </tr>
    </table>
    <p style="margin-top: 12px;"><strong>Return Profile:</strong> Low entry cost with immediate revenue baseline and high upside from lead database monetization and platform scaling.</p>
    <div class="slide-number">Slide 10</div>
  </div>

  <div class="slide">
    <h2>Next Steps</h2>
    <ol>
      <li><strong>NDA Signed</strong> – Confidentiality and non-circumvention</li>
      <li><strong>Due Diligence</strong> – Financial, technical, and operational review</li>
      <li><strong>Purchase Agreement</strong> – Standard asset sale terms negotiation</li>
      <li><strong>Final Walkthrough</strong> – Verify systems and data</li>
      <li><strong>Closing & Payment</strong> – Wire transfer, account transitions</li>
      <li><strong>Transition Support</strong> – 30-60 day handoff period</li>
    </ol>
    <div class="slide-number">Slide 11</div>
  </div>

  <div class="slide">
    <h2>Questions?</h2>
    <p>This presentation outlines the ${assetName} acquisition opportunity. For detailed financial data, customer references, technical documentation, and additional materials—all shared post-NDA.</p>
    <p style="margin-top: 20px; font-size: 12px; color: #718096;">Contact: Abel J. Fernandez | Allura Business Exchange</p>
    <div class="slide-number">Slide 12</div>
  </div>
</body>
</html>
  `;
}
