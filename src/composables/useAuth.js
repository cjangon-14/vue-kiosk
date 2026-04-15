import { ref, computed } from 'vue'

const authToken = ref(localStorage.getItem('authToken') || null)
const adminUser = ref(() => {
  const user = localStorage.getItem('adminUser')
  return user ? JSON.parse(user) : null
})

export const useAuth = () => {
  const isAuthenticated = computed(() => !!authToken.value)

  const login = (token, user) => {
    authToken.value = token
    localStorage.setItem('authToken', token)
    localStorage.setItem('adminUser', JSON.stringify(user))
  }

  const logout = () => {
    authToken.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('adminUser')
  }

  const getToken = () => authToken.value

  const getUser = () => {
    const user = localStorage.getItem('adminUser')
    return user ? JSON.parse(user) : null
  }

  const updateUserPreference = async (key, value) => {
    const user = getUser()
    if (!user) return

    // Update local user object
    user[key] = value
    localStorage.setItem('adminUser', JSON.stringify(user))

    // Optionally sync with backend
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'
      await fetch(`${API_BASE_URL}/admins/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken.value}`,
        },
        body: JSON.stringify({ [key]: value }),
      })
    } catch (err) {
      console.error('Failed to update user preference on backend:', err)
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
    getToken,
    getUser,
    updateUserPreference,
  }
}
