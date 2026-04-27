export function generateEmailHTML({
  buyerName = "Prospect",
  assetName = "SourcifyLending",
}: {
  buyerName?: string;
  assetName?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
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
    h1 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
    p { margin: 10px 0; font-size: 12px; line-height: 1.6; }
    .email-section { background: #f7fafc; border-left: 4px solid #4b5563; padding: 16px; margin: 16px 0; }
    .divider { border-top: 1px solid #d2d6dc; margin: 20px 0; }
    .signature { margin-top: 24px; font-size: 11px; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    @media print { body { margin: 0.5in; } }
  </style>
</head>
<body>
  <h1>Buyer Follow-Up Email – ${assetName}</h1>
  <p style="font-size: 11px; color: #718096; margin-bottom: 20px;">Copy-ready email to send NDA and asset overview</p>

  <div class="divider"></div>

  <h2 style="font-size: 14px; margin-top: 0;">Email 1: Initial NDA & Overview</h2>

  <div class="email-section">
    <p><strong>To:</strong> ${buyerName}</p>
    <p><strong>Subject:</strong> ${assetName} – Confidentiality Agreement & Asset Overview</p>
  </div>

  <p>Hi ${buyerName},</p>

  <p>Thanks for your interest in ${assetName}. We're excited to explore this opportunity with you.</p>

  <p>To move forward, I'm attaching a Confidentiality and Non-Circumvention Agreement. Please review with your team or counsel, sign, and return. Once executed, I'll send over a detailed overview and we can schedule a conversation about the platform, client base, and lead database opportunity.</p>

  <p><strong>Attached materials:</strong></p>
  <ul style="margin: 10px 0; padding-left: 20px; font-size: 12px;">
    <li><strong>${assetName} Confidentiality Agreement</strong> – Please sign and return</li>
    <li><strong>${assetName} Asset Overview</strong> – A short summary of what you're evaluating</li>
  </ul>

  <p>Once we have the signed NDA, you'll receive:</p>
  <ul style="margin: 10px 0; padding-left: 20px; font-size: 12px;">
    <li>Detailed acquisition presentation</li>
    <li>Financial and operational overview</li>
    <li>Technical platform details</li>
    <li>Data access for due diligence</li>
  </ul>

  <p>I'm available for any questions about the NDA or the opportunity. Let me know your timeline and preferred next steps.</p>

  <p>Looking forward to it.</p>

  <p>Best,</p>

  <div class="signature">
    <p style="margin-bottom: 2px;"><strong>Abel J. Fernandez</strong></p>
    <p style="margin-bottom: 2px;">Allura Business Exchange</p>
    <p style="margin-bottom: 2px;">[Email Address]</p>
    <p style="margin: 0;">[Phone Number]</p>
  </div>

  <div class="divider" style="margin-top: 32px;"></div>

  <h2 style="font-size: 14px;">Email 2: Follow-Up (3-5 Days Post-Send)</h2>

  <p style="color: #718096; font-size: 11px; margin-bottom: 16px;">Send if no response received within 3-5 business days.</p>

  <div class="email-section">
    <p><strong>Subject:</strong> Following up – ${assetName} NDA</p>
  </div>

  <p>Hi ${buyerName},</p>

  <p>Just checking in on your side—any questions about the NDA or the opportunity? Happy to discuss the terms or address anything on your mind.</p>

  <p>Let me know if you're still interested in moving forward.</p>

  <p>Thanks,<br>Abel</p>

  <div class="divider" style="margin-top: 32px;"></div>

  <h2 style="font-size: 14px;">Email 3: Post-NDA Presentation (After Signed NDA)</h2>

  <p style="color: #718096; font-size: 11px; margin-bottom: 16px;">Send once NDA is signed and returned.</p>

  <div class="email-section">
    <p><strong>Subject:</strong> ${assetName} – Detailed Presentation (Post-NDA)</p>
  </div>

  <p>Hi ${buyerName},</p>

  <p>Thanks for returning the signed NDA. We're excited to move to the next phase of evaluation.</p>

  <p>Attached is our detailed acquisition presentation along with the financial overview and technical platform summary. This provides a comprehensive view of what you're acquiring.</p>

  <p><strong>Next Steps:</strong></p>
  <ul style="margin: 10px 0; padding-left: 20px; font-size: 12px;">
    <li>Review the presentation at your pace</li>
    <li>Submit any due diligence questions</li>
    <li>Schedule a call to walk through platform details and discuss next steps</li>
  </ul>

  <p>Once your team has reviewed the materials, let's find a time to connect. I'm happy to answer technical questions or dive deeper into the business model.</p>

  <p>Talk soon,<br>Abel</p>

  <div class="divider" style="margin-top: 32px;"></div>

  <h2 style="font-size: 14px;">Email Tips</h2>

  <div class="email-section">
    <p style="margin-top: 0;"><strong>✓ Do:</strong></p>
    <ul style="margin: 10px 0; padding-left: 20px; font-size: 12px;">
      <li>Keep emails short and clear</li>
      <li>Attach documents in PDF format</li>
      <li>Include a clear call to action</li>
      <li>Respond to questions within 24 hours</li>
      <li>Schedule calls at buyer's convenience</li>
    </ul>
  </div>

  <div class="email-section">
    <p style="margin-top: 0;"><strong>✗ Don't:</strong></p>
    <ul style="margin: 10px 0; padding-left: 20px; font-size: 12px;">
      <li>Over-explain or over-sell</li>
      <li>Include sensitive financial data in email body</li>
      <li>Send unsolicited follow-ups more than once per week</li>
      <li>Make guarantees about revenue or outcomes</li>
      <li>Share credentials or access information via email</li>
    </ul>
  </div>

  <p style="margin-top: 24px; font-size: 10px; color: #718096; border-top: 1px solid #d2d6dc; padding-top: 12px;">These email templates provide a professional framework for the buyer communication sequence. Customize with specific details and your own voice.</p>
</body>
</html>
  `;
}
