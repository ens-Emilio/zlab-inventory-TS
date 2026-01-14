/**
 * Z-Lab Inventory - Keyboard Shortcuts
 * Atalhos de teclado para power users
 */

export class KeyboardShortcuts {
    private shortcuts: Map<string, () => void>;
    private search: any; // Search instance

    constructor(search: any) {
        this.search = search;
        this.shortcuts = new Map();
        this.registerShortcuts();
        this.init();
    }

    private init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    private registerShortcuts() {
        // / - Focus search
        this.shortcuts.set('/', () => {
            this.search.focus();
        });

        // n - New item
        this.shortcuts.set('n', () => {
            const addBtn = document.getElementById('add-item-btn');
            addBtn?.click();
        });

        // ? - Show keyboard help
        this.shortcuts.set('?', () => {
            this.showKeyboardHelp();
        });
    }

    private handleKeydown(e: KeyboardEvent) {
        // Ignore if user is typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            // Allow Escape even in inputs
            if (e.key === 'Escape') {
                (target as HTMLInputElement).blur();
            }
            return;
        }

        // Check for registered shortcuts
        const handler = this.shortcuts.get(e.key);
        if (handler) {
            e.preventDefault();
            handler();
        }

        // Escape - Close modals/drawers
        if (e.key === 'Escape') {
            this.handleEscape();
        }
    }

    private handleEscape() {
        // Close drawer
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('drawer-overlay');
        sidebar?.classList.remove('open');
        overlay?.classList.remove('active');

        // Close any open modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            (modal as HTMLElement).style.display = 'none';
        });
    }

    private showKeyboardHelp() {
        // TODO: Implementar modal de ajuda
        console.log('Keyboard shortcuts:');
        console.log('/ - Focus search');
        console.log('n - New item');
        console.log('Esc - Close modals/drawer');
        console.log('? - Show this help');
    }
}
