"use client";

import { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import type { DigitalAssetRow, DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";

export default function DocumentsPage() {
  const [assets, setAssets] = useState<DigitalAssetRow[]>([]);
  const [buyers, setBuyers] = useState<DigitalAssetBuyerInterestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("nda");
  const [preview, setPreview] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  const templates = [
    {
      name: "Non-Disclosure Agreement (NDA)",
      description: "Legal confidentiality agreement with buyer/asset auto-fill",
      type: "nda",
    },
    {
      name: "Buyer Summary",
      description: "Executive overview of the asset and opportunity",
      type: "summary",
    },
    {
      name: "Buyer Presentation",
      description: "12-slide acquisition presentation with highlights",
      type: "presentation",
    },
    {
      name: "Data Room Checklist",
      description: "Document staging guide for due diligence",
      type: "checklist",
    },
    {
      name: "Buyer Follow-Up Email",
      description: "Copy-ready email templates for outreach",
      type: "email",
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/admin/data");
      const data = await response.json();
      setAssets(data.assets.filter((a: any) => a.status === "for_sale"));
      if (data.assets.length > 0) {
        setSelectedAsset(data.assets[0].id);
      }
      setBuyers(data.buyers || []);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBuyers = selectedAsset
    ? buyers.filter(b => b.digital_asset_id === selectedAsset)
    : [];

  const currentAsset = assets.find(a => a.id === selectedAsset);
  const currentBuyer = buyers.find(b => b.id === selectedBuyer);

  const generatePreview = () => {
    if (!currentAsset || !currentBuyer) {
      alert("Please select both an asset and a buyer");
      return;
    }

    let content = "";
    const today = new Date().toLocaleDateString();
    const buyerName = currentBuyer.buyer_name || "Buyer";
    const assetName = currentAsset.name || "Asset";
    const price = currentAsset.asking_price ? `$${currentAsset.asking_price.toLocaleString()}` : "TBD";

    switch (selectedTemplate) {
      case "nda":
        content = `
NON-DISCLOSURE AGREEMENT

THIS AGREEMENT is made and entered into on ${today} ("Effective Date")

BETWEEN: Allura Business Exchange ("Seller")
AND: ${buyerName} ("Buyer")

WHEREAS, Seller owns or controls certain confidential information regarding ${assetName} and wishes to evaluate the possibility of sale;

NOW THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. CONFIDENTIAL INFORMATION
The term "Confidential Information" means all information, whether technical or commercial, disclosed by Seller to Buyer in connection with the proposed transaction, including but not limited to business plans, financial data, technical specifications, and trade secrets.

2. OBLIGATIONS
Buyer agrees to:
   a) Keep all Confidential Information strictly confidential
   b) Not disclose Confidential Information to third parties without prior written consent
   c) Use Confidential Information solely for evaluating the proposed transaction
   d) Return or destroy Confidential Information upon request

3. EXCLUSIONS
Confidential Information does not include information that:
   a) Is already in the public domain
   b) Was rightfully known to Buyer prior to disclosure
   c) Is independently developed without use of Confidential Information
   d) Is rightfully received from a third party

4. TERM
This Agreement shall remain in effect for 24 months from the Effective Date.

5. FLORIDA LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of Florida, without regard to conflicts of law principles.

ASSET DETAILS:
- Asset Name: ${assetName}
- Asking Price: ${price}
- Asset Type: ${currentAsset.asset_type || "N/A"}
- Revenue Stage: ${currentAsset.revenue_stage || "N/A"}

Seller: Allura Business Exchange
Buyer: ${buyerName}
Email: ${currentBuyer.buyer_email || "N/A"}
Phone: ${currentBuyer.buyer_phone || "N/A"}
`;
        break;

      case "summary":
        content = `
BUYER SUMMARY: ${assetName}

Executive Overview
${assetName} is a digital asset representing a ${currentAsset.revenue_stage || "growth-stage"} opportunity with a current valuation of ${price}.

Asset Overview
Type: ${currentAsset.asset_type || "Digital Service"}
Status: ${currentAsset.status}
Stage: ${currentAsset.revenue_stage || "N/A"}

Description:
${currentAsset.short_description || "Professional digital asset with established market presence and growth potential."}

Investment Highlights
- Established business model
- Recurring revenue streams
- Scalable platform
- Experienced operations
- Growth potential in market

Financial Overview
Asking Price: ${price}
Revenue Stage: ${currentAsset.revenue_stage || "Confidential"}

Next Steps
1. Review complete information package
2. Schedule management meeting
3. Begin financial due diligence
4. Negotiate letter of intent
`;
        break;

      case "presentation":
        content = `
BUYER PRESENTATION: ${assetName}

SLIDE 1: OVERVIEW
${assetName} - Digital Asset Acquisition Opportunity
Asking Price: ${price}

SLIDE 2: BUSINESS SUMMARY
Type: ${currentAsset.asset_type || "Digital Service"}
Revenue Stage: ${currentAsset.revenue_stage || "Established"}
${currentAsset.short_description || "Professional digital asset"}

SLIDE 3-5: FINANCIAL PERFORMANCE
- Revenue Growth: Consistent year-over-year
- Margin Profile: Healthy and sustainable
- Cash Flow: Positive and reliable

SLIDE 6-8: MARKET OPPORTUNITY
- Addressable Market: Growing demand
- Competitive Position: Strong
- Growth Trajectory: Accelerating

SLIDE 9-10: MANAGEMENT & OPERATIONS
- Experienced Leadership Team
- Established Processes & Systems
- Proven Track Record

SLIDE 11: INVESTMENT HIGHLIGHTS
✓ Established business model
✓ Multiple growth vectors
✓ Strong management team
✓ Scalable technology platform

SLIDE 12: NEXT STEPS
1. Confirm interest
2. Sign NDA
3. Arrange management discussions
4. Begin formal due diligence
5. Negotiate definitive agreements
`;
        break;

      case "checklist":
        content = `
DATA ROOM CHECKLIST: ${assetName}

TIER 1: CRITICAL DOCUMENTS
☐ Organizational Documents
  ☐ Articles of Incorporation/Formation
  ☐ Bylaws/Operating Agreement
  ☐ Cap Table and Equity Documents

☐ Financial Documents
  ☐ Last 3 years audited financials
  ☐ Current year-to-date statements
  ☐ Balance sheets, P&L, cash flow

TIER 2: OPERATIONAL DOCUMENTS
☐ Commercial Contracts
  ☐ Customer agreements
  ☐ Vendor agreements
  ☐ Employee agreements

☐ Intellectual Property
  ☐ Patents and trademarks
  ☐ Licenses and permissions
  ☐ Source code documentation

TIER 3: COMPLIANCE DOCUMENTS
☐ Tax Returns (3 years)
☐ Insurance Policies
☐ Regulatory Filings
☐ Compliance Certifications

TIER 4: STRATEGIC DOCUMENTS
☐ Business Plans
☐ Growth Projections
☐ Market Analysis
☐ Competitive Analysis

TIER 5: SUPPLEMENTAL DOCUMENTS
☐ Press releases
☐ Customer references
☐ Technical documentation
☐ Product roadmap

Asset: ${assetName}
Price: ${price}
Prepared for: ${buyerName}
Date: ${today}
`;
        break;

      case "email":
        content = `
Subject: Exclusive Acquisition Opportunity - ${assetName}

Dear ${buyerName},

I hope this message finds you well. I'm reaching out with an exclusive acquisition opportunity that aligns with your portfolio strategy.

OPPORTUNITY OVERVIEW
Asset: ${assetName}
Type: ${currentAsset.asset_type || "Digital Asset"}
Asking Price: ${price}

HIGHLIGHTS
✓ Established business with proven revenue model
✓ Growth stage: ${currentAsset.revenue_stage || "Established"}
✓ Strong market position and scalability

NEXT STEPS
I'd like to schedule a brief call to discuss how this acquisition could create value for your organization. Upon your interest, we'll:

1. Share a comprehensive information package
2. Arrange a management presentation
3. Discuss financial and operational details
4. Move toward formal evaluation

CONFIDENTIALITY
This opportunity is offered subject to a Non-Disclosure Agreement (NDA) to protect proprietary information.

Available times this week:
- Tuesday, 2:00 PM - 4:00 PM
- Wednesday, 10:00 AM - 12:00 PM
- Thursday, 3:00 PM - 5:00 PM

Please let me know your availability, or feel free to suggest alternative times.

Best regards,
Allura Business Exchange
Phone: (305) 555-0123

---
This communication and any attachments are confidential and intended for the named recipient only.
`;
        break;

      default:
        content = "Document preview not available";
    }

    setPreview(content);
    setShowPreview(true);
  };

  const handlePrint = () => {
    if (!preview) {
      alert("Please generate a preview first");
      return;
    }

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedTemplate} - ${currentBuyer?.buyer_name || "Document"}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${preview}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Documents"
        description="Generate and export documents for asset sales, NDAs, and buyer communications."
      />

      <PageCard title="Generate Document" description="">
        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Asset *</label>
              <select
                value={selectedAsset}
                onChange={(e) => {
                  setSelectedAsset(e.target.value);
                  setSelectedBuyer("");
                }}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
              >
                <option value="">Select asset...</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Buyer *</label>
              <select
                value={selectedBuyer}
                onChange={(e) => setSelectedBuyer(e.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
              >
                <option value="">Select buyer...</option>
                {filteredBuyers.map(buyer => (
                  <option key={buyer.id} value={buyer.id}>
                    {buyer.buyer_name} ({buyer.buyer_email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1">Template *</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
              >
                {templates.map(template => (
                  <option key={template.type} value={template.type}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generatePreview}
              disabled={loading || !selectedAsset || !selectedBuyer}
              className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-50 transition"
            >
              Generate Preview
            </button>
            {showPreview && (
              <button
                onClick={handlePrint}
                className="rounded-lg border border-accent-300 bg-accent-50 px-4 py-2 text-sm font-medium text-accent-700 hover:bg-accent-100 transition"
              >
                📄 Export PDF
              </button>
            )}
            {!selectedAsset || !selectedBuyer ? (
              <div className="text-xs text-ink-600 flex items-center">
                Please select an asset, buyer, and template
              </div>
            ) : null}
          </div>
        </div>
      </PageCard>

      {showPreview && preview && (
        <PageCard title="Document Preview" description="">
          <div className="rounded-lg border border-ink-200 bg-ink-50 p-6 whitespace-pre-wrap font-mono text-sm overflow-auto max-h-96">
            {preview}
          </div>
        </PageCard>
      )}

      <PageCard title="Available Templates" description={`${templates.length} templates ready to use`}>
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map(template => (
            <div key={template.type} className="rounded-lg border border-ink-200 bg-white p-4">
              <h3 className="font-medium text-ink-900">{template.name}</h3>
              <p className="mt-1 text-xs text-ink-600">{template.description}</p>
            </div>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
