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
import { getYoutubeChannelAndVideoDetails } from '../tools/youtube';

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
  headlinePatterns: z
    .array(z.string())
    .describe('Common headline patterns used by the competitor.'),
  commonTags: z
    .array(z.string())
    .describe('Common tags used by the competitor.'),
  gapOpportunities: z
    .array(z.string())
    .describe('Identified content gap opportunities based on the real data.'),
  contentAngles: z
    .array(z.string())
    .describe('Recommended content angles to outrank the competitor, informed by the provided data.'),
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
  input: {schema: z.any()},
  output: {schema: AnalyzeCompetitorContentOutputSchema},
  prompt: `You are an expert SEO analyst specializing in competitor analysis for YouTube and Instagram.
  
  You have been provided with real data from a competitor's YouTube channel, including their top videos, titles, and tags.
  Your task is to perform a detailed analysis of this data to identify patterns, gaps, and opportunities.

  Analyze the provided data:
  - Top Videos: {{{topVideos}}}
  - Video Titles: {{{titles}}}
  - Video Tags: {{{tags}}}

  Your analysis must include:
  - An analysis of common patterns in their video headlines.
  - A summary of their most frequently used tags/hashtags.
  - Insightful content gap opportunities based on what they are and are not covering.
  - Creative and actionable content angles that could be used to outrank this competitor.
`,
});

const analyzeCompetitorContentFlow = ai.defineFlow(
  {
    name: 'analyzeCompetitorContentFlow',
    inputSchema: AnalyzeCompetitorContentInputSchema,
    outputSchema: AnalyzeCompetitorContentOutputSchema,
    tools: [getYoutubeChannelAndVideoDetails]
  },
  async ({competitorChannelOrVideoLink}) => {

    const youtubeData = await getYoutubeChannelAndVideoDetails(competitorChannelOrVideoLink);
    
    if (!youtubeData) {
        throw new Error('Could not retrieve YouTube data.');
    }

    const {output} = await prompt({
        topVideos: youtubeData.videoTitles,
        titles: youtubeData.videoTitles,
        tags: youtubeData.videoTags,
    });
    
    return {
        ...output!,
        topVideos: youtubeData.videoTitles.slice(0, 5),
    }
  }
);
