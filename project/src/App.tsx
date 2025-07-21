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
import { CurrencyContext } from './context/CurrencyContext';
import SettingsPage from './components/common/SettingsPage';
import UserProfilePage from './components/common/UserProfilePage';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Data state
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [activeCurrency, setActiveCurrency] = useState<'KES' | 'USD' | 'GBP' | 'EUR'>('KES');

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
    console.log('App handleAddIncome called with:', income);
    try {
      await DatabaseService.addIncome(income);
      console.log('Income added successfully');
      await fetchAllData();
      console.log('Data refreshed');
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

  const handleDeleteIncome = async (id: string) => {
    try {
      await DatabaseService.deleteIncome(id);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to delete income:', error);
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

  // Merge default and custom categories for expenses
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
  const customCategories = budgetCategories.map(cat => ({ value: cat.name, label: cat.name }));
  const mergedCategoriesMap = new Map();
  [...defaultCategories, ...customCategories].forEach(cat => {
    mergedCategoriesMap.set(cat.value.trim().toLowerCase(), cat);
  });
  const mergedCategories = Array.from(mergedCategoriesMap.values());

  return (
    <CurrencyContext.Provider value={{ activeCurrency, setActiveCurrency }}>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar onLogout={handleLogout} onSettings={() => navigate('/settings')} />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Dashboard incomes={incomes} expenses={expenses} savingGoals={savingGoals} bills={bills} />} />
              <Route path="/expenses" element={<ExpensesPage expenses={expenses} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} budgetCategories={mergedCategories} />} />
              <Route path="/bills" element={<BillsPage bills={bills} onAddBill={handleAddBill} onMarkPaid={handleMarkBillPaid} onDeleteBill={handleDeleteBill} />} />
              <Route path="/goals" element={<GoalsPage goals={savingGoals} onAddGoal={handleAddGoal} onAddProgress={handleAddGoalProgress} onDeleteGoal={handleDeleteGoal} />} />
              <Route path="/analytics" element={<AnalyticsPage incomes={incomes} expenses={expenses} />} />
              <Route path="/budget" element={<BudgetPage incomes={incomes} expenses={expenses} bills={bills} onAddIncome={handleAddIncome} onDeleteIncome={handleDeleteIncome} userId={currentUser.id} />} />
              <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
              <Route path="/profile" element={<UserProfilePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </CurrencyContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;