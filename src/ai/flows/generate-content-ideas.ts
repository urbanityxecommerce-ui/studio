'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating content ideas based on user-defined criteria.
 *
 * It includes:
 * - `generateContentIdeas`: The main function to generate content ideas.
 * - `GenerateContentIdeasInput`: The input type for the `generateContentIdeas` function.
 * - `GenerateContentIdeasOutput`: The output type for the `generateContentIdeas` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentIdeasInputSchema = z.object({
  category: z.string().describe('The broad category of the content (e.g., Tech, Beauty, Finance).'),
  subcategory: z.string().describe('The specific subcategory of the content (e.g., Smartphones, Makeup Tutorials, Personal Investing).'),
  targetAudience: z.string().describe('The target audience for the content (e.g., Beginners, Experts, Gamers).'),
  language: z.string().describe('The language of the content (e.g., English, Spanish, Hindi).'),
  preferredFormat: z.enum(['short', 'long']).describe('The preferred format of the content (short-form or long-form).'),
  tone: z.string().describe('The tone of the content (e.g., Friendly, Professional, Motivational).'),
});

export type GenerateContentIdeasInput = z.infer<typeof GenerateContentIdeasInputSchema>;

const ContentIdeaSchema = z.object({
  title: z.string().describe('A one-line title for the content idea.'),
  seoTitleVariations: z.array(z.string()).length(5).describe('Five SEO-optimized variations of the title.'),
  viralHook: z.string().describe('A 10-second viral hook to grab attention.'),
  thumbnailConcepts: z.array(z.string()).length(3).describe('Three thumbnail concepts with text and composition suggestions.'),
  shortDescription: z.string().max(150).describe('A 150-character short description of the content.'),
  tags: z.array(z.string()).length(5).describe('Five relevant tags/hashtags.'),
  timestampedStructurePoints: z.array(z.string()).length(3).describe('Three timestamped structure points for the content.'),
  repurposeSuggestion: z.string().describe('A suggestion for repurposing the content.'),
  difficultyScore: z.number().describe('A difficulty score to determine how hard the content would be to create.'),
});

const GenerateContentIdeasOutputSchema = z.object({
  ideas: z.array(ContentIdeaSchema).length(5).describe('A list of 5 content ideas.'),
});

export type GenerateContentIdeasOutput = z.infer<typeof GenerateContentIdeasOutputSchema>;

export async function generateContentIdeas(input: GenerateContentIdeasInput): Promise<GenerateContentIdeasOutput> {
  return generateContentIdeasFlow(input);
}

const generateContentIdeasPrompt = ai.definePrompt({
  name: 'generateContentIdeasPrompt',
  input: {schema: GenerateContentIdeasInputSchema},
  output: {schema: GenerateContentIdeasOutputSchema},
  prompt: `You are a content creation expert. Generate 5 content ideas based on the following criteria:

Category: {{{category}}}
Subcategory: {{{subcategory}}}
Target Audience: {{{targetAudience}}}
Language: {{{language}}}
Preferred Format: {{{preferredFormat}}}
Tone: {{{tone}}}

Each content idea should include:
- A one-line title
- 5 SEO title variations
- A 10-second viral hook
- 3 thumbnail concepts (text & composition)
- A 150-character short description
- 5 tags/hashtags
- 3 timestamped structure points
- 1 repurpose suggestion
- A difficulty score

Ensure the ideas are relevant and engaging for the specified target audience and align with the chosen category, subcategory and tone. Focus on the latest trends.

Output should be structured as a JSON object as described in the output schema.`, 
});

const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
  },
  async input => {
    const {output} = await generateContentIdeasPrompt(input);
    return output!;
  }
);
