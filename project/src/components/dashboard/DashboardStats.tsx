import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { CalculationService } from '../../utils/calculations';
import { Income, Expense, SavingGoal } from '../../types';

interface DashboardStatsProps {
  incomes: Income[];
  expenses: Expense[];
  savingGoals: SavingGoal[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  incomes,
  expenses,
  savingGoals
}) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = CalculationService.getTotalIncome(incomes, currentMonth, currentYear);
  const monthlyExpenses = CalculationService.getTotalExpenses(expenses, currentMonth, currentYear);
  const monthlySavings = CalculationService.calculateSavings(incomes, expenses, currentMonth, currentYear);
  const totalSavings = savingGoals.reduce((total, goal) => total + goal.currentAmount, 0);

  const stats = [
    {
      title: 'Monthly Income',
      value: CalculationService.formatCurrency(monthlyIncome),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Monthly Expenses',
      value: CalculationService.formatCurrency(monthlyExpenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Monthly Savings',
      value: CalculationService.formatCurrency(monthlySavings),
      icon: DollarSign,
      color: monthlySavings >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: monthlySavings >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Total Savings',
      value: CalculationService.formatCurrency(totalSavings),
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} hover className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};