'use server';
/**
 * @fileOverview Flow for generating creative captions for Instagram Reels with different call to action variations.
 *
 * - generateReelCaptions - A function that generates reel captions.
 * - GenerateReelCaptionsInput - The input type for the generateReelCaptions function.
 * - GenerateReelCaptionsOutput - The return type for the generateReelCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReelCaptionsInputSchema = z.object({
  topic: z.string().describe('The topic of the Instagram Reel.'),
});

export type GenerateReelCaptionsInput = z.infer<typeof GenerateReelCaptionsInputSchema>;

const GenerateReelCaptionsOutputSchema = z.object({
  captions: z.array(
    z.object({
      caption: z.string().describe('A creative caption for the Instagram Reel.'),
      cta: z.string().describe('A call to action variation for the caption.'),
    })
  ).describe('An array of creative captions with call to action variations.'),
});

export type GenerateReelCaptionsOutput = z.infer<typeof GenerateReelCaptionsOutputSchema>;

export async function generateReelCaptions(input: GenerateReelCaptionsInput): Promise<GenerateReelCaptionsOutput> {
  return generateReelCaptionsFlow(input);
}

const generateReelCaptionsPrompt = ai.definePrompt({
  name: 'generateReelCaptionsPrompt',
  input: {schema: GenerateReelCaptionsInputSchema},
  output: {schema: GenerateReelCaptionsOutputSchema},
  prompt: `You are a social media expert specializing in creating engaging captions for Instagram Reels.
  Generate 3 different captions for a Reel about the following topic, each with a unique call to action.  The captions should be unique and interesting.

  Topic: {{{topic}}}

  Format your response as a JSON array of objects with 'caption' and 'cta' fields. Use the descriptions from the schema to generate creative captions and compelling CTAs.
  `,
});

const generateReelCaptionsFlow = ai.defineFlow(
  {
    name: 'generateReelCaptionsFlow',
    inputSchema: GenerateReelCaptionsInputSchema,
    outputSchema: GenerateReelCaptionsOutputSchema,
  },
  async input => {
    const {output} = await generateReelCaptionsPrompt(input);
    return output!;
  }
);
