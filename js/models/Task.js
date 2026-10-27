/**
 * RoutineNest - Task Model
 * Phase 2: Task class definition
 */

class Task {
  constructor({
    id = null,
    title = '',
    description = '',
    category = 'Personal',
    priority = 'medium',  // low, medium, high
    durationMinutes = 30,
    scheduledDate = null,  // YYYY-MM-DD
    scheduledTime = '00:00',  // HH:MM
    recurrenceRule = 'once',  // once, daily, weekdays, weekly, monthly
    selectedWeekdays = [],  // [0-6] = Sunday-Saturday
    status = 'pending',  // pending, in_progress, completed, skipped, postponed
    completedAt = null,
    createdAt = null,
    notificationId = null,
    reminderTime = '15_min_before',  // 15_min_before, at_time, 1_hour_before
  } = {}) {
    this.id = id || Date.now().toString();
    this.title = title;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.durationMinutes = parseInt(durationMinutes) || 30;
    this.scheduledDate = scheduledDate || new Date().toISOString().split('T')[0];
    this.scheduledTime = scheduledTime;
    this.recurrenceRule = recurrenceRule;
    this.selectedWeekdays = Array.isArray(selectedWeekdays) ? selectedWeekdays : [];
    this.status = status;
    this.completedAt = completedAt;
    this.createdAt = createdAt || new Date().toISOString();
    this.notificationId = notificationId;
    this.reminderTime = reminderTime;
  }

  /**
   * Get display time (HH:MM format)
   */
  getDisplayTime() {
    return this.scheduledTime;
  }

  /**
   * Get display duration (e.g., "30 min", "2 hours")
   */
  getDisplayDuration() {
    if (this.durationMinutes < 60) {
      return `${this.durationMinutes} min`;
    }
    const hours = Math.floor(this.durationMinutes / 60);
    const mins = this.durationMinutes % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}min`;
  }

  /**
   * Calculate end time based on start time and duration
   */
  getEndTime() {
    const [hours, mins] = this.scheduledTime.split(':').map(Number);
    let endMinutes = mins + this.durationMinutes;
    let endHours = hours;

    if (endMinutes >= 60) {
      endHours += Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
    }

    if (endHours >= 24) {
      endHours = endHours % 24;
    }

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }

  /**
   * Check if task is overdue
   */
  isOverdue() {
    if (['completed', 'skipped'].includes(this.status)) {
      return false;
    }

    const now = new Date();
    const taskDateTime = new Date(`${this.scheduledDate}T${this.scheduledTime}`);
    return taskDateTime < now;
  }

  /**
   * Check if task is happening now
   */
  isHappeningNow() {
    const now = new Date();
    const taskStart = new Date(`${this.scheduledDate}T${this.scheduledTime}`);
    const taskEnd = new Date(taskStart.getTime() + this.durationMinutes * 60000);
    
    return now >= taskStart && now <= taskEnd;
  }

  /**
   * Check if task is today
   */
  isToday() {
    const today = new Date().toISOString().split('T')[0];
    return this.scheduledDate === today;
  }

  /**
   * Mark task as complete
   */
  complete() {
    this.status = 'completed';
    this.completedAt = new Date().toISOString();
  }

  /**
   * Mark task as skipped
   */
  skip() {
    this.status = 'skipped';
  }

  /**
   * Mark task as postponed
   */
  postpone() {
    this.status = 'postponed';
  }

  /**
   * Resume task (back to pending)
   */
  resume() {
    this.status = 'pending';
    this.completedAt = null;
  }

  /**
   * Start task (set to in_progress)
   */
  start() {
    this.status = 'in_progress';
  }

  /**
   * Get priority color (for UI)
   */
  getPriorityColor() {
    const colors = {
      low: '#34C759',    // Green
      medium: '#FF9500', // Orange
      high: '#FF3B30',   // Red
    };
    return colors[this.priority] || '#007AFF';  // Blue default
  }

  /**
   * Get priority badge text
   */
  getPriorityBadge() {
    return this.priority.charAt(0).toUpperCase() + this.priority.slice(1);
  }

  /**
   * Get status icon
   */
  getStatusIcon() {
    const icons = {
      pending: '⏱️',
      in_progress: '▶️',
      completed: '✅',
      skipped: '⏭️',
      postponed: '⏸️',
    };
    return icons[this.status] || '❓';
  }

  /**
   * Get status label
   */
  getStatusLabel() {
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      skipped: 'Skipped',
      postponed: 'Postponed',
    };
    return labels[this.status] || 'Unknown';
  }

  /**
   * Check if task should recur tomorrow
   */
  shouldRecurTomorrow() {
    if (this.recurrenceRule === 'once') {
      return false;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDay();

    if (this.recurrenceRule === 'daily') {
      return true;
    }

    if (this.recurrenceRule === 'weekdays') {
      // Monday = 1, Friday = 5
      return tomorrowDay >= 1 && tomorrowDay <= 5;
    }

    if (this.recurrenceRule === 'weekly') {
      const todayDay = new Date().getDay();
      return tomorrowDay === todayDay;
    }

    if (this.recurrenceRule === 'monthly') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.getDate() === today.getDate();
    }

    return false;
  }

  /**
   * Serialize to JSON
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      priority: this.priority,
      durationMinutes: this.durationMinutes,
      scheduledDate: this.scheduledDate,
      scheduledTime: this.scheduledTime,
      recurrenceRule: this.recurrenceRule,
      selectedWeekdays: this.selectedWeekdays,
      status: this.status,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      notificationId: this.notificationId,
      reminderTime: this.reminderTime,
    };
  }

  /**
   * Create Task from JSON
   */
  static fromJSON(json) {
    return new Task(json);
  }

  /**
   * Get display summary for logging
   */
  toString() {
    return `${this.getStatusIcon()} ${this.title} (${this.scheduledTime}, ${this.getDisplayDuration()})`;
  }
}

console.log('✅ Task model loaded');