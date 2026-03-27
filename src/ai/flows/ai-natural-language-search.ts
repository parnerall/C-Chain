'use server';
/**
 * @fileOverview This file implements a Genkit flow for natural language search of market opportunities.
 *
 * - aiNaturalLanguageSearch - A function that handles natural language search for market opportunities.
 * - AiNaturalLanguageSearchInput - The input type for the aiNaturalLanguageSearch function.
 * - AiNaturalLanguageSearchOutput - The return type for the aiNaturalLanguageSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for a single market post, based on the INITIAL_FEED structure.
const PostSchema = z.object({
  id: z.string().describe('Unique identifier for the post.'),
  user: z.string().describe('Name of the user/company who created the post.'),
  avatar: z.string().describe('Avatar initials of the user.'),
  location: z.string().describe('Location associated with the post (e.g., province, city).'),
  image: z.string().url().describe('URL to the main image of the post.'),
  title: z.string().describe('Title of the market opportunity.'),
  description: z.string().describe('Detailed description of the opportunity.'),
  value: z.string().describe('Estimated value or price of the opportunity, can be "Sob consulta".'),
  category: z.enum(['Logística', 'Produção', 'Transporte', 'Armazém', 'Sementes']).describe('Category of the post.').default('Logística'),
  likes: z.number().int().describe('Number of likes the post has received.'),
  time: z.string().describe('Time elapsed since the post was published (e.g., "2h", "1d").'),
  status: z.enum(['URGENTE', 'AUDITADO', 'NOVO', 'Normal']).describe('Status of the post, indicating urgency or verification. "Normal" for posts without specific status.').default('Normal'),
  authorIsVerified: z.boolean().describe("Whether the post's author is verified.").default(false),
  authorIsSubscriber: z.boolean().describe("Whether the post's author has a premium subscription.").default(false),
});

export type Post = z.infer<typeof PostSchema>;

// Define the input schema for the natural language search flow.
const AiNaturalLanguageSearchInputSchema = z.object({
  query: z.string().describe('The natural language query from the user (e.g., "milho em Luanda", "transporte urgente").'),
  posts: z.array(PostSchema).describe('An array of all available market opportunity posts to search through.'),
});
export type AiNaturalLanguageSearchInput = z.infer<typeof AiNaturalLanguageSearchInputSchema>;

// Define the output schema for the natural language search flow.
const AiNaturalLanguageSearchOutputSchema = z.object({
  results: z.array(PostSchema).describe('An array of market opportunity posts that best match the user\'s query.').default([]),
});
export type AiNaturalLanguageSearchOutput = z.infer<typeof AiNaturalLanguageSearchOutputSchema>;

export async function aiNaturalLanguageSearch(
  input: AiNaturalLanguageSearchInput
): Promise<AiNaturalLanguageSearchOutput> {
  return aiNaturalLanguageSearchFlow(input);
}

const aiNaturalLanguageSearchPrompt = ai.definePrompt({
  name: 'aiNaturalLanguageSearchPrompt',
  input: { schema: AiNaturalLanguageSearchInputSchema },
  output: { schema: AiNaturalLanguageSearchOutputSchema },
  prompt: `You are an intelligent search assistant for the C-Chain Angola platform. Your task is to interpret a user's natural language query and identify the most relevant market opportunity posts from a provided list.

Here is the user's search query:
Query: {{{query}}}

Here are the available market opportunity posts, presented as a JSON array. Each post has the following structure:
{{json posts}}

Analyze the query and the provided posts. Identify posts that are highly relevant to the user's intent. Consider keywords, categories, locations, urgency, and general meaning.
Return only the posts that are a good match for the query in a JSON array format, as specified by the output schema. If no relevant posts are found, return an empty array.

Example matches:
- If query is "milho em Luanda", look for posts with "milho" in title/description and "Luanda" in location.
- If query is "transporte urgente", look for posts with "Transporte" category and "URGENTE" status.
- If query is "comprar batata", look for posts about "batata" and a category that suggests buying/selling (e.g., "Produção" from the seller's perspective, implied from query if user is buyer).

Be precise and only include posts that genuinely match the user's intent. The output should be a JSON object with a single key 'results' containing an array of matching Post objects.`,
});

const aiNaturalLanguageSearchFlow = ai.defineFlow(
  {
    name: 'aiNaturalLanguageSearchFlow',
    inputSchema: AiNaturalLanguageSearchInputSchema,
    outputSchema: AiNaturalLanguageSearchOutputSchema,
  },
  async (input) => {
    const { output } = await aiNaturalLanguageSearchPrompt(input);
    return output!;
  }
);
