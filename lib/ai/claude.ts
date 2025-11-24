import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY || "";

// Initialize Claude client
export const claude = apiKey
  ? new Anthropic({ apiKey })
  : null;

// NCLEX categories for question generation
export const nclexCategories = [
  "Safe and Effective Care Environment",
  "Health Promotion and Maintenance",
  "Psychosocial Integrity",
  "Physiological Integrity",
] as const;

export type NCLEXCategory = typeof nclexCategories[number];

export interface NCLEXQuestion {
  id: string;
  category: NCLEXCategory;
  scenario: string;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  rationale: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

// Mock question generator for development
export async function generateMockQuestion(category: NCLEXCategory): Promise<NCLEXQuestion> {
  const mockQuestions: Record<NCLEXCategory, NCLEXQuestion> = {
    "Safe and Effective Care Environment": {
      id: `q_${Date.now()}`,
      category,
      scenario: "A nurse is caring for a client who is scheduled for surgery. The client asks about the consent form.",
      question: "Which statement by the nurse is most appropriate?",
      choices: {
        A: "You can sign the form now and ask questions later.",
        B: "The surgeon will explain the procedure before you sign.",
        C: "Your family can sign the form if you're not sure.",
        D: "The consent form is just a formality.",
      },
      correctAnswer: "B",
      rationale: {
        A: "Incorrect. Informed consent requires understanding before signing.",
        B: "Correct. The surgeon must explain the procedure, risks, and alternatives before obtaining informed consent.",
        C: "Incorrect. The client must provide their own consent unless legally unable.",
        D: "Incorrect. Informed consent is a legal and ethical requirement, not a formality.",
      },
    },
    "Health Promotion and Maintenance": {
      id: `q_${Date.now()}`,
      category,
      scenario: "A nurse is teaching a prenatal class about nutrition during pregnancy.",
      question: "Which food should the nurse recommend to increase folic acid intake?",
      choices: {
        A: "Lean red meat",
        B: "Leafy green vegetables",
        C: "Whole milk",
        D: "White bread",
      },
      correctAnswer: "B",
      rationale: {
        A: "Incorrect. Red meat is high in iron but not folic acid.",
        B: "Correct. Leafy green vegetables are excellent sources of folic acid, which prevents neural tube defects.",
        C: "Incorrect. Milk provides calcium and vitamin D but not significant folic acid.",
        D: "Incorrect. White bread is not a good source of folic acid unless fortified.",
      },
    },
    "Psychosocial Integrity": {
      id: `q_${Date.now()}`,
      category,
      scenario: "A client with depression tells the nurse, 'I don't see any point in continuing therapy.'",
      question: "Which response by the nurse is most therapeutic?",
      choices: {
        A: "You should continue therapy because your doctor ordered it.",
        B: "Tell me more about how you're feeling right now.",
        C: "Many people feel this way, but it gets better.",
        D: "You're making progress even if you don't see it.",
      },
      correctAnswer: "B",
      rationale: {
        A: "Incorrect. This dismisses the client's feelings and is authoritarian.",
        B: "Correct. This uses therapeutic communication to explore the client's feelings and concerns.",
        C: "Incorrect. This minimizes the client's individual experience.",
        D: "Incorrect. This provides false reassurance without exploring feelings.",
      },
    },
    "Physiological Integrity": {
      id: `q_${Date.now()}`,
      category,
      scenario: "A nurse is caring for a client with diabetic ketoacidosis (DKA).",
      question: "Which finding should the nurse expect during assessment?",
      choices: {
        A: "Rapid, shallow respirations",
        B: "Fruity-smelling breath",
        C: "Increased skin turgor",
        D: "Bradycardia",
      },
      correctAnswer: "B",
      rationale: {
        A: "Incorrect. DKA causes deep, rapid respirations (Kussmaul respirations), not shallow.",
        B: "Correct. Fruity-smelling breath results from acetone, a byproduct of fat metabolism in DKA.",
        C: "Incorrect. DKA causes dehydration, leading to decreased skin turgor.",
        D: "Incorrect. DKA typically causes tachycardia due to dehydration, not bradycardia.",
      },
    },
  };

  return mockQuestions[category];
}

// Generate 100 NCLEX-style questions
export async function generateNCLEXTest(): Promise<NCLEXQuestion[]> {
  const questions: NCLEXQuestion[] = [];
  
  // Distribute questions across categories (approximate NCLEX distribution)
  const distribution = {
    "Safe and Effective Care Environment": 25,
    "Health Promotion and Maintenance": 15,
    "Psychosocial Integrity": 10,
    "Physiological Integrity": 50,
  };

  for (const [category, count] of Object.entries(distribution)) {
    for (let i = 0; i < count; i++) {
      const question = await generateMockQuestion(category as NCLEXCategory);
      questions.push({
        ...question,
        id: `q_${Date.now()}_${i}_${category.slice(0, 3)}`,
      });
    }
  }

  return questions;
}

// Real Claude API call (when API key is available)
export async function generateQuestionWithClaude(
  category: NCLEXCategory
): Promise<NCLEXQuestion> {
  if (!claude) {
    return generateMockQuestion(category);
  }

  const prompt = `Generate a multiple-choice NCLEX-style question about ${category}.

Include:
- A clinical scenario (2-3 sentences)
- One question with 4 answer choices (A, B, C, D)
- Mark the correct answer
- Provide detailed rationales for why each answer is correct or incorrect
- Follow NCLEX cognitive levels (Application/Analysis)

Format as JSON:
{
  "category": "${category}",
  "scenario": "...",
  "question": "...",
  "choices": {
    "A": "...",
    "B": "...",
    "C": "...",
    "D": "..."
  },
  "correctAnswer": "A|B|C|D",
  "rationale": {
    "A": "...",
    "B": "...",
    "C": "...",
    "D": "..."
  }
}`;

  try {
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type === "text") {
      const parsed = JSON.parse(content.text);
      return {
        id: `q_${Date.now()}`,
        ...parsed,
      };
    }
  } catch (error) {
    console.error("Claude API error:", error);
  }

  return generateMockQuestion(category);
}

// Generate rationale for an answer using Claude (no external APIs)
export async function generateRationaleWithClaude(
  scenario: string,
  question: string,
  selectedAnswer: string,
  correctAnswer: string,
  choices: Record<string, string>
): Promise<string> {
  if (!claude) {
    return generateMockRationale(selectedAnswer, correctAnswer);
  }

  const isCorrect = selectedAnswer === correctAnswer;

  const prompt = `As a nursing educator, explain why the selected answer is ${
    isCorrect ? "correct" : "incorrect"
  }.

Scenario: ${scenario}
Question: ${question}
Answer choices:
A: ${choices.A}
B: ${choices.B}
C: ${choices.C}
D: ${choices.D}

Selected Answer: ${selectedAnswer}
Correct Answer: ${correctAnswer}

Provide a detailed, educational explanation suitable for NCLEX preparation. Include:
1. Why the selected answer is correct/incorrect
2. Key nursing concepts involved
3. Clinical reasoning points
4. Memory aids or mnemonics if applicable

Keep response concise but thorough (200-300 words).`;

  try {
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type === "text") {
      return content.text;
    }
  } catch (error) {
    console.error("Claude API error generating rationale:", error);
  }

  return generateMockRationale(selectedAnswer, correctAnswer);
}

// Mock rationale for development
function generateMockRationale(selectedAnswer: string, correctAnswer: string): string {
  const isCorrect = selectedAnswer === correctAnswer;

  if (isCorrect) {
    return `Excellent! You selected the correct answer (${correctAnswer}).

This demonstrates your understanding of the key nursing concepts in this scenario. The correct answer addresses the most appropriate nursing action based on evidence-based practice and patient safety principles.

Key Points:
• Always prioritize patient safety and follow evidence-based guidelines
• Consider the ABC approach: Airway, Breathing, Circulation
• Therapeutic communication is essential in nurse-patient relationships
• Remember the nursing process: Assessment, Diagnosis, Planning, Implementation, Evaluation

This type of question tests your ability to apply clinical judgment and prioritize nursing interventions effectively.`;
  }

  return `You selected ${selectedAnswer}, but the correct answer is ${correctAnswer}.

Let's review why: The correct answer represents the most appropriate nursing action based on current evidence-based practice and patient safety standards. Your selected answer may have seemed plausible, but it doesn't address the priority concern in this scenario.

Key Learning Points:
• Review the nursing process and prioritization principles
• Consider physiological needs before psychosocial needs (Maslow's hierarchy)
• Always follow the ABC approach when determining priorities
• Therapeutic communication requires open-ended questions and active listening

Remember to carefully analyze each scenario and identify the priority action. Consider what would have the most immediate positive impact on patient outcomes.`;
}

// Generate NCLEX questions based on uploaded content (PowerPoint/PDF)
export async function generateQuestionsFromContent(
  extractedContent: string,
  options: {
    questionCount?: number;
    categories?: NCLEXCategory[];
  } = {}
): Promise<NCLEXQuestion[]> {
  const questionCount = options.questionCount || 100;
  const targetCategories = options.categories || nclexCategories;

  if (!claude) {
    return generateMockQuestionsFromContent(questionCount);
  }

  const prompt = `You are an expert NCLEX nursing educator. Based on the following course material/lecture notes, generate ${questionCount} NCLEX-style practice questions.

Course Material:
${extractedContent}

Requirements:
1. Questions should test comprehension and application of the provided content
2. Each question must have a clinical scenario (2-3 sentences)
3. Provide exactly 4 answer choices (A, B, C, D) per question
4. Include detailed rationales for each answer choice
5. Focus on nursing judgment, safety, and evidence-based practice
6. Questions should be at Application/Analysis cognitive levels

Distribute questions across these NCLEX categories where applicable:
- Safe and Effective Care Environment (25%)
- Health Promotion and Maintenance (15%)
- Psychosocial Integrity (10%)
- Physiological Integrity (50%)

Return a JSON array of questions with this structure:
[
  {
    "category": "Category Name",
    "scenario": "Clinical scenario text",
    "question": "Question text",
    "choices": {
      "A": "Choice A text",
      "B": "Choice B text",
      "C": "Choice C text",
      "D": "Choice D text"
    },
    "correctAnswer": "A|B|C|D",
    "rationale": {
      "A": "Why A is correct/incorrect",
      "B": "Why B is correct/incorrect",
      "C": "Why C is correct/incorrect",
      "D": "Why D is correct/incorrect"
    }
  }
]

Generate exactly ${questionCount} questions. Only return the JSON array, no other text.`;

  try {
    const response = await claude.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: Math.min(questionCount * 150, 4096),
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type === "text") {
      const parsed = JSON.parse(content.text);
      const questions: NCLEXQuestion[] = Array.isArray(parsed) ? parsed : [parsed];

      return questions.map((q, idx) => ({
        id: `q_${Date.now()}_${idx}`,
        ...q,
      }));
    }
  } catch (error) {
    console.error("Claude API error generating content-based questions:", error);
  }

  return generateMockQuestionsFromContent(questionCount);
}

// Mock questions based on content
function generateMockQuestionsFromContent(count: number): NCLEXQuestion[] {
  const questions: NCLEXQuestion[] = [];
  const baseQuestions = [
    {
      category: "Physiological Integrity" as NCLEXCategory,
      scenario:
        "A nurse is conducting a physical assessment on a patient admitted with pneumonia.",
      question: "Which breath sound should the nurse expect to hear?",
      choices: {
        A: "Wheezing in all lung fields",
        B: "Crackles in the affected lung areas",
        C: "Completely silent lungs",
        D: "High-pitched stridor",
      },
      correctAnswer: "B",
    },
    {
      category: "Safe and Effective Care Environment" as NCLEXCategory,
      scenario:
        "A nurse is preparing to administer a medication to a patient. The patient is unable to read the medication label.",
      question: "What should the nurse do before administering the medication?",
      choices: {
        A: "Assume the patient knows what the medication is for",
        B: "Verify the patient's identity using two identifiers",
        C: "Ask another nurse if they recognize the patient",
        D: "Document that the patient refused to identify themselves",
      },
      correctAnswer: "B",
    },
    {
      category: "Health Promotion and Maintenance" as NCLEXCategory,
      scenario: "A nurse is teaching a patient about preventing wound infections.",
      question: "Which instruction is most important for the patient?",
      choices: {
        A: "Keep the wound wet to promote healing",
        B: "Apply antibiotics only if the wound starts to smell",
        C: "Keep the wound clean and covered until healing is complete",
        D: "Change the bandage only when pain develops",
      },
      correctAnswer: "C",
    },
    {
      category: "Psychosocial Integrity" as NCLEXCategory,
      scenario:
        "A patient with a terminal diagnosis tells the nurse they feel hopeless.",
      question: "Which response demonstrates therapeutic communication?",
      choices: {
        A: "Don't worry, everything will be fine.",
        B: "Tell me more about what you're experiencing.",
        C: "You should focus on positive thoughts.",
        D: "Many people feel this way; it's normal.",
      },
      correctAnswer: "B",
    },
  ];

  for (let i = 0; i < count; i++) {
    const baseQ = baseQuestions[i % baseQuestions.length];
    questions.push({
      id: `q_${Date.now()}_${i}`,
      category: baseQ.category,
      scenario: baseQ.scenario,
      question: baseQ.question,
      choices: baseQ.choices,
      correctAnswer: baseQ.correctAnswer as "A" | "B" | "C" | "D",
      rationale: {
        A: "This is incorrect based on clinical evidence.",
        B: "This is the correct answer based on best practices.",
        C: "This does not address the patient's priority need.",
        D: "This represents unsafe nursing practice.",
      },
    });
  }

  return questions;
}

