/**
 * Z-Lab Inventory - Navigation Module
 * Gerencia navegação, drawer mobile e routing
 */

export class Navigation {
    private sidebar: HTMLElement | null;
    private drawerOverlay: HTMLElement | null;
    private menuToggle: HTMLElement | null;
    private navItems: NodeListOf<HTMLElement>;
    private currentRoute: string = 'inventory';

    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.drawerOverlay = document.getElementById('drawer-overlay');
        this.menuToggle = document.getElementById('menu-toggle');
        this.navItems = document.querySelectorAll('.nav-item');

        this.init();
    }

    private init() {
        // Menu toggle (mobile)
        this.menuToggle?.addEventListener('click', () => this.toggleDrawer());
        this.drawerOverlay?.addEventListener('click', () => this.closeDrawer());

        // Navigation items
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const route = item.getAttribute('data-route');
                if (route) {
                    this.navigate(route);
                    this.closeDrawer();
                }
            });
        });

        // Handle hash changes (deep linking)
        window.addEventListener('hashchange', () => this.handleHashChange());

        // Initial route
        this.handleHashChange();
    }

    private toggleDrawer() {
        this.sidebar?.classList.toggle('open');
        this.drawerOverlay?.classList.toggle('active');
    }

    private closeDrawer() {
        this.sidebar?.classList.remove('open');
        this.drawerOverlay?.classList.remove('active');
    }

    private handleHashChange() {
        const hash = window.location.hash.slice(1) || 'inventory';
        this.navigate(hash);
    }

    public navigate(route: string) {
        this.currentRoute = route;
        window.location.hash = route;

        // Update active nav item
        this.navItems.forEach(item => {
            const itemRoute = item.getAttribute('data-route');
            if (itemRoute === route) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update breadcrumb
        this.updateBreadcrumb(route);

        // Dispatch custom event for route change
        window.dispatchEvent(new CustomEvent('route-change', { detail: { route } }));
    }

    private updateBreadcrumb(route: string) {
        const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
        if (breadcrumbCurrent) {
            const routeNames: Record<string, string> = {
                'inventory': 'Inventory',
                'locations': 'Locations',
                'categories': 'Categories',
                'print-labels': 'Print Labels',
                'import-export': 'Import/Export',
                'settings': 'Settings'
            };
            breadcrumbCurrent.textContent = routeNames[route] || route;
        }
    }

    public getCurrentRoute(): string {
        return this.currentRoute;
    }
}
