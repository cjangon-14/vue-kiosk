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

  return {
    isAuthenticated,
    login,
    logout,
    getToken,
    getUser,
  }
}
