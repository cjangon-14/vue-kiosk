export const recentActivityRoute = {
  path: '/activity',
  name: 'Activity',
  component: () => import('@/views/ActivityView.vue'),
  meta: { category: 'Monitoring', title: 'Recent Activity', icon: 'recentactivity' },
}
