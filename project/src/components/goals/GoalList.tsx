import React from 'react';
import { Target, Calendar, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SavingGoal } from '../../types';
import { CalculationService } from '../../utils/calculations';

interface GoalListProps {
  goals: SavingGoal[];
  onAddProgress: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export const GoalList: React.FC<GoalListProps> = ({ goals, onAddProgress, onDelete }) => {
  const handleAddProgress = (goalId: string) => {
    const amount = prompt('Enter amount to add:');
    if (amount && !isNaN(parseFloat(amount))) {
      onAddProgress(goalId, parseFloat(amount));
    }
  };

  // Use the most common or first income's currency for all stats
  const summaryCurrency = goals.length > 0 && goals[0].userId ? 'KES' : 'KES'; // fallback, as goals don't have currency, use KES

  return (
    <div className="space-y-6">
      {goals.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No savings goals set yet</p>
          </div>
        </Card>
      ) : (
        goals.map((goal) => {
          const progress = CalculationService.getSavingGoalProgress(goal);
          const daysLeft = CalculationService.getDaysUntilGoal(goal);
          const isCompleted = progress >= 100;

          return (
            <Card key={goal.id} className={`${isCompleted ? 'ring-2 ring-green-200' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    isCompleted ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Target className={`w-5 h-5 ${
                      isCompleted ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Target: {CalculationService.formatDate(goal.targetDate)}</span>
                      {daysLeft > 0 && (
                        <>
                          <span>•</span>
                          <span>{daysLeft} days left</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    icon={Plus}
                    onClick={() => handleAddProgress(goal.id)}
                  >
                    Add Progress
                  </Button>
                  <Button 
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onDelete(goal.id)} children={undefined}                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className={`text-sm font-bold ${
                    isCompleted ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {CalculationService.formatCurrency(goal.currentAmount, summaryCurrency)}
                  </span>
                  <span className="text-sm text-gray-500">
                    of {CalculationService.formatCurrency(goal.targetAmount, summaryCurrency)}
                  </span>
                </div>
              </div>

              {isCompleted && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-medium">🎉 Goal completed!</p>
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
};