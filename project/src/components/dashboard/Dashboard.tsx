import React from 'react';
import { Income, Expense, SavingGoal, Bill } from '../../types';
import { DashboardStats } from './DashboardStats';
import { RecentTransactions } from './RecentTransactions';
import { ExpenseBreakdown } from './ExpenseBreakdown';
import { AlertTriangle, Calendar } from 'lucide-react';
import { useContext } from 'react';
import { CurrencyContext } from '../../context/CurrencyContext';
import { CalculationService } from '../../utils/calculations';

interface DashboardProps {
  incomes: Income[];
  expenses: Expense[];
  savingGoals: SavingGoal[];
  bills: Bill[];
  onNavigate?: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  incomes,
  expenses,
  savingGoals,
  bills,
  onNavigate
}) => {
  const { activeCurrency } = useContext(CurrencyContext);
  const handleNavigate = (page: string) => {
    if (onNavigate) onNavigate(page);
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        <DashboardStats incomes={incomes} expenses={expenses} savingGoals={savingGoals} bills={bills} onNavigate={handleNavigate} />
      </div>

      {/* Bills summary for current month */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Bills This Month
        </h3>
        <div className="space-y-2">
          {bills.filter(bill => {
            const dueDate = new Date(bill.dueDate);
            const now = new Date();
            return dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
          }).length === 0 ? (
            <div className="text-gray-500 text-sm">No bills for this month 🎉</div>
          ) : (
            bills.filter(bill => {
              const dueDate = new Date(bill.dueDate);
              const now = new Date();
              return dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
            }).map(bill => {
              const dueDate = new Date(bill.dueDate);
              const now = new Date();
              const isOverdue = !bill.isPaid && dueDate < now;
              const isUnpaid = !bill.isPaid;
              return (
                <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{bill.name}</span>
                    {/* Tags after the name */}
                    {bill.isPaid && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-semibold ml-2">Paid</span>
                    )}
                    {isUnpaid && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700 font-semibold ml-2">Unpaid</span>
                    )}
                    {isOverdue && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-semibold ml-2">Overdue</span>
                    )}
                    <span className="text-xs text-gray-500 ml-2">Due: {dueDate.toLocaleDateString()}</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">{CalculationService.formatCurrency(bill.amount, activeCurrency)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions incomes={incomes} expenses={expenses} activeCurrency={activeCurrency} />
        <div className="lg:col-span-1">
          <ExpenseBreakdown expenses={expenses} activeCurrency={activeCurrency} />
        </div>
      </div>
    </div>
  );
};