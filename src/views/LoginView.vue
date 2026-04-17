<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { login } = useAuth()
const { success, error: showError } = useToast()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password'
    return
  }

  try {
    isLoading.value = true
    error.value = ''

    // Validate credentials against the database
    let isValidUser = false
    let adminData = null
    let storeId = null

    try {
      // First check superadmin
      const superadminRes = await fetch('http://localhost:3005/superadmin')
      const superadminData = await superadminRes.json()

      if (superadminData.username === username.value && superadminData.password === password.value) {
        isValidUser = true
        adminData = superadminData
      } else {
        // If not superadmin, check regular admins
        const adminsRes = await fetch('http://localhost:3005/admins')
        const adminsList = await adminsRes.json()

        // Search through all stores' admins
        for (const storeIdKey in adminsList) {
          const storeAdmins = adminsList[storeIdKey]
          const foundAdmin = storeAdmins.find(
            (admin) => admin.username === username.value && admin.password === password.value,
          )
          if (foundAdmin) {
            isValidUser = true
            adminData = foundAdmin
            storeId = storeIdKey
            break
          }
        }
      }
    } catch (err) {
      console.error('Failed to validate credentials:', err)
      error.value = 'Failed to connect to server'
      isLoading.value = false
      return
    }

    if (isValidUser) {
      // Generate a unique token
      const token = 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()

      // Store auth data
      login(token, {
        id: adminData.id,
        username: adminData.username,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: adminData.role,
        storeId: storeId,
      })

      // Clear history and navigate
      window.history.pushState(null, null, window.location.href)

      // Redirect based on role
      success(`Welcome back, ${adminData.firstName}!`)
      if (adminData.role === 'Super Admin') {
        router.push('/dashboard')
      } else {
        router.push('/client')
      }
    } else {
      error.value = 'Invalid username or password'
      showError('Invalid username or password')
    }
  } catch (err) {
    error.value = 'Login failed. Please try again.'
    showError('Login failed. Please try again.')
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Kiosk Admin</h1>
        <p class="text-gray-600">Sign in to your account</p>
      </div>

      <!-- Form -->
      <form @keydown="handleKeydown" class="space-y-4">
        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Username Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="admin"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Login Button -->
        <button
          @click.prevent="handleLogin"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 mt-6"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-600 mt-6">
        Demo credentials: admin / password123
      </p>
    </div>
  </div>
</template>
