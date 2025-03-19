import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';

import './styles/app.css';
import useTheme from './composables/useTheme'

const routes = [
    { 
        path: '/', 
        name: 'home', 
        component: () => import('./views/HomeApp.vue'),
    },
    { 
        path: '/users', 
        name: 'users', 
        component: () => import('./views/UsersApp.vue') 
    },
  ]

const router = createRouter({
    history: createWebHistory(),
    routes, 
    linkActiveClass: 'link-active',
})

const { initTheme } = useTheme()
initTheme()


const app = createApp(App)

app.config.globalProperties.urlBackend = 'https://desafio.test'

app.use(router)
app.mount('#app')


