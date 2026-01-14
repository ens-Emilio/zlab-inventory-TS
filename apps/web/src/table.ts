/**
 * Z-Lab Inventory - Inventory Table Module
 * Tabela power user com seleção em massa, ordenação e linhas expansíveis
 */

interface Item {
    id: number;
    public_id?: string;
    name: string;
    description?: string;
    quantity: number;
    category_id?: number;
    category_name?: string;
    location_id?: number;
    location_name?: string;
    created_at?: string;
    updated_at?: string;
}

type SortDirection = 'asc' | 'desc';
type SortColumn = 'name' | 'category' | 'location' | 'quantity' | 'updated';

export class InventoryTable {
    private items: Item[] = [];
    private filteredItems: Item[] = [];
    private selectedItems: Set<number> = new Set();
    private sortColumn: SortColumn = 'name';
    private sortDirection: SortDirection = 'asc';
    private expandedRows: Set<number> = new Set();
    private container: HTMLElement | null;
    private toast: any;

    constructor(containerId: string, toast: any) {
        this.container = document.getElementById(containerId);
        this.toast = toast;
    }

    public async loadItems() {
        try {
            const response = await fetch('/api/items');
            this.items = await response.json();
            this.filteredItems = [...this.items];
            this.render();
        } catch (error) {
            console.error('Error loading items:', error);
            this.toast?.error('Erro ao carregar itens');
        }
    }

    public filterItems(query: string) {
        if (!query) {
            this.filteredItems = [...this.items];
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredItems = this.items.filter(item =>
                item.name.toLowerCase().includes(lowerQuery) ||
                item.description?.toLowerCase().includes(lowerQuery) ||
                item.category_name?.toLowerCase().includes(lowerQuery) ||
                item.location_name?.toLowerCase().includes(lowerQuery)
            );
        }
        this.render();
    }

    private sort() {
        this.filteredItems.sort((a, b) => {
            let aVal: any, bVal: any;

            switch (this.sortColumn) {
                case 'name':
                    aVal = a.name;
                    bVal = b.name;
                    break;
                case 'category':
                    aVal = a.category_name || '';
                    bVal = b.category_name || '';
                    break;
                case 'location':
                    aVal = a.location_name || '';
                    bVal = b.location_name || '';
                    break;
                case 'quantity':
                    aVal = a.quantity;
                    bVal = b.quantity;
                    break;
                case 'updated':
                    aVal = new Date(a.updated_at || 0).getTime();
                    bVal = new Date(b.updated_at || 0).getTime();
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    private handleSort(column: SortColumn) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sort();
        this.render();
    }

    private toggleSelectAll(checked: boolean) {
        if (checked) {
            this.filteredItems.forEach(item => this.selectedItems.add(item.id));
        } else {
            this.selectedItems.clear();
        }
        this.render();
    }

    private toggleSelectItem(id: number, checked: boolean) {
        if (checked) {
            this.selectedItems.add(id);
        } else {
            this.selectedItems.delete(id);
        }
        this.render();
    }

    private toggleExpandRow(id: number) {
        if (this.expandedRows.has(id)) {
            this.expandedRows.delete(id);
        } else {
            this.expandedRows.add(id);
        }
        this.render();
    }

    private formatDate(dateString?: string): string {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Agora';
        if (diffMins < 60) return `${diffMins}m atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;
        return date.toLocaleDateString('pt-BR');
    }

    public render() {
        if (!this.container) return;

        const hasSelection = this.selectedItems.size > 0;
        const allSelected = this.filteredItems.length > 0 &&
            this.selectedItems.size === this.filteredItems.length;

        this.container.innerHTML = `
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">Itens (${this.filteredItems.length})</h2>
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
              Colunas
            </button>
          </div>
        </div>

        ${hasSelection ? `
          <div class="bulk-actions-bar active">
            <div class="bulk-actions-info">
              <span class="bulk-actions-count">${this.selectedItems.size}</span>
              <span>item(ns) selecionado(s)</span>
            </div>
            <div class="bulk-actions-buttons">
              <button class="btn btn-secondary btn-sm" onclick="inventoryTable.bulkPrint()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Imprimir Labels
              </button>
              <button class="btn btn-secondary btn-sm" onclick="inventoryTable.bulkExport()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Exportar
              </button>
              <button class="btn btn-danger btn-sm" onclick="inventoryTable.bulkDelete()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Deletar
              </button>
            </div>
          </div>
        ` : ''}

        <div class="table-wrapper">
          ${this.filteredItems.length === 0 ? this.renderEmptyState() : this.renderTable(allSelected)}
        </div>
      </div>
    `;

        this.attachEventListeners();
    }

    private renderTable(allSelected: boolean): string {
        return `
      <table class="table">
        <thead>
          <tr>
            <th class="col-checkbox">
              <input type="checkbox" class="table-checkbox" id="select-all" ${allSelected ? 'checked' : ''}>
            </th>
            <th class="col-photo"></th>
            <th class="sortable ${this.sortColumn === 'name' ? 'sorted' : ''}" data-column="name">
              <div class="table-header-content">
                Nome
                ${this.sortColumn === 'name' ? `
                  <svg class="sort-icon ${this.sortDirection === 'desc' ? 'desc' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                ` : ''}
              </div>
            </th>
            <th class="sortable ${this.sortColumn === 'category' ? 'sorted' : ''}" data-column="category">
              <div class="table-header-content">
                Categoria
                ${this.sortColumn === 'category' ? `
                  <svg class="sort-icon ${this.sortDirection === 'desc' ? 'desc' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                ` : ''}
              </div>
            </th>
            <th class="sortable ${this.sortColumn === 'location' ? 'sorted' : ''}" data-column="location">
              <div class="table-header-content">
                Local
                ${this.sortColumn === 'location' ? `
                  <svg class="sort-icon ${this.sortDirection === 'desc' ? 'desc' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                ` : ''}
              </div>
            </th>
            <th class="col-qty sortable ${this.sortColumn === 'quantity' ? 'sorted' : ''}" data-column="quantity">
              <div class="table-header-content">
                Qty
                ${this.sortColumn === 'quantity' ? `
                  <svg class="sort-icon ${this.sortDirection === 'desc' ? 'desc' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                ` : ''}
              </div>
            </th>
            <th class="col-updated sortable ${this.sortColumn === 'updated' ? 'sorted' : ''}" data-column="updated">
              <div class="table-header-content">
                Atualizado
                ${this.sortColumn === 'updated' ? `
                  <svg class="sort-icon ${this.sortDirection === 'desc' ? 'desc' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                ` : ''}
              </div>
            </th>
            <th class="col-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${this.filteredItems.map(item => this.renderRow(item)).join('')}
        </tbody>
      </table>
    `;
    }

    private renderRow(item: Item): string {
        const isSelected = this.selectedItems.has(item.id);
        const isExpanded = this.expandedRows.has(item.id);

        return `
      <tr class="expandable ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}" data-id="${item.id}">
        <td class="col-checkbox">
          <input type="checkbox" class="table-checkbox item-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''}>
        </td>
        <td class="col-photo">
          <img src="https://via.placeholder.com/40" alt="${item.name}" class="item-photo">
        </td>
        <td>
          <div style="display: flex; align-items: center;">
            <svg class="expand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            <a href="#item/${item.id}" class="item-name-link">
              <strong class="item-name">${item.name}</strong>
            </a>
          </div>
        </td>
        <td>
          <span class="badge badge-primary">${item.category_name || 'Sem categoria'}</span>
        </td>
        <td class="item-location">${item.location_name || 'Sem local'}</td>
        <td class="col-qty item-qty">${item.quantity}</td>
        <td class="col-updated item-updated">${this.formatDate(item.updated_at)}</td>
        <td class="col-actions">
          <div class="item-actions">
            <button class="action-btn" title="Editar" data-action="edit" data-id="${item.id}">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button class="action-btn" title="Movimentar estoque" data-action="stock" data-id="${item.id}">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </button>
            <button class="action-btn danger" title="Deletar" data-action="delete" data-id="${item.id}">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
      ${isExpanded ? this.renderExpandedRow(item) : ''}
    `;
    }

    private renderExpandedRow(item: Item): string {
        return `
      <tr class="expanded-row">
        <td colspan="8">
          <div class="expanded-content">
            <div class="expanded-details">
              <div class="expanded-section">
                <div class="expanded-section-title">Descrição</div>
                <div class="expanded-section-content">${item.description || 'Sem descrição'}</div>
              </div>
              <div class="expanded-section">
                <div class="expanded-section-title">Tags</div>
                <div class="expanded-tags">
                  <span class="badge badge-neutral">Tag 1</span>
                  <span class="badge badge-neutral">Tag 2</span>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
    }

    private renderEmptyState(): string {
        return `
      <div class="empty-state">
        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <h3 class="empty-state-title">Nenhum item encontrado</h3>
        <p class="empty-state-description">Comece adicionando seu primeiro item ao inventário</p>
        <button class="btn btn-primary" id="add-first-item">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Adicionar Primeiro Item
        </button>
      </div>
    `;
    }

    private attachEventListeners() {
        // Select all
        const selectAll = document.getElementById('select-all') as HTMLInputElement;
        selectAll?.addEventListener('change', (e) => {
            this.toggleSelectAll((e.target as HTMLInputElement).checked);
        });

        // Individual checkboxes
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                const id = parseInt(target.getAttribute('data-id') || '0');
                this.toggleSelectItem(id, target.checked);
            });
        });

        // Sortable columns
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.getAttribute('data-column') as SortColumn;
                this.handleSort(column);
            });
        });

        // Expandable rows
        document.querySelectorAll('.expandable').forEach(row => {
            row.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                // Ignore clicks on checkboxes, buttons, and links
                if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
                    return;
                }
                const id = parseInt(row.getAttribute('data-id') || '0');
                this.toggleExpandRow(id);
            });
        });

        // Action buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const id = parseInt(btn.getAttribute('data-id') || '0');
                this.handleAction(action, id);
            });
        });
    }

    private handleAction(action: string | null, id: number) {
        switch (action) {
            case 'edit':
                console.log('Edit item', id);
                this.toast?.info('Edição em desenvolvimento');
                break;
            case 'stock':
                console.log('Manage stock', id);
                this.toast?.info('Gestão de estoque em desenvolvimento');
                break;
            case 'delete':
                this.deleteItem(id);
                break;
        }
    }

    private async deleteItem(id: number) {
        if (!confirm('Tem certeza que deseja deletar este item?')) return;

        try {
            const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
            if (response.ok) {
                this.toast?.success('Item deletado com sucesso');
                this.loadItems();
            } else {
                this.toast?.error('Erro ao deletar item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            this.toast?.error('Erro ao deletar item');
        }
    }

    // Bulk actions
    public bulkPrint() {
        console.log('Bulk print', Array.from(this.selectedItems));
        this.toast?.info('Impressão em massa em desenvolvimento');
    }

    public bulkExport() {
        console.log('Bulk export', Array.from(this.selectedItems));
        this.toast?.info('Exportação em massa em desenvolvimento');
    }

    public async bulkDelete() {
        if (!confirm(`Tem certeza que deseja deletar ${this.selectedItems.size} item(ns)?`)) return;

        this.toast?.info('Deleção em massa em desenvolvimento');
    }
}
