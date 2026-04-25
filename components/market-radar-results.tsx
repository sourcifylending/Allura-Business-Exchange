"use client";

import type { RankedOpportunity } from "@/lib/market-radar-research";
import { RadarScorePill } from "./radar-score-pill";

interface MarketRadarResultsProps {
  opportunities: RankedOpportunity[];
}

export function MarketRadarResults({ opportunities }: MarketRadarResultsProps) {
  if (opportunities.length === 0) {
    return (
      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
          Ranked Opportunities
        </div>
        <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
          No opportunities found. Try different research criteria and run Market Radar again.
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="grid gap-2">
        <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
          Ranked Opportunities
        </div>
        <h3 className="text-xl font-semibold text-ink-950">
          {opportunities.length} market opportunities ranked by overall score
        </h3>
        <p className="text-sm text-ink-600">
          Each idea is scored on demand strength, build feasibility, buyer clarity, competition
          level, and sale potential. Click to expand for full details.
        </p>
      </div>

      <div className="grid gap-4">
        {opportunities.map((opp, index) => (
          <OpportunityCard key={opp.id} opportunity={opp} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}

interface OpportunityCardProps {
  opportunity: RankedOpportunity;
  rank: number;
}

function OpportunityCard({ opportunity, rank }: OpportunityCardProps) {
  const scoreTone = (score: number) => {
    if (score >= 80) return "positive";
    if (score >= 60) return "warning";
    return "danger";
  };

  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-ink-50 p-6 transition hover:border-accent-200">
      <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
        {/* Left side - Content */}
        <div className="grid gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
                #{rank} Opportunity • {opportunity.industry}
              </div>
              <h4 className="mt-2 text-lg font-semibold text-ink-950">{opportunity.opportunityName}</h4>
              <p className="mt-1 text-sm text-ink-600">{opportunity.problemGap}</p>
            </div>
            <div className="flex-shrink-0 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
              {opportunity.scores.overall.toFixed(0)}/100
            </div>
          </div>

          {/* AI Asset Idea */}
          <div className="rounded-[1rem] border border-dashed border-ink-300 bg-white p-3">
            <div className="text-xs font-semibold tracking-[0.18em] text-ink-500 uppercase">
              AI Asset Idea
            </div>
            <p className="mt-1 text-sm text-ink-700">{opportunity.assetIdea}</p>
          </div>

          {/* Scores Grid */}
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <RadarScorePill
              label="Demand"
              value={opportunity.scores.demand.toFixed(0)}
              tone={scoreTone(opportunity.scores.demand)}
            />
            <RadarScorePill
              label="Build Speed"
              value={opportunity.scores.buildSpeed.toFixed(0)}
              tone={scoreTone(opportunity.scores.buildSpeed)}
            />
            <RadarScorePill
              label="Buyer Clarity"
              value={opportunity.scores.buyerClarity.toFixed(0)}
              tone={scoreTone(opportunity.scores.buyerClarity)}
            />
            <RadarScorePill
              label="Competition"
              value={opportunity.scores.competition.toFixed(0)}
              tone={opportunity.scores.competition < 50 ? "positive" : "warning"}
            />
            <RadarScorePill
              label="Sale Potential"
              value={opportunity.scores.salePotential.toFixed(0)}
              tone={scoreTone(opportunity.scores.salePotential)}
            />
          </div>

          {/* Key Details */}
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <div className="font-semibold text-ink-700">Why Demand Exists</div>
              <p className="mt-1 text-ink-600">{opportunity.whyDemandExists}</p>
            </div>
            <div>
              <div className="font-semibold text-ink-700">Target Buyer</div>
              <p className="mt-1 text-ink-600">{opportunity.targetBuyer}</p>
            </div>
            <div>
              <div className="font-semibold text-ink-700">Build Timeline</div>
              <p className="mt-1 text-ink-600">{opportunity.buildSpeed}</p>
            </div>
            <div>
              <div className="font-semibold text-ink-700">Sale Range</div>
              <p className="mt-1 text-ink-600">{opportunity.likelySaleRange}</p>
            </div>
          </div>

          {/* Expandable Details */}
          <details className="rounded-[1rem] border border-dashed border-ink-300 bg-white p-3">
            <summary className="cursor-pointer font-semibold text-accent-700 uppercase text-xs tracking-[0.16em]">
              View full details
            </summary>
            <div className="mt-4 grid gap-4 text-sm">
              <div>
                <div className="font-semibold text-ink-700">Competition Level</div>
                <p className="mt-1 text-ink-600">{opportunity.competitionLevel}</p>
              </div>
              <div>
                <div className="font-semibold text-ink-700">Difficulty</div>
                <p className="mt-1 text-ink-600">{opportunity.difficulty}</p>
              </div>
              <div>
                <div className="font-semibold text-ink-700">Suggested MVP Scope</div>
                <p className="mt-1 text-ink-600">{opportunity.suggestedMVPScope}</p>
              </div>
              <div>
                <div className="font-semibold text-ink-700">Validation Signals</div>
                <ul className="mt-1 list-inside list-disc text-ink-600">
                  {opportunity.validationSignals.map((signal, i) => (
                    <li key={i}>{signal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-ink-700">Next Steps</div>
                <ol className="mt-1 list-inside list-decimal text-ink-600">
                  {opportunity.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </details>
        </div>

        {/* Right side - Actions */}
        <div className="flex flex-col gap-2 xl:w-40">
          <button className="inline-flex items-center justify-center rounded-full bg-accent-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-600">
            Save as Draft
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-accent-700 px-4 py-2 text-xs font-semibold text-accent-700 transition hover:bg-accent-50">
            View Details
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-ink-300 px-4 py-2 text-xs font-semibold text-ink-700 transition hover:bg-ink-100">
            Add to Watchlist
          </button>
        </div>
      </div>
    </article>
  );
}
