export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: Date;
  userId: string;
  type: 'salary' | 'recurring' | 'one-time';
  recurrenceRule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    dayOfMonth?: number; // for monthly
    dayOfWeek?: number; // for weekly (0=Sunday)
  };
  endDate?: Date;
  currency: 'KES' | 'USD' | 'GBP' | 'EUR';
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'need' | 'want';
  userId: string;
  priority: number;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  isPaid: boolean;
  userId: string;
  recurring: boolean;
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  userId: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  spentAmount: number;
  type: 'need' | 'want';
  color: string;
  incomePercentage: number; // percentage of income allocated to this category
}

export const defaultExpenseCategories = [
  { value: 'Housing', label: 'Housing' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Food', label: 'Food' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Education', label: 'Education' },
  { value: 'Other', label: 'Other' }
];

export const categoryColorMap: Record<string, string> = {
  Housing: '#3B82F6',         // Blue
  Transportation: '#F59E42',  // Orange
  Food: '#10B981',            // Green
  Healthcare: '#EF4444',      // Red
  Entertainment: '#A78BFA',   // Purple
  Shopping: '#F472B6',        // Pink
  Utilities: '#FBBF24',       // Yellow
  Education: '#6366F1',       // Indigo
  Other: '#6B7280'            // Gray
};