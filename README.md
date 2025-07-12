# Budget Tracker

## Project Scope
This project is a modern, full-featured personal budget tracker built with React and Supabase. It allows users to manage their incomes, expenses, bills, savings goals, and budgets in a seamless, visually appealing interface. The application is designed for students and individuals who want to track their finances, set goals, and gain insights into their spending habits.

## Features
- User authentication (Supabase Auth)
- Dashboard with monthly stats, recent transactions, and expense breakdowns
- Income and expense management with category support
- Bill tracking (paid, unpaid, overdue)
- Budget recommendations and category management
- Savings goals tracking
- Analytics and visualizations (charts, progress bars)
- Responsive, modern UI/UX

## What It Does
- **Tracks all your incomes and expenses** by category and date
- **Manages recurring and one-time bills** and shows their impact on your monthly budget
- **Provides budget recommendations** and allows you to customize category allocations
- **Visualizes your financial data** with charts and breakdowns
- **Helps you set and track savings goals**
- **Gives you a seamless, unified dashboard** for all your financial activity

## How to Run

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- Supabase account (with the provided schema and environment variables)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/shalimohamed/project.git
   cd project
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure Supabase:**
   - Copy your Supabase project URL and anon key into `project/src/utils/supabase.ts` if not already set.
   - Run the SQL migrations in `project/supabase/migrations/` on your Supabase instance.
   - See `SUPABASE_SETUP.md` for detailed setup instructions.
4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Contributors
- **Shali Mohammed** (Student ID: 669344) — Lead Developer & Designer

If you use or extend this project, please credit the original author.
