/**
 * Z-Lab Inventory - Toast Notifications
 * Sistema de notificações toast
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
    message: string;
    type: ToastType;
    duration?: number;
}

export class Toast {
    private container: HTMLElement;
    private toasts: HTMLElement[] = [];
    private maxToasts: number = 3;

    constructor() {
        this.container = this.createContainer();
        document.body.appendChild(this.container);
    }

    private createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
      position: fixed;
      top: var(--space-4);
      right: var(--space-4);
      z-index: var(--z-toast);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      pointer-events: none;
    `;
        return container;
    }

    public show(options: ToastOptions) {
        const { message, type, duration = 3000 } = options;

        // Remove oldest toast if max reached
        if (this.toasts.length >= this.maxToasts) {
            const oldest = this.toasts.shift();
            oldest?.remove();
        }

        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Auto dismiss
        setTimeout(() => {
            this.dismiss(toast);
        }, duration);
    }

    private createToast(message: string, type: ToastType): HTMLElement {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background-color: var(--bg-elevated);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      min-width: 300px;
      max-width: 400px;
      pointer-events: auto;
      animation: toast-slide-in 0.3s ease-out;
    `;

        // Icon
        const icon = this.getIcon(type);
        toast.appendChild(icon);

        // Message
        const messageEl = document.createElement('span');
        messageEl.textContent = message;
        messageEl.style.cssText = `
      flex: 1;
      font-size: var(--text-sm);
      color: var(--text-primary);
    `;
        toast.appendChild(messageEl);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: var(--text-2xl);
      line-height: 1;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    `;
        closeBtn.addEventListener('click', () => this.dismiss(toast));
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = 'var(--bg-tertiary)';
            closeBtn.style.color = 'var(--text-primary)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = 'var(--text-tertiary)';
        });
        toast.appendChild(closeBtn);

        // Type-specific styling
        const colors = {
            success: 'var(--color-success-600)',
            error: 'var(--color-danger-600)',
            warning: 'var(--color-warning-600)',
            info: 'var(--color-info-600)'
        };
        toast.style.borderLeftWidth = '4px';
        toast.style.borderLeftColor = colors[type];

        return toast;
    }

    private getIcon(type: ToastType): HTMLElement {
        const icon = document.createElement('div');
        icon.style.cssText = `
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    `;

        const svgs = {
            success: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--color-success-600)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
            error: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--color-danger-600)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
            warning: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--color-warning-600)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>`,
            info: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--color-info-600)">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`
        };

        icon.innerHTML = svgs[type];
        return icon;
    }

    private dismiss(toast: HTMLElement) {
        toast.style.animation = 'toast-slide-out 0.3s ease-out';
        setTimeout(() => {
            toast.remove();
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    // Convenience methods
    public success(message: string) {
        this.show({ message, type: 'success' });
    }

    public error(message: string) {
        this.show({ message, type: 'error' });
    }

    public warning(message: string) {
        this.show({ message, type: 'warning' });
    }

    public info(message: string) {
        this.show({ message, type: 'info' });
    }
}

// Add animations to document
const style = document.createElement('style');
style.textContent = `
  @keyframes toast-slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes toast-slide-out {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
