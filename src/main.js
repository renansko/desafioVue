import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import useTheme from './composables/useTheme'

const { initTheme } = useTheme()
initTheme()

const app = createApp(App)

app.config.globalProperties.urlBackend = process.env.VUE_APP_BACKEND_URL || 'http://127.0.0.1:8000'

app.use(router)
app.mount('#app')


