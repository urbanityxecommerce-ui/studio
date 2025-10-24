'use server';
/**
 * @fileOverview A flow for performing keyword research based on a topic.
 *
 * - searchKeywords - A function that handles the keyword search process.
 * - SearchKeywordsInput - The input type for the searchKeywords function.
 * - SearchKeywordsOutput - The return type for the searchKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  input: {schema: SearchKeywordsInputSchema},
  output: {schema: SearchKeywordsOutputSchema},
  prompt: `You are an expert SEO analyst. For the given topic, generate a list of 10 related keywords. For each keyword, provide the estimated monthly search volume, competition level (low, medium, or high), and the SEO difficulty to rank for it (low, medium, or high).

Topic: {{{topic}}}

Provide a diverse set of keywords, including long-tail and question-based keywords. Ensure the data is realistic.
`,
});

const searchKeywordsFlow = ai.defineFlow(
  {
    name: 'searchKeywordsFlow',
    inputSchema: SearchKeywordsInputSchema,
    outputSchema: SearchKeywordsTOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
