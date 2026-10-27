/**
 * RoutineNest - Notification Service
 * Phase 2: Web Notifications API wrapper
 * 
 * Handles browser notifications:
 * - Permission requests
 * - Notification scheduling
 * - Quiet hours management
 */

const NotificationService = {
  /**
   * Check if notifications are supported
   */
  isSupported() {
    return 'Notification' in window;
  },

  /**
   * Check if notifications are enabled
   */
  isEnabled() {
    return this.isSupported() && 
           Notification.permission === 'granted' &&
           appState.settings.notificationsEnabled;
  },

  /**
   * Request notification permission
   */
  async requestPermission() {
    if (!this.isSupported()) {
      console.warn('⚠️ Notifications not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission already granted');
      appState.hasNotificationPermission = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('⚠️ Notification permission denied by user');
      return false;
    }

    // Request permission (will prompt user)
    try {
      const permission = await Notification.requestPermission();
      appState.hasNotificationPermission = permission === 'granted';
      console.log(`📬 Notification permission: ${permission}`);
      return permission === 'granted';
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error.message);
      return false;
    }
  },

  /**
   * Check if currently in quiet hours
   */
  isInQuietHours() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const quietStart = appState.settings.reminderQuietHoursStart;
    const quietEnd = appState.settings.reminderQuietHoursEnd;

    // If quiet hours span midnight (e.g., 22:00 to 08:00)
    if (quietStart > quietEnd) {
      return currentTime >= quietStart || currentTime < quietEnd;
    }

    // Normal quiet hours (e.g., 14:00 to 18:00)
    return currentTime >= quietStart && currentTime < quietEnd;
  },

  /**
   * Check if should send notification for task
   */
  shouldNotifyTask(task) {
    // Not enabled
    if (!this.isEnabled()) {
      return false;
    }

    // In quiet hours
    if (this.isInQuietHours()) {
      return false;
    }

    // Task not pending or in progress
    if (!['pending', 'in_progress'].includes(task.status)) {
      return false;
    }

    // Not scheduled for today
    const today = new Date().toISOString().split('T')[0];
    if (task.scheduledDate !== today) {
      return false;
    }

    return true;
  },

  /**
   * Send task notification
   */
  sendTaskNotification(task) {
    if (!this.shouldNotifyTask(task)) {
      return false;
    }

    const title = `${task.title}`;
    const options = {
      body: `${task.scheduledTime} • ${task.getDisplayDuration()}`,
      icon: 'images/icon-192x192.png',
      badge: 'images/icon-192x192.png',
      tag: `task-${task.id}`,
      requireInteraction: true,
      actions: [
        { action: 'complete', title: '✅ Complete' },
        { action: 'dismiss', title: '✕ Dismiss' },
      ],
    };

    try {
      const notification = new Notification(title, options);
      
      notification.addEventListener('click', () => {
        console.log(`Clicked notification for task: ${task.title}`);
        window.focus();
        // Could navigate to task here
      });

      console.log(`📢 Task notification sent: ${task.title}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending notification:', error.message);
      return false;
    }
  },

  /**
   * Send budget warning notification
   */
  sendBudgetNotification(percentage) {
    if (!this.isEnabled() || this.isInQuietHours()) {
      return false;
    }

    let title = '💰 Budget Update';
    let body = '';

    if (percentage >= 100) {
      title = '⚠️ Budget Exceeded!';
      body = `You've exceeded your daily budget of ৳${appState.settings.dailyBudget}`;
    } else if (percentage >= 80) {
      body = `You've used ${percentage}% of your daily budget`;
    } else {
      return false; // Don't notify if below 80%
    }

    try {
      const notification = new Notification(title, {
        body: body,
        icon: 'images/icon-192x192.png',
        badge: 'images/icon-192x192.png',
        tag: 'budget-warning',
        requireInteraction: false,
      });

      console.log(`📢 Budget notification sent: ${body}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending budget notification:', error.message);
      return false;
    }
  },

  /**
   * Send completion milestone notification
   */
  sendMilestoneNotification(completedCount) {
    if (!this.isEnabled() || this.isInQuietHours()) {
      return false;
    }

    let shouldNotify = false;
    let message = '';

    if (completedCount === 1) {
      shouldNotify = true;
      message = 'Great start! You completed your first task today! 🎉';
    } else if (completedCount === 5) {
      shouldNotify = true;
      message = 'Awesome! You\'ve completed 5 tasks! 🚀';
    } else if (completedCount === 10) {
      shouldNotify = true;
      message = 'Outstanding! 10 tasks completed! 💪';
    } else if (completedCount % 10 === 0 && completedCount > 10) {
      shouldNotify = true;
      message = `Incredible! ${completedCount} tasks completed today! ⭐`;
    }

    if (!shouldNotify) {
      return false;
    }

    try {
      const notification = new Notification('🎯 Milestone Reached!', {
        body: message,
        icon: 'images/icon-192x192.png',
        badge: 'images/icon-192x192.png',
        tag: 'milestone',
        requireInteraction: false,
      });

      console.log(`📢 Milestone notification sent: ${message}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending milestone notification:', error.message);
      return false;
    }
  },

  /**
   * Close notification by tag
   */
  closeNotification(tag) {
    // Unfortunately, we can't directly close notifications in most browsers
    // This is a placeholder for future use
    console.log(`Attempting to close notification with tag: ${tag}`);
  },

  /**
   * Schedule task reminder
   */
  scheduleTaskReminder(task) {
    if (!this.isEnabled()) {
      return false;
    }

    const taskTime = new Date(`${task.scheduledDate}T${task.scheduledTime}`);
    const now = new Date();
    const reminderTime = this.calculateReminderTime(task.reminderTime, taskTime);

    // If reminder time is in the past, don't schedule
    if (reminderTime <= now) {
      return false;
    }

    const delayMs = reminderTime.getTime() - now.getTime();

    // Set timeout for reminder (max ~24 days in JS)
    if (delayMs < 2147483647) { // Max 32-bit integer
      setTimeout(() => {
        this.sendTaskNotification(task);
      }, delayMs);

      console.log(`⏰ Task reminder scheduled for: ${task.title} at ${reminderTime}`);
      return true;
    }

    return false;
  },

  /**
   * Calculate reminder time based on reminder type
   */
  calculateReminderTime(reminderType, taskTime) {
    const time = new Date(taskTime);

    switch (reminderType) {
      case '15_min_before':
        time.setMinutes(time.getMinutes() - 15);
        break;
      case '30_min_before':
        time.setMinutes(time.getMinutes() - 30);
        break;
      case '1_hour_before':
        time.setHours(time.getHours() - 1);
        break;
      case 'at_time':
        // No change needed
        break;
      default:
        time.setMinutes(time.getMinutes() - 15);
    }

    return time;
  },

  /**
   * Get notification status for UI
   */
  getStatus() {
    if (!this.isSupported()) {
      return 'not-supported';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return appState.settings.notificationsEnabled ? 'enabled' : 'disabled';
    }

    return 'not-requested';
  },

  /**
   * Get notification status message
   */
  getStatusMessage() {
    const status = this.getStatus();
    const messages = {
      'not-supported': '⚠️ Notifications not supported in this browser',
      'denied': '❌ Notification permission denied',
      'not-requested': '📬 Click button to enable notifications',
      'enabled': '✅ Notifications enabled',
      'disabled': '⏸️ Notifications disabled in settings',
    };
    return messages[status] || 'Unknown status';
  },

  /**
   * Test notification
   */
  sendTestNotification() {
    if (!this.isEnabled()) {
      alert('❌ Notifications not enabled. Please enable in settings and grant permission.');
      return false;
    }

    try {
      const notification = new Notification('🧪 Test Notification', {
        body: 'This is a test notification from RoutineNest',
        icon: 'images/icon-192x192.png',
      });

      console.log('📢 Test notification sent');
      return true;
    } catch (error) {
      console.error('❌ Error sending test notification:', error.message);
      return false;
    }
  },
};

// Check notification support on load
document.addEventListener('DOMContentLoaded', () => {
  if (NotificationService.isSupported()) {
    console.log(`📬 Notifications supported. Status: ${NotificationService.getStatus()}`);
  } else {
    console.warn('⚠️ Notifications not supported in this browser');
  }
});

console.log('✅ NotificationService module loaded');