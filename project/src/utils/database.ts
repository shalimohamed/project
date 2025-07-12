import { User, Income, Expense, Bill, SavingGoal } from '../types';
import { supabase, TABLES } from './supabase';
import { v4 as uuidv4 } from 'uuid';


export class DatabaseService {
  static async initialize(): Promise<void> {
    try {
      // Test the connection
      const { error } = await supabase
        .from(TABLES.USERS)
        .select('count')
        .limit(1);

      if (error) {
        console.error('Database connection failed:', error);
        throw new Error('Failed to connect to Supabase database');
      }

      // Verify all required tables exist
      for (const table of Object.values(TABLES)) {
        const { error: tableError } = await supabase
          .from(table)
          .select('count')
          .limit(1);
          
        if (tableError) {
          throw new Error(`Table ${table} does not exist`);
        }
      }

      console.log('Database service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database service:', error);
      throw error;
    }
  }

  // User management
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching current user:', error);
        return null;
      }

      return data ? {
        id: data.id,
        username: data.username,
        email: data.email,
        createdAt: new Date(data.created_at)
      } : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async setCurrentUser(user: User): Promise<void> {
    // This will be handled by Supabase Auth
    console.log('User set:', user.username);
  }

  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  }

  static async userExists(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('id')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking if user exists:', error);
      return false;
    }

    return !!data;
  }

  static async emailExists(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('id')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking if email exists:', error);
      return false;
    }

    return !!data;
  }

  static async authenticateUser(username: string, password: string): Promise<User | null> {
    try {
      // First get the user by username
      const { data: userData, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        return null;
      }

      // Sign in with Supabase Auth using the email
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password
      });

      if (authError) {
        console.error('Auth error:', authError);
        return null;
      }

      return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        createdAt: new Date(userData.created_at)
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }



  static async registerUser(username: string, email: string, password: string): Promise<User> {
    try {
      // Check if user already exists
      const exists = await this.userExists(username);
      if (exists) {
        throw new Error('Username already exists');
      }

      // Check if email already exists
      const emailExists = await this.emailExists(email);
      if (emailExists) {
        throw new Error('Email already exists');
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw new Error('Failed to create user account');
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create user in our users table using the Auth user ID
      const { data: userData, error: userError } = await supabase
        .from(TABLES.USERS)
        .insert([{
          id: authData.user.id,
          username: username,
          email: email,
          password_hash: '' // We don't store password hash when using Supabase Auth
        }])
        .select()
        .single();

      if (userError) {
        console.error('Error creating user record:', userError);
        // Note: We can't delete the auth user from client-side
        // The user will need to be cleaned up manually or through a server function
        throw new Error('Failed to create user profile');
      }

      return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        createdAt: new Date(userData.created_at)
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Income management
  static async getIncomes(): Promise<Income[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];

    const { data, error } = await supabase
      .from(TABLES.INCOMES)
      .select('*')
      .eq('user_id', currentUser.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching incomes:', error);
      return [];
    }

    return data.map(income => ({
      id: income.id,
      userId: income.user_id,
      amount: income.amount,
      source: income.source,
      date: new Date(income.date)
    }));
  }

  static async addIncome(income: Omit<Income, 'id'>): Promise<Income> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No authenticated user');

    const id = uuidv4();

    const { data, error } = await supabase
      .from(TABLES.INCOMES)
      .insert([{
        id,
        user_id: currentUser.id,
        amount: income.amount,
        source: income.source,
        date: income.date.toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding income:', error);
      throw new Error('Failed to add income');
    }

    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      source: data.source,
      date: new Date(data.date)
    };
  }

  // Expense management
  static async getExpenses(): Promise<Expense[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];

    const { data, error } = await supabase
      .from(TABLES.EXPENSES)
      .select('*')
      .eq('user_id', currentUser.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }

    return data.map(expense => ({
      id: expense.id,
      userId: expense.user_id,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: new Date(expense.date),
      type: expense.type,
      priority: expense.priority
    }));
  }

  static async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No authenticated user');

    const id = uuidv4();

    const { data, error } = await supabase
      .from(TABLES.EXPENSES)
      .insert([{
        id,
        user_id: currentUser.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date.toISOString(),
        type: expense.type,
        priority: expense.priority
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      throw new Error('Failed to add expense');
    }

    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: new Date(data.date),
      type: data.type,
      priority: data.priority
    };
  }

  static async deleteExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.EXPENSES)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      throw new Error('Failed to delete expense');
    }
  }

  static async updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
    const updateData: any = {};
    
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.date !== undefined) updateData.date = updates.date.toISOString();
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.priority !== undefined) updateData.priority = updates.priority;

    const { error } = await supabase
      .from(TABLES.EXPENSES)
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating expense:', error);
      throw new Error('Failed to update expense');
    }
  }

  // Bill management
  static async getBills(): Promise<Bill[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];

    const { data, error } = await supabase
      .from(TABLES.BILLS)
      .select('*')
      .eq('user_id', currentUser.id)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching bills:', error);
      return [];
    }

    return data.map(bill => ({
      id: bill.id,
      userId: bill.user_id,
      name: bill.name,
      amount: bill.amount,
      dueDate: new Date(bill.due_date),
      category: bill.category,
      isPaid: bill.is_paid,
      recurring: bill.recurring
    }));
  }

  static async addBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No authenticated user');

    const id = uuidv4();

    const { data, error } = await supabase
      .from(TABLES.BILLS)
      .insert([{
        id,
        user_id: currentUser.id,
        name: bill.name,
        amount: bill.amount,
        due_date: bill.dueDate.toISOString(),
        category: bill.category,
        is_paid: bill.isPaid,
        recurring: bill.recurring
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding bill:', error);
      throw new Error('Failed to add bill');
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      amount: data.amount,
      dueDate: new Date(data.due_date),
      category: data.category,
      isPaid: data.is_paid,
      recurring: data.recurring
    };
  }

  static async updateBill(id: string, updates: Partial<Bill>): Promise<void> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate.toISOString();
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.isPaid !== undefined) updateData.is_paid = updates.isPaid;
    if (updates.recurring !== undefined) updateData.recurring = updates.recurring;

    const { error } = await supabase
      .from(TABLES.BILLS)
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating bill:', error);
      throw new Error('Failed to update bill');
    }
  }

  static async deleteBill(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.BILLS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting bill:', error);
      throw new Error('Failed to delete bill');
    }
  }

  static async markBillPaid(id: string): Promise<void> {
    await this.updateBill(id, { isPaid: true });
  }

  static async getUpcomingBills(daysAhead: number = 7): Promise<Bill[]> {
    const bills = await this.getBills();
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysAhead);
    
    return bills.filter(bill => 
      !bill.isPaid && 
      bill.dueDate >= today && 
      bill.dueDate <= futureDate
    ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  static async getOverdueBills(): Promise<Bill[]> {
    const bills = await this.getBills();
    const today = new Date();
    
    return bills.filter(bill => 
      !bill.isPaid && bill.dueDate < today
    ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  // Saving goals management
  static async getSavingGoals(): Promise<SavingGoal[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];

    const { data, error } = await supabase
      .from(TABLES.SAVING_GOALS)
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saving goals:', error);
      return [];
    }

    return data.map(goal => ({
      id: goal.id,
      userId: goal.user_id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      targetDate: new Date(goal.target_date)
    }));
  }

  static async addSavingGoal(goal: Omit<SavingGoal, 'id'>): Promise<SavingGoal> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No authenticated user');

    const id = uuidv4();

    const { data, error } = await supabase
      .from(TABLES.SAVING_GOALS)
      .insert([{
        id,
        user_id: currentUser.id,
        name: goal.name,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        target_date: goal.targetDate.toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding saving goal:', error);
      throw new Error('Failed to add saving goal');
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      targetAmount: data.target_amount,
      currentAmount: data.current_amount,
      targetDate: new Date(data.target_date)
    };
  }

  static async updateSavingGoal(id: string, updates: Partial<SavingGoal>): Promise<void> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.targetAmount !== undefined) updateData.target_amount = updates.targetAmount;
    if (updates.currentAmount !== undefined) updateData.current_amount = updates.currentAmount;
    if (updates.targetDate !== undefined) updateData.target_date = updates.targetDate.toISOString();

    const { error } = await supabase
      .from(TABLES.SAVING_GOALS)
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating saving goal:', error);
      throw new Error('Failed to update saving goal');
    }
  }

  static async deleteSavingGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.SAVING_GOALS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting saving goal:', error);
      throw new Error('Failed to delete saving goal');
    }
  }

  static async addSavingGoalProgress(id: string, amount: number): Promise<void> {
    const goals = await this.getSavingGoals();
    const goal = goals.find(g => g.id === id);
    if (goal) {
      await this.updateSavingGoal(id, {
        currentAmount: goal.currentAmount + amount
      });
    }
  }

  // Monthly data helpers
  static async getMonthlyIncomes(month: number, year: number): Promise<Income[]> {
    const incomes = await this.getIncomes();
    return incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === month && incomeDate.getFullYear() === year;
    });
  }

  static async getMonthlyExpenses(month: number, year: number): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });
  }
}