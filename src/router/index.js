import { createRouter, createWebHistory } from 'vue-router'
import { sidebarRoutes } from './sidebarRoutes'
import { clientRoutes } from './clientRoutes'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'HomeViewLayout',
    component: () => import('@/views/HomeViewLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: sidebarRoutes,
  },
  {
    path: '/client',
    name: 'ClientHomeViewLayout',
    component: () => import('@/views/ClientHomeViewLayout.vue'),
    redirect: '/client/dashboard',
    meta: { requiresAuth: true },
    children: clientRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard for authentication
router.beforeEach((to, from) => {
  const { isAuthenticated, getUser } = useAuth()
  const user = getUser()

  // If trying to access a protected route
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirect to login
    return '/login'
  }
  // If already logged in and trying to access login page
  else if (to.path === '/login' && isAuthenticated.value) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'Super Admin') {
      return '/dashboard'
    } else {
      return '/client'
    }
  }
  // Prevent superadmin from accessing client routes
  else if (to.path.startsWith('/client') && user?.role === 'Super Admin') {
    return '/dashboard'
  }
  // Prevent store admin from accessing superadmin routes
  else if (
    !to.path.startsWith('/client') &&
    to.path !== '/login' &&
    user?.role !== 'Super Admin' &&
    user?.storeId
  ) {
    return '/client'
  }
  // return nothing/undefined to allow navigation
})

// Prevent back button after login
window.history.pushState(null, null, window.location.href)
window.addEventListener('popstate', () => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated.value) {
    window.history.pushState(null, null, window.location.href)
  }
})

export default router
