import React from 'react';
import { Trash2, Edit, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Expense } from '../../types';
import { CalculationService } from '../../utils/calculations';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-600 bg-red-50';
      case 2: return 'text-yellow-600 bg-yellow-50';
      case 3: return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'Unknown';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">All Expenses</h3>
        <div className="text-sm text-gray-500">
          {expenses.length} total expenses
        </div>
      </div>

      <div className="space-y-3">
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No expenses recorded yet</p>
          </div>
        ) : (
          sortedExpenses.map((expense) => (
            <div 
              key={expense.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(expense.priority)}`}>
                  {getPriorityText(expense.priority)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      expense.type === 'need' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {expense.type}
                    </span>
                    <span>•</span>
                    <span>{CalculationService.formatDate(expense.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-red-600">
                  {CalculationService.formatCurrency(expense.amount, 'KES')}
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="secondary" size="sm" icon={Edit} />
                  <Button 
                    variant="danger" 
                    size="sm" 
                    icon={Trash2}
                    onClick={() => onDelete(expense.id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};