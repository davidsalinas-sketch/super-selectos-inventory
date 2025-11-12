import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard/inventory'
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/InventoryView.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/UsersView.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'distributors',
        name: 'Distributors',
        component: () => import('@/views/DistributorsView.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('@/views/MapView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else if (to.meta.requiresAdmin && authStore.currentUser?.rol !== 'Administrador') {
    next('/dashboard/inventory')
  } else if (to.path === '/' && authStore.isAuthenticated) {
    next('/dashboard/inventory')
  } else {
    next()
  }
})

export default router
