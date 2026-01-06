import { z } from "zod";

// Test answer submission
export const submitAnswerSchema = z.object({
  testId: z.string().min(1, "testId is required"),
  questionId: z.string().min(1, "questionId is required"),
  selectedAnswer: z.enum(["A", "B", "C", "D"], {
    errorMap: () => ({ message: "Answer must be A, B, C, or D" }),
  }),
  question: z.string().min(1, "question is required"),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
  scenario: z.string().min(1, "scenario is required"),
  choices: z.record(z.string()),
});
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

// Test generation from upload
export const generateTestSchema = z.object({
  questionCount: z.number().min(1).max(100).default(100),
});
export type GenerateTestInput = z.infer<typeof generateTestSchema>;

// User settings update
export const userSettingsSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  preferences: z
    .object({
      timer_enabled: z.boolean().optional(),
      show_rationales_immediately: z.boolean().optional(),
    })
    .optional(),
});
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;

// Checkout request
export const checkoutSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  email: z.string().email("Invalid email address"),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Helper to validate and return typed result or error response
export function validateBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errors };
  }
  return { success: true, data: result.data };
}
