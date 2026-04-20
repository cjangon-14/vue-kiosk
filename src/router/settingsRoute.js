export const settingsRoute = {
  path: '/settings',
  name: 'Settings',
  component: () => import('@/views/SettingsView.vue'),
  meta: { category: 'Admin', title: 'Settings', icon: 'Settings' },
}
