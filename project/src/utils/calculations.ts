import { Income, Expense, Bill, SavingGoal } from '../types';

export class CalculationService {
  static getTotalIncome(incomes: Income[], month?: number, year?: number): number {
    let filteredIncomes = incomes;
    
    if (month !== undefined && year !== undefined) {
      filteredIncomes = incomes.filter(income => {
        const date = new Date(income.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    }
    
    return filteredIncomes.reduce((total, income) => total + income.amount, 0);
  }

  static getTotalExpenses(expenses: Expense[], month?: number, year?: number): number {
    let filteredExpenses = expenses;
    
    if (month !== undefined && year !== undefined) {
      filteredExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    }
    
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  }

  static getTotalExpensesWithBills(expenses: Expense[], bills: Bill[], month?: number, year?: number): number {
    const totalExpenses = this.getTotalExpenses(expenses, month, year);
    let filteredBills = bills.filter(bill => bill.isPaid);
    if (month !== undefined && year !== undefined) {
      filteredBills = filteredBills.filter(bill => {
        const dueDate = new Date(bill.dueDate);
        return dueDate.getMonth() === month && dueDate.getFullYear() === year;
      });
    }
    const totalBills = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
    return totalExpenses + totalBills;
  }

  static getExpensesByCategory(expenses: Expense[], month?: number, year?: number): Record<string, number> {
    let filteredExpenses = expenses;
    
    if (month !== undefined && year !== undefined) {
      filteredExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    }
    
    return filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }

  static getExpensesByType(expenses: Expense[], month?: number, year?: number): { needs: number; wants: number } {
    let filteredExpenses = expenses;
    
    if (month !== undefined && year !== undefined) {
      filteredExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    }
    
    return filteredExpenses.reduce((acc, expense) => {
      if (expense.type === 'need') {
        acc.needs += expense.amount;
      } else {
        acc.wants += expense.amount;
      }
      return acc;
    }, { needs: 0, wants: 0 });
  }

  static getUpcomingBills(bills: Bill[], daysAhead: number = 7): Bill[] {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysAhead);
    
    return bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return !bill.isPaid && dueDate >= today && dueDate <= futureDate;
    });
  }

  static getOverdueBills(bills: Bill[]): Bill[] {
    const today = new Date();
    return bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return !bill.isPaid && dueDate < today;
    });
  }

  static calculateSavings(incomes: Income[], expenses: Expense[], month?: number, year?: number): number {
    const totalIncome = this.getTotalIncome(incomes, month, year);
    const totalExpenses = this.getTotalExpenses(expenses, month, year);
    return totalIncome - totalExpenses;
  }

  static getSavingGoalProgress(goal: SavingGoal): number {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }

  static getDaysUntilGoal(goal: SavingGoal): number {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  static formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
}