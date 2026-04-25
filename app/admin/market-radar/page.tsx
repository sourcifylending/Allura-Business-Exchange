"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { MarketRadarResearchControls } from "@/components/market-radar-research-controls";
import { MarketRadarResults } from "@/components/market-radar-results";
import { runMarketRadarResearch, type ResearchCriteria } from "@/lib/market-radar-research";
import type { RankedOpportunity } from "@/lib/market-radar-research";

export default function MarketRadarPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RankedOpportunity[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const handleResearch = async (criteria: ResearchCriteria) => {
    setIsLoading(true);
    try {
      const result = await runMarketRadarResearch(criteria);
      setResults(result.opportunities);
      setHasRun(true);
    } catch (error) {
      console.error("Research error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Market Radar"
        description="AI-assisted research cockpit to discover high-demand industries, market gaps, and buildable AI asset ideas."
      />

      <MarketRadarResearchControls onSubmit={handleResearch} isLoading={isLoading} />

      {hasRun && <MarketRadarResults opportunities={results} />}
    </div>
  );
}
