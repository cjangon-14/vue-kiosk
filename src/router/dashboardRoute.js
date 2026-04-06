export const dashboardRoute = {
  path: 'dashboard',
  name: 'Dashboard',
  component: () => import('@/views/DashboardView.vue'),
  meta: { icon: 'dashboard' },
}
