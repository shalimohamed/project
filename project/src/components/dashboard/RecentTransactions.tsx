import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Income, Expense } from '../../types';
import { CalculationService } from '../../utils/calculations';

interface RecentTransactionsProps {
  incomes: Income[];
  expenses: Expense[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  incomes,
  expenses
}) => {
  const allTransactions = [
    ...incomes.map(income => ({
      id: income.id,
      type: 'income' as const,
      description: income.source,
      amount: income.amount,
      date: income.date,
      category: 'Income'
    })),
    ...expenses.map(expense => ({
      id: expense.id,
      type: 'expense' as const,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category
    }))
  ];

  const sortedTransactions = allTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
      </div>
      
      <div className="space-y-3">
        {sortedTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          sortedTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{CalculationService.formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-gray-500">
                  {CalculationService.formatDate(transaction.date)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};