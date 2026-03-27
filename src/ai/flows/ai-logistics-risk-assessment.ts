'use server';
/**
 * @fileOverview An AI agent for assessing logistics risks in Angola.
 *
 * - assessLogisticsRisk - A function that handles the logistics risk assessment process.
 * - LogisticsRiskAssessmentInput - The input type for the assessLogisticsRisk function.
 * - LogisticsRiskAssessmentOutput - The return type for the assessLogisticsRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LogisticsRiskAssessmentInputSchema = z.object({
  title: z.string().describe('The title of the market opportunity.'),
  description: z
    .string()
    .describe('A detailed description of the market opportunity.'),
  location: z.string().describe('The geographical location (province/city) of the opportunity.'),
  category: z
    .string()
    .describe('The category of the opportunity (e.g., Logística, Transporte, Produção).'),
  value: z
    .string()
    .optional()
    .describe('The estimated value of the opportunity, can be "Sob consulta".'),
});
export type LogisticsRiskAssessmentInput = z.infer<
  typeof LogisticsRiskAssessmentInputSchema
>;

const LogisticsRiskAssessmentOutputSchema = z.object({
  assessment: z
    .string()
    .describe('The AI-powered logistics risk assessment for the opportunity.'),
});
export type LogisticsRiskAssessmentOutput = z.infer<
  typeof LogisticsRiskAssessmentOutputSchema
>;

export async function assessLogisticsRisk(
  input: LogisticsRiskAssessmentInput
): Promise<LogisticsRiskAssessmentOutput> {
  return logisticsRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'logisticsRiskAssessmentPrompt',
  input: {schema: LogisticsRiskAssessmentInputSchema},
  output: {schema: LogisticsRiskAssessmentOutputSchema},
  prompt: `You are an expert logistics and supply chain analyst in Angola. Your task is to provide a comprehensive logistics risk assessment for a given market opportunity, considering the Angolan context.
Analyze the provided details and identify potential challenges, opportunities, and key factors influencing the logistical success of this operation. Focus on aspects like transportation infrastructure, specific product requirements, urgency, and the stated value.

Market Opportunity Details:
Title: {{{title}}}
Description: {{{description}}}
Category: {{{category}}}
Location: {{{location}}}
Estimated Value: {{{value}}}

Provide a concise and informative assessment, highlighting key risks and offering brief insights or recommendations. Ensure the response is formatted as a JSON object with a single 'assessment' field.`,
});

const logisticsRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'logisticsRiskAssessmentFlow',
    inputSchema: LogisticsRiskAssessmentInputSchema,
    outputSchema: LogisticsRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
