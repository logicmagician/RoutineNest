/**
 * RoutineNest - Application State Management
 * Phase 2: Simple centralized state object
 * 
 * Single source of truth for app state
 * Services read/write here and to localStorage
 */

const appState = {
  // ===== Current Page =====
  currentPage: 'home',

  // ===== Theme & Display =====
  isDarkMode: false,
  fontSize: 1.0,

  // ===== Tasks =====
  tasks: [],
  selectedTask: null,  // Currently selected/editing task

  // ===== Expenses =====
  expenses: [],
  selectedExpense: null,

  // ===== Meals =====
  meals: [],
  selectedMeal: null,

  // ===== Settings =====
  settings: {
    theme: 'system',
    fontSize: 1.0,
    dayStartHour: 0,
    weekStart: 'monday',
    dailyBudget: 1000,
    budgetCurrency: 'BDT',
    notificationsEnabled: true,
    reminderQuietHoursStart: '22:00',
    reminderQuietHoursEnd: '08:00',
  },

  // ===== UI State =====
  isLoading: false,
  showTaskForm: false,
  showExpenseForm: false,
  showMealForm: false,
  formMode: 'create',  // 'create' or 'edit'

  // ===== Notifications =====
  hasNotificationPermission: false,
  notificationQueue: [],  // Tasks pending notifications

  /**
   * Initialize app state from localStorage
   */
  init() {
    console.log('📊 Initializing app state...');
    
    // Load from localStorage (or use defaults)
    this.tasks = Storage.getTasks();
    this.expenses = Storage.getExpenses();
    this.meals = Storage.getMeals();
    this.settings = Storage.getSettings();

    console.log(`✅ State initialized: ${this.tasks.length} tasks, ${this.expenses.length} expenses`);
  },

  /**
   * Get tasks for today
   */
  getTodaysTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => t.scheduledDate === today);
  },

  /**
   * Get next task (soonest by time)
   */
  getNextTask() {
    const todaysTasks = this.getTodaysTasks()
      .filter(t => ['pending', 'in_progress'].includes(t.status))
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    
    return todaysTasks[0] || null;
  },

  /**
   * Get tasks by status
   */
  getTasksByStatus(status) {
    return this.tasks.filter(t => t.status === status);
  },

  /**
   * Get completed count for today
   */
  getTodaysCompletedCount() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => 
      t.scheduledDate === today && t.status === 'completed'
    ).length;
  },

  /**
   * Get pending count for today
   */
  getTodaysPendingCount() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(t => 
      t.scheduledDate === today && ['pending', 'in_progress'].includes(t.status)
    ).length;
  },

  /**
   * Get expenses for today
   */
  getTodaysExpenses() {
    const today = new Date().toISOString().split('T')[0];
    return this.expenses.filter(e => e.date === today);
  },

  /**
   * Get today's spending total
   */
  getTodaysSpendingTotal() {
    return this.getTodaysExpenses().reduce((sum, e) => sum + e.amount, 0);
  },

  /**
   * Check if task is overdue
   */
  isTaskOverdue(task) {
    const taskDateTime = new Date(`${task.scheduledDate}T${task.scheduledTime}`);
    return taskDateTime < new Date() && !['completed', 'skipped'].includes(task.status);
  },

  /**
   * Serialize state for debugging
   */
  serialize() {
    return JSON.stringify({
      currentPage: this.currentPage,
      taskCount: this.tasks.length,
      expenseCount: this.expenses.length,
      todaysPending: this.getTodaysPendingCount(),
      todaysSpent: this.getTodaysSpendingTotal(),
      settings: this.settings,
    }, null, 2);
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = appState;
}

console.log('✅ State module loaded');