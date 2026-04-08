export const storesRoute = {
  path: '/stores',
  name: 'Stores',
  component: () => import('@/views/StoresView.vue'),
  meta: { icon: 'stores' },
  children: [
    {
      path: ':id',
      component: () => import('@/views/StoreDetailView.vue'),
      props: true,
    },
  ],
}
