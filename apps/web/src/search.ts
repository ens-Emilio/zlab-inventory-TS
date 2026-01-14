/**
 * Z-Lab Inventory - Search Module
 * Busca global com debounce e sugestões
 */

export class Search {
    private searchInput: HTMLInputElement | null;
    private debounceTimer: number | null = null;
    private debounceDelay: number = 300;
    private searchHistory: string[] = [];
    private maxHistoryItems: number = 5;

    constructor() {
        this.searchInput = document.getElementById('global-search') as HTMLInputElement;
        this.loadSearchHistory();
        this.init();
    }

    private init() {
        if (!this.searchInput) return;

        // Debounced search
        this.searchInput.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value;
            this.debouncedSearch(query);
        });

        // Handle Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = this.searchInput?.value || '';
                this.performSearch(query);
            }
        });

        // Clear on Escape
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    private debouncedSearch(query: string) {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = window.setTimeout(() => {
            if (query.length >= 2) {
                this.performSearch(query);
            } else if (query.length === 0) {
                this.clearSearch();
            }
        }, this.debounceDelay);
    }

    private performSearch(query: string) {
        console.log('Searching for:', query);

        // Save to history
        this.addToHistory(query);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('search', { detail: { query } }));
    }

    private clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        window.dispatchEvent(new CustomEvent('search-clear'));
    }

    private addToHistory(query: string) {
        if (!query.trim()) return;

        // Remove duplicates
        this.searchHistory = this.searchHistory.filter(item => item !== query);

        // Add to beginning
        this.searchHistory.unshift(query);

        // Limit size
        this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);

        // Save to localStorage
        this.saveSearchHistory();
    }

    private loadSearchHistory() {
        const stored = localStorage.getItem('search-history');
        if (stored) {
            try {
                this.searchHistory = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to load search history', e);
            }
        }
    }

    private saveSearchHistory() {
        localStorage.setItem('search-history', JSON.stringify(this.searchHistory));
    }

    public getSearchHistory(): string[] {
        return this.searchHistory;
    }

    public focus() {
        this.searchInput?.focus();
    }
}
