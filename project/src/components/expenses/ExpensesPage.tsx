import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { Expense } from '../../types';
import { CalculationService } from '../../utils/calculations';

interface ExpensesPageProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  budgetCategories: { value: string; label: string }[] | import('../../types').BudgetCategory[];
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
  budgetCategories
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = CalculationService.getTotalExpenses(expenses, currentMonth, currentYear);
  const { needs, wants } = CalculationService.getExpensesByType(expenses, currentMonth, currentYear);
  const averageDaily = monthlyExpenses / new Date().getDate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
        <Button icon={Plus} onClick={() => setIsFormOpen(true)}>
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {CalculationService.formatCurrency(monthlyExpenses)}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs vs Wants</p>
              <p className="text-2xl font-bold text-gray-900">
                {needs > 0 ? `${((needs / (needs + wants)) * 100).toFixed(0)}%` : '0%'}
              </p>
              <p className="text-sm text-gray-500">Needs</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900">
                {CalculationService.formatCurrency(averageDaily)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      <ExpenseList expenses={expenses} onDelete={onDeleteExpense} />

      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={onAddExpense}
        budgetCategories={budgetCategories}
      />
    </div>
  );
};