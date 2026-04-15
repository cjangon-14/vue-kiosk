import { ref, computed } from 'vue'
import { useAuth } from './useAuth'

const darkMode = ref(false)

export const useDarkMode = () => {
  const { getUser, updateUserPreference } = useAuth()
  const isDarkMode = computed(() => darkMode.value)

  const initializeDarkMode = () => {
    if (typeof window !== 'undefined') {
      const user = getUser()

      // Load from user account if available
      if (user && user.darkMode !== undefined) {
        darkMode.value = user.darkMode
      } else {
        // Fall back to localStorage
        const saved = localStorage.getItem('darkMode')
        if (saved !== null) {
          darkMode.value = saved === 'true'
        } else {
          // Check system preference
          darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
      }
      applyDarkMode(darkMode.value)
    }
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    applyDarkMode(darkMode.value)
    savePreference(darkMode.value)
  }

  const setDarkMode = (value) => {
    darkMode.value = value
    applyDarkMode(value)
    savePreference(value)
  }

  const savePreference = async (isDark) => {
    if (typeof window !== 'undefined') {
      // Save to localStorage as backup
      localStorage.setItem('darkMode', isDark.toString())

      // Save to user account
      try {
        await updateUserPreference('darkMode', isDark)
      } catch (err) {
        console.error('Failed to save dark mode preference:', err)
      }
    }
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
    initializeDarkMode,
    toggleDarkMode,
    setDarkMode,
  }
}
    toggleDarkMode,
    setDarkMode,
    initializeDarkMode,
  }
}
