/**
 * OpenAI Integration Module for Nursing Rationale Generation
 * 
 * STATUS: Alternative provider (currently unused, Claude is primary)
 * 
 * This module provides an alternative AI provider for generating educational
 * rationales using OpenAI's GPT-4o-mini model. It can be used as:
 * 
 * 1. COST OPTIMIZATION: GPT-4o-mini is often more cost-effective than Claude
 *    for high-volume rationale generation
 * 
 * 2. FALLBACK PROVIDER: Can be integrated as a fallback when Claude is unavailable
 * 
 * 3. A/B TESTING: Test response quality between providers
 * 
 * INTEGRATION EXAMPLE:
 * To use OpenAI for rationales instead of Claude, update app/api/test/submit/route.ts:
 * 
 *   import { generateRationale } from "@/lib/ai/openai";
 *   // ...
 *   const rationale = await generateRationale({
 *     scenario,
 *     question,
 *     selectedAnswer,
 *     correctAnswer,
 *   });
 * 
 * REQUIRED ENV VAR: OPENAI_API_KEY
 */
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "";

// Initialize OpenAI client (null if API key not configured)
export const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;

export interface RationaleRequest {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  scenario: string;
}

// Generate detailed rationale using GPT-4-mini
export async function generateRationale(request: RationaleRequest): Promise<string> {
  if (!openai) {
    return generateMockRationale(request);
  }

  const prompt = `As a nursing educator, explain why the selected answer is ${
    request.selectedAnswer === request.correctAnswer ? "correct" : "incorrect"
  }.

Scenario: ${request.scenario}
Question: ${request.question}
Selected Answer: ${request.selectedAnswer}
Correct Answer: ${request.correctAnswer}

Provide a detailed, educational explanation suitable for nursing exam preparation. Include:
1. Why the selected answer is correct/incorrect
2. Key nursing concepts involved
3. Clinical reasoning points
4. Memory aids or mnemonics if applicable

Keep response concise but thorough (200-300 words).`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert nursing educator specializing in nursing exam preparation.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || generateMockRationale(request);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return generateMockRationale(request);
  }
}

// Mock rationale generator for development
function generateMockRationale(request: RationaleRequest): string {
  const isCorrect = request.selectedAnswer === request.correctAnswer;

  if (isCorrect) {
    return `Excellent! You selected the correct answer (${request.correctAnswer}).

This demonstrates your understanding of the key nursing concepts in this scenario. The correct answer addresses the most appropriate nursing action based on evidence-based practice and patient safety principles.

Key Points:
• Always prioritize patient safety and follow evidence-based guidelines
• Consider the ABC approach: Airway, Breathing, Circulation
• Therapeutic communication is essential in nurse-patient relationships
• Remember the nursing process: Assessment, Diagnosis, Planning, Implementation, Evaluation

This type of question tests your ability to apply clinical judgment and prioritize nursing interventions effectively.`;
  }

  return `You selected ${request.selectedAnswer}, but the correct answer is ${request.correctAnswer}.

Let's review why: The correct answer represents the most appropriate nursing action based on current evidence-based practice and patient safety standards. Your selected answer may have seemed plausible, but it doesn't address the priority concern in this scenario.

Key Learning Points:
• Review the nursing process and prioritization principles
• Consider physiological needs before psychosocial needs (Maslow's hierarchy)
• Always follow the ABC approach when determining priorities
• Therapeutic communication requires open-ended questions and active listening

Remember to carefully analyze each scenario and identify the priority action. Consider what would have the most immediate positive impact on patient outcomes.`;
}

