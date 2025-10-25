'use server';
/**
 * @fileOverview A flow for performing keyword research based on a topic, enriched with real YouTube data.
 *
 * - searchKeywords - A function that handles the keyword search process.
 * - SearchKeywordsInput - The input type for the searchKeywords function.
 * - SearchKeywordsOutput - The return type for the searchKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getYoutubeKeywordSuggestions } from '../tools/youtube';

const SearchKeywordsInputSchema = z.object({
  topic: z.string().describe('The topic to research for keywords.'),
});
export type SearchKeywordsInput = z.infer<typeof SearchKeywordsInputSchema>;

const KeywordSchema = z.object({
    keyword: z.string().describe('The keyword phrase.'),
    monthlySearches: z.number().describe('Estimated monthly search volume.'),
    competition: z.enum(['low', 'medium', 'high']).describe('The competition level for the keyword.'),
    difficulty: z.enum(['low', 'medium', 'high']).describe('The SEO difficulty to rank for the keyword.'),
});

const SearchKeywordsOutputSchema = z.object({
  keywords: z.array(KeywordSchema).length(10).describe('A list of 10 related keywords with their data.'),
});
export type SearchKeywordsOutput = z.infer<typeof SearchKeywordsOutputSchema>;

export async function searchKeywords(
  input: SearchKeywordsInput
): Promise<SearchKeywordsOutput> {
  return searchKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchKeywordsPrompt',
  input: {schema: z.object({ topic: z.string(), suggestedKeywords: z.array(z.string()) })},
  output: {schema: SearchKeywordsOutputSchema},
  prompt: `You are an expert SEO analyst. You have been provided with a list of real keyword suggestions from YouTube for a specific topic. Your task is to analyze these suggestions and enrich them with estimated data.

Topic: {{{topic}}}
YouTube Keyword Suggestions:
{{#each suggestedKeywords}}
- {{{this}}}
{{/each}}

From the provided list, select the best 10 keywords. For each of those 10 keywords, provide the following estimated data:
- monthlySearches: A realistic estimated monthly search volume.
- competition: An estimated competition level (low, medium, or high).
- difficulty: An estimated SEO difficulty to rank for it (low, medium, or high).

Present the final output as a clean JSON object containing only the list of 10 keywords with their associated data.
`,
});

const searchKeywordsFlow = ai.defineFlow(
  {
    name: 'searchKeywordsFlow',
    inputSchema: SearchKeywordsInputSchema,
    outputSchema: SearchKeywordsOutputSchema,
    tools: [getYoutubeKeywordSuggestions]
  },
  async ({ topic }) => {
    const suggestedKeywords = await getYoutubeKeywordSuggestions(topic);
    
    if (!suggestedKeywords || suggestedKeywords.length === 0) {
        throw new Error('Could not retrieve keyword suggestions from YouTube.');
    }

    const {output} = await prompt({
        topic,
        suggestedKeywords,
    });
    
    return output!;
  }
);
