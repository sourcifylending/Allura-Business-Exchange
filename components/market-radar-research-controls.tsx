"use client";

import { useState } from "react";
import type {
  ResearchMode,
  OpportunityType,
  BuildSpeed,
  TargetBuyer,
  SaleRange,
} from "@/lib/market-radar-research";

const INDUSTRIES = [
  "Any Industry",
  "Healthcare",
  "Home Services",
  "Legal",
  "Finance",
  "Real Estate",
  "Construction",
  "Logistics",
  "Education",
  "Local Services",
  "Creator Economy",
  "Insurance",
];

const RESEARCH_MODES: { value: ResearchMode; label: string }[] = [
  { value: "hottest_demand", label: "Hottest Demand Right Now" },
  { value: "market_gap", label: "Underserved Industry Gap" },
  { value: "fast_build", label: "Fast-Build AI Tool Ideas" },
  { value: "high_ticket", label: "High-Ticket B2B Software Ideas" },
  { value: "buyer_ready", label: "Buyer-Ready Digital Asset Ideas" },
];

const OPPORTUNITY_TYPES: { value: OpportunityType; label: string }[] = [
  { value: "AI_SaaS", label: "AI SaaS" },
  { value: "Internal_Tool", label: "Internal Operations Tool" },
  { value: "Lead_Gen", label: "Lead Generation Tool" },
  { value: "Compliance", label: "Compliance Workflow Tool" },
  { value: "CRM_Addon", label: "CRM / Portal Add-on" },
  { value: "Analytics", label: "Analytics Dashboard" },
  { value: "Automation", label: "Automation Tool" },
];

const BUILD_SPEEDS: { value: BuildSpeed; label: string }[] = [
  { value: "fast", label: "Fast: 1-2 weeks" },
  { value: "medium", label: "Medium: 2-6 weeks" },
  { value: "longer", label: "Longer: 6-12 weeks" },
];

const TARGET_BUYERS: { value: TargetBuyer; label: string }[] = [
  { value: "Agency_Owners", label: "Agency Owners" },
  { value: "Small_Business", label: "Small Business Operators" },
  { value: "Vertical_SaaS", label: "Vertical SaaS Buyers" },
  { value: "Private_Equity", label: "Private Equity / Searchers" },
  { value: "Service_Business", label: "Service Businesses" },
  { value: "Compliance", label: "Compliance Teams" },
  { value: "Sales_Teams", label: "Sales Teams" },
];

const SALE_RANGES: { value: SaleRange; label: string }[] = [
  { value: "$10k-$25k", label: "$10k-$25k" },
  { value: "$25k-$50k", label: "$25k-$50k" },
  { value: "$50k-$100k", label: "$50k-$100k" },
  { value: "$100k+", label: "$100k+" },
];

interface MarketRadarResearchControlsProps {
  onSubmit: (formData: {
    researchMode: ResearchMode;
    industryFocus: string[];
    opportunityType: OpportunityType;
    buildSpeed: BuildSpeed;
    targetBuyer: TargetBuyer;
    targetSaleRange: SaleRange;
    optionalPrompt: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function MarketRadarResearchControls({
  onSubmit,
  isLoading,
}: MarketRadarResearchControlsProps) {
  const [formData, setFormData] = useState({
    researchMode: "hottest_demand" as ResearchMode,
    industryFocus: ["Any Industry"],
    opportunityType: "AI_SaaS" as OpportunityType,
    buildSpeed: "medium" as BuildSpeed,
    targetBuyer: "Small_Business" as TargetBuyer,
    targetSaleRange: "$25k-$50k" as SaleRange,
    optionalPrompt: "",
  });

  const handleIndustryChange = (industry: string) => {
    if (industry === "Any Industry") {
      setFormData({ ...formData, industryFocus: ["Any Industry"] });
    } else {
      const current = formData.industryFocus.filter((i) => i !== "Any Industry");
      const updated = current.includes(industry)
        ? current.filter((i) => i !== industry)
        : [...current, industry];
      setFormData({ ...formData, industryFocus: updated.length > 0 ? updated : ["Any Industry"] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <section className="grid gap-6 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="grid gap-2">
        <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
          Research Command Center
        </div>
        <h2 className="text-2xl font-semibold text-ink-950">
          Discover high-demand industries and AI asset ideas
        </h2>
        <p className="text-sm text-ink-600">
          Select research criteria below. The system will generate ranked market opportunities with
          demand signals, build complexity, buyer clarity, and sale potential.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Research Mode */}
        <div className="grid gap-2">
          <label className="text-xs font-semibold tracking-[0.2em] text-ink-500 uppercase">
            Research Mode
          </label>
          <select
            value={formData.researchMode}
            onChange={(e) =>
              setFormData({ ...formData, researchMode: e.target.value as ResearchMode })
            }
            disabled={isLoading}
            className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 disabled:opacity-50"
          >
            {RESEARCH_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        {/* Industry Focus */}
        <div className="grid gap-2">
          <label className="text-xs font-semibold tracking-[0.2em] text-ink-500 uppercase">
            Industry Focus (select one or more)
          </label>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <label key={industry} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.industryFocus.includes(industry)}
                  onChange={() => handleIndustryChange(industry)}
                  disabled={isLoading}
                  className="rounded border-ink-300"
                />
                <span className="text-sm text-ink-700">{industry}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Grid for other controls */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {/* Opportunity Type */}
          <div className="grid gap-2">
            <label className="text-xs font-semibold tracking-[0.2em] text-ink-500 uppercase">
              Opportunity Type
            </label>
            <select
              value={formData.opportunityType}
              onChange={(e) =>
                setFormData({ ...formData, opportunityType: e.target.value as OpportunityType })
              }
              disabled={isLoading}
              className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 disabled:opacity-50"
            >
              {OPPORTUNITY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Build Speed */}
          <div className="grid gap-2">
            <label className="text-xs font-semibold tracking-[0.2em] text-ink-500 uppercase">
              Build Speed
            </label>
            <select
              value={formData.buildSpeed}
              onChange={(e) =>
                setFormData({ ...formData, buildSpeed: e.target.value as BuildSpeed })
              }
              disabled={isLoading}
              className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 disabled:opacity-50"
            >
              {BUILD_SPEEDS.map((speed) => (
                <option key={speed.value} value={speed.value}>
                  {speed.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Buyer */}
          <div className="grid gap-2">
            <label className="text-xs font-semibold tracking-[0.2em] text-ink-500 uppercase">
              Target Buyer
            </label>
            <select
              value={formData.targetBuyer}
              onChange={(e) =>
                setFormData({ ...formData, targetBuyer: e.target.value as TargetBuyer })
              }
              disabled={isLoading}
              className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 disabled:opacity-50"
            >
              {TARGET_BUYERS.map((buyer) => (
                <option key={buyer.value} value={buyer.value}>
                  {buyer.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sale Range */}
          <div className="grid gap-2 sm:col-span-2 xl:col-span-1">
            <label className="text-xs font-semibold tracking-[0.2em] text-ink-500 uppercase">
              Target Sale Range
            </label>
            <select
              value={formData.targetSaleRange}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetSaleRange: e.target.value as SaleRange,
                })
              }
              disabled={isLoading}
              className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 disabled:opacity-50"
            >
              {SALE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Prompt */}
        <div className="grid gap-2">
          <label className="text-xs font-semibold tracking-[0.2em] text-ink-500 uppercase">
            Optional Prompt (refine the research)
          </label>
          <textarea
            value={formData.optionalPrompt}
            onChange={(e) =>
              setFormData({ ...formData, optionalPrompt: e.target.value })
            }
            disabled={isLoading}
            placeholder="Example: Find AI tools that service businesses would buy quickly and that can be built in under 30 days."
            rows={3}
            className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full bg-accent-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Running Market Radar..." : "Run Market Radar"}
          </button>
          <span className="text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">
            Admin only
          </span>
        </div>
      </form>
    </section>
  );
}
