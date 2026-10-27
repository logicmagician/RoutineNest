/**
 * RoutineNest - Meal Model
 * Phase 2: Meal class definition (placeholder)
 */

class Meal {
  constructor({
    id = null,
    name = '',
    category = 'snack',  // breakfast, lunch, dinner, snack
    estimatedCost = 0,
    currency = 'BDT',
    description = '',
    isFavorite = false,
    createdAt = null,
  } = {}) {
    this.id = id || Date.now().toString();
    this.name = name;
    this.category = category;
    this.estimatedCost = parseFloat(estimatedCost) || 0;
    this.currency = currency;
    this.description = description;
    this.isFavorite = isFavorite;
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
    return emojis[this.category] || '🍴';
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
    return labels[this.category] || 'Other';
  }

  /**
   * Format cost with currency
   */
  getFormattedCost() {
    const symbols = {
      'BDT': '৳',
      'USD': '$',
      'EUR': '€',
      'INR': '₹',
      'PKR': '₨',
    };
    const symbol = symbols[this.currency] || this.currency;
    return `${symbol}${this.estimatedCost.toFixed(2)}`;
  }

  /**
   * Toggle favorite
   */
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  /**
   * Serialize to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      estimatedCost: this.estimatedCost,
      currency: this.currency,
      description: this.description,
      isFavorite: this.isFavorite,
      createdAt: this.createdAt,
    };
  }

  /**
   * Create Meal from JSON
   */
  static fromJSON(json) {
    return new Meal(json);
  }

  /**
   * Get display summary
   */
  toString() {
    const heart = this.isFavorite ? '❤️' : '🤍';
    return `${this.getCategoryEmoji()} ${this.name} - ${this.getFormattedCost()} ${heart}`;
  }
}

console.log('✅ Meal model loaded');