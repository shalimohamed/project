import React, { useState, useEffect } from 'react';
import { User, Income, Expense, Bill, SavingGoal, BudgetCategory } from './types';
import { DatabaseService } from './utils/database';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { ExpensesPage } from './components/expenses/ExpensesPage';
import { BillsPage } from './components/bills/BillsPage';
import { GoalsPage } from './components/goals/GoalsPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { BudgetPage } from './components/budget/BudgetPage';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data state
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);

  const fetchAllData = async () => {
    if (!currentUser) return;
    
    try {
      const [incomesData, expensesData, billsData, goalsData, categoriesData] = await Promise.all([
        DatabaseService.getIncomes(),
        DatabaseService.getExpenses(),
        DatabaseService.getBills(),
        DatabaseService.getSavingGoals(),
        DatabaseService.getBudgetCategories()
      ]);
      
      setIncomes(incomesData);
      setExpenses(expensesData);
      setBills(billsData);
      setSavingGoals(goalsData);
      setBudgetCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await DatabaseService.initialize();
        
        // Check if user is already logged in (from Supabase Auth)
        const currentUser = await DatabaseService.getCurrentUser();
        if (currentUser) {
          setCurrentUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await DatabaseService.logout();
      setCurrentUser(null);
      setCurrentPage('dashboard');
      // Clear data state
      setIncomes([]);
      setExpenses([]);
      setBills([]);
      setSavingGoals([]);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleAddIncome = async (income: Omit<Income, 'id'>) => {
    try {
      await DatabaseService.addIncome(income);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to add income:', error);
    }
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      await DatabaseService.addExpense(expense);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await DatabaseService.deleteExpense(id);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleAddBill = async (bill: Omit<Bill, 'id'>) => {
    try {
      await DatabaseService.addBill(bill);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to add bill:', error);
    }
  };

  const handleMarkBillPaid = async (id: string) => {
    try {
      await DatabaseService.markBillPaid(id);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to mark bill as paid:', error);
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      await DatabaseService.deleteBill(id);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to delete bill:', error);
    }
  };

  const handleAddGoal = async (goal: Omit<SavingGoal, 'id'>) => {
    try {
      await DatabaseService.addSavingGoal(goal);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };

  const handleAddGoalProgress = async (id: string, amount: number) => {
    try {
      await DatabaseService.addSavingGoalProgress(id, amount);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to add goal progress:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await DatabaseService.deleteSavingGoal(id);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard incomes={incomes} expenses={expenses} savingGoals={savingGoals} bills={bills} onNavigate={setCurrentPage} />;
      case 'expenses':
        // Merge default categories with custom budget categories, avoiding duplicates
        const defaultCategories = [
          { value: 'Housing', label: 'Housing' },
          { value: 'Transportation', label: 'Transportation' },
          { value: 'Food', label: 'Food' },
          { value: 'Healthcare', label: 'Healthcare' },
          { value: 'Entertainment', label: 'Entertainment' },
          { value: 'Shopping', label: 'Shopping' },
          { value: 'Utilities', label: 'Utilities' },
          { value: 'Education', label: 'Education' },
          { value: 'Other', label: 'Other' }
        ];
        // Convert custom categories to { value, label }
        const customCategories = budgetCategories.map(cat => ({
          value: cat.name,
          label: cat.name
        }));
        // Merge and deduplicate by value (case-insensitive)
        const mergedCategoriesMap = new Map();
        [...defaultCategories, ...customCategories].forEach(cat => {
          mergedCategoriesMap.set(cat.value.trim().toLowerCase(), cat);
        });
        const mergedCategories = Array.from(mergedCategoriesMap.values());
        return (
          <ExpensesPage 
            expenses={expenses} 
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            budgetCategories={mergedCategories}
          />
        );
      case 'bills':
        return (
          <BillsPage 
            bills={bills}
            onAddBill={handleAddBill}
            onMarkPaid={handleMarkBillPaid}
            onDeleteBill={handleDeleteBill}
          />
        );
      case 'goals':
        return (
          <GoalsPage 
            goals={savingGoals}
            onAddGoal={handleAddGoal}
            onAddProgress={handleAddGoalProgress}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case 'analytics':
        return <AnalyticsPage incomes={incomes} expenses={expenses} />;
      case 'budget':
        return (
          <BudgetPage 
            incomes={incomes}
            expenses={expenses}
            bills={bills}
            onAddIncome={handleAddIncome}
          />
        );
      default:
        return <Dashboard incomes={incomes} expenses={expenses} savingGoals={savingGoals} bills={bills} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar 
          currentTab={currentPage}
          onTabChange={setCurrentPage}
        />
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-6">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
      <footer className="w-full py-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
        © Developed by Shali Mohammed | Student ID: 669344
      </footer>
    </div>
  );
}

export default App;