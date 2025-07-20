import React, { useState, useEffect, useContext } from 'react';
import { Plus, PlusCircle, DollarSign, Info, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Income, Expense, Bill, BudgetCategory } from '../../types';
import { CalculationService } from '../../utils/calculations';
import { DatabaseService } from '../../utils/database';
import { Select } from '../ui/Select';
import { CurrencyContext } from '../../context/CurrencyContext';

interface BudgetPageProps {
  incomes: Income[];
  expenses: Expense[];
  bills: Bill[];
  onAddIncome: (income: Omit<Income, 'id'>) => void;
  onDeleteIncome: (id: string) => void; // <-- add this
  userId: string;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({
  incomes,
  expenses,
  bills,
  onAddIncome,
  onDeleteIncome, // <-- add this
  userId
}) => {
  const { activeCurrency } = useContext(CurrencyContext);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    source: '',
    type: 'one-time',
    recurrenceFrequency: 'monthly',
    recurrenceDayOfMonth: '',
    recurrenceDayOfWeek: '1',
    startDate: '',
    endDate: '',
  });
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    budgetAmount: 0,
    spentAmount: 0,
    type: 'need',
    color: '#3B82F6',
    incomePercentage: 0
  });
  const [addingCategory, setAddingCategory] = useState(false);
  const [addCategoryError, setAddCategoryError] = useState<string | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editPercentage, setEditPercentage] = useState<number>(0);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editIncomeId, setEditIncomeId] = useState<string | null>(null);
  const [editIncomeForm, setEditIncomeForm] = useState({ amount: '', source: '' });
  const [editIncomeSaving, setEditIncomeSaving] = useState(false);
  const [editIncomeError, setEditIncomeError] = useState<string | null>(null);
  const [deleteIncomeId, setDeleteIncomeId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [deleteCategoryError, setDeleteCategoryError] = useState<string | null>(null);
  const [deleteIncomeError, setDeleteIncomeError] = useState<string | null>(null);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = CalculationService.getTotalIncome(incomes, currentMonth, currentYear);
  const monthlyExpenses = CalculationService.getTotalExpensesWithBills(expenses, bills, currentMonth, currentYear);
  const remainingBudget = monthlyIncome - monthlyExpenses;

  useEffect(() => {
    setLoadingCategories(true);
    DatabaseService.getBudgetCategories().then((cats) => {
      setCategories(cats);
      setLoadingCategories(false);
    });
  }, []);

  // Find salary income (assume only one active salary)
  const recurringIncomes = incomes.filter(i => i.type === 'recurring');
  const oneTimeIncomes = incomes.filter(i => i.type === 'one-time');
  const salaryIncomes = incomes.filter(i => i.type === 'salary');

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    let recurrenceRule = undefined;
    let date = new Date();
    let endDate = undefined;
    if (incomeForm.type === 'recurring') {
      recurrenceRule = {
        frequency: incomeForm.recurrenceFrequency as 'monthly' | 'weekly' | 'daily' | 'yearly',
        dayOfMonth: incomeForm.recurrenceFrequency === 'monthly' ? Number(incomeForm.recurrenceDayOfMonth) : undefined,
        dayOfWeek: incomeForm.recurrenceFrequency === 'weekly' ? Number(incomeForm.recurrenceDayOfWeek) : undefined
      };
      date = incomeForm.startDate ? new Date(incomeForm.startDate) : new Date();
      endDate = incomeForm.endDate ? new Date(incomeForm.endDate) : undefined;
    } else if (incomeForm.type === 'salary') {
      recurrenceRule = {
        frequency: 'monthly' as 'monthly',
        dayOfMonth: Number(incomeForm.recurrenceDayOfMonth)
      };
      date = incomeForm.startDate ? new Date(incomeForm.startDate) : new Date();
    } else {
      date = new Date();
    }
    const incomeData = {
      amount: parseFloat(incomeForm.amount),
      source: incomeForm.source,
      date,
      userId,
      type: incomeForm.type as 'salary' | 'recurring' | 'one-time',
      recurrenceRule,
      endDate,
      currency: activeCurrency,
    };
    onAddIncome(incomeData);
    setIncomeForm({
      amount: '',
      source: '',
      type: 'one-time',
      recurrenceFrequency: 'monthly',
      recurrenceDayOfMonth: '',
      recurrenceDayOfWeek: '1',
      startDate: '',
      endDate: '',
    });
    setIsIncomeModalOpen(false);
  };

  const handlePercentageChange = (id: string, value: number) => {
    setCategories((prev) => prev.map(cat => cat.id === id ? { ...cat, incomePercentage: value } : cat));
  };

  const handleSavePercentage = async (id: string, value: number) => {
    setSaving(id);
    await DatabaseService.updateBudgetCategory(id, { incomePercentage: value });
    setSaving(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Budget</h2>
        <div className="flex gap-2">
          <Button icon={Plus} onClick={() => setIsIncomeModalOpen(true)}>
            Add Income
          </Button>
          <Button icon={PlusCircle} variant="secondary" onClick={() => setIsAddCategoryOpen(true)}>
            Add Budget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                {CalculationService.formatCurrency(monthlyIncome, activeCurrency)}
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
                {CalculationService.formatCurrency(monthlyExpenses, activeCurrency)}
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
                {CalculationService.formatCurrency(remainingBudget, activeCurrency)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${remainingBudget >= 0 ? 'bg-green-50' : 'bg-red-50'}`}> 
              <DollarSign className={`w-6 h-6 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Budget Recommendations
          <span className="ml-1" title="Set your own recommended % of income for each category. Actual vs. recommended is shown below.">
            <Info className="w-4 h-4 text-blue-400 inline" />
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingCategories ? (
            <div className="text-gray-500 col-span-2">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-gray-500 col-span-2">No budget categories found.</div>
          ) : (
            categories.map((cat) => {
              const recommended = monthlyIncome * (cat.incomePercentage / 100);
              // Make category matching case-insensitive and include both expenses and paid bills
              const expenseAmount = expenses.filter(e => e.category.trim().toLowerCase() === cat.name.trim().toLowerCase()).reduce((sum, e) => sum + e.amount, 0);
              const billAmount = bills.filter(b => b.isPaid && b.category.trim().toLowerCase() === cat.name.trim().toLowerCase()).reduce((sum, b) => sum + b.amount, 0);
              const actual = expenseAmount + billAmount;
              const isOverBudget = actual > recommended;
              const percentage = recommended > 0 ? (actual / recommended) * 100 : 0;
              return (
                <div key={cat.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-2 relative group">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full" style={{ background: cat.color }} />
                      <span className="font-semibold text-gray-900 text-base">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className={`font-bold text-lg ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}> 
                          {CalculationService.formatCurrency(actual, activeCurrency)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          / {CalculationService.formatCurrency(recommended, activeCurrency)}
                        </span>
                      </div>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors ml-2"
                        onClick={() => {
                          setEditCategoryId(cat.id);
                          setEditPercentage(cat.incomePercentage);
                          setEditError(null);
                        }}
                        aria-label="Edit category"
                        type="button"
                      >
                        <Edit className="w-5 h-5 text-gray-500" />
                      </button>
                      <button
                        className="p-1 rounded-full hover:bg-red-100 transition-colors"
                        onClick={() => setDeleteCategoryId(cat.id)}
                        aria-label="Delete category"
                        type="button"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-700 font-semibold select-none">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    {isOverBudget ? (
                      <span className="ml-2 text-xs text-red-600 font-medium whitespace-nowrap">
                        Over by {CalculationService.formatCurrency(actual - recommended, activeCurrency)}
                      </span>
                    ) : (
                      <span className="ml-2 text-xs text-green-600 font-medium whitespace-nowrap">
                        {recommended - actual > 0 ? `Under by ${CalculationService.formatCurrency(recommended - actual, activeCurrency)}` : 'On track'}
                      </span>
                    )}
                  </div>
                  {/* Edit popover/modal */}
                  {editCategoryId === cat.id && (
                    <div className="absolute z-20 top-10 right-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64 animate-fade-in">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Edit {cat.name} Recommendation</h4>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setEditSaving(true);
                          setEditError(null);
                          try {
                            await DatabaseService.updateBudgetCategory(cat.id, { incomePercentage: editPercentage });
                            setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, incomePercentage: editPercentage } : c));
                            setEditCategoryId(null);
                          } catch (err: any) {
                            setEditError(err?.message || 'Failed to update.');
                          } finally {
                            setEditSaving(false);
                          }
                        }}
                        className="space-y-2"
                      >
                        <label className="block text-xs font-medium text-gray-700">% of Income</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={0.1}
                          value={editPercentage}
                          onChange={e => setEditPercentage(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          disabled={editSaving}
                        />
                        {editError && <div className="text-xs text-red-600">{editError}</div>}
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 hover:bg-gray-200 text-gray-700"
                            onClick={() => setEditCategoryId(null)}
                            disabled={editSaving}
                          >Cancel</button>
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-blue-300"
                            disabled={editSaving}
                          >Save</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Income Sources Section */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Sources</h3>
        <div className="space-y-3">
          {/* Salary Incomes */}
          {salaryIncomes.length > 0 && <div className="font-semibold text-green-700">Salary</div>}
          {salaryIncomes.map((income) => (
            <div key={income.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{income.source}</p>
                <p className="text-sm text-gray-500">
                  Every month on day {income.recurrenceRule?.dayOfMonth}
                </p>
              </div>
              <span className="text-lg font-semibold text-green-600">
                {CalculationService.formatCurrency(income.amount, income.currency)}
              </span>
              <button
                className="ml-2 p-1 rounded hover:bg-red-100"
                onClick={() => setDeleteIncomeId(income.id)}
                title="Delete income"
                type="button"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
          {/* Recurring Incomes */}
          {recurringIncomes.length > 0 && <div className="font-semibold text-blue-700">Recurring Incomes</div>}
          {recurringIncomes.map((income) => (
            <div key={income.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{income.source}</p>
                <p className="text-sm text-gray-500">
                  {income.recurrenceRule?.frequency === 'monthly' && `Every month on day ${income.recurrenceRule.dayOfMonth}`}
                  {income.recurrenceRule?.frequency === 'weekly' && `Every week on day ${income.recurrenceRule.dayOfWeek}`}
                  {income.recurrenceRule?.frequency === 'daily' && 'Every day'}
                </p>
              </div>
              <span className="text-lg font-semibold text-green-600">
                {CalculationService.formatCurrency(income.amount, income.currency)}
              </span>
            </div>
          ))}
          {/* One-time Incomes */}
          {oneTimeIncomes.length > 0 && <div className="font-semibold text-gray-700 mt-4">One-time Incomes</div>}
          {oneTimeIncomes.map((income) => (
            <div key={income.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{income.source}</p>
                <p className="text-sm text-gray-500">
                  {CalculationService.formatDate(income.date)}
                </p>
              </div>
              <span className="text-lg font-semibold text-green-600">
                {CalculationService.formatCurrency(income.amount, income.currency)}
              </span>
              <button
                className="ml-2 p-1 rounded hover:bg-red-100"
                onClick={() => setDeleteIncomeId(income.id)}
                title="Delete income"
                type="button"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </Card>
      {/* Add/Edit Income Modal */}
      <Modal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} title="Add Income">
        <form onSubmit={handleAddIncome} className="space-y-4">
          <Select
            label="Type"
            value={incomeForm.type}
            onChange={e => setIncomeForm(f => ({ ...f, type: e.target.value }))}
            options={[
              { value: 'salary', label: 'Salary' },
              { value: 'recurring', label: 'Recurring' },
              { value: 'one-time', label: 'One-time' }
            ]}
          />
          <Input
            type="number"
            label="Amount"
            value={incomeForm.amount}
            onChange={e => setIncomeForm(f => ({ ...f, amount: e.target.value }))}
            required
          />
          <Input
            type="text"
            label="Source"
            value={incomeForm.source}
            onChange={e => setIncomeForm(f => ({ ...f, source: e.target.value }))}
            required
          />
          {/* Recurrence fields */}
          {incomeForm.type === 'salary' && (
            <Input
              type="number"
              label="Salary Day of Month"
              value={incomeForm.recurrenceDayOfMonth}
              onChange={e => setIncomeForm(f => ({ ...f, recurrenceDayOfMonth: e.target.value }))}
              placeholder="1-31"
              required
            />
          )}
          {incomeForm.type === 'recurring' && (
            <>
              <Select
                label="Frequency"
                value={incomeForm.recurrenceFrequency}
                onChange={e => setIncomeForm(f => ({ ...f, recurrenceFrequency: e.target.value }))}
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'daily', label: 'Daily' }
                ]}
                required
              />
              {incomeForm.recurrenceFrequency === 'monthly' && (
                <Input
                  type="number"
                  label="Day of Month"
                  value={incomeForm.recurrenceDayOfMonth}
                  onChange={e => setIncomeForm(f => ({ ...f, recurrenceDayOfMonth: e.target.value }))}
                  placeholder="1-31"
                  required
                />
              )}
              {incomeForm.recurrenceFrequency === 'weekly' && (
                <Select
                  label="Day of Week"
                  value={incomeForm.recurrenceDayOfWeek}
                  onChange={e => setIncomeForm(f => ({ ...f, recurrenceDayOfWeek: e.target.value }))}
                  options={[
                    { value: '0', label: 'Sunday' },
                    { value: '1', label: 'Monday' },
                    { value: '2', label: 'Tuesday' },
                    { value: '3', label: 'Wednesday' },
                    { value: '4', label: 'Thursday' },
                    { value: '5', label: 'Friday' },
                    { value: '6', label: 'Saturday' }
                  ]}
                  required
                />
              )}
              <Input
                type="date"
                label="Start Date"
                value={incomeForm.startDate}
                onChange={e => setIncomeForm(f => ({ ...f, startDate: e.target.value }))}
                required
              />
              <Input
                type="date"
                label="End Date (optional)"
                value={incomeForm.endDate}
                onChange={e => setIncomeForm(f => ({ ...f, endDate: e.target.value }))}
              />
            </>
          )}
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

      <Modal isOpen={isAddCategoryOpen} onClose={() => { setIsAddCategoryOpen(false); setAddCategoryError(null); }} title="Add Budget Category">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setAddCategoryError(null);
            // Prevent duplicate names (case-insensitive)
            if (categories.some(cat => cat.name.trim().toLowerCase() === newCategory.name.trim().toLowerCase())) {
              setAddCategoryError('A budget category with this name already exists.');
              return;
            }
            setAddingCategory(true);
            try {
              const added = await DatabaseService.addBudgetCategory({
                ...newCategory,
                type: newCategory.type as 'need' | 'want'
              });
              setCategories((prev) => [...prev, added]);
              setIsAddCategoryOpen(false);
              setNewCategory({
                name: '',
                budgetAmount: 0,
                spentAmount: 0,
                type: 'need',
                color: '#3B82F6',
                incomePercentage: 0
              });
            } catch (err: any) {
              setAddCategoryError(err?.message || 'Failed to add budget category.');
            } finally {
              setAddingCategory(false);
            }
          }}
          className="space-y-4"
        >
          {addCategoryError && (
            <div className="text-red-600 text-sm font-medium">{addCategoryError}</div>
          )}
          <Input
            type="text"
            label="Category Name"
            value={newCategory.name}
            onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
            required
          />
          <Input
            type="number"
            label="Budget Amount (optional)"
            value={isNaN(newCategory.budgetAmount) || newCategory.budgetAmount === 0 ? '' : newCategory.budgetAmount}
            onChange={e => setNewCategory({ ...newCategory, budgetAmount: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
            placeholder="0 or more"
          />
          <Input
            type="number"
            label="% of Income"
            value={isNaN(newCategory.incomePercentage) || newCategory.incomePercentage === 0 ? '' : newCategory.incomePercentage}
            onChange={e => setNewCategory({ ...newCategory, incomePercentage: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
            placeholder="0-100"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1"
              value={newCategory.type}
              onChange={e => setNewCategory({ ...newCategory, type: e.target.value as 'need' | 'want' })}
            >
              <option value="need">Need</option>
              <option value="want">Want</option>
            </select>
          </div>
          <Input
            type="text"
            label="Color (hex)"
            value={newCategory.color}
            onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
            placeholder="#3B82F6"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => { setIsAddCategoryOpen(false); setAddCategoryError(null); }} type="button">
              Cancel
            </Button>
            <Button type="submit" icon={PlusCircle}>
              Add Budget
            </Button>
          </div>
        </form>
      </Modal>
      {/* Delete category modal */}
      {deleteCategoryId && (
        <Modal isOpen={true} onClose={() => setDeleteCategoryId(null)} title={`Delete ${categories.find(cat => cat.id === deleteCategoryId)?.name}?`}>
          <div className="space-y-4">
            <p>Are you sure you want to delete the <b>{categories.find(cat => cat.id === deleteCategoryId)?.name}</b> budget category? This cannot be undone.</p>
            {deleteCategoryError && <div className="text-red-600 text-sm">{deleteCategoryError}</div>}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteCategoryId(null)}>Cancel</Button>
              <Button variant="danger" onClick={async () => {
                try {
                  await DatabaseService.deleteBudgetCategory(deleteCategoryId);
                  setCategories(prev => prev.filter(c => c.id !== deleteCategoryId));
                  setDeleteCategoryId(null);
                } catch (err: any) {
                  setDeleteCategoryError(err?.message || 'Failed to delete.');
                }
              }}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}
      {/* Delete income modal */}
      {deleteIncomeId && (
        <Modal isOpen={true} onClose={() => setDeleteIncomeId(null)} title="Delete Income?">
          <div className="space-y-4">
            <p>Are you sure you want to delete this income? This cannot be undone.</p>
            {deleteIncomeError && <div className="text-red-600 text-sm">{deleteIncomeError}</div>}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteIncomeId(null)}>Cancel</Button>
              <Button variant="danger" onClick={async () => {
                try {
                  await onDeleteIncome(deleteIncomeId);
                  setDeleteIncomeId(null);
                } catch (err: any) {
                  setDeleteIncomeError(err?.message || 'Failed to delete.');
                }
              }}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};