// Database type definitions for Nurse Buddy

export interface User {
  id: string;
  email: string;
  name: string;
  stripe_customer_id: string | null;
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  preferences?: {
    timer_enabled: boolean;
    show_rationales_immediately: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string;
  user_id: string;
  questions: Question[];
  answers: Record<string, string>;
  score: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface Question {
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
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  rationale: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface Performance {
  id: string;
  user_id: string;
  category: NCLEXCategory;
  correct_answers: number;
  total_questions: number;
  date: string;
}

export type NCLEXCategory =
  | 'Safe and Effective Care Environment'
  | 'Health Promotion and Maintenance'
  | 'Psychosocial Integrity'
  | 'Physiological Integrity';

// Database query result types
export interface TestWithStats extends Test {
  correct_count: number;
  total_count: number;
  percentage: number;
}

export interface CategoryPerformance {
  category: NCLEXCategory;
  correct_answers: number;
  total_questions: number;
  percentage: number;
}

export interface UserStats {
  total_tests: number;
  average_score: number;
  total_questions_answered: number;
  study_streak_days: number;
  total_study_hours: number;
}

