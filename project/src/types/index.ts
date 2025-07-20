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