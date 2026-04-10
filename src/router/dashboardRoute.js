export const dashboardRoute = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/DashboardView.vue'),
  meta: { category: 'Overview', title: 'Dashboard', icon: 'dashboard' },
}
