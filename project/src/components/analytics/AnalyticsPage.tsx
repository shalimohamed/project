import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from '../ui/Card';
import { Income, Expense } from '../../types';
import { CalculationService } from '../../utils/calculations';
import { useContext } from 'react';
import { CurrencyContext } from '../../context/CurrencyContext';

interface AnalyticsPageProps {
  incomes: Income[];
  expenses: Expense[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ incomes, expenses }) => {
  const { activeCurrency } = useContext(CurrencyContext);
  // Generate monthly data for the last 6 months
  const monthlyData = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthlyIncome = CalculationService.getTotalIncome(incomes, month, year);
    const monthlyExpenses = CalculationService.getTotalExpenses(expenses, month, year);
    const savings = monthlyIncome - monthlyExpenses;
    
    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      income: monthlyIncome,
      expenses: monthlyExpenses,
      savings: savings
    });
  }

  // Category breakdown
  const categoryData = Object.entries(CalculationService.getExpensesByCategory(expenses))
    .map(([category, amount]) => ({
      category,
      amount
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => CalculationService.formatCurrency(value as number, activeCurrency)} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={2} name="Savings" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => CalculationService.formatCurrency(value as number, activeCurrency)} />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Monthly Income</span>
              <span className="font-semibold">
                {CalculationService.formatCurrency(
                  monthlyData.reduce((sum, data) => sum + data.income, 0) / monthlyData.length,
                  activeCurrency
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Monthly Expenses</span>
              <span className="font-semibold">
                {CalculationService.formatCurrency(
                  monthlyData.reduce((sum, data) => sum + data.expenses, 0) / monthlyData.length,
                  activeCurrency
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Monthly Savings</span>
              <span className="font-semibold">
                {CalculationService.formatCurrency(
                  monthlyData.reduce((sum, data) => sum + data.savings, 0) / monthlyData.length,
                  activeCurrency
                )}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="space-y-3">
            {categoryData.slice(0, 5).map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{category.category}</span>
                <span className="font-semibold">
                  {CalculationService.formatCurrency(category.amount, activeCurrency)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Income</span>
              <span className="font-semibold text-green-600">
                {CalculationService.formatCurrency(
                  incomes.reduce((sum, income) => sum + income.amount, 0),
                  activeCurrency
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold text-red-600">
                {CalculationService.formatCurrency(
                  expenses.reduce((sum, expense) => sum + expense.amount, 0),
                  activeCurrency
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Net Savings</span>
              <span className="font-semibold text-blue-600">
                {CalculationService.formatCurrency(
                  incomes.reduce((sum, income) => sum + income.amount, 0) -
                  expenses.reduce((sum, expense) => sum + expense.amount, 0),
                  activeCurrency
                )}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};