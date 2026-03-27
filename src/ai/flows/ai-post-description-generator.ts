'use server';
/**
 * @fileOverview A Genkit flow for generating comprehensive market post descriptions.
 *
 * - generatePostDescription - A function that generates a detailed post description using AI.
 * - GeneratePostDescriptionInput - The input type for the generatePostDescription function.
 * - GeneratePostDescriptionOutput - The return type for the generatePostDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePostDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the market opportunity.'),
  category: z.string().describe('The category of the market opportunity (e.g., Logística, Produção, Transporte).'),
  urgency: z.string().describe('The urgency level of the opportunity (e.g., Normal, Alta).'),
  location: z.string().describe('The location or province where the opportunity is based.'),
  value: z.string().optional().describe('The estimated value of the opportunity, if available. Can be "Sob consulta".'),
});
export type GeneratePostDescriptionInput = z.infer<typeof GeneratePostDescriptionInputSchema>;

const GeneratePostDescriptionOutputSchema = z.object({
  description: z.string().describe('A clear and comprehensive description for the market post.'),
});
export type GeneratePostDescriptionOutput = z.infer<typeof GeneratePostDescriptionOutputSchema>;

export async function generatePostDescription(input: GeneratePostDescriptionInput): Promise<GeneratePostDescriptionOutput> {
  return aiPostDescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPostDescriptionGeneratorPrompt',
  input: { schema: GeneratePostDescriptionInputSchema },
  output: { schema: GeneratePostDescriptionOutputSchema },
  prompt: `You are an AI assistant specialized in generating clear and comprehensive descriptions for market opportunities in Angola, focusing on logistics and agriculture.

Generate a detailed description for a market post based on the following information. Ensure the description is professional, informative, and enticing to potential partners or buyers.

Opportunity Details:
Title: {{{title}}}
Category: {{{category}}}
Location: {{{location}}}
Urgency: {{{urgency}}}
{{#if value}}Estimated Value: {{{value}}}{{/if}}

Focus on providing context, benefits, and any implied requirements based on the title and category. If the urgency is 'Alta', emphasize the need for a quick response. Keep it concise yet informative.

Example Output: {"description": "Precisamos de 3 camiões para escoamento imediato de 50 toneladas de milho para Luanda. Produção auditada pela SGS, disponível para carga a partir de amanhã. Contacte-nos para mais detalhes e propostas."}`,
});

const aiPostDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'aiPostDescriptionGeneratorFlow',
    inputSchema: GeneratePostDescriptionInputSchema,
    outputSchema: GeneratePostDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
