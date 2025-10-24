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

  IMPORTANT: You CANNOT access external URLs. Your task is to perform a realistic, high-quality *simulated* analysis.
  
  1.  Infer the general topic from the provided link: {{{competitorChannelOrVideoLink}}}
  2.  Based *only on that topic*, generate a detailed, hypothetical competitor analysis. 
  3.  Pretend you have analyzed a popular, real channel about that topic and present the findings. The data must be specific, creative, and actionable. Do not state that you are generating sample data.

  For example, if the link is about 'learning guitar', generate a plausible analysis for a popular guitar tutorial channel.

  Your analysis must include:
  - top 5 plausible video titles
  - a realistic average watch time
  - common headline patterns
  - common tags/hashtags for the topic
  - insightful content gap opportunities
  - creative content angles to outrank a competitor on that topic.
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
