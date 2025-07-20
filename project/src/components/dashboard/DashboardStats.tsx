import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { CalculationService } from '../../utils/calculations';
import { Income, Expense, SavingGoal, Bill } from '../../types';

interface DashboardStatsProps {
  incomes: Income[];
  expenses: Expense[];
  savingGoals: SavingGoal[];
  bills: Bill[];
  onNavigate?: (page: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  incomes,
  expenses,
  savingGoals,
  bills,
  onNavigate
}) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = CalculationService.getTotalIncome(incomes, currentMonth, currentYear);
  const monthlyExpenses = CalculationService.getTotalExpensesWithBills(expenses, bills, currentMonth, currentYear);
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const totalSavings = savingGoals.reduce((total, goal) => total + goal.currentAmount, 0);

  // Use the most common or first income's currency for all stats
  const summaryCurrency = incomes.length > 0 ? incomes[0].currency : 'KES';
  const stats = [
    {
      title: 'Monthly Income',
      value: CalculationService.formatCurrency(monthlyIncome, summaryCurrency),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      page: 'budget',
    },
    {
      title: 'Monthly Expenses',
      value: CalculationService.formatCurrency(monthlyExpenses, summaryCurrency),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      page: 'expenses',
    },
    {
      title: 'Monthly Savings',
      value: CalculationService.formatCurrency(monthlySavings, summaryCurrency),
      icon: DollarSign,
      color: monthlySavings >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: monthlySavings >= 0 ? 'bg-green-50' : 'bg-red-50',
      page: 'budget',
    },
    {
      title: 'Total Savings',
      value: CalculationService.formatCurrency(totalSavings, summaryCurrency),
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      page: 'goals',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="cursor-pointer group"
            onClick={() => onNavigate && stat.page && onNavigate(stat.page)}
            tabIndex={0}
            role="button"
            aria-label={`Go to ${stat.title}`}
          >
            <Card hover className="p-6 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-blue-200 transition-all">
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
          </div>
        );
      })}
    </div>
  );
};