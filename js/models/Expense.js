/**
 * RoutineNest - Expense Model
 * Phase 2: Expense class definition
 */

class Expense {
  constructor({
    id = null,
    date = null,
    amount = 0,
    currency = 'BDT',
    mealCategory = 'snack',  // breakfast, lunch, dinner, snack
    description = '',
    notes = '',
    createdAt = null,
  } = {}) {
    this.id = id || Date.now().toString();
    this.date = date || new Date().toISOString().split('T')[0];
    this.amount = parseFloat(amount) || 0;
    this.currency = currency;
    this.mealCategory = mealCategory;
    this.description = description;
    this.notes = notes;
    this.createdAt = createdAt || new Date().toISOString();
  }

  /**
   * Get category emoji
   */
  getCategoryEmoji() {
    const emojis = {
      breakfast: '🌅',
      lunch: '🍽️',
      dinner: '🌙',
      snack: '🍪',
    };
    return emojis[this.mealCategory] || '💰';
  }

  /**
   * Get category label
   */
  getCategoryLabel() {
    const labels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
    };
    return labels[this.mealCategory] || 'Other';
  }

  /**
   * Format amount with currency
   */
  getFormattedAmount() {
    const symbols = {
      'BDT': '৳',
      'USD': '$',
      'EUR': '€',
      'INR': '₹',
      'PKR': '₨',
      'GBP': '£',
      'JPY': '¥',
    };
    const symbol = symbols[this.currency] || this.currency;
    return `${symbol}${this.amount.toFixed(2)}`;
  }

  /**
   * Get day of week for display
   */
  getDayOfWeek() {
    const date = new Date(`${this.date}T00:00:00`);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }

  /**
   * Check if expense is today
   */
  isToday() {
    const today = new Date().toISOString().split('T')[0];
    return this.date === today;
  }

  /**
   * Check if expense is this week
   */
  isThisWeek() {
    const expenseDate = new Date(`${this.date}T00:00:00`);
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return expenseDate >= weekStart && expenseDate <= weekEnd;
  }

  /**
   * Check if expense is this month
   */
  isThisMonth() {
    const today = new Date();
    const expenseDate = new Date(`${this.date}T00:00:00`);

    return expenseDate.getMonth() === today.getMonth() &&
           expenseDate.getFullYear() === today.getFullYear();
  }

  /**
   * Serialize to JSON
   */
  toJSON() {
    return {
      id: this.id,
      date: this.date,
      amount: this.amount,
      currency: this.currency,
      mealCategory: this.mealCategory,
      description: this.description,
      notes: this.notes,
      createdAt: this.createdAt,
    };
  }

  /**
   * Create Expense from JSON
   */
  static fromJSON(json) {
    return new Expense(json);
  }

  /**
   * Get display summary
   */
  toString() {
    return `${this.getCategoryEmoji()} ${this.description} - ${this.getFormattedAmount()}`;
  }
}

console.log('✅ Expense model loaded');