import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database schema helper functions
export const createTables = async () => {
  // This would typically be done via Supabase dashboard or migrations
  // Including here for reference of the expected schema
  
  const userTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro')),
      stripe_customer_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const ideaTableSQL = `
    CREATE TABLE IF NOT EXISTS ideas (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      problem_category TEXT NOT NULL,
      validation_stage TEXT DEFAULT 'initial' CHECK (validation_stage IN ('initial', 'testing', 'validated', 'rejected')),
      user_pain_points TEXT[] DEFAULT '{}',
      revenue_potential INTEGER DEFAULT 0,
      target_users INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const painPointTableSQL = `
    CREATE TABLE IF NOT EXISTS pain_points (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      impact_score INTEGER DEFAULT 0 CHECK (impact_score >= 0 AND impact_score <= 10),
      wtp_score INTEGER DEFAULT 0 CHECK (wtp_score >= 0 AND wtp_score <= 10),
      freq_score INTEGER DEFAULT 0 CHECK (freq_score >= 0 AND freq_score <= 10),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const validationSignalTableSQL = `
    CREATE TABLE IF NOT EXISTS validation_signals (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('survey', 'interview', 'landing_page', 'prototype', 'other')),
      result JSONB NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Note: These would be executed via Supabase migrations in production
  console.log('Database schema defined. Execute via Supabase dashboard or migrations.');
};

// Row Level Security (RLS) policies would be set up in Supabase dashboard:
/*
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_signals ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Users can view own ideas" ON ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ideas" ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ideas" ON ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ideas" ON ideas FOR DELETE USING (auth.uid() = user_id);

-- Pain points policies
CREATE POLICY "Users can view own pain points" ON pain_points FOR SELECT USING (
  EXISTS (SELECT 1 FROM ideas WHERE ideas.id = pain_points.idea_id AND ideas.user_id = auth.uid())
);
CREATE POLICY "Users can insert own pain points" ON pain_points FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM ideas WHERE ideas.id = pain_points.idea_id AND ideas.user_id = auth.uid())
);

-- Validation signals policies
CREATE POLICY "Users can view own validation signals" ON validation_signals FOR SELECT USING (
  EXISTS (SELECT 1 FROM ideas WHERE ideas.id = validation_signals.idea_id AND ideas.user_id = auth.uid())
);
CREATE POLICY "Users can insert own validation signals" ON validation_signals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM ideas WHERE ideas.id = validation_signals.idea_id AND ideas.user_id = auth.uid())
);
*/
