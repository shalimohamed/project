import React, { useState, useContext } from 'react';
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { GoalForm } from './GoalForm';
import { GoalList } from './GoalList';
import { SavingGoal } from '../../types';
import { CalculationService } from '../../utils/calculations';
import { CurrencyContext } from '../../context/CurrencyContext';

interface GoalsPageProps {
  goals: SavingGoal[];
  onAddGoal: (goal: Omit<SavingGoal, 'id'>) => void;
  onAddProgress: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalsPage: React.FC<GoalsPageProps> = ({
  goals,
  onAddGoal,
  onAddProgress,
  onDeleteGoal
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { activeCurrency } = useContext(CurrencyContext);

  const completedGoals = goals.filter(goal => CalculationService.getSavingGoalProgress(goal) >= 100);
  const activeGoals = goals.filter(goal => CalculationService.getSavingGoalProgress(goal) < 100);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  // Use the most common or first income's currency for all stats
  const summaryCurrency = goals.length > 0 && goals[0].userId ? 'KES' : 'KES'; // fallback, as goals don't have currency, use KES

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Savings Goals</h2>
        <Button icon={Plus} onClick={() => setIsFormOpen(true)}>
          Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedGoals.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900">
                {CalculationService.formatCurrency(totalSaved, activeCurrency)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <GoalList goals={goals} onAddProgress={onAddProgress} onDelete={onDeleteGoal} />

      <GoalForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={onAddGoal}
      />
    </div>
  );
};