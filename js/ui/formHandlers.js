/**
 * RoutineNest - Form Handlers
 * Phase 3: Task and Expense form submission
 */

const TaskFormHandler = {
  submit(event) {
    event.preventDefault();

    try {
      const form = document.getElementById('task-form');
      const formData = new FormData(form);

      const taskData = {
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        category: formData.get('category'),
        priority: formData.get('priority'),
        durationMinutes: parseInt(formData.get('durationMinutes')) || 30,
        scheduledDate: formData.get('scheduledDate'),
        scheduledTime: formData.get('scheduledTime'),
        recurrenceRule: formData.get('recurrenceRule'),
      };

      // Validation
      if (!taskData.title) {
        alert('⚠️ Task title is required');
        return;
      }

      if (!taskData.scheduledDate) {
        alert('⚠️ Date is required');
        return;
      }

      if (!taskData.scheduledTime) {
        alert('⚠️ Time is required');
        return;
      }

      // Check if editing
      const taskId = formData.get('taskId');
      if (taskId) {
        // Update existing task
        const success = TaskService.updateTask(taskId, taskData);
        if (success) {
          console.log(`✅ Task updated: ${taskData.title}`);
          Modal.hide();
          UIRenderer.renderDailyRoutine();
          Toast.success('✏️ Task updated successfully!');
        } else {
          Toast.error('❌ Failed to update task');
        }
      } else {
        // Create new task
        const newTask = TaskService.createTask(taskData);
        if (newTask) {
          console.log(`✅ Task created: ${taskData.title}`);
          Modal.hide();
          UIRenderer.renderDailyRoutine();
          Toast.success(`➕ Task "${taskData.title}" added!`);
        } else {
          Toast.error('❌ Failed to create task');
        }
      }
    } catch (error) {
      console.error('❌ Error submitting task form:', error.message);
      Toast.error('❌ Error saving task: ' + error.message);
    }
  },
};

const ExpenseFormHandler = {
  submit(event) {
    event.preventDefault();

    try {
      const form = document.getElementById('expense-form');
      const formData = new FormData(form);

      const expenseData = {
        date: formData.get('date'),
        amount: parseFloat(formData.get('amount')),
        description: formData.get('description').trim(),
        mealCategory: formData.get('mealCategory'),
        notes: formData.get('notes').trim(),
      };

      // Validation
      if (!expenseData.date) {
        alert('⚠️ Date is required');
        return;
      }

      if (!expenseData.amount || expenseData.amount <= 0) {
        alert('⚠️ Amount must be greater than 0');
        return;
      }

      if (!expenseData.description) {
        alert('⚠️ Description is required');
        return;
      }

      // Check if editing
      const expenseId = formData.get('expenseId');
      if (expenseId) {
        // Update existing expense
        const success = ExpenseService.updateExpense(expenseId, expenseData);
        if (success) {
          console.log(`✅ Expense updated: ${expenseData.amount}`);
          Modal.hide();
          UIRenderer.renderFoodBudget();
          Toast.success('✏️ Expense updated successfully!');
        } else {
          Toast.error('❌ Failed to update expense');
        }
      } else {
        // Create new expense
        const newExpense = ExpenseService.createExpense(expenseData);
        if (newExpense) {
          console.log(`✅ Expense created: ${expenseData.amount}`);
          Modal.hide();
          UIRenderer.renderFoodBudget();
          UIRenderer.updateHomePageData();

          const currencySymbol = SettingsService.getBudgetCurrencySymbol();
          Toast.success(`💰 Expense ${currencySymbol}${expenseData.amount} logged!`);
        } else {
          Toast.error('❌ Failed to create expense');
        }
      }
    } catch (error) {
      console.error('❌ Error submitting expense form:', error.message);
      Toast.error('❌ Error saving expense: ' + error.message);
    }
  },
};

console.log('✅ Form handlers loaded');