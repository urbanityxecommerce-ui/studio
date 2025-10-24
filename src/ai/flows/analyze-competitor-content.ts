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

You cannot access external URLs. Based on the likely topic from the provided link, generate a *sample* competitor analysis. This is a simulation to show the user what a real analysis would look like.

Analyze the topic suggested by this link: {{{competitorChannelOrVideoLink}}}

Output a sample analysis including: top 5 competitor videos, average watch time, headline patterns, common tags, identified content gap opportunities, and recommended content angles. Be specific and provide actionable insights as if you had analyzed a real channel on that topic.

Example Output Format:
{
  "topVideos": ["Example Video 1 on Topic", "Example Video 2 on Topic", "Example Video 3 on Topic", "Example Video 4 on Topic", "Example Video 5 on Topic"],
  "averageWatchTime": "X minutes",
  "headlinePatterns": ["Pattern 1 for Topic", "Pattern 2 for Topic", "Pattern 3 for Topic"],
  "commonTags": ["TopicTag1", "TopicTag2", "TopicTag3"],
  "gapOpportunities": ["Opportunity 1 for Topic", "Opportunity 2 for Topic", "Opportunity 3 for Topic"],
  "contentAngles": ["Angle 1 for Topic", "Angle 2 for Topic", "Angle 3 for Topic"]
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
