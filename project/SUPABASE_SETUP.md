# Supabase Setup Guide

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Setup

1. **Run the migration**: The database schema is already defined in `supabase/migrations/20250710230026_lucky_lab.sql`

2. **Apply the migration to your Supabase project**:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of the migration file
   - Execute the SQL

## Authentication Setup

The project uses Supabase Auth for user authentication. Make sure to:

1. Enable Email authentication in your Supabase project settings
2. Configure any additional authentication providers if needed

## Row Level Security (RLS)

For production use, you should enable Row Level Security on your tables to ensure users can only access their own data. Add these policies to your Supabase project:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE saving_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
-- Example for expenses table:
CREATE POLICY "Users can view their own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);
```

## Testing the Connection

After setting up the environment variables and database schema, start the development server:

```bash
npm run dev
```

The application should now connect to your Supabase database instead of using localStorage. 