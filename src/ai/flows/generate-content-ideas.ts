
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
  seoTitleVariations: z.array(z.string()).describe('Five SEO-optimized variations of the title.'),
  viralHook: z.string().describe('A 10-second viral hook to grab attention.'),
  thumbnailConcepts: z.array(z.string()).describe('Three thumbnail concepts with text and composition suggestions.'),
  shortDescription: z.string().max(150).describe('A short description of the content, strictly under 150 characters.'),
  tags: z.array(z.string()).describe("Five relevant keyword tags (without the '#' symbol)."),
  timestampedStructurePoints: z.array(z.string()).describe('Three timestamped structure points for the content.'),
  repurposeSuggestion: z.string().describe('A suggestion for repurposing the content.'),
  difficultyScore: z.number().describe('A difficulty score to determine how hard the content would be to create.'),
});

const GenerateContentIdeasOutputSchema = z.object({
  ideas: z.array(ContentIdeaSchema).describe('A list of content ideas.'),
});

export type GenerateContentIdeasOutput = z.infer<typeof GenerateContentIdeasOutputSchema>;

// This is the input for the prompt that generates a *single* idea.
const SingleIdeaInputSchema = GenerateContentIdeasInputSchema.extend({
  existingTitles: z.array(z.string()).optional().describe('A list of titles already generated to ensure originality.'),
});

// This is the output for the prompt that generates a *single* idea.
const SingleIdeaOutputSchema = z.object({
  idea: ContentIdeaSchema,
});


export async function generateContentIdeas(input: GenerateContentIdeasInput): Promise<GenerateContentIdeasOutput> {
  return generateContentIdeasFlow(input);
}

const generateSingleContentIdeaPrompt = ai.definePrompt({
  name: 'generateSingleContentIdeaPrompt',
  input: {schema: SingleIdeaInputSchema},
  output: {schema: SingleIdeaOutputSchema},
  prompt: `You are a viral content strategist and an expert SEO copywriter. Your goal is to generate ONE highly original, powerful, and human-sounding content idea based on the user's criteria.

User Criteria:
- Category: {{{category}}}
- Subcategory: {{{subcategory}}}
- Target Audience: {{{targetAudience}}}
- Language: {{{language}}}
- Format: {{{preferredFormat}}}
- Tone: {{{tone}}}

Please generate a NEW and ORIGINAL idea that is distinct from these already generated titles:
{{#each existingTitles}}
- {{{this}}}
{{/each}}


For the idea, provide the following, ensuring it feels like a creative human strategist came up with it:
- **Title**: A compelling, human-friendly title.
- **SEO Title Variations**: 5 powerful, keyword-rich variations optimized for search engines.
- **Viral Hook**: A genuinely captivating 10-second hook that creates curiosity or an emotional connection.
- **Thumbnail Concepts**: 3 creative and high-CTR thumbnail ideas with clear visual direction.
- **Short Description**: A concise, engaging summary. This description MUST be under 150 characters.
- **Tags/Hashtags**: 5 highly relevant, lowercase keyword tags (without using the '#' symbol).
- **Timestamped Structure Points**: 3 logical, well-paced points for the content's structure.
- **Repurpose Suggestion**: A smart, actionable idea for repurposing the content on another platform.
- **Difficulty Score**: A realistic score for creation difficulty.

Focus on originality, emotional resonance, and proven SEO tactics. Avoid generic ideas. Think about what would genuinely capture attention and provide value.

Output must be a JSON object that strictly follows the output schema.`,
});


const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
  },
  async input => {
    const promises = [];
    const existingTitles: string[] = [];

    // Create 5 promises to generate ideas in parallel
    for (let i = 0; i < 5; i++) {
        promises.push(generateSingleContentIdeaPrompt({
            ...input,
            // Pass a snapshot of titles generated by previous requests
            existingTitles: [...existingTitles], 
        }));
    }

    // Wait for all promises to settle (either resolve or reject)
    const results = await Promise.allSettled(promises);

    const generatedIdeas: z.infer<typeof ContentIdeaSchema>[] = [];
    
    // Process the results of the settled promises
    for (const result of results) {
        if (result.status === 'fulfilled' && result.value.output?.idea) {
            const newIdea = result.value.output.idea;

            // Ensure descriptions don't exceed the character limit.
            if (newIdea.shortDescription.length > 150) {
                newIdea.shortDescription = newIdea.shortDescription.substring(0, 150);
            }
            
            // Ensure tags are lowercase
            newIdea.tags = newIdea.tags.map(tag => tag.toLowerCase());

            generatedIdeas.push(newIdea);
            // Add the new title to the list for subsequent uniqueness checks, though less critical with parallel execution
            existingTitles.push(newIdea.title); 
        } else if (result.status === 'rejected') {
            // Log the error but don't block other ideas from being returned
            console.error("Error generating an idea:", result.reason);
        }
    }
    
    // Only throw an error if NO ideas were generated successfully
    if (generatedIdeas.length === 0) {
      throw new Error("Failed to generate any ideas. The AI may be busy. Please try again in a moment.");
    }

    return { ideas: generatedIdeas };
  }
);
