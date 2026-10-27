/**
 * RoutineNest - Modal Component
 * Phase 3: Reusable modal dialog system
 */

const Modal = {
  /**
   * Show a modal with content
   */
  show(title, content, buttons = []) {
    try {
      // Get or create modal container
      let modalContainer = document.getElementById('modal-overlay');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-overlay';
        modalContainer.className = 'modal-overlay';
        document.body.appendChild(modalContainer);
      }

      // Build modal HTML
      const modalHtml = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>${title}</h2>
            <button class="modal-close" onclick="Modal.hide()">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer">
            ${buttons.map(btn => `
              <button class="btn btn-${btn.type || 'secondary'}" onclick="${btn.onclick || 'Modal.hide()'}">
                ${btn.label}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      // Insert modal
      modalContainer.innerHTML = modalHtml;
      modalContainer.classList.add('active');
      document.body.classList.add('modal-open');

      console.log(`📱 Modal shown: ${title}`);
      return true;
    } catch (error) {
      console.error('❌ Error showing modal:', error.message);
      return false;
    }
  },

  /**
   * Hide the modal
   */
  hide() {
    try {
      const modalContainer = document.getElementById('modal-overlay');
      if (modalContainer) {
        modalContainer.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Clear after animation
        setTimeout(() => {
          modalContainer.innerHTML = '';
        }, 300);
      }
      console.log('📱 Modal hidden');
      return true;
    } catch (error) {
      console.error('❌ Error hiding modal:', error.message);
      return false;
    }
  },

  /**
   * Show confirmation dialog
   */
  confirm(title, message, onConfirm, onCancel = null) {
    const content = `<p>${message}</p>`;
    const buttons = [
      { label: 'Cancel', type: 'secondary', onclick: `${onCancel ? onCancel : 'Modal.hide()'}` },
      { label: 'Confirm', type: 'primary', onclick: onConfirm },
    ];

    return this.show(title, content, buttons);
  },

  /**
   * Show alert dialog
   */
  alert(title, message) {
    const content = `<p>${message}</p>`;
    const buttons = [
      { label: 'OK', type: 'primary', onclick: 'Modal.hide()' },
    ];

    return this.show(title, content, buttons);
  },

  /**
   * Show task creation form
   */
  showTaskForm(task = null) {
    const isEdit = task !== null;
    const title = isEdit ? '✏️ Edit Task' : '➕ New Task';

    const categories = ['Personal', 'Work', 'Health', 'Other'];
    const priorities = ['low', 'medium', 'high'];
    const recurrenceOptions = ['once', 'daily', 'weekdays', 'weekly', 'monthly'];

    // Default values
    const today = new Date().toISOString().split('T')[0];
    const defaultValues = task || {
      title: '',
      description: '',
      category: 'Personal',
      priority: 'medium',
      durationMinutes: 30,
      scheduledDate: today,
      scheduledTime: '09:00',
      recurrenceRule: 'once',
    };

    const content = `
      <form id="task-form" onsubmit="TaskFormHandler.submit(event)">
        <div class="form-group">
          <label for="task-title">Task Title *</label>
          <input type="text" id="task-title" name="title" value="${defaultValues.title}" required>
        </div>

        <div class="form-group">
          <label for="task-description">Description</label>
          <textarea id="task-description" name="description">${defaultValues.description}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="task-category">Category</label>
            <select id="task-category" name="category">
              ${categories.map(cat => `<option value="${cat}" ${cat === defaultValues.category ? 'selected' : ''}>${cat}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label for="task-priority">Priority</label>
            <select id="task-priority" name="priority">
              ${priorities.map(p => `<option value="${p}" ${p === defaultValues.priority ? 'selected' : ''}>${p.charAt(0).toUpperCase() + p.slice(1)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="task-date">Date *</label>
            <input type="date" id="task-date" name="scheduledDate" value="${defaultValues.scheduledDate}" required>
          </div>

          <div class="form-group">
            <label for="task-time">Time *</label>
            <input type="time" id="task-time" name="scheduledTime" value="${defaultValues.scheduledTime}" required>
          </div>
        </div>

        <div class="form-group">
          <label for="task-duration">Duration (minutes)</label>
          <input type="number" id="task-duration" name="durationMinutes" value="${defaultValues.durationMinutes}" min="1">
        </div>

        <div class="form-group">
          <label for="task-recurrence">Recurrence</label>
          <select id="task-recurrence" name="recurrenceRule">
            ${recurrenceOptions.map(opt => `<option value="${opt}" ${opt === defaultValues.recurrenceRule ? 'selected' : ''}>${opt.charAt(0).toUpperCase() + opt.slice(1)}</option>`).join('')}
          </select>
        </div>

        ${isEdit ? `<input type="hidden" name="taskId" value="${task.id}">` : ''}
      </form>
    `;

    const buttons = [
      { label: '✕ Cancel', type: 'secondary', onclick: 'Modal.hide()' },
      { label: isEdit ? '✏️ Update' : '➕ Create', type: 'primary', onclick: 'document.getElementById("task-form").dispatchEvent(new Event("submit"))' },
    ];

    return this.show(title, content, buttons);
  },

  /**
   * Show expense creation form
   */
  showExpenseForm(expense = null) {
    const isEdit = expense !== null;
    const title = isEdit ? '✏️ Edit Expense' : '➕ New Expense';

    const today = new Date().toISOString().split('T')[0];
    const defaultValues = expense || {
      date: today,
      amount: '',
      description: '',
      mealCategory: 'snack',
      notes: '',
    };

    const content = `
      <form id="expense-form" onsubmit="ExpenseFormHandler.submit(event)">
        <div class="form-group">
          <label for="expense-date">Date *</label>
          <input type="date" id="expense-date" name="date" value="${defaultValues.date}" required>
        </div>

        <div class="form-group">
          <label for="expense-description">Description *</label>
          <input type="text" id="expense-description" name="description" value="${defaultValues.description}" placeholder="e.g., Rice & vegetables" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="expense-amount">Amount *</label>
            <input type="number" id="expense-amount" name="amount" value="${defaultValues.amount}" placeholder="0.00" min="0.01" step="0.01" required>
          </div>

          <div class="form-group">
            <label for="expense-category">Category *</label>
            <select id="expense-category" name="mealCategory" required>
              <option value="breakfast" ${defaultValues.mealCategory === 'breakfast' ? 'selected' : ''}>🌅 Breakfast</option>
              <option value="lunch" ${defaultValues.mealCategory === 'lunch' ? 'selected' : ''}>🍽️ Lunch</option>
              <option value="dinner" ${defaultValues.mealCategory === 'dinner' ? 'selected' : ''}>🌙 Dinner</option>
              <option value="snack" ${defaultValues.mealCategory === 'snack' ? 'selected' : ''}>🍪 Snack</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="expense-notes">Notes</label>
          <textarea id="expense-notes" name="notes" placeholder="Optional notes">${defaultValues.notes}</textarea>
        </div>

        ${isEdit ? `<input type="hidden" name="expenseId" value="${expense.id}">` : ''}
      </form>
    `;

    const buttons = [
      { label: '✕ Cancel', type: 'secondary', onclick: 'Modal.hide()' },
      { label: isEdit ? '✏️ Update' : '➕ Add', type: 'primary', onclick: 'document.getElementById("expense-form").dispatchEvent(new Event("submit"))' },
    ];

    return this.show(title, content, buttons);
  },
};

// Add modal styles to page
const style = document.createElement('style');
style.textContent = `
  .modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .modal-overlay.active {
    display: flex;
    opacity: 1;
  }

  .modal-content {
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
  }

  .modal-header h2 {
    margin: 0;
    font-size: var(--font-size-xl);
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }

  .modal-close:hover {
    color: var(--color-text);
  }

  .modal-body {
    padding: var(--spacing-lg);
  }

  .modal-footer {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    justify-content: flex-end;
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
    transition: var(--transition);
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  @media (max-width: 639px) {
    .modal-content {
      max-width: 100%;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .modal-footer {
      flex-direction: column-reverse;
    }

    .modal-footer .btn {
      width: 100%;
    }
  }

  body.modal-open {
    overflow: hidden;
  }
`;
document.head.appendChild(style);

console.log('✅ Modal component loaded');