/**
 * RoutineNest - UI Renderer
 * Phase 3: Renders real data from appState to all pages
 */

const UIRenderer = {
  /**
   * Render home page
   */
  renderHome() {
    try {
      const page = document.getElementById('page-home');
      if (!page) return;

      const stats = {
        todayCompleted: appState.getTodaysCompletedCount(),
        todayPending: appState.getTodaysPendingCount(),
        todayExpenses: appState.getTodaysExpenses().length,
        spendingTotal: appState.getTodaysSpendingTotal(),
        budgetRemaining: ExpenseService.getTodaysBudgetRemaining(),
        budgetPercentage: ExpenseService.getTodaysBudgetPercentage(),
      };

      const nextTask = appState.getNextTask();
      const nextTaskHtml = nextTask
        ? `
          <div class="card">
            <div class="card-header">
              <h3>⏰ Next Task</h3>
            </div>
            <div class="card-body">
              <div class="task-preview">
                <div class="task-title">${nextTask.title}</div>
                <div class="task-meta">
                  <span class="badge badge-${nextTask.priority}">${nextTask.priority}</span>
                  <span class="time">${nextTask.scheduledTime}</span>
                </div>
                <div class="task-category">${nextTask.category}</div>
              </div>
            </div>
          </div>
        `
        : '<div class="card"><p>✨ No tasks for today!</p></div>';

      const currencySymbol = SettingsService.getBudgetCurrencySymbol();
      const budgetStatus = ExpenseService.getBudgetWarningLevel();
      const budgetStatusColor = {
        safe: 'safe',
        warning: 'warning',
        caution: 'caution',
        danger: 'danger',
      }[budgetStatus] || 'safe';

      const budgetHtml = `
        <div class="card">
          <div class="card-header">
            <h3>💰 Daily Budget</h3>
          </div>
          <div class="card-body">
            <div class="budget-summary">
              <div class="budget-amount">
                <span class="label">Spent</span>
                <span class="value">${currencySymbol}${stats.spendingTotal.toFixed(2)}</span>
              </div>
              <div class="budget-bar">
                <div class="progress" style="width: ${Math.min(stats.budgetPercentage, 100)}%;" class="budget-${budgetStatusColor}"></div>
              </div>
              <div class="budget-info">
                <span>${currencySymbol}${stats.budgetRemaining.toFixed(2)} remaining</span>
                <span>${stats.budgetPercentage.toFixed(0)}% used</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const statsHtml = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${stats.todayCompleted}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.todayPending}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.todayExpenses}</div>
            <div class="stat-label">Expenses</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.budgetPercentage.toFixed(0)}%</div>
            <div class="stat-label">Budget Used</div>
          </div>
        </div>
      `;

      page.innerHTML = `
        <div class="page-header">
          <h1>🏠 Home</h1>
          <p>Today's Overview</p>
        </div>
        
        <div class="page-content">
          ${statsHtml}
          ${nextTaskHtml}
          ${budgetHtml}
        </div>
      `;

      console.log('✅ Home page rendered');
    } catch (error) {
      console.error('❌ Error rendering home:', error.message);
    }
  },

  /**
   * Render Daily Routine page
   */
  renderDailyRoutine() {
    try {
      const page = document.getElementById('page-routine');
      if (!page) return;

      const tasks = appState.getTodaysTasks();
      const groupedTasks = appState.getTodaysTasks().reduce((acc, task) => {
        const hour = parseInt(task.scheduledTime.split(':')[0]);
        let timeBlock;

        if (hour < 12) timeBlock = 'morning';
        else if (hour < 17) timeBlock = 'afternoon';
        else if (hour < 21) timeBlock = 'evening';
        else timeBlock = 'night';

        if (!acc[timeBlock]) acc[timeBlock] = [];
        acc[timeBlock].push(task);
        return acc;
      }, {});

      const timeBlocks = ['morning', 'afternoon', 'evening', 'night'];
      const timeBlockLabels = {
        morning: '🌅 Morning',
        afternoon: '☀️ Afternoon',
        evening: '🌙 Evening',
        night: '🌃 Night',
      };

      const tasksHtml = timeBlocks
        .map(block => {
          const blockTasks = groupedTasks[block] || [];
          if (blockTasks.length === 0) return '';

          return `
            <div class="time-block">
              <h3>${timeBlockLabels[block]}</h3>
              <div class="task-list">
                ${blockTasks
                  .map(task => this.renderTaskItem(task))
                  .join('')}
              </div>
            </div>
          `;
        })
        .filter(Boolean)
        .join('');

      page.innerHTML = `
        <div class="page-header">
          <h1>📋 Daily Routine</h1>
          <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </div>

        <div class="page-content">
          <button class="btn btn-primary btn-full" onclick="Modal.showTaskForm()">➕ New Task</button>
          
          ${tasksHtml || '<p>No tasks scheduled for today. Add one to get started!</p>'}
        </div>
      `;

      console.log('✅ Daily Routine page rendered');
    } catch (error) {
      console.error('❌ Error rendering daily routine:', error.message);
    }
  },

  /**
   * Render a single task item
   */
  renderTaskItem(task) {
    const priorityColors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
    };

    return `
      <div class="task-item task-${task.status}">
        <div class="task-checkbox">
          <input type="checkbox" ${task.status === 'completed' ? 'checked' : ''} 
            onchange="TaskService.completeTask('${task.id}'); UIRenderer.renderDailyRoutine();">
        </div>
        <div class="task-content">
          <div class="task-title ${task.status === 'completed' ? 'completed' : ''}">${task.title}</div>
          <div class="task-meta">
            <span class="time">⏱️ ${task.scheduledTime}</span>
            <span class="duration">${task.durationMinutes}m</span>
            <span class="category">${task.category}</span>
          </div>
          ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
        </div>
        <div class="task-actions">
          <button class="btn btn-icon" onclick="Modal.showTaskForm(appState.tasks.find(t => t.id === '${task.id}'))" title="Edit">✏️</button>
          <button class="btn btn-icon btn-danger" onclick="TaskService.deleteTask('${task.id}'); UIRenderer.renderDailyRoutine();" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  },

  /**
   * Render Food Budget page
   */
  renderFoodBudget() {
    try {
      const page = document.getElementById('page-budget');
      if (!page) return;

      const expenses = appState.getTodaysExpenses();
      const total = appState.getTodaysSpendingTotal();
      const remaining = ExpenseService.getTodaysBudgetRemaining();
      const percentage = ExpenseService.getTodaysBudgetPercentage();
      const budgetStatus = ExpenseService.getBudgetWarningLevel();
      const currencySymbol = SettingsService.getBudgetCurrencySymbol();

      const expensesHtml = expenses.length > 0
        ? expenses.map(expense => this.renderExpenseItem(expense)).join('')
        : '<p>No expenses logged today.</p>';

      const statusMessages = {
        safe: '✅ You are within budget',
        warning: '⚠️ Approaching budget limit',
        caution: '⚠️⚠️ Getting close to limit',
        danger: '🚨 Budget exceeded!',
      };

      page.innerHTML = `
        <div class="page-header">
          <h1>💰 Food Budget</h1>
          <p>Daily spending tracker</p>
        </div>

        <div class="page-content">
          <div class="card budget-card">
            <div class="budget-summary">
              <div class="budget-stat">
                <span class="label">Daily Budget</span>
                <span class="value">${currencySymbol}${appState.settings.dailyBudget}</span>
              </div>
              <div class="budget-stat">
                <span class="label">Spent</span>
                <span class="value total">${currencySymbol}${total.toFixed(2)}</span>
              </div>
              <div class="budget-stat">
                <span class="label">Remaining</span>
                <span class="value remaining">${currencySymbol}${remaining.toFixed(2)}</span>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%;"></div>
            </div>
            <div class="budget-status ${budgetStatus}">
              ${statusMessages[budgetStatus]}
            </div>
          </div>

          <button class="btn btn-primary btn-full" onclick="Modal.showExpenseForm()">➕ Log Expense</button>

          <div class="expenses-list">
            <h3>Today's Expenses</h3>
            ${expensesHtml}
          </div>
        </div>
      `;

      console.log('✅ Food Budget page rendered');
    } catch (error) {
      console.error('❌ Error rendering food budget:', error.message);
    }
  },

  /**
   * Render a single expense item
   */
  renderExpenseItem(expense) {
    const categoryEmoji = {
      breakfast: '🌅',
      lunch: '🍽️',
      dinner: '🌙',
      snack: '🍪',
    };

    return `
      <div class="expense-item">
        <div class="expense-header">
          <div class="expense-info">
            <span class="emoji">${categoryEmoji[expense.mealCategory] || '🍽️'}</span>
            <div class="expense-details">
              <div class="expense-description">${expense.description}</div>
              <div class="expense-meta">${expense.mealCategory}</div>
            </div>
          </div>
          <div class="expense-amount">${SettingsService.getBudgetCurrencySymbol()}${expense.amount.toFixed(2)}</div>
        </div>
        ${expense.notes ? `<div class="expense-notes">${expense.notes}</div>` : ''}
        <div class="expense-actions">
          <button class="btn btn-sm" onclick="Modal.showExpenseForm(appState.expenses.find(e => e.id === '${expense.id}'))">✏️ Edit</button>
          <button class="btn btn-sm btn-danger" onclick="ExpenseService.deleteExpense('${expense.id}'); UIRenderer.renderFoodBudget(); UIRenderer.updateHomePageData();">🗑️ Delete</button>
        </div>
      </div>
    `;
  },

  /**
   * Render Progress page
   */
  renderProgress() {
    try {
      const page = document.getElementById('page-progress');
      if (!page) return;

      const stats = TaskService.getTaskStats();
      const completionRate = appState.getTodaysPendingCount() + appState.getTodaysCompletedCount() > 0
        ? Math.round((appState.getTodaysCompletedCount() / (appState.getTodaysPendingCount() + appState.getTodaysCompletedCount())) * 100)
        : 0;

      page.innerHTML = `
        <div class="page-header">
          <h1>📊 Progress</h1>
          <p>Analytics & insights</p>
        </div>

        <div class="page-content">
          <div class="card">
            <div class="card-header">
              <h3>Today's Completion</h3>
            </div>
            <div class="card-body">
              <div class="progress-display">
                <div class="progress-circle" style="--percentage: ${completionRate}">
                  <div class="progress-text">${completionRate}%</div>
                </div>
                <div class="progress-stats">
                  <div class="stat">✅ ${appState.getTodaysCompletedCount()} completed</div>
                  <div class="stat">⏳ ${appState.getTodaysPendingCount()} pending</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Overall Stats</h3>
            </div>
            <div class="card-body">
              <div class="stats-list">
                <div class="stat-row">
                  <span>Total Tasks</span>
                  <span>${stats.total}</span>
                </div>
                <div class="stat-row">
                  <span>Completed</span>
                  <span>${stats.completed}</span>
                </div>
                <div class="stat-row">
                  <span>Pending</span>
                  <span>${stats.pending}</span>
                </div>
                <div class="stat-row">
                  <span>Skipped</span>
                  <span>${stats.skipped}</span>
                </div>
                <div class="stat-row">
                  <span>Overdue</span>
                  <span>${stats.overdue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      console.log('✅ Progress page rendered');
    } catch (error) {
      console.error('❌ Error rendering progress:', error.message);
    }
  },

  /**
   * Render Settings page
   */
  renderSettings() {
    try {
      const page = document.getElementById('page-settings');
      if (!page) return;

      const settings = appState.settings;

      page.innerHTML = `
        <div class="page-header">
          <h1>⚙️ Settings</h1>
          <p>Customize your experience</p>
        </div>

        <div class="page-content">
          <div class="card">
            <div class="card-header">
              <h3>Display</h3>
            </div>
            <div class="card-body">
              <div class="setting-item">
                <label>Theme</label>
                <select onchange="SettingsService.updateSetting('theme', this.value); app.applyTheme(this.value);">
                  <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>☀️ Light</option>
                  <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>🌙 Dark</option>
                  <option value="system" ${settings.theme === 'system' ? 'selected' : ''}>💻 System</option>
                </select>
              </div>

              <div class="setting-item">
                <label>Font Size</label>
                <div class="font-size-options">
                  ${[90, 100, 110, 120].map(size => `
                    <button class="btn btn-sm ${settings.fontSize === size ? 'active' : ''}" 
                      onclick="SettingsService.updateSetting('fontSize', ${size}); app.applyFontSize(${size}); UIRenderer.renderSettings();">
                      ${size}%
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Budget</h3>
            </div>
            <div class="card-body">
              <div class="setting-item">
                <label for="daily-budget">Daily Budget (${settings.budgetCurrency})</label>
                <input type="number" id="daily-budget" value="${settings.dailyBudget}" 
                  onchange="SettingsService.updateSetting('dailyBudget', parseFloat(this.value)); Toast.success('💰 Budget updated');">
              </div>

              <div class="setting-item">
                <label for="budget-currency">Currency</label>
                <select id="budget-currency" onchange="SettingsService.updateSetting('budgetCurrency', this.value); Toast.success('💱 Currency updated');">
                  <option value="BDT" ${settings.budgetCurrency === 'BDT' ? 'selected' : ''}>BDT (৳)</option>
                  <option value="USD" ${settings.budgetCurrency === 'USD' ? 'selected' : ''}>USD ($)</option>
                  <option value="EUR" ${settings.budgetCurrency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                  <option value="INR" ${settings.budgetCurrency === 'INR' ? 'selected' : ''}>INR (₹)</option>
                  <option value="PKR" ${settings.budgetCurrency === 'PKR' ? 'selected' : ''}>PKR (₨)</option>
                  <option value="GBP" ${settings.budgetCurrency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                  <option value="JPY" ${settings.budgetCurrency === 'JPY' ? 'selected' : ''}>JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Notifications</h3>
            </div>
            <div class="card-body">
              <div class="setting-item">
                <label class="toggle-label">
                  <input type="checkbox" ${settings.notificationsEnabled ? 'checked' : ''} 
                    onchange="SettingsService.updateSetting('notificationsEnabled', this.checked); Toast.info('🔔 Notification settings updated');">
                  <span>Enable Notifications</span>
                </label>
              </div>

              <div class="setting-item">
                <label>Quiet Hours Start</label>
                <input type="time" value="${settings.reminderQuietHoursStart}" 
                  onchange="SettingsService.updateSetting('reminderQuietHoursStart', this.value);">
              </div>

              <div class="setting-item">
                <label>Quiet Hours End</label>
                <input type="time" value="${settings.reminderQuietHoursEnd}" 
                  onchange="SettingsService.updateSetting('reminderQuietHoursEnd', this.value);">
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Data</h3>
            </div>
            <div class="card-body">
              <button class="btn btn-secondary btn-full" onclick="UIRenderer.exportData()">📥 Export Data</button>
              <button class="btn btn-secondary btn-full" onclick="UIRenderer.importData()">📤 Import Data</button>
              <button class="btn btn-danger btn-full" onclick="Modal.confirm('Clear All Data', 'Are you sure? This cannot be undone.', 'Storage.clearAllData(); location.reload();')">🗑️ Clear All Data</button>
            </div>
          </div>
        </div>
      `;

      console.log('✅ Settings page rendered');
    } catch (error) {
      console.error('❌ Error rendering settings:', error.message);
    }
  },

  /**
   * Update only home page data (for faster refresh)
   */
  updateHomePageData() {
    try {
      const stats = {
        todayCompleted: appState.getTodaysCompletedCount(),
        todayPending: appState.getTodaysPendingCount(),
        todayExpenses: appState.getTodaysExpenses().length,
        spendingTotal: appState.getTodaysSpendingTotal(),
        budgetRemaining: ExpenseService.getTodaysBudgetRemaining(),
        budgetPercentage: ExpenseService.getTodaysBudgetPercentage(),
      };

      const statsGrid = document.querySelector('.stats-grid');
      if (statsGrid) {
        statsGrid.innerHTML = `
          <div class="stat-card"><div class="stat-number">${stats.todayCompleted}</div><div class="stat-label">Completed</div></div>
          <div class="stat-card"><div class="stat-number">${stats.todayPending}</div><div class="stat-label">Pending</div></div>
          <div class="stat-card"><div class="stat-number">${stats.todayExpenses}</div><div class="stat-label">Expenses</div></div>
          <div class="stat-card"><div class="stat-number">${stats.budgetPercentage.toFixed(0)}%</div><div class="stat-label">Budget Used</div></div>
        `;
      }

      const currencySymbol = SettingsService.getBudgetCurrencySymbol();
      const budgetStatus = ExpenseService.getBudgetWarningLevel();
      const budgetStatusColor = {
        safe: 'safe',
        warning: 'warning',
        caution: 'caution',
        danger: 'danger',
      }[budgetStatus] || 'safe';

      const budgetCard = document.querySelector('.card.budget-card');
      if (budgetCard) {
        budgetCard.innerHTML = `
          <div class="budget-summary">
            <div class="budget-amount">
              <span class="label">Spent</span>
              <span class="value">${currencySymbol}${stats.spendingTotal.toFixed(2)}</span>
            </div>
            <div class="budget-bar">
              <div class="progress" style="width: ${Math.min(stats.budgetPercentage, 100)}%;" class="budget-${budgetStatusColor}"></div>
            </div>
            <div class="budget-info">
              <span>${currencySymbol}${stats.budgetRemaining.toFixed(2)} remaining</span>
              <span>${stats.budgetPercentage.toFixed(0)}% used</span>
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.error('❌ Error updating home data:', error.message);
    }
  },

  /**
   * Export data as JSON file
   */
  exportData() {
    try {
      const data = Storage.exportAllData();
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `routine-nest-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      Toast.success('📥 Data exported successfully!');
      console.log('✅ Data exported');
    } catch (error) {
      console.error('❌ Error exporting data:', error.message);
      Toast.error('❌ Failed to export data');
    }
  },

  /**
   * Import data from file
   */
  importData() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const backup = JSON.parse(event.target.result);
            Storage.importAllData(backup);
            Toast.success('📤 Data imported successfully!');
            location.reload();
          } catch (error) {
            Toast.error('❌ Invalid backup file');
            console.error('❌ Error importing data:', error.message);
          }
        };
        reader.readAsText(file);
      };
      input.click();
    } catch (error) {
      console.error('❌ Error importing data:', error.message);
      Toast.error('❌ Failed to import data');
    }
  },
};

console.log('✅ UI Renderer loaded');