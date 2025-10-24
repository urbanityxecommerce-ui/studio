'use server';
/**
 * @fileOverview A flow for repurposing long-form videos into short, engaging clips.
 *
 * - repurposeLongVideo - A function that handles the video repurposing process.
 * - RepurposeLongVideoInput - The input type for the repurposeLongVideo function.
 * - RepurposeLongVideoOutput - The return type for the repurposeLongVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RepurposeLongVideoInputSchema = z.object({
  videoDescription: z.string().describe('The description of the long-form video.'),
  videoUrl: z.string().describe('The URL of the long-form video.'),
  targetPlatforms: z.array(z.string()).describe('The social media platforms to repurpose the video for.'),
});
export type RepurposeLongVideoInput = z.infer<typeof RepurposeLongVideoInputSchema>;

const RepurposeLongVideoOutputSchema = z.object({
  shortScripts: z.array(
    z.object({
      platform: z.string().describe('The social media platform the script is for.'),
      script: z.string().describe('The short script for the platform.'),
      timestamps: z.array(z.string()).describe('The timestamps for the clips.'),
      captions: z.string().describe('The captions for the clips.'),
    })
  ).describe('The list of short scripts for each platform.'),
});
export type RepurposeLongVideoOutput = z.infer<typeof RepurposeLongVideoOutputSchema>;

export async function repurposeLongVideo(input: RepurposeLongVideoInput): Promise<RepurposeLongVideoOutput> {
  return repurposeLongVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'repurposeLongVideoPrompt',
  input: {schema: RepurposeLongVideoInputSchema},
  output: {schema: RepurposeLongVideoOutputSchema},
  prompt: `You are an expert social media strategist specializing in repurposing long-form video content into short, engaging clips for various social media platforms.

  Given the following long-form video description and target platforms, generate short scripts with timestamps and captions optimized for each platform.

  Video Description: {{{videoDescription}}}
  Video URL: {{{videoUrl}}}
  Target Platforms: {{#each targetPlatforms}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  The output should be a JSON array of short scripts, each containing the platform, script, timestamps, and captions.
  Ensure the scripts are engaging and tailored to the specific platform.
  Each short script should be around 30-60 seconds in length.
`,
});

const repurposeLongVideoFlow = ai.defineFlow(
  {
    name: 'repurposeLongVideoFlow',
    inputSchema: RepurposeLongVideoInputSchema,
    outputSchema: RepurposeLongVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
