export const storesRoute = {
  path: '/stores',
  name: 'Stores',
  component: () => import('@/views/StoresView.vue'),
  meta: { category: 'Management', title: 'Stores', icon: 'stores' },
  children: [
    {
      path: ':id',
      component: () => import('@/views/StoreDetailView.vue'),
      props: true,
    },
  ],
}
