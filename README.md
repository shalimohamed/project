# Budget Tracker

## Project Scope
This project is a modern, full-featured personal budget tracker built with React and Supabase. It allows users to manage their incomes, expenses, bills, savings goals, and budgets in a seamless, visually appealing interface. The application is designed for students and individuals who want to track their finances, set goals, and gain insights into their spending habits.

## Tech Stack
- **React**: Frontend framework for building the user interface and managing state. All UI components, routing, and state management are implemented in React (TypeScript).
- **TypeScript**: Used throughout the frontend for type safety and maintainability.
- **Supabase**: Backend-as-a-Service providing authentication, database (PostgreSQL), and API. Used for user management, data storage, and real-time updates.
- **Tailwind CSS**: Utility-first CSS framework for rapid, consistent, and responsive UI styling.
- **Vite**: Fast development server and build tool for React projects.
- **Recharts**: For data visualization (charts and graphs in analytics and dashboard).
- **Lucide React**: Icon library for modern, consistent icons across the UI.

### Business Logic
- **TypeScript Service Classes & Utilities**: All business logic is implemented in the frontend using TypeScript service classes and utility modules:
  - `DatabaseService` (`project/src/utils/database.ts`): Handles all data access, CRUD operations, user management, and domain-specific rules (e.g., filtering by user, monthly calculations, marking bills as paid/unpaid).
  - `CalculationService` (`project/src/utils/calculations.ts`): Implements all financial calculations, aggregations, and formatting (e.g., totals, category breakdowns, including unpaid bills in monthly expenses).
- These classes are used throughout the React components to separate business rules and data processing from UI logic, ensuring maintainability and clarity.

### Where and How Each Technology is Used
- **React & TypeScript**: All components in `project/src/components/` and logic in `project/src/` are written in React with TypeScript.
- **Supabase**: Database and authentication logic is in `project/src/utils/supabase.ts` and `project/src/utils/database.ts`. All data (users, incomes, expenses, bills, goals, categories) is stored in Supabase tables.
- **Tailwind CSS**: All styling is done using Tailwind utility classes in component files and configured in `tailwind.config.js`.
- **Vite**: Project is bootstrapped and run using Vite (`vite.config.ts`).
- **Recharts**: Used in dashboard and analytics components for pie charts and other visualizations.
- **Lucide React**: Used for icons in navigation, dashboard, and UI elements.

## Methodology
- **Component-Based Design**: The UI is broken down into reusable, modular React components for maintainability and scalability.
- **Type Safety**: TypeScript is used throughout to catch errors early and improve code quality.
- **Separation of Concerns**: Data access and business logic are separated from UI components (see `utils/database.ts` and `utils/calculations.ts`).
- **Responsive & Accessible UI**: Tailwind CSS ensures the app is responsive and accessible on all devices.
- **User-Centric Workflow**: Features are designed around real user needs (students, individuals managing budgets), with a focus on ease of use and clarity.
- **Iterative Development**: Features and UI are improved based on feedback and testing, ensuring a seamless user experience.

## Architecture
- **Frontend**: Single Page Application (SPA) built with React and TypeScript. All routing and state are managed client-side.
- **Backend**: Supabase provides a managed PostgreSQL database, authentication, and RESTful API endpoints. No custom backend server is required.
- **Data Flow**: Components interact with Supabase via service classes in `utils/`, fetching and updating data as needed. State is managed locally in React components.
- **Authentication**: Handled by Supabase Auth, with user sessions managed client-side.
- **Deployment**: Can be deployed to any static hosting provider (e.g., Vercel, Netlify) with environment variables for Supabase configuration.

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
