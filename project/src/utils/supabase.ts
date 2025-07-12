import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hklwivqzlvastpsigorh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbHdpdnF6bHZhc3Rwc2lnb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzE4MDcsImV4cCI6MjA2Nzg0NzgwN30.0Qus9T6BQ9qzKG5FWu84GohSV31DwKLZwPjffJ2YzKc';

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