import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../ui/Card';
import { Expense } from '../../types';
import { CurrencyType } from '../../context/CurrencyContext';
import { CalculationService } from '../../utils/calculations';

interface ExpenseBreakdownProps {
  expenses: Expense[];
  activeCurrency: CurrencyType;
}

export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ expenses, activeCurrency }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const categoryExpenses = CalculationService.getExpensesByCategory(expenses, currentMonth, currentYear);
  const { needs, wants } = CalculationService.getExpensesByType(expenses, currentMonth, currentYear);

  const pieData = [
    { name: 'Needs', value: needs, color: '#10B981' },
    { name: 'Wants', value: wants, color: '#3B82F6' }
  ];

  const categoryData = Object.entries(categoryExpenses).map(([category, amount]) => ({
    category,
    amount
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Needs vs Wants</h3>
        {needs + wants > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => CalculationService.formatCurrency(value as number, activeCurrency)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-300 flex items-center justify-center text-gray-500">
            No expense data available
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
        <div className="space-y-3">
          {categoryData.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No categories yet</p>
          ) : (
            categoryData
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{item.category}</span>
                  <span className="text-red-600 font-semibold">
                    {CalculationService.formatCurrency(item.amount, activeCurrency)}
                  </span>
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  );
};