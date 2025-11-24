-- Nurse Buddy Database Schema
-- Initial migration for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  answers JSONB DEFAULT '{}',
  score NUMERIC(5,2),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT score_range CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);

-- Performance table
CREATE TABLE IF NOT EXISTS performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'Safe and Effective Care Environment',
    'Health Promotion and Maintenance',
    'Psychosocial Integrity',
    'Physiological Integrity'
  )),
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT valid_counts CHECK (
    correct_answers >= 0 AND
    total_questions > 0 AND
    correct_answers <= total_questions
  )
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tests_user_id ON tests(user_id);
CREATE INDEX IF NOT EXISTS idx_tests_created_at ON tests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_user_id ON performance(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_date ON performance(date DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Row Level Security (RLS) policies

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Tests policies
CREATE POLICY "Users can view their own tests"
  ON tests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tests"
  ON tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tests"
  ON tests FOR UPDATE
  USING (auth.uid() = user_id);

-- Performance policies
CREATE POLICY "Users can view their own performance"
  ON performance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own performance"
  ON performance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate test score
CREATE OR REPLACE FUNCTION calculate_test_score(test_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_questions INTEGER;
  correct_answers INTEGER;
BEGIN
  SELECT
    jsonb_array_length(questions),
    (SELECT COUNT(*)
     FROM jsonb_each(answers) answer
     JOIN jsonb_array_elements(questions) question
       ON (question->>'id') = answer.key
     WHERE answer.value->>0 = question->>'correctAnswer')
  INTO total_questions, correct_answers
  FROM tests
  WHERE id = test_id;

  IF total_questions > 0 THEN
    RETURN ROUND((correct_answers::NUMERIC / total_questions::NUMERIC) * 100, 2);
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user account information and subscription status';
COMMENT ON TABLE tests IS 'Stores NCLEX practice test data including questions and answers';
COMMENT ON TABLE performance IS 'Tracks user performance across NCLEX categories over time';
COMMENT ON COLUMN users.subscription_status IS 'Current Stripe subscription status';
COMMENT ON COLUMN tests.questions IS 'JSONB array of question objects with answers and rationales';
COMMENT ON COLUMN tests.answers IS 'JSONB object mapping question IDs to user answers';

