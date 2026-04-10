export const systemHealthRoute = {
  path: '/system-health',
  name: 'SystemHealth',
  component: () => import('@/views/SystemHealthView.vue'),
  meta: { category: 'Monitoring', title: 'System Health', icon: 'systemhealth' },
}
