import React from 'react';
import { Income, Expense, SavingGoal } from '../../types';
import { DashboardStats } from './DashboardStats';
import { RecentTransactions } from './RecentTransactions';
import { ExpenseBreakdown } from './ExpenseBreakdown';

interface DashboardProps {
  incomes: Income[];
  expenses: Expense[];
  savingGoals: SavingGoal[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  incomes,
  expenses,
  savingGoals
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        <DashboardStats incomes={incomes} expenses={expenses} savingGoals={savingGoals} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions incomes={incomes} expenses={expenses} />
        <div className="lg:col-span-1">
          <ExpenseBreakdown expenses={expenses} />
        </div>
      </div>
    </div>
  );
};