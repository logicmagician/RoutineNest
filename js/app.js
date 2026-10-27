/**
 * RoutineNest - Main App
 * Phase 2: Full application with data layer
 * 
 * Initialization, routing, and app state management
 */

// ===== Router (Page Navigation) with UIRenderer =====
const router = {
  show(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
      page.hidden = true;
    });

    // Deactivate all nav buttons
    document.querySelectorAll('.nav-button').forEach(btn => {
      btn.classList.remove('active');
    });

    // Show selected page
    const pageElement = document.getElementById(`page-${pageName}`);
    if (pageElement) {
      pageElement.classList.add('active');
      pageElement.hidden = false;
    }

    // Activate nav button
    const navButton = document.getElementById(`nav-${pageName}`);
    if (navButton) {
      navButton.classList.add('active');
    }

    // Update state
    appState.currentPage = pageName;

    // Render page content with real data
    switch(pageName) {
      case 'home':
        UIRenderer.renderHome();
        break;
      case 'routine':
        UIRenderer.renderDailyRoutine();
        break;
      case 'budget':
        UIRenderer.renderFoodBudget();
        break;
      case 'progress':
        UIRenderer.renderProgress();
        break;
      case 'settings':
        UIRenderer.renderSettings();
        break;
    }

    // Scroll to top
    window.scrollTo(0, 0);

    console.log(`📍 Navigated to: ${pageName}`);
  }
};

// ===== Theme Management =====
const themeManager = {
  init() {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('routineNest_theme');
    
    if (savedTheme === 'dark' || (prefersDark && !savedTheme)) {
      this.enable();
      document.getElementById('theme-toggle').checked = true;
    } else {
      this.disable();
      document.getElementById('theme-toggle').checked = false;
    }

    // Listen for theme toggle
    document.getElementById('theme-toggle').addEventListener('change', (e) => {
      if (e.target.checked) {
        this.enable();
      } else {
        this.disable();
      }
    });

    console.log('🎨 Theme manager initialized');
  },

  enable() {
    document.documentElement.style.colorScheme = 'dark';
    appState.isDarkMode = true;
    localStorage.setItem('routineNest_theme', 'dark');
    console.log('🌙 Dark mode enabled');
  },

  disable() {
    document.documentElement.style.colorScheme = 'light';
    appState.isDarkMode = false;
    localStorage.setItem('routineNest_theme', 'light');
    console.log('☀️ Light mode enabled');
  }
};

// ===== Font Size Management =====
const fontSizeManager = {
  init() {
    const savedFontSize = localStorage.getItem('routineNest_fontSize') || '1';
    this.set(savedFontSize);

    document.getElementById('font-size').addEventListener('change', (e) => {
      this.set(e.target.value);
    });

    console.log('📝 Font size manager initialized');
  },

  set(scale) {
    scale = parseFloat(scale);
    appState.fontSize = scale;
    localStorage.setItem('routineNest_fontSize', scale);

    // Apply font scale
    const body = document.body;
    body.classList.remove('font-small', 'font-large', 'font-xlarge');

    if (scale === 0.9) {
      body.classList.add('font-small');
    } else if (scale === 1.1) {
      body.classList.add('font-large');
    } else if (scale === 1.2) {
      body.classList.add('font-xlarge');
    }

    document.getElementById('font-size').value = scale;
    console.log(`📝 Font size set to: ${(scale * 100).toFixed(0)}%`);
  }
};

// ===== Navigation Setup =====
function setupNavigation() {
  document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', () => {
      const pageName = button.dataset.page;
      router.show(pageName);
    });
  });

  console.log('🧭 Navigation initialized');
}

// ===== Data Management Functions =====

/**
 * Export all data as JSON backup
 */
function exportData() {
  const backup = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    exportedFrom: 'RoutineNest',
    appState: appState,
    data: {
      sampleTasks: [
        { id: 1, title: 'Morning run', time: '6:00 AM', duration: 30 },
        { id: 2, title: 'Breakfast', time: '7:00 AM', duration: 30 },
      ],
      sampleExpenses: [
        { id: 1, date: new Date().toISOString().split('T')[0], amount: 250, category: 'Breakfast' },
        { id: 2, date: new Date().toISOString().split('T')[0], amount: 350, category: 'Lunch' },
      ]
    }
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `routineNest_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert('✅ Backup exported successfully!');
  console.log('📥 Data exported as JSON');
}

/**
 * Import data from JSON backup
 */
function importData(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const backup = JSON.parse(e.target.result);

      // Validate
      if (backup.version !== '1.0') {
        throw new Error('Unsupported backup version');
      }

      // Ask for confirmation
      const confirmed = confirm('⚠️ This will replace all your data. Are you sure?');
      if (!confirmed) {
        console.log('Import cancelled by user');
        return;
      }

      // Restore (for Phase 1, just show success)
      alert('✅ Backup imported successfully!');
      console.log('📤 Data imported from JSON');
      console.log('Backup contents:', backup);
    } catch (error) {
      alert(`❌ Error importing backup: ${error.message}`);
      console.error('Import error:', error);
    }
  };

  reader.onerror = () => {
    alert('❌ Error reading file');
  };

  reader.readAsText(file);
}

/**
 * Delete all data with confirmation
 */
function deleteAllData() {
  const confirmed = confirm('⚠️ WARNING: This will DELETE ALL your data. This cannot be undone. Are you really sure?');
  if (!confirmed) {
    console.log('Data deletion cancelled');
    return;
  }

  const doubleConfirmed = confirm('Type "DELETE" to confirm permanent deletion.\nActually, for now just click OK to confirm this demo.');
  if (doubleConfirmed) {
    // In Phase 2+, this will actually delete data
    alert('✅ All data would be deleted.\n\n(Phase 1: Demo mode - actual deletion in Phase 2)');
    console.log('All data deleted (demo)');
  }
}

// ===== Update Today's Date =====
function updateTodayDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = today.toLocaleDateString('en-US', options);
  
  const dateElements = document.querySelectorAll('#today-date');
  dateElements.forEach(el => {
    el.textContent = dateString;
  });
}

// ===== Update Home Page with Real Data =====
function updateHomePageData() {
  try {
    // Next task
    const nextTask = appState.getNextTask();
    if (nextTask) {
      document.getElementById('next-task-title').textContent = nextTask.title;
      document.getElementById('next-task-time').textContent = nextTask.scheduledTime;
      document.getElementById('next-task-duration').textContent = nextTask.getDisplayDuration();
    }

    // Pending tasks count
    const pendingCount = appState.getTodaysPendingCount();
    document.querySelectorAll('[data-stat="pending-count"]').forEach(el => {
      el.textContent = pendingCount;
    });

    // Completed count
    const completedCount = appState.getTodaysCompletedCount();
    document.querySelectorAll('[data-stat="completed-count"]').forEach(el => {
      el.textContent = completedCount;
    });

    // Budget info
    const spentToday = ExpenseService.getTodaysTotal();
    const budget = appState.settings.dailyBudget;
    const percentage = ExpenseService.getTodaysBudgetPercentage();
    
    document.querySelectorAll('[data-stat="spent-today"]').forEach(el => {
      el.textContent = SettingsService.formatAmount(spentToday);
    });
    document.querySelectorAll('[data-stat="budget-limit"]').forEach(el => {
      el.textContent = SettingsService.formatAmount(budget);
    });
    document.querySelectorAll('[data-stat="budget-percentage"]').forEach(el => {
      el.textContent = `${percentage}%`;
    });

    // Update budget bar
    const budgetBars = document.querySelectorAll('[data-stat="budget-bar"]');
    budgetBars.forEach(bar => {
      if (bar.querySelector('.budget-progress')) {
        bar.querySelector('.budget-progress').style.width = `${Math.min(100, percentage)}%`;
      }
    });

    console.log('✅ Home page data updated');
  } catch (error) {
    console.error('⚠️ Error updating home page data:', error.message);
  }
}

// ===== File Import Handler =====
function setupFileImport() {
  const importInput = document.getElementById('import-file');
  importInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      importData(e.target.files[0]);
      // Reset input
      e.target.value = '';
    }
  });
}

// ===== Main App Object =====
const app = {
  applyTheme(theme) {
    if (theme === 'dark') {
      themeManager.enable();
    } else if (theme === 'light') {
      themeManager.disable();
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        themeManager.enable();
      } else {
        themeManager.disable();
      }
    }
  },

  applyFontSize(size) {
    fontSizeManager.set(size / 100);
  }
};

// ===== Initialize App =====
function initApp() {
  console.log('🚀 RoutineNest Phase 3 Initializing...');

  // Check browser support
  const support = {
    localStorage: typeof Storage !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    notifications: 'Notification' in window,
    fetch: typeof fetch !== 'undefined',
  };

  console.log('📱 Browser Support:', support);

  // Initialize app state from localStorage
  if (!appState.tasks) {
    appState.init();
  }

  // Initialize services
  themeManager.init();
  fontSizeManager.init();
  setupNavigation();
  setupFileImport();
  updateTodayDate();

  // Request notification permission
  if (NotificationService.isSupported() && appState.settings.notificationsEnabled) {
    NotificationService.requestPermission().catch(err => {
      console.log('Notification permission request (optional):', err.message);
    });
  }

  // Show home page and render with real data
  router.show('home');

  // Register service worker (Phase 6)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => {
        console.log('✅ Service Worker registered');
      })
      .catch(err => {
        console.log('Service Worker registration (Phase 6):', err);
      });
  }

  console.log('✅ Phase 3 initialized successfully!');
  console.log(`📊 Loaded: ${appState.tasks.length} tasks, ${appState.expenses.length} expenses`);
  console.log('📖 Documentation: See README.md');
}

// ===== Start App on Load =====
document.addEventListener('DOMContentLoaded', initApp);

// Fallback if DOMContentLoaded already fired
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ===== Keyboard Shortcuts (Bonus) =====
document.addEventListener('keydown', (e) => {
  // Alt + H: Home
  if (e.altKey && e.key === 'h') {
    router.show('home');
    e.preventDefault();
  }
  // Alt + R: Routine
  if (e.altKey && e.key === 'r') {
    router.show('routine');
    e.preventDefault();
  }
  // Alt + B: Budget
  if (e.altKey && e.key === 'b') {
    router.show('budget');
    e.preventDefault();
  }
  // Alt + P: Progress
  if (e.altKey && e.key === 'p') {
    router.show('progress');
    e.preventDefault();
  }
  // Alt + S: Settings
  if (e.altKey && e.key === 's') {
    router.show('settings');
    e.preventDefault();
  }
});

console.log('⌨️ Keyboard shortcuts: Alt+H, Alt+R, Alt+B, Alt+P, Alt+S');