'use server';
/**
 * @fileOverview An AI agent that analyzes competitor content to identify gaps and opportunities.
 *
 * - analyzeCompetitorContent - A function that handles the competitor content analysis process.
 * - AnalyzeCompetitorContentInput - The input type for the analyzeCompetitorContent function.
 * - AnalyzeCompetitorContentOutput - The return type for the analyzeCompetitorContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCompetitorContentInputSchema = z.object({
  competitorChannelOrVideoLink: z
    .string()
    .describe('The link to the competitor\'s channel or a specific video.'),
});
export type AnalyzeCompetitorContentInput = z.infer<
  typeof AnalyzeCompetitorContentInputSchema
>;

const AnalyzeCompetitorContentOutputSchema = z.object({
  topVideos: z
    .array(z.string())
    .describe('Top 5 competitor videos based on views and engagement.'),
  averageWatchTime: z
    .string()
    .describe('Average watch time of the competitor\'s videos.'),
  headlinePatterns: z
    .array(z.string())
    .describe('Common headline patterns used by the competitor.'),
  commonTags: z
    .array(z.string())
    .describe('Common tags used by the competitor.'),
  gapOpportunities: z
    .array(z.string())
    .describe('Identified content gap opportunities.'),
  contentAngles: z
    .array(z.string())
    .describe('Recommended content angles to outrank the competitor.'),
});
export type AnalyzeCompetitorContentOutput = z.infer<
  typeof AnalyzeCompetitorContentOutputSchema
>;

export async function analyzeCompetitorContent(
  input: AnalyzeCompetitorContentInput
): Promise<AnalyzeCompetitorContentOutput> {
  return analyzeCompetitorContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCompetitorContentPrompt',
  input: {schema: AnalyzeCompetitorContentInputSchema},
  output: {schema: AnalyzeCompetitorContentOutputSchema},
  prompt: `You are an expert SEO analyst specializing in competitor analysis for YouTube and Instagram.

You will analyze the competitor's content and identify gaps and opportunities for the user to outrank them.

Analyze the following competitor channel or video link: {{{competitorChannelOrVideoLink}}}

Output the top 5 competitor videos, average watch time, headline patterns, common tags, identified content gap opportunities, and recommended content angles to outrank the competitor. Be specific and provide actionable insights.

Example Output Format:
{
  "topVideos": ["Video 1", "Video 2", "Video 3", "Video 4", "Video 5"],
  "averageWatchTime": "X minutes",
  "headlinePatterns": ["Pattern 1", "Pattern 2", "Pattern 3"],
  "commonTags": ["Tag 1", "Tag 2", "Tag 3"],
  "gapOpportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
  "contentAngles": ["Angle 1", "Angle 2", "Angle 3"]
}
`,
});

const analyzeCompetitorContentFlow = ai.defineFlow(
  {
    name: 'analyzeCompetitorContentFlow',
    inputSchema: AnalyzeCompetitorContentInputSchema,
    outputSchema: AnalyzeCompetitorContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
