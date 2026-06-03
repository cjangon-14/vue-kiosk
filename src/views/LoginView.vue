<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { useActivityLog } from '../composables/useActivityLog'
import { apiService } from '../api/apiService'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  AlertCircle,
} from '@lucide/vue'

const router = useRouter()
const { login } = useAuth()
const { success, error: showError } = useToast()
const { logUserLoggedIn } = useActivityLog()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showDemoCredentials = ref(false)

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
      const superadminRes = await fetch('/api/superadmin').catch(() => null)
      if (superadminRes?.ok) {
        const superadminData = await superadminRes.json()

        if (
          superadminData.username === username.value &&
          superadminData.password === password.value
        ) {
          isValidUser = true
          adminData = superadminData
        }
      }

      // If not superadmin, check regular admins
      if (!isValidUser) {
        const adminsList = await apiService.getAdmins()

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

      // Log login activity
      await logUserLoggedIn(adminData.username, adminData.role, storeId)

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

const handleRetry = () => {
  error.value = ''
  handleLogin()
}

const fillDemoCredentials = (user, pass) => {
  username.value = user
  password.value = pass
}

const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Left Panel: Branding & System Status (Hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col items-center justify-center p-8">
      <div class="text-center max-w-md">
        <!-- Logo/Title -->
        <div class="mb-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur">
            <User class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-4xl font-bold text-white mb-3">Admin Portal</h1>
          <p class="text-slate-300 text-lg">Kiosk Management System</p>
        </div>

        <!-- System Status Card -->
        <div class="space-y-4">
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition">
            <p class="text-slate-300 text-sm font-medium mb-2">System Status</p>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <p class="text-emerald-400 font-semibold">Online</p>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <p class="text-slate-300 text-sm font-medium mb-2">Version</p>
            <p class="text-slate-200 font-semibold">1.0.0</p>
          </div>
        </div>

        <!-- Footer Info -->
        <p class="text-slate-400 text-sm mt-12">Secure Admin Access</p>
      </div>
    </div>

    <!-- Right Panel: Login Form -->
    <div class="flex-1 flex items-center justify-center p-6 lg:p-8">
      <div class="w-full max-w-md">
        <!-- Form Container -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 lg:p-10">
          <!-- Header -->
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p class="text-gray-600">Sign in to your admin account</p>
          </div>

          <!-- Form -->
          <form @keydown="handleKeydown" class="space-y-6">
            <!-- Username Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2">Username</label>
              <div class="relative">
                <User class="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  v-model="username"
                  type="text"
                  placeholder="Enter your username"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2">Password</label>
              <div class="relative">
                <Lock class="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Enter your password"
                  @keydown="handleKeydown"
                  class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Sign In Button -->
            <button
              type="button"
              @click.prevent="handleLogin"
              :disabled="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 mt-8 shadow-md hover:shadow-lg"
            >
              <span v-if="!isLoading">Sign In</span>
              <span v-else class="flex items-center justify-center gap-2">
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing in...
              </span>
            </button>

            <!-- Error Alert -->
            <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div class="flex items-start gap-3">
                <AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-red-900">{{ error }}</p>
                  <p class="text-xs text-red-700 mt-1">Error Code: 504</p>
                </div>
                <button
                  type="button"
                  @click="handleRetry"
                  class="text-sm font-semibold text-red-700 hover:text-red-900 underline whitespace-nowrap ml-2"
                >
                  Try Again
                </button>
              </div>
            </div>
          </form>

          <!-- Demo Credentials Section -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="showDemoCredentials = !showDemoCredentials"
              class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{{ showDemoCredentials ? 'Hide Demo Credentials' : 'Auto-Fill Demo Credentials' }}</span>
              <ChevronDown
                class="w-4 h-4 transition-transform duration-200"
                :class="showDemoCredentials ? 'rotate-180' : ''"
              />
            </button>

            <!-- Demo Credentials Panel -->
            <div
              v-if="showDemoCredentials"
              class="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <!-- Super Admin -->
              <button
                type="button"
                @click="fillDemoCredentials('admin', 'password123')"
                class="w-full px-6 py-4 bg-slate-800 border-l-2 border-l-blue-500 rounded-xl hover:bg-slate-700 transition-all text-left group"
              >
                <p class="text-xs font-semibold text-slate-100 mb-2">Super Admin</p>
                <p class="text-xs font-mono text-slate-400 group-hover:text-slate-300 font-medium">
                  admin / password123
                </p>
              </button>

              <!-- Store Admin -->
              <button
                type="button"
                @click="fillDemoCredentials('john1', 'password123')"
                class="w-full px-6 py-4 bg-slate-800 border-l-2 border-l-emerald-500 rounded-xl hover:bg-slate-700 transition-all text-left group"
              >
                <p class="text-xs font-semibold text-slate-100 mb-2">Store Admin (McDonald's)</p>
                <p class="text-xs font-mono text-slate-400 group-hover:text-slate-300 font-medium">
                  john1 / password123
                </p>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <p class="text-center text-xs text-gray-500 mt-6">For demo and testing purposes only</p>
        </div>
      </div>
    </div>
  </div>
</template>
