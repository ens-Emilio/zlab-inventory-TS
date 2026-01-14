/**
 * Z-Lab Inventory - Main Application
 * Integra todos os módulos e gerencia o estado global
 */

import { Navigation } from './navigation.js';
import { Search } from './search.js';
import { KeyboardShortcuts } from './keyboard.js';
import { Toast } from './toast.js';
import { InventoryTable } from './table.js';

class App {
    private navigation: Navigation;
    private search: Search;
    private keyboard: KeyboardShortcuts;
    private toast: Toast;
    private inventoryTable: InventoryTable;

    constructor() {
        this.toast = new Toast();
        this.navigation = new Navigation();
        this.search = new Search();
        this.keyboard = new KeyboardShortcuts(this.search);
        this.inventoryTable = new InventoryTable('app-content', this.toast);

        // Make inventoryTable available globally for bulk actions
        (window as any).inventoryTable = this.inventoryTable;

        this.init();
    }

    private init() {
        // Listen to route changes
        window.addEventListener('route-change', (e: Event) => {
            const customEvent = e as CustomEvent;
            this.handleRouteChange(customEvent.detail.route);
        });

        // Listen to search events
        window.addEventListener('search', (e: Event) => {
            const customEvent = e as CustomEvent;
            this.handleSearch(customEvent.detail.query);
        });

        window.addEventListener('search-clear', () => {
            this.handleSearchClear();
        });

        // Add item button
        const addItemBtn = document.getElementById('add-item-btn');
        addItemBtn?.addEventListener('click', () => this.showAddItemModal());

        // Initial load
        this.handleRouteChange(this.navigation.getCurrentRoute());
    }

    private handleRouteChange(route: string) {
        console.log('Route changed to:', route);

        switch (route) {
            case 'inventory':
                this.renderInventoryView();
                break;
            case 'locations':
                this.renderLocationsView();
                break;
            case 'categories':
                this.renderCategoriesView();
                break;
            case 'print-labels':
                this.renderPrintLabelsView();
                break;
            case 'import-export':
                this.renderImportExportView();
                break;
            case 'settings':
                this.renderSettingsView();
                break;
            default:
                this.renderInventoryView();
        }
    }

    private handleSearch(query: string) {
        console.log('Searching for:', query);
        const currentRoute = this.navigation.getCurrentRoute();

        if (currentRoute === 'inventory') {
            this.inventoryTable.filterItems(query);
        }
    }

    private handleSearchClear() {
        const currentRoute = this.navigation.getCurrentRoute();

        if (currentRoute === 'inventory') {
            this.inventoryTable.filterItems('');
        }
    }

    private renderInventoryView() {
        this.inventoryTable.loadItems();
    }

    private renderLocationsView() {
        const container = document.getElementById('app-content');
        if (!container) return;

        container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">Locations</h1>
        <p class="content-description">Gerencie os locais do seu inventário</p>
      </div>
      <div class="empty-state">
        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <h3 class="empty-state-title">Em desenvolvimento</h3>
        <p class="empty-state-description">A tela de Locations está sendo implementada</p>
      </div>
    `;
    }

    private renderCategoriesView() {
        const container = document.getElementById('app-content');
        if (!container) return;

        container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">Categories</h1>
        <p class="content-description">Organize seus itens por categorias</p>
      </div>
      <div class="empty-state">
        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
        <h3 class="empty-state-title">Em desenvolvimento</h3>
        <p class="empty-state-description">A tela de Categories está sendo implementada</p>
      </div>
    `;
    }

    private renderPrintLabelsView() {
        const container = document.getElementById('app-content');
        if (!container) return;

        container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">Print Labels</h1>
        <p class="content-description">Imprima etiquetas para seus itens</p>
      </div>
      <div class="empty-state">
        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
        </svg>
        <h3 class="empty-state-title">Em desenvolvimento</h3>
        <p class="empty-state-description">A tela de Print Labels está sendo implementada</p>
      </div>
    `;
    }

    private renderImportExportView() {
        const container = document.getElementById('app-content');
        if (!container) return;

        container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">Import/Export</h1>
        <p class="content-description">Importe e exporte dados do inventário</p>
      </div>
      <div class="empty-state">
        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
        </svg>
        <h3 class="empty-state-title">Em desenvolvimento</h3>
        <p class="empty-state-description">A tela de Import/Export está sendo implementada</p>
      </div>
    `;
    }

    private renderSettingsView() {
        const container = document.getElementById('app-content');
        if (!container) return;

        container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">Settings</h1>
        <p class="content-description">Configure o sistema</p>
      </div>
      <div class="empty-state">
        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <h3 class="empty-state-title">Em desenvolvimento</h3>
        <p class="empty-state-description">A tela de Settings está sendo implementada</p>
      </div>
    `;
    }

    private showAddItemModal() {
        this.toast.info('Modal de adicionar item em desenvolvimento');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
