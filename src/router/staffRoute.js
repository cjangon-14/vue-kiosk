export const clientStaffRoute = {
  path: 'staff',
  name: 'ClientStaff',
  component: () => import('@/views/StaffManagementView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Staff',
    icon: 'Users',
    category: 'Operations',
  },
}
