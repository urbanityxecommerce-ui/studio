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
      caption: z.string().describe('A creative, human-sounding caption for the Instagram Reel. It should be engaging and not sound like it was written by an AI.'),
      cta: z.string().describe('A compelling call to action that matches the tone of the caption.'),
    })
  ).length(5).describe('An array of 5 creative captions with call to action variations.'),
});

export type GenerateReelCaptionsOutput = z.infer<typeof GenerateReelCaptionsOutputSchema>;

export async function generateReelCaptions(input: GenerateReelCaptionsInput): Promise<GenerateReelCaptionsOutput> {
  return generateReelCaptionsFlow(input);
}

const generateReelCaptionsPrompt = ai.definePrompt({
  name: 'generateReelCaptionsPrompt',
  input: {schema: GenerateReelCaptionsInputSchema},
  output: {schema: GenerateReelCaptionsOutputSchema},
  prompt: `You are a viral social media strategist and a brilliant copywriter. Your goal is to generate 5 distinct, highly engaging, human-sounding captions for an Instagram Reel on a given topic. Avoid robotic language and generic phrases.

  Topic: {{{topic}}}

  For each of the 5 captions, adopt a different creative angle:
  1.  **Storytelling:** Start with a personal story or a relatable scenario.
  2.  **Question-Based:** Ask a thought-provoking question to spark conversation.
  3.  **Bold & Controversial:** Make a strong, slightly controversial statement to grab attention.
  4.  **Humorous & Witty:** Use humor or a clever pun to be memorable.
  5.  **Value-Driven:** Offer a quick, valuable tip or a surprising fact.

  Each caption must have a unique and compelling call to action (CTA) that naturally follows the caption's tone. Use emojis where appropriate to add personality.

  Format your response as a JSON object that strictly follows the output schema.
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
