'use server';

/**
 * @fileOverview An AI agent for optimizing video thumbnails to improve click-through rate.
 *
 * - optimizeVideoThumbnails - A function that analyzes a video thumbnail and provides optimization suggestions.
 * - OptimizeVideoThumbnailsInput - The input type for the optimizeVideoThumbnails function.
 * - OptimizeVideoThumbnailsOutput - The return type for the optimizeVideoThumbnails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeVideoThumbnailsInputSchema = z.object({
  thumbnailDataUri: z
    .string()
    .describe(
      "A photo of a video thumbnail, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  videoTitle: z.string().describe('The title of the video.'),
});
export type OptimizeVideoThumbnailsInput = z.infer<typeof OptimizeVideoThumbnailsInputSchema>;

const OptimizeVideoThumbnailsOutputSchema = z.object({
  ctrPredictionScore: z
    .number()
    .describe('The predicted click-through rate score (0-100) for the thumbnail.'),
  readability: z.string().describe('An analysis of the thumbnail text readability.'),
  subjectProminence: z.string().describe('An analysis of the subject prominence in the thumbnail.'),
  facialCloseUps: z.string().describe('An analysis of the presence and quality of facial close-ups.'),
  contrast: z.string().describe('An analysis of the contrast in the thumbnail.'),
  clickbaitAnalysis: z.string().describe('An analysis of the presence of clickbait elements.'),
  actionableImprovements: z.array(z.string()).describe('Actionable suggestions to improve the thumbnail.'),
});
export type OptimizeVideoThumbnailsOutput = z.infer<typeof OptimizeVideoThumbnailsOutputSchema>;

export async function optimizeVideoThumbnails(
  input: OptimizeVideoThumbnailsInput
): Promise<OptimizeVideoThumbnailsOutput> {
  return optimizeVideoThumbnailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeVideoThumbnailsPrompt',
  input: {schema: OptimizeVideoThumbnailsInputSchema},
  output: {schema: OptimizeVideoThumbnailsOutputSchema},
  prompt: `You are an expert in YouTube and Instagram thumbnail design, specializing in optimizing thumbnails to increase click-through rates.

  Analyze the provided video thumbnail and provide a comprehensive analysis, including:

  - A predicted click-through rate score (0-100) based on the thumbnail's characteristics.
  - An assessment of the thumbnail text readability.
  - An evaluation of the subject prominence in the thumbnail.
  - An analysis of the presence and quality of facial close-ups, if applicable.
  - An assessment of the contrast in the thumbnail.
  - An evaluation of the presence of clickbait elements and their potential impact.

  Based on your analysis, provide a list of actionable suggestions to improve the thumbnail and increase its click-through rate. Be specific and practical in your recommendations.

  Video Title: {{{videoTitle}}}
  Thumbnail: {{media url=thumbnailDataUri}}

  Ensure that the output adheres to the schema description.`,
});

const optimizeVideoThumbnailsFlow = ai.defineFlow(
  {
    name: 'optimizeVideoThumbnailsFlow',
    inputSchema: OptimizeVideoThumbnailsInputSchema,
    outputSchema: OptimizeVideoThumbnailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
