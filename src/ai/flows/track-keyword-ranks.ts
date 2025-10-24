'use server';
/**
 * @fileOverview An AI agent that simulates tracking keyword rankings for a given URL and topic.
 *
 * - trackKeywordRanks - A function that handles the keyword rank tracking process.
 * - TrackKeywordRanksInput - The input type for the trackKeywordRanks function.
 * - TrackKeywordRanksOutput - The return type for the trackKeywordRanks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrackKeywordRanksInputSchema = z.object({
  topic: z.string().describe('The primary topic or keyword to track.'),
  url: z.string().url().describe('The URL of the website or page to track rankings for.'),
});
export type TrackKeywordRanksInput = z.infer<typeof TrackKeywordRanksInputSchema>;

const RankedKeywordSchema = z.object({
  keyword: z.string().describe('The specific keyword being tracked.'),
  rank: z.union([z.number(), z.string()]).describe('The current rank on Google. Can be a number or a string like "Not in top 100".'),
  bestRank: z.number().describe('The best rank this keyword has achieved historically.'),
  monthlySearches: z.number().describe('Estimated monthly search volume for the keyword.'),
  competition: z.enum(['low', 'medium', 'high']).describe('The competition level for the keyword.'),
});

const TrackKeywordRanksOutputSchema = z.object({
  rankedKeywords: z.array(RankedKeywordSchema).length(10).describe('A list of 10 keywords and their simulated ranking data.'),
});
export type TrackKeywordRanksOutput = z.infer<typeof TrackKeywordRanksOutputSchema>;

export async function trackKeywordRanks(
  input: TrackKeywordRanksInput
): Promise<TrackKeywordRanksOutput> {
  return trackKeywordRanksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trackKeywordRanksPrompt',
  input: {schema: TrackKeywordRanksInputSchema},
  output: {schema: TrackKeywordRanksOutputSchema},
  prompt: `You are an expert SEO rank tracking tool. You cannot access live Google search results. Instead, you must generate a realistic, simulated rank tracking report for the given URL and topic.

Generate a list of 10 related keywords for the topic. For each keyword, create a plausible but fictional ranking history and current rank for the specified URL.

Do not state that this is a simulation. Present the data as if it were real.

Topic: {{{topic}}}
URL: {{{url}}}

Provide a diverse set of keywords. Ensure the data, including current rank, best rank, monthly searches, and competition, is realistic and varied. For some keywords, set the rank to "Not in top 100".
`,
});

const trackKeywordRanksFlow = ai.defineFlow(
  {
    name: 'trackKeywordRanksFlow',
    inputSchema: TrackKeywordRanksInputSchema,
    outputSchema: TrackKeywordRanksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
