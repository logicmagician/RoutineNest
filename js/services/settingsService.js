/**
 * RoutineNest - Settings Service
 * Phase 2: User settings management
 */

const SettingsService = {
  /**
   * Get all settings
   */
  getSettings() {
    return appState.settings;
  },

  /**
   * Update a setting
   */
  updateSetting(key, value) {
    try {
      if (!(key in appState.settings)) {
        throw new Error(`Unknown setting: ${key}`);
      }

      appState.settings[key] = value;
      Storage.saveSettings(appState.settings);
      console.log(`✅ Setting updated: ${key} = ${value}`);
      
      // Apply changes immediately
      this.applySetting(key, value);
      
      return true;
    } catch (error) {
      console.error('❌ Error updating setting:', error.message);
      return false;
    }
  },

  /**
   * Update multiple settings at once
   */
  updateSettings(updates) {
    try {
      Object.assign(appState.settings, updates);
      Storage.saveSettings(appState.settings);
      console.log(`✅ ${Object.keys(updates).length} settings updated`);
      
      // Apply all changes
      for (const [key, value] of Object.entries(updates)) {
        this.applySetting(key, value);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error updating settings:', error.message);
      return false;
    }
  },

  /**
   * Apply setting change to UI
   */
  applySetting(key, value) {
    switch (key) {
      case 'theme':
        this.applyTheme(value);
        break;
      case 'fontSize':
        this.applyFontSize(value);
        break;
      case 'dailyBudget':
        console.log(`💰 Daily budget updated to: ${appState.settings.budgetCurrency}${value}`);
        break;
      case 'notificationsEnabled':
        console.log(`📬 Notifications ${value ? 'enabled' : 'disabled'}`);
        break;
      case 'budgetCurrency':
        console.log(`💱 Currency changed to: ${value}`);
        break;
      default:
        console.log(`⚙️ Setting applied: ${key}`);
    }
  },

  /**
   * Apply theme to page
   */
  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.style.colorScheme = 'dark';
      appState.isDarkMode = true;
    } else if (theme === 'light') {
      document.documentElement.style.colorScheme = 'light';
      appState.isDarkMode = false;
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.style.colorScheme = prefersDark ? 'dark' : 'light';
      appState.isDarkMode = prefersDark;
    }
    
    console.log(`🎨 Theme applied: ${theme}`);
  },

  /**
   * Apply font size to page
   */
  applyFontSize(size) {
    const body = document.body;
    body.classList.remove('font-small', 'font-large', 'font-xlarge');

    if (size === 0.9) {
      body.classList.add('font-small');
    } else if (size === 1.1) {
      body.classList.add('font-large');
    } else if (size === 1.2) {
      body.classList.add('font-xlarge');
    }

    appState.fontSize = size;
    console.log(`📝 Font size applied: ${(size * 100).toFixed(0)}%`);
  },

  /**
   * Get specific setting
   */
  getSetting(key) {
    return appState.settings[key];
  },

  /**
   * Reset all settings to defaults
   */
  resetSettings() {
    try {
      appState.settings = Storage.getDefaultSettings();
      Storage.saveSettings(appState.settings);
      
      // Apply all defaults
      this.applyTheme(appState.settings.theme);
      this.applyFontSize(appState.settings.fontSize);
      
      console.log('✅ All settings reset to defaults');
      return true;
    } catch (error) {
      console.error('❌ Error resetting settings:', error.message);
      return false;
    }
  },

  /**
   * Check if quiet hours are active
   */
  isInQuietHours() {
    return NotificationService.isInQuietHours();
  },

  /**
   * Get quiet hours as display string
   */
  getQuietHoursDisplay() {
    const start = appState.settings.reminderQuietHoursStart;
    const end = appState.settings.reminderQuietHoursEnd;
    return `${start} - ${end}`;
  },

  /**
   * Check if daily budget is set
   */
  hasBudget() {
    return appState.settings.dailyBudget > 0;
  },

  /**
   * Get budget currency symbol
   */
  getBudgetCurrencySymbol() {
    const symbols = {
      'BDT': '৳',
      'USD': '$',
      'EUR': '€',
      'INR': '₹',
      'PKR': '₨',
      'GBP': '£',
      'JPY': '¥',
    };
    return symbols[appState.settings.budgetCurrency] || appState.settings.budgetCurrency;
  },

  /**
   * Format amount with current currency
   */
  formatAmount(amount) {
    const symbol = this.getBudgetCurrencySymbol();
    return `${symbol}${amount.toFixed(2)}`;
  },

  /**
   * Get all available themes
   */
  getAvailableThemes() {
    return ['light', 'dark', 'system'];
  },

  /**
   * Get all available font sizes
   */
  getAvailableFontSizes() {
    return [
      { value: 0.9, label: 'Small (90%)' },
      { value: 1.0, label: 'Normal (100%)' },
      { value: 1.1, label: 'Large (110%)' },
      { value: 1.2, label: 'Extra Large (120%)' },
    ];
  },

  /**
   * Get all available currencies
   */
  getAvailableCurrencies() {
    return [
      { code: 'BDT', name: 'Bangladeshi Taka' },
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'INR', name: 'Indian Rupee' },
      { code: 'PKR', name: 'Pakistani Rupee' },
      { code: 'GBP', name: 'British Pound' },
      { code: 'JPY', name: 'Japanese Yen' },
    ];
  },

  /**
   * Export settings for backup
   */
  exportSettings() {
    return JSON.parse(JSON.stringify(appState.settings));
  },

  /**
   * Get settings info for debugging
   */
  getInfo() {
    return {
      theme: appState.settings.theme,
      fontSize: `${(appState.settings.fontSize * 100).toFixed(0)}%`,
      dailyBudget: this.formatAmount(appState.settings.dailyBudget),
      currency: appState.settings.budgetCurrency,
      notificationsEnabled: appState.settings.notificationsEnabled,
      quietHours: this.getQuietHoursDisplay(),
      weekStart: appState.settings.weekStart,
    };
  },
};

console.log('✅ SettingsService module loaded');