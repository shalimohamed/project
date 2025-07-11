import React, { useState } from 'react';
import { Plus, PlusCircle, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Income, Expense } from '../../types';
import { CalculationService } from '../../utils/calculations';

interface BudgetPageProps {
  incomes: Income[];
  expenses: Expense[];
  onAddIncome: (income: Omit<Income, 'id'>) => void;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({
  incomes,
  expenses,
  onAddIncome
}) => {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    source: ''
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = CalculationService.getTotalIncome(incomes, currentMonth, currentYear);
  const monthlyExpenses = CalculationService.getTotalExpenses(expenses, currentMonth, currentYear);
  const remainingBudget = monthlyIncome - monthlyExpenses;

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddIncome({
      amount: parseFloat(incomeForm.amount),
      source: incomeForm.source,
      date: new Date(),
      userId: '1'
    });

    setIncomeForm({ amount: '', source: '' });
    setIsIncomeModalOpen(false);
  };

  // Budget recommendations
  const budgetRecommendations = [
    {
      category: 'Housing',
      recommended: monthlyIncome * 0.3,
      actual: expenses.filter(e => e.category === 'Housing').reduce((sum, e) => sum + e.amount, 0),
      description: '30% of income'
    },
    {
      category: 'Transportation',
      recommended: monthlyIncome * 0.15,
      actual: expenses.filter(e => e.category === 'Transportation').reduce((sum, e) => sum + e.amount, 0),
      description: '15% of income'
    },
    {
      category: 'Food',
      recommended: monthlyIncome * 0.12,
      actual: expenses.filter(e => e.category === 'Food').reduce((sum, e) => sum + e.amount, 0),
      description: '12% of income'
    },
    {
      category: 'Savings',
      recommended: monthlyIncome * 0.2,
      actual: remainingBudget,
      description: '20% of income'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Budget</h2>
        <Button icon={Plus} onClick={() => setIsIncomeModalOpen(true)}>
          Add Income
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                {CalculationService.formatCurrency(monthlyIncome)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
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
              <p className="text-sm font-medium text-gray-600">Remaining Budget</p>
              <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {CalculationService.formatCurrency(remainingBudget)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${remainingBudget >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <DollarSign className={`w-6 h-6 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Recommendations</h3>
        <div className="space-y-4">
          {budgetRecommendations.map((item, index) => {
            const isOverBudget = item.actual > item.recommended;
            const percentage = item.recommended > 0 ? (item.actual / item.recommended) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.description})</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {CalculationService.formatCurrency(item.actual)}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      / {CalculationService.formatCurrency(item.recommended)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                {isOverBudget && (
                  <p className="text-sm text-red-600">
                    Over budget by {CalculationService.formatCurrency(item.actual - item.recommended)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Sources</h3>
        <div className="space-y-3">
          {incomes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No income sources added yet</p>
          ) : (
            incomes.map((income) => (
              <div key={income.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{income.source}</p>
                  <p className="text-sm text-gray-500">
                    {CalculationService.formatDate(income.date)}
                  </p>
                </div>
                <span className="text-lg font-semibold text-green-600">
                  {CalculationService.formatCurrency(income.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} title="Add Income">
        <form onSubmit={handleAddIncome} className="space-y-4">
          <Input
            type="number"
            label="Amount"
            value={incomeForm.amount}
            onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
            placeholder="0.00"
            required
          />

          <Input
            type="text"
            label="Source"
            value={incomeForm.source}
            onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
            placeholder="e.g., Salary, Freelance, etc."
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsIncomeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" icon={PlusCircle}>
              Add Income
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};