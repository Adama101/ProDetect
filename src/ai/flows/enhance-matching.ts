'use server';

/**
 * @fileOverview Enhances fuzzy matching of names against watchlists using GenAI.
 *
 * - enhanceMatching - A function that enhances matching of names.
 * - EnhanceMatchingInput - The input type for the enhanceMatching function.
 * - EnhanceMatchingOutput - The return type for the enhanceMatching function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EnhanceMatchingInputSchema = z.object({
    nameToMatch: z.string().describe('The name to match against the watchlist.'),
    watchlistNames: z.array(z.string()).describe('An array of names from the watchlist.'),
});
export type EnhanceMatchingInput = z.infer<typeof EnhanceMatchingInputSchema>;

const EnhanceMatchingOutputSchema = z.object({
    enhancedMatches: z.array(
        z.object({
            name: z.string().describe('The watchlist name that is a potential match.'),
            similarityScore: z.number().describe('A score indicating the similarity between the input name and the watchlist name.'),
            justification: z.string().describe('Explanation of why the names are considered a potential match, highlighting similar characters or contexts.'),
            listType: z.string().optional().describe('The type of watchlist (e.g., OFAC, UN, EU, Internal)'),
            entityType: z.string().optional().describe('The type of entity (e.g., Individual, Organization)'),
            riskCategory: z.string().optional().describe('The risk category associated with this entity'),
        })
    ).describe('An array of enhanced matches from the watchlist, with similarity scores and justifications.'),
});
export type EnhanceMatchingOutput = z.infer<typeof EnhanceMatchingOutputSchema>;

export async function enhanceMatching(input: EnhanceMatchingInput): Promise<EnhanceMatchingOutput> {
    return enhanceMatchingFlow(input);
}

const enhanceMatchingPrompt = ai.definePrompt({
    name: 'enhanceMatchingPrompt',
    input: { schema: EnhanceMatchingInputSchema },
    output: { schema: EnhanceMatchingOutputSchema },
    prompt: `You are a compliance officer specializing in identifying potential fraud risks.
Your task is to enhance fuzzy matching of names against watchlists using AI.
Given a name to match and a list of names from the watchlist, identify potential matches even with slight discrepancies in identifiers.

Name to Match: {{{nameToMatch}}}
Watchlist Names:
{{#each watchlistNames}}- {{{this}}}
{{/each}}

Analyze the names from the watchlist and provide enhanced matches with similarity scores and justifications.
For each potential match:
1. Calculate a similarity score between 0 and 1, where 1 is an exact match
2. Provide a detailed justification explaining why the names are considered similar
3. Infer the list type (OFAC, UN, EU, Internal) based on the name if possible
4. Infer the entity type (Individual, Organization) based on the name if possible
5. Assign a risk category (High, Medium, Low) based on the similarity score and context

Be thorough in your analysis, considering:
- Name variations and common nicknames
- Spelling differences and transliterations
- Word order variations
- Corporate name variations (LLC, Inc, Ltd, etc.)
- Partial matches on significant name components

Ensure to include the name, similarity score, and justification for each potential match.
`,
});

const enhanceMatchingFlow = ai.defineFlow(
    {
        name: 'enhanceMatchingFlow',
        inputSchema: EnhanceMatchingInputSchema,
        outputSchema: EnhanceMatchingOutputSchema,
    },
    async input => {
        const { output } = await enhanceMatchingPrompt(input);
        return output!;
    }
);