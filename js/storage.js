/**
 * RoutineNest - Storage Layer
 * Phase 2: localStorage wrapper with error handling
 * 
 * All persistence goes through this module
 * Handles JSON serialization/deserialization
 */

const Storage = {
  // ===== Storage Keys =====
  KEYS: {
    TASKS: 'routineNest_tasks',
    EXPENSES: 'routineNest_expenses',
    MEALS: 'routineNest_meals',
    SETTINGS: 'routineNest_settings',
    COMPLETION_RECORDS: 'routineNest_completionRecords',
    THEME: 'routineNest_theme',
    FONT_SIZE: 'routineNest_fontSize',
  },

  /**
   * Check if localStorage is available
   */
  isAvailable() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.error('❌ localStorage not available:', e.message);
      return false;
    }
  },

  /**
   * Get available storage space (approximate)
   */
  getAvailableSpace() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return {
      used: total,
      limit: 10485760,  // 10 MB
      remaining: 10485760 - total,
      percentage: Math.round((total / 10485760) * 100),
    };
  },

  // ===== Task Storage =====

  getTasks() {
    try {
      const json = localStorage.getItem(this.KEYS.TASKS);
      if (!json) {
        console.log('📋 No tasks found in storage');
        return [];
      }
      const tasks = JSON.parse(json);
      console.log(`✅ Loaded ${tasks.length} tasks from storage`);
      return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
      console.error('❌ Error loading tasks:', error.message);
      return [];
    }
  },

  saveTasks(tasks) {
    try {
      if (!Array.isArray(tasks)) {
        throw new Error('Tasks must be an array');
      }
      localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
      console.log(`✅ Saved ${tasks.length} tasks to storage`);
      return true;
    } catch (error) {
      console.error('❌ Error saving tasks:', error.message);
      return false;
    }
  },

  // ===== Expense Storage =====

  getExpenses() {
    try {
      const json = localStorage.getItem(this.KEYS.EXPENSES);
      if (!json) {
        console.log('💰 No expenses found in storage');
        return [];
      }
      const expenses = JSON.parse(json);
      console.log(`✅ Loaded ${expenses.length} expenses from storage`);
      return Array.isArray(expenses) ? expenses : [];
    } catch (error) {
      console.error('❌ Error loading expenses:', error.message);
      return [];
    }
  },

  saveExpenses(expenses) {
    try {
      if (!Array.isArray(expenses)) {
        throw new Error('Expenses must be an array');
      }
      localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify(expenses));
      console.log(`✅ Saved ${expenses.length} expenses to storage`);
      return true;
    } catch (error) {
      console.error('❌ Error saving expenses:', error.message);
      return false;
    }
  },

  // ===== Meal Storage =====

  getMeals() {
    try {
      const json = localStorage.getItem(this.KEYS.MEALS);
      if (!json) {
        console.log('🍽️ No meals found in storage');
        return [];
      }
      const meals = JSON.parse(json);
      console.log(`✅ Loaded ${meals.length} meals from storage`);
      return Array.isArray(meals) ? meals : [];
    } catch (error) {
      console.error('❌ Error loading meals:', error.message);
      return [];
    }
  },

  saveMeals(meals) {
    try {
      if (!Array.isArray(meals)) {
        throw new Error('Meals must be an array');
      }
      localStorage.setItem(this.KEYS.MEALS, JSON.stringify(meals));
      console.log(`✅ Saved ${meals.length} meals to storage`);
      return true;
    } catch (error) {
      console.error('❌ Error saving meals:', error.message);
      return false;
    }
  },

  // ===== Settings Storage =====

  getSettings() {
    try {
      const json = localStorage.getItem(this.KEYS.SETTINGS);
      if (!json) {
        console.log('⚙️ No settings found, using defaults');
        return this.getDefaultSettings();
      }
      const settings = JSON.parse(json);
      console.log('✅ Loaded settings from storage');
      return settings;
    } catch (error) {
      console.error('❌ Error loading settings:', error.message);
      return this.getDefaultSettings();
    }
  },

  saveSettings(settings) {
    try {
      if (typeof settings !== 'object' || settings === null) {
        throw new Error('Settings must be an object');
      }
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
      console.log('✅ Saved settings to storage');
      return true;
    } catch (error) {
      console.error('❌ Error saving settings:', error.message);
      return false;
    }
  },

  getDefaultSettings() {
    return {
      theme: 'system',
      fontSize: 1.0,
      dayStartHour: 0,
      weekStart: 'monday',
      dailyBudget: 1000,
      budgetCurrency: 'BDT',
      notificationsEnabled: true,
      reminderQuietHoursStart: '22:00',
      reminderQuietHoursEnd: '08:00',
    };
  },

  // ===== Completion Records =====

  getCompletionRecords() {
    try {
      const json = localStorage.getItem(this.KEYS.COMPLETION_RECORDS);
      if (!json) {
        console.log('📝 No completion records found');
        return [];
      }
      const records = JSON.parse(json);
      console.log(`✅ Loaded ${records.length} completion records`);
      return Array.isArray(records) ? records : [];
    } catch (error) {
      console.error('❌ Error loading completion records:', error.message);
      return [];
    }
  },

  saveCompletionRecords(records) {
    try {
      if (!Array.isArray(records)) {
        throw new Error('Records must be an array');
      }
      localStorage.setItem(this.KEYS.COMPLETION_RECORDS, JSON.stringify(records));
      console.log(`✅ Saved ${records.length} completion records`);
      return true;
    } catch (error) {
      console.error('❌ Error saving completion records:', error.message);
      return false;
    }
  },

  // ===== Theme & Display (Legacy - now in settings) =====

  getTheme() {
    return localStorage.getItem(this.KEYS.THEME) || 'light';
  },

  saveTheme(theme) {
    try {
      localStorage.setItem(this.KEYS.THEME, theme);
      return true;
    } catch (error) {
      console.error('❌ Error saving theme:', error.message);
      return false;
    }
  },

  getFontSize() {
    const size = localStorage.getItem(this.KEYS.FONT_SIZE);
    return size ? parseFloat(size) : 1.0;
  },

  saveFontSize(size) {
    try {
      localStorage.setItem(this.KEYS.FONT_SIZE, size.toString());
      return true;
    } catch (error) {
      console.error('❌ Error saving font size:', error.message);
      return false;
    }
  },

  // ===== Backup & Restore =====

  /**
   * Export all data as JSON object
   */
  exportAllData() {
    try {
      const backup = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        exportedFrom: 'RoutineNest',
        data: {
          tasks: this.getTasks(),
          expenses: this.getExpenses(),
          meals: this.getMeals(),
          settings: this.getSettings(),
          completionRecords: this.getCompletionRecords(),
        },
      };
      console.log('✅ Data exported successfully');
      return backup;
    } catch (error) {
      console.error('❌ Error exporting data:', error.message);
      return null;
    }
  },

  /**
   * Import all data from JSON object
   */
  importAllData(backup) {
    try {
      // Validate
      if (!backup || !backup.data) {
        throw new Error('Invalid backup format');
      }

      if (backup.version !== '1.0') {
        throw new Error('Unsupported backup version');
      }

      // Import
      if (backup.data.tasks) this.saveTasks(backup.data.tasks);
      if (backup.data.expenses) this.saveExpenses(backup.data.expenses);
      if (backup.data.meals) this.saveMeals(backup.data.meals);
      if (backup.data.settings) this.saveSettings(backup.data.settings);
      if (backup.data.completionRecords) {
        this.saveCompletionRecords(backup.data.completionRecords);
      }

      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error.message);
      return false;
    }
  },

  // ===== Clear All Data =====

  clearAllData() {
    try {
      localStorage.removeItem(this.KEYS.TASKS);
      localStorage.removeItem(this.KEYS.EXPENSES);
      localStorage.removeItem(this.KEYS.MEALS);
      localStorage.removeItem(this.KEYS.SETTINGS);
      localStorage.removeItem(this.KEYS.COMPLETION_RECORDS);
      console.log('🗑️ All data cleared from storage');
      return true;
    } catch (error) {
      console.error('❌ Error clearing data:', error.message);
      return false;
    }
  },

  // ===== Debug & Info =====

  getStorageInfo() {
    const space = this.getAvailableSpace();
    return {
      available: this.isAvailable(),
      tasks: this.getTasks().length,
      expenses: this.getExpenses().length,
      meals: this.getMeals().length,
      space: space,
    };
  },

  logStorageInfo() {
    const info = this.getStorageInfo();
    console.log('📊 Storage Info:', {
      available: info.available,
      tasks: info.tasks,
      expenses: info.expenses,
      meals: info.meals,
      used: `${(info.space.used / 1024).toFixed(2)} KB / ${(info.space.limit / 1024 / 1024).toFixed(0)} MB`,
      percentage: `${info.space.percentage}% full`,
    });
  },
};

// Check availability on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log(`${Storage.isAvailable() ? '✅' : '❌'} Storage module initialized`);
  });
} else {
  console.log(`${Storage.isAvailable() ? '✅' : '❌'} Storage module initialized`);
}