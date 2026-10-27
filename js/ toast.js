/**
 * RoutineNest - Toast Notifications
 * Phase 3: Temporary feedback messages
 */

const Toast = {
  /**
   * Show a toast message
   */
  show(message, type = 'info', duration = 3000) {
    try {
      // Get or create toast container
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
      }

      // Create toast element
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;

      // Add to container
      container.appendChild(toast);

      // Show animation
      setTimeout(() => toast.classList.add('show'), 10);

      // Remove after duration
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, duration);

      console.log(`🔔 Toast [${type}]: ${message}`);
    } catch (error) {
      console.error('❌ Error showing toast:', error.message);
    }
  },

  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  },

  error(message, duration = 4000) {
    this.show(message, 'error', duration);
  },

  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  },

  warning(message, duration = 3500) {
    this.show(message, 'warning', duration);
  },
};

// Add toast styles
const style = document.createElement('style');
style.textContent = `
  #toast-container {
    position: fixed;
    bottom: var(--spacing-lg);
    right: var(--spacing-lg);
    z-index: 2000;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .toast {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    max-width: 300px;
    word-wrap: break-word;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.3s ease;
    animation: slideInToast 0.3s ease forwards;
  }

  @keyframes slideInToast {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }

  .toast.toast-success {
    background-color: #10b981;
    color: white;
  }

  .toast.toast-error {
    background-color: #ef4444;
    color: white;
  }

  .toast.toast-info {
    background-color: #3b82f6;
    color: white;
  }

  .toast.toast-warning {
    background-color: #f59e0b;
    color: white;
  }

  @media (max-width: 639px) {
    #toast-container {
      bottom: var(--spacing-md);
      right: var(--spacing-md);
      left: var(--spacing-md);
    }

    .toast {
      max-width: 100%;
    }
  }
`;
document.head.appendChild(style);

console.log('✅ Toast component loaded');