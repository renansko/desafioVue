import { ref } from 'vue'

export default function useTheme() {
  const isDark = ref(false)
  
  const initTheme = () => {
    const savedTheme = localStorage.getItem('darkMode')
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    
    localStorage.setItem('darkMode', isDark.value ? 'dark' : 'light')
    
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  return { isDark, toggleTheme, initTheme }
}
