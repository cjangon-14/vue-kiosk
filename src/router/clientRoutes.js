export const clientDashboardRoute = {
  path: 'dashboard',
  name: 'ClientDashboard',
  component: () => import('@/views/ClientDashboardView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    category: 'Overview',
  },
}

export const clientCategoriesRoute = {
  path: 'categories',
  name: 'ClientCategories',
  component: () => import('@/views/ClientCategoriesView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Categories',
    icon: 'Tags',
    category: 'Menu Management',
  },
}

export const clientProductsRoute = {
  path: 'products',
  name: 'ClientProducts',
  component: () => import('@/views/ClientProductsView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Products',
    icon: 'Package',
    category: 'Menu Management',
  },
}

export const clientMenusRoute = {
  path: 'menus',
  name: 'ClientMenus',
  component: () => import('@/views/ClientMenusView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Menus',
    icon: 'LayoutList',
    category: 'Menu Management',
  },
}

export const clientInventoryRoute = {
  path: 'inventory',
  name: 'ClientInventory',
  component: () => import('@/views/ClientInventoryView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Inventory',
    icon: 'Boxes',
    category: 'Operations',
  },
}

export const clientKiosksManagementRoute = {
  path: 'kiosks',
  name: 'ClientKiosksManagement',
  component: () => import('@/views/ClientKiosksManagementView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Kiosks',
    icon: 'Monitor',
    category: 'Operations',
  },
}

export const clientSettingsRoute = {
  path: 'settings',
  name: 'ClientSettings',
  component: () => import('@/views/ClientSettingsView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Settings',
    icon: 'Settings',
    category: 'Configuration',
  },
}

export const clientRoutes = [
  clientDashboardRoute,
  clientCategoriesRoute,
  clientProductsRoute,
  clientMenusRoute,
  clientInventoryRoute,
  clientKiosksManagementRoute,
  clientSettingsRoute,
]
