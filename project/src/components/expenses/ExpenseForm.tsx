import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { Expense } from '../../types';
import { defaultExpenseCategories } from '../../types';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  budgetCategories?: { value: string; label: string }[] | import('../../types').BudgetCategory[];
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budgetCategories
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'need' as 'need' | 'want',
    priority: 1
  });

  let categories: { value: string; label: string }[] = [];
  if (budgetCategories && Array.isArray(budgetCategories) && budgetCategories.length > 0) {
    categories = (budgetCategories as any[]).map(cat =>
      typeof cat === 'string'
        ? { value: cat, label: cat }
        : { value: cat.name || cat.value, label: cat.name || cat.label }
    );
  } else {
    categories = defaultExpenseCategories;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      date: new Date(),
      userId: '1'
    });

    setFormData({
      amount: '',
      category: '',
      description: '',
      type: 'need',
      priority: 1
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories}
            placeholder="Select category"
            required
          />
        </div>

        <Input
          type="text"
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What did you spend on?"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'need' | 'want' })}
            options={[
              { value: 'need', label: 'Need' },
              { value: 'want', label: 'Want' }
            ]}
            required
          />

          <Select
            label="Priority"
            value={formData.priority.toString()}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
            options={[
              { value: '1', label: 'High Priority' },
              { value: '2', label: 'Medium Priority' },
              { value: '3', label: 'Low Priority' }
            ]}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" icon={Plus}>
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};