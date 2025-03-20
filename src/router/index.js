import { createRouter, createWebHistory } from 'vue-router';
import authService from '@/services/authService';

const routes = [
  { 
    path: '/login', 
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { 
      requiresAuth: false,
      layout: 'blank' // This indicates no main layout
    }
  },
  { 
    path: '/', 
    name: 'home', 
    component: () => import('@/views/HomeApp.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'default'
    }
  },
  { 
    path: '/users', 
    name: 'users', 
    component: () => import('@/views/UsersApp.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'default'
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes, 
  linkActiveClass: 'link-active',
})

// Navigation guard to check auth
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = authService.isAuthenticated();
  
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;