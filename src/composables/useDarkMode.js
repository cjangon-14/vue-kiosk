import { ref, computed } from 'vue'

const darkMode = ref(false)

export const useDarkMode = () => {
  const isDarkMode = computed(() => darkMode.value)

  const initializeDarkMode = () => {
    if (typeof window !== 'undefined') {
      // Load dark mode preference from localStorage
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) {
        darkMode.value = saved === 'true'
      } else {
        // Check system preference
        darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyDarkMode(darkMode.value)
    }
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.value.toString())
    }
    applyDarkMode(darkMode.value)
  }

  const setDarkMode = (value) => {
    darkMode.value = value
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', value.toString())
    }
    applyDarkMode(value)
  }

  const applyDarkMode = (isDark) => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      if (isDark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
    initializeDarkMode,
  }
}
