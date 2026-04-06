import { createRouter, createWebHistory } from 'vue-router'
import { sidebarRoutes } from './sidebarRoutes'

const routes = [
  {
    path: '/',
    name: 'HomeViewLayout',
    component: () => import('@/views/HomeViewLayout.vue'),
    redirect: '/dashboard',
    children: sidebarRoutes,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
