import { ref } from 'vue'

export default function useTheme() {
  const isDark = ref(false)
  
  const initTheme = () => {
    // Check for saved preference
    const savedTheme = localStorage.getItem('darkMode')
    
    // Check for system preference if no saved preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Initialize dark mode based on preference
    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    // Apply initial theme
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDark.value ? 'dark' : 'light')
    
    // Apply dark class to html element
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  return { isDark, toggleTheme, initTheme }
}
