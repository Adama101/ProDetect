
'use client';

import { useState } from 'react';
import { FuzzyMatchForm } from '@/components/fuzzy-matching/fuzzy-match-form';
import { MatchResultsTable } from '@/components/fuzzy-matching/match-results-table';
import type { EnhanceMatchingOutput } from '@/ai/flows/enhance-matching';

export default function FuzzyMatchingPage() {
  const [matchResults, setMatchResults] = useState<EnhanceMatchingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Fuzzy Matching</h1>
        <p className="text-muted-foreground">
          Employ AI for precise, high-fidelity screening against global watchlists, sanctions lists (e.g., OFAC, UN, EU), and PEP lists. Identify near-matches with advanced fuzzy logic.
        </p>
      </header>

      <FuzzyMatchForm 
        onResults={setMatchResults} 
        onLoadingStateChange={setIsLoading} 
      />

      <MatchResultsTable results={matchResults} isLoading={isLoading} />
    </div>
  );
}
