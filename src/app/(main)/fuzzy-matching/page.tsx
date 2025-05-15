"use client";

import { useState } from "react";
import { FuzzyMatchForm } from "@/components/fuzzy-matching/fuzzy-match-form";
import { MatchResultsTable } from "@/components/fuzzy-matching/match-results-table";
import type { EnhanceMatchingOutput } from "@/ai/flows/enhance-matching";

export default function FuzzyMatchingPage() {
  const [matchResults, setMatchResults] =
    useState<EnhanceMatchingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Fuzzy Matching
        </h1>
      </header>

      <FuzzyMatchForm
        onResults={setMatchResults}
        onLoadingStateChange={setIsLoading}
      />

      <MatchResultsTable results={matchResults} isLoading={isLoading} />
    </div>
  );
}
