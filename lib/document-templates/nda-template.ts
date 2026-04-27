export function generateNDAHTML({
  buyerName,
  sellerName = "ALLURA BUSINESS EXCHANGE",
  assetName = "SourcifyLending",
  date,
  signer = "Abel J. Fernandez",
}: {
  buyerName: string;
  sellerName?: string;
  assetName?: string;
  date: string;
  signer?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confidentiality and Non-Circumvention Agreement</title>
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
    h1 { font-size: 18px; font-weight: 700; text-align: center; margin-bottom: 24px; }
    h2 { font-size: 14px; font-weight: 700; margin-top: 24px; margin-bottom: 12px; }
    p { margin: 12px 0; font-size: 11px; }
    .signature-block { margin-top: 48px; display: inline-block; width: 45%; }
    .signature-line { border-bottom: 1px solid #000; margin-bottom: 6px; }
    .label { font-size: 10px; font-weight: 600; }
    ul { margin: 12px 0; padding-left: 24px; font-size: 11px; }
    li { margin: 6px 0; }
    .section-number { font-weight: 700; }
    .page-break { page-break-after: always; }
    @media print {
      body { margin: 0.5in; }
    }
  </style>
</head>
<body>
  <h1>CONFIDENTIALITY AND NON-CIRCUMVENTION AGREEMENT</h1>

  <p><strong>EFFECTIVE DATE:</strong> ${date}</p>

  <p>This Confidentiality and Non-Circumvention Agreement ("Agreement") is entered into as of the date last signed below, by and between <strong>${sellerName}</strong>, a business entity ("Disclosing Party"), and <strong>${buyerName}</strong> ("Receiving Party").</p>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">

  <h2><span class="section-number">1.</span> RECITALS</h2>
  <p>WHEREAS, the Disclosing Party is willing to disclose certain confidential and proprietary information regarding <strong>${assetName}</strong> and related assets ("the Asset") to the Receiving Party for the sole purpose of evaluating the potential acquisition of the Asset; and</p>
  <p>WHEREAS, the parties wish to protect such information and establish conditions for this evaluation.</p>
  <p>NOW, THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows:</p>

  <h2><span class="section-number">2.</span> DEFINITION OF CONFIDENTIAL INFORMATION</h2>
  <p>"Confidential Information" includes all information disclosed by the Disclosing Party, whether orally, visually, in writing, or electronically, regarding the Asset and related matters, including but not limited to:</p>
  <ul>
    <li>Business plans, strategy, and operations</li>
    <li>Financial information, revenue data, pricing, and margins</li>
    <li>Customer and client information, lists, and relationships</li>
    <li>Lead databases, prospect data, and contact information</li>
    <li>Software, source code, algorithms, and technical infrastructure</li>
    <li>Platform architecture, features, and functionality</li>
    <li>Business workflows, processes, and methodologies</li>
    <li>Marketing materials, brand assets, and proprietary content</li>
    <li>Vendor, partner, and affiliate relationships</li>
    <li>Personnel information and organizational structure</li>
    <li>Any other information marked as "Confidential" or reasonably understood to be confidential</li>
  </ul>

  <h2><span class="section-number">3.</span> EXCLUSIONS FROM CONFIDENTIAL INFORMATION</h2>
  <p>Confidential Information does not include information that:</p>
  <ul>
    <li>Is or becomes publicly available through no breach of this Agreement;</li>
    <li>Was rightfully in the Receiving Party's possession before disclosure, as evidenced by written record;</li>
    <li>Is independently developed by the Receiving Party without use of the Confidential Information;</li>
    <li>Is rightfully received by the Receiving Party from a third party without confidentiality obligations.</li>
  </ul>

  <h2><span class="section-number">4.</span> PERMITTED USE</h2>
  <p>The Receiving Party may use the Confidential Information solely to:</p>
  <ul>
    <li>Evaluate the potential acquisition of the Asset</li>
    <li>Conduct reasonable business and legal diligence</li>
    <li>Present information to internal advisors under confidentiality obligations</li>
  </ul>
  <p>Any use beyond this purpose is prohibited without written consent.</p>

  <h2><span class="section-number">5.</span> RESTRICTIONS AND OBLIGATIONS</h2>
  <p>The Receiving Party shall:</p>
  <ul>
    <li>Protect Confidential Information using reasonable security measures no less stringent than those used for its own confidential information;</li>
    <li>Limit access to employees, advisors, and representatives who have a legitimate need to know and who are bound by written confidentiality obligations no less protective than this Agreement;</li>
    <li>Not disclose Confidential Information to any third party without prior written consent;</li>
    <li>Not use Confidential Information for competitive purposes or in a manner harmful to the Disclosing Party;</li>
    <li>Not attempt to reverse-engineer, decompile, or otherwise analyze any software or proprietary technology;</li>
    <li>Maintain the confidentiality of this Agreement itself and the existence of discussions.</li>
  </ul>

  <div class="page-break"></div>

  <h2><span class="section-number">6.</span> NON-CIRCUMVENTION</h2>
  <p>The Receiving Party agrees that it shall not, during the evaluation period or at any time thereafter, directly or indirectly:</p>
  <ul>
    <li>Contact or solicit any customer, client, lead, vendor, partner, affiliate, contractor, or prospect identified in or associated with the Asset without the prior written permission of the Disclosing Party;</li>
    <li>Attempt to establish relationships with any party that may be disclosed in the Confidential Information for purposes of circumventing the Disclosing Party's business interests;</li>
    <li>Use Confidential Information to compete with or interfere with the Disclosing Party's business or existing relationships;</li>
    <li>Encourage or facilitate any party's non-performance of obligations to the Asset or the Disclosing Party.</li>
  </ul>

  <h2><span class="section-number">7.</span> NO LICENSE OR OWNERSHIP TRANSFER</h2>
  <p>Disclosure of Confidential Information grants no license, ownership rights, or other interests in the Asset or any related intellectual property. No confidential material may be copied, duplicated, or used except as explicitly permitted. All rights remain the property of the Disclosing Party until execution of a definitive purchase agreement and receipt of full payment.</p>

  <h2><span class="section-number">8.</span> NO OBLIGATION TO PROCEED</h2>
  <p>Neither party is obligated to proceed with any transaction. Either party may terminate discussions at any time. Termination does not relieve obligations under this Agreement.</p>

  <h2><span class="section-number">9.</span> RETURN OR DESTRUCTION OF INFORMATION</h2>
  <p>Upon termination of discussions or upon written request, the Receiving Party shall promptly:</p>
  <ul>
    <li>Return all Confidential Information in tangible form;</li>
    <li>Destroy all copies, notes, and work product containing or derived from Confidential Information;</li>
    <li>Certify in writing completion of return or destruction within 15 days;</li>
    <li>Exception: Receiving Party may retain one archival copy for legal compliance purposes, subject to continued confidentiality obligations.</li>
  </ul>

  <h2><span class="section-number">10.</span> NO REPRESENTATION OR WARRANTY</h2>
  <p>The Disclosing Party makes no warranty regarding the accuracy, completeness, or timeliness of Confidential Information. Evaluation and due diligence are the Receiving Party's responsibility. The Asset is offered "as-is" pending definitive purchase agreement terms.</p>

  <h2><span class="section-number">11.</span> TERM AND TERMINATION</h2>
  <p>This Agreement shall commence upon execution and remain in effect for <strong>three (3) years</strong>, unless earlier terminated by either party. Obligations survive termination for the remainder of the three-year period.</p>

  <h2><span class="section-number">12.</span> REMEDIES</h2>
  <p>The Receiving Party acknowledges that breach of this Agreement may cause irreparable harm not fully compensable by damages. The Disclosing Party shall be entitled to seek:</p>
  <ul>
    <li>Injunctive relief and specific performance</li>
    <li>Monetary damages</li>
    <li>Recovery of attorneys' fees and costs</li>
  </ul>

  <h2><span class="section-number">13.</span> GOVERNING LAW AND VENUE</h2>
  <p>This Agreement shall be governed by and construed in accordance with the laws of the <strong>State of Florida</strong>, without regard to conflicts of law principles. Both parties consent to exclusive jurisdiction and venue in the state and federal courts located in <strong>Miami-Dade County, Florida</strong>.</p>

  <h2><span class="section-number">14.</span> SEVERABILITY</h2>
  <p>If any provision is found invalid or unenforceable, the remaining provisions shall continue in full force. The parties shall replace the invalid provision with a valid one that achieves the original intent.</p>

  <h2><span class="section-number">15.</span> ENTIRE AGREEMENT</h2>
  <p>This Agreement constitutes the entire agreement between the parties regarding the subject matter and supersedes all prior negotiations, understandings, and agreements. Amendments must be in writing and signed by both parties.</p>

  <h2><span class="section-number">16.</span> COUNTERPARTS</h2>
  <p>This Agreement may be executed in counterparts, each of which constitutes an original and all of which together constitute one instrument.</p>

  <div class="page-break"></div>

  <h2>SIGNATURES</h2>

  <div style="margin-bottom: 48px;">
    <p><strong>${sellerName}</strong></p>
    <div class="signature-block">
      <div class="signature-line" style="height: 40px;"></div>
      <p class="label">Authorized Representative</p>
      <div class="signature-line" style="height: 20px; margin-top: 12px;"></div>
      <p class="label">Name (Print): ${signer}</p>
      <div class="signature-line" style="height: 20px; margin-top: 12px;"></div>
      <p class="label">Title</p>
      <div class="signature-line" style="height: 20px; margin-top: 12px;"></div>
      <p class="label">Date</p>
    </div>
  </div>

  <div>
    <p><strong>${buyerName}</strong></p>
    <div class="signature-block">
      <div class="signature-line" style="height: 40px;"></div>
      <p class="label">Authorized Representative</p>
      <div class="signature-line" style="height: 20px; margin-top: 12px;"></div>
      <p class="label">Name (Print)</p>
      <div class="signature-line" style="height: 20px; margin-top: 12px;"></div>
      <p class="label">Title</p>
      <div class="signature-line" style="height: 20px; margin-top: 12px;"></div>
      <p class="label">Date</p>
    </div>
  </div>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 48px; margin-bottom: 12px;">
  <p style="font-size: 10px; color: #718096;">This agreement protects all confidential business, technical, financial, operational, customer, lead, software, strategy, and diligence information related to ${assetName}. No information transfer occurs without execution of a definitive purchase agreement and full payment.</p>
</body>
</html>
  `;
}
