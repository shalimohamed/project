import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client - will throw error if env vars are missing
export const supabase = createClient(
  supabaseUrl!,
  supabaseAnonKey!
);

// Database table names
export const TABLES = {
  USERS: 'users',
  INCOMES: 'incomes',
  EXPENSES: 'expenses',
  BILLS: 'bills',
  SAVING_GOALS: 'saving_goals',
  BUDGET_CATEGORIES: 'budget_categories'
} as const; 