/**
 * RoutineNest - Expense Service
 * Phase 2: Expense CRUD and budget calculations
 * 
 * Handles all expense operations:
 * - Create, Read, Update, Delete
 * - Budget tracking and calculations
 * - Filtering and sorting
 */

const ExpenseService = {
  /**
   * Create a new expense
   */
  createExpense(expenseData) {
    try {
      const expense = new Expense(expenseData);
      appState.expenses.push(expense);
      Storage.saveExpenses(appState.expenses);
      console.log(`✅ Expense recorded: ${expense.toString()}`);
      return expense;
    } catch (error) {
      console.error('❌ Error creating expense:', error.message);
      return null;
    }
  },

  /**
   * Get expense by ID
   */
  getExpenseById(id) {
    return appState.expenses.find(e => e.id === id) || null;
  },

  /**
   * Get all expenses
   */
  getAllExpenses() {
    return appState.expenses;
  },

  /**
   * Get expenses for a specific date
   */
  getExpensesByDate(date) {
    return appState.expenses.filter(e => e.date === date);
  },

  /**
   * Get today's expenses
   */
  getTodaysExpenses() {
    return appState.getTodaysExpenses();
  },

  /**
   * Get expenses by category
   */
  getExpensesByCategory(category) {
    return appState.expenses.filter(e => e.mealCategory === category);
  },

  /**
   * Get expenses for a date range
   */
  getExpensesByDateRange(startDate, endDate) {
    return appState.expenses.filter(e => 
      e.date >= startDate && e.date <= endDate
    );
  },

  /**
   * Get this week's expenses
   */
  getWeekExpenses() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    return this.getExpensesByDateRange(weekStartStr, weekEndStr);
  },

  /**
   * Get this month's expenses
   */
  getMonthExpenses() {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartStr = monthStart.toISOString().split('T')[0];

    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const monthEndStr = monthEnd.toISOString().split('T')[0];

    return this.getExpensesByDateRange(monthStartStr, monthEndStr);
  },

  /**
   * Update an expense
   */
  updateExpense(id, updates) {
    try {
      const expense = this.getExpenseById(id);
      if (!expense) {
        throw new Error('Expense not found');
      }

      Object.assign(expense, updates);
      Storage.saveExpenses(appState.expenses);
      console.log(`✅ Expense updated: ${expense.toString()}`);
      return expense;
    } catch (error) {
      console.error('❌ Error updating expense:', error.message);
      return null;
    }
  },

  /**
   * Delete an expense
   */
  deleteExpense(id) {
    try {
      const index = appState.expenses.findIndex(e => e.id === id);
      if (index === -1) {
        throw new Error('Expense not found');
      }

      const expense = appState.expenses[index];
      appState.expenses.splice(index, 1);
      Storage.saveExpenses(appState.expenses);
      console.log(`✅ Expense deleted: ${expense.toString()}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting expense:', error.message);
      return false;
    }
  },

  /**
   * Calculate total spending for today
   */
  getTodaysTotal() {
    return this.getTodaysExpenses().reduce((sum, e) => sum + e.amount, 0);
  },

  /**
   * Calculate total spending for this week
   */
  getWeekTotal() {
    return this.getWeekExpenses().reduce((sum, e) => sum + e.amount, 0);
  },

  /**
   * Calculate total spending for this month
   */
  getMonthTotal() {
    return this.getMonthExpenses().reduce((sum, e) => sum + e.amount, 0);
  },

  /**
   * Get today's budget remaining
   */
  getTodaysBudgetRemaining() {
    const budget = appState.settings.dailyBudget;
    const spent = this.getTodaysTotal();
    return Math.max(0, budget - spent);
  },

  /**
   * Get today's budget percentage used
   */
  getTodaysBudgetPercentage() {
    const budget = appState.settings.dailyBudget;
    if (budget === 0) return 0;

    const spent = this.getTodaysTotal();
    return Math.round((spent / budget) * 100);
  },

  /**
   * Check if over budget for today
   */
  isOverBudgetToday() {
    return this.getTodaysTotal() > appState.settings.dailyBudget;
  },

  /**
   * Get week's budget percentage used
   */
  getWeekBudgetPercentage() {
    const dailyBudget = appState.settings.dailyBudget;
    const weeklyBudget = dailyBudget * 7;
    if (weeklyBudget === 0) return 0;

    const spent = this.getWeekTotal();
    return Math.round((spent / weeklyBudget) * 100);
  },

  /**
   * Get month's budget percentage used
   */
  getMonthBudgetPercentage() {
    const dailyBudget = appState.settings.dailyBudget;
    const monthlyBudget = dailyBudget * 30;
    if (monthlyBudget === 0) return 0;

    const spent = this.getMonthTotal();
    return Math.round((spent / monthlyBudget) * 100);
  },

  /**
   * Get spending by category (today)
   */
  getTodaysSpendingByCategory() {
    const expenses = this.getTodaysExpenses();
    const categories = {};

    expenses.forEach(e => {
      if (!categories[e.mealCategory]) {
        categories[e.mealCategory] = 0;
      }
      categories[e.mealCategory] += e.amount;
    });

    return categories;
  },

  /**
   * Get average daily spending this week
   */
  getWeekAverageDailySpending() {
    const weekTotal = this.getWeekTotal();
    const daysWithExpenses = new Set(this.getWeekExpenses().map(e => e.date)).size;
    
    if (daysWithExpenses === 0) return 0;
    return Math.round((weekTotal / daysWithExpenses) * 100) / 100;
  },

  /**
   * Get average daily spending this month
   */
  getMonthAverageDailySpending() {
    const monthTotal = this.getMonthTotal();
    const daysWithExpenses = new Set(this.getMonthExpenses().map(e => e.date)).size;

    if (daysWithExpenses === 0) return 0;
    return Math.round((monthTotal / daysWithExpenses) * 100) / 100;
  },

  /**
   * Get expense statistics
   */
  getExpenseStats() {
    const todaysTotal = this.getTodaysTotal();
    const weekTotal = this.getWeekTotal();
    const monthTotal = this.getMonthTotal();
    const dailyBudget = appState.settings.dailyBudget;

    return {
      today: {
        total: todaysTotal,
        budget: dailyBudget,
        remaining: Math.max(0, dailyBudget - todaysTotal),
        percentage: this.getTodaysBudgetPercentage(),
        overBudget: this.isOverBudgetToday(),
      },
      week: {
        total: weekTotal,
        budget: dailyBudget * 7,
        percentage: this.getWeekBudgetPercentage(),
        average: this.getWeekAverageDailySpending(),
      },
      month: {
        total: monthTotal,
        budget: dailyBudget * 30,
        percentage: this.getMonthBudgetPercentage(),
        average: this.getMonthAverageDailySpending(),
      },
    };
  },

  /**
   * Get most expensive category (today)
   */
  getMostExpensiveCategory() {
    const byCategory = this.getTodaysSpendingByCategory();
    if (Object.keys(byCategory).length === 0) return null;

    let maxCategory = null;
    let maxAmount = 0;

    for (const [category, amount] of Object.entries(byCategory)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxCategory = category;
      }
    }

    return { category: maxCategory, amount: maxAmount };
  },

  /**
   * Validate expense data
   */
  validateExpense(expenseData) {
    const errors = [];

    if (!expenseData.description || expenseData.description.trim() === '') {
      errors.push('Description is required');
    }

    if (expenseData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!expenseData.date) {
      errors.push('Date is required');
    }

    if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(expenseData.mealCategory)) {
      errors.push('Invalid meal category');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  },

  /**
   * Get trending (most common) meal category
   */
  getTrendingCategory() {
    const weekExpenses = this.getWeekExpenses();
    const categories = {};

    weekExpenses.forEach(e => {
      categories[e.mealCategory] = (categories[e.mealCategory] || 0) + 1;
    });

    let trendingCategory = null;
    let maxCount = 0;

    for (const [category, count] of Object.entries(categories)) {
      if (count > maxCount) {
        maxCount = count;
        trendingCategory = category;
      }
    }

    return trendingCategory;
  },

  /**
   * Get budget warning level (0-100 for color coding)
   */
  getBudgetWarningLevel() {
    const percentage = this.getTodaysBudgetPercentage();
    if (percentage < 50) return 'safe';      // Green
    if (percentage < 80) return 'warning';   // Yellow
    if (percentage < 100) return 'caution';  // Orange
    return 'danger';                          // Red
  },
};

console.log('✅ ExpenseService module loaded');