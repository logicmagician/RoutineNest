/**
 * RoutineNest - Task Service
 * Phase 2: Task CRUD and business logic
 * 
 * Handles all task operations:
 * - Create, Read, Update, Delete
 * - Status management
 * - Recurrence logic
 * - Filtering and sorting
 */

const TaskService = {
  /**
   * Create a new task
   */
  createTask(taskData) {
    try {
      const task = new Task(taskData);
      appState.tasks.push(task);
      Storage.saveTasks(appState.tasks);
      console.log(`✅ Task created: ${task.toString()}`);
      return task;
    } catch (error) {
      console.error('❌ Error creating task:', error.message);
      return null;
    }
  },

  /**
   * Get task by ID
   */
  getTaskById(id) {
    return appState.tasks.find(t => t.id === id) || null;
  },

  /**
   * Get all tasks
   */
  getAllTasks() {
    return appState.tasks;
  },

  /**
   * Get tasks for a specific date
   */
  getTasksByDate(date) {
    return appState.tasks.filter(t => t.scheduledDate === date);
  },

  /**
   * Get today's tasks
   */
  getTodaysTasks() {
    return appState.getTodaysTasks();
  },

  /**
   * Get tasks by status
   */
  getTasksByStatus(status) {
    return appState.tasks.filter(t => t.status === status);
  },

  /**
   * Get tasks by category
   */
  getTasksByCategory(category) {
    return appState.tasks.filter(t => t.category === category);
  },

  /**
   * Get tasks by priority
   */
  getTasksByPriority(priority) {
    return appState.tasks.filter(t => t.priority === priority);
  },

  /**
   * Get today's tasks grouped by time
   */
  getTodaysTasksGrouped() {
    const tasks = this.getTodaysTasks()
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    const grouped = {
      morning: [],    // 05:00 - 11:59
      afternoon: [],  // 12:00 - 17:59
      evening: [],    // 18:00 - 23:59
      night: [],      // 00:00 - 04:59
    };

    tasks.forEach(task => {
      const hour = parseInt(task.scheduledTime.split(':')[0]);
      
      if (hour >= 5 && hour < 12) grouped.morning.push(task);
      else if (hour >= 12 && hour < 18) grouped.afternoon.push(task);
      else if (hour >= 18) grouped.evening.push(task);
      else grouped.night.push(task);
    });

    return grouped;
  },

  /**
   * Get next task (soonest by time today)
   */
  getNextTask() {
    return appState.getNextTask();
  },

  /**
   * Update a task
   */
  updateTask(id, updates) {
    try {
      const task = this.getTaskById(id);
      if (!task) {
        throw new Error('Task not found');
      }

      // Update only provided fields
      Object.assign(task, updates);
      Storage.saveTasks(appState.tasks);
      console.log(`✅ Task updated: ${task.toString()}`);
      return task;
    } catch (error) {
      console.error('❌ Error updating task:', error.message);
      return null;
    }
  },

  /**
   * Delete a task
   */
  deleteTask(id) {
    try {
      const index = appState.tasks.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Task not found');
      }

      const task = appState.tasks[index];
      appState.tasks.splice(index, 1);
      Storage.saveTasks(appState.tasks);
      console.log(`✅ Task deleted: ${task.title}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting task:', error.message);
      return false;
    }
  },

  /**
   * Mark task as complete
   */
  completeTask(id) {
    try {
      const task = this.getTaskById(id);
      if (!task) throw new Error('Task not found');

      task.complete();
      Storage.saveTasks(appState.tasks);
      console.log(`✅ Task completed: ${task.title}`);
      
      // Record completion for stats
      this.recordCompletion(task);
      
      return task;
    } catch (error) {
      console.error('❌ Error completing task:', error.message);
      return null;
    }
  },

  /**
   * Mark task as skipped
   */
  skipTask(id) {
    try {
      const task = this.getTaskById(id);
      if (!task) throw new Error('Task not found');

      task.skip();
      Storage.saveTasks(appState.tasks);
      console.log(`⏭️ Task skipped: ${task.title}`);
      return task;
    } catch (error) {
      console.error('❌ Error skipping task:', error.message);
      return null;
    }
  },

  /**
   * Mark task as postponed
   */
  postponeTask(id) {
    try {
      const task = this.getTaskById(id);
      if (!task) throw new Error('Task not found');

      task.postpone();
      Storage.saveTasks(appState.tasks);
      console.log(`⏸️ Task postponed: ${task.title}`);
      return task;
    } catch (error) {
      console.error('❌ Error postponing task:', error.message);
      return null;
    }
  },

  /**
   * Resume a task
   */
  resumeTask(id) {
    try {
      const task = this.getTaskById(id);
      if (!task) throw new Error('Task not found');

      task.resume();
      Storage.saveTasks(appState.tasks);
      console.log(`▶️ Task resumed: ${task.title}`);
      return task;
    } catch (error) {
      console.error('❌ Error resuming task:', error.message);
      return null;
    }
  },

  /**
   * Start a task
   */
  startTask(id) {
    try {
      const task = this.getTaskById(id);
      if (!task) throw new Error('Task not found');

      task.start();
      Storage.saveTasks(appState.tasks);
      console.log(`▶️ Task started: ${task.title}`);
      return task;
    } catch (error) {
      console.error('❌ Error starting task:', error.message);
      return null;
    }
  },

  /**
   * Record task completion for statistics
   */
  recordCompletion(task) {
    try {
      const records = Storage.getCompletionRecords();
      records.push({
        taskId: task.id,
        taskTitle: task.title,
        completedDate: new Date().toISOString().split('T')[0],
        completedTime: new Date().toISOString(),
      });
      Storage.saveCompletionRecords(records);
    } catch (error) {
      console.error('⚠️ Could not record completion:', error.message);
    }
  },

  /**
   * Get completion rate for today
   */
  getTodaysCompletionRate() {
    const todaysTasks = this.getTodaysTasks();
    if (todaysTasks.length === 0) return 0;

    const completed = todaysTasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / todaysTasks.length) * 100);
  },

  /**
   * Get completion rate for this week
   */
  getWeeklyCompletionRate() {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const weekTasks = appState.tasks.filter(t => t.scheduledDate >= weekStartStr);
    if (weekTasks.length === 0) return 0;

    const completed = weekTasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / weekTasks.length) * 100);
  },

  /**
   * Get completed tasks count for a date
   */
  getCompletedCountForDate(date) {
    return this.getTasksByDate(date).filter(t => t.status === 'completed').length;
  },

  /**
   * Get pending tasks count for today
   */
  getTodaysPendingCount() {
    return appState.getTodaysPendingCount();
  },

  /**
   * Check if task has overdue items
   */
  hasOverdueTasks() {
    return appState.tasks.some(t => t.isOverdue());
  },

  /**
   * Get overdue tasks
   */
  getOverdueTasks() {
    return appState.tasks.filter(t => t.isOverdue());
  },

  /**
   * Get high priority tasks for today
   */
  getTodaysHighPriorityTasks() {
    return this.getTodaysTasks()
      .filter(t => t.priority === 'high' && ['pending', 'in_progress'].includes(t.status))
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  },

  /**
   * Validate task data before save
   */
  validateTask(taskData) {
    const errors = [];

    if (!taskData.title || taskData.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!taskData.scheduledDate) {
      errors.push('Date is required');
    }

    if (!taskData.scheduledTime) {
      errors.push('Time is required');
    }

    if (taskData.durationMinutes < 1) {
      errors.push('Duration must be at least 1 minute');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  },

  /**
   * Get task statistics
   */
  getTaskStats() {
    const total = appState.tasks.length;
    const completed = appState.tasks.filter(t => t.status === 'completed').length;
    const pending = appState.tasks.filter(t => t.status === 'pending').length;
    const inProgress = appState.tasks.filter(t => t.status === 'in_progress').length;
    const skipped = appState.tasks.filter(t => t.status === 'skipped').length;

    return {
      total,
      completed,
      pending,
      inProgress,
      skipped,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  },

  /**
   * Get tasks due in next N hours
   */
  getUpcomingTasks(hoursAhead = 2) {
    const now = new Date();
    const future = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

    return appState.tasks.filter(t => {
      if (['completed', 'skipped'].includes(t.status)) return false;

      const taskDateTime = new Date(`${t.scheduledDate}T${t.scheduledTime}`);
      return taskDateTime >= now && taskDateTime <= future;
    });
  },
};

console.log('✅ TaskService module loaded');