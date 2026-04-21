<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from '@lucide/vue'
import { useAuth } from '../../composables/useAuth'
import { useDarkMode } from '../../composables/useDarkMode'
import { useActivityLog } from '../../composables/useActivityLog'

const router = useRouter()
const { logout, getUser } = useAuth()
const { initializeDarkMode } = useDarkMode()
const { logUserLoggedOut } = useActivityLog()
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const currentUser = computed(() => getUser())

const props = defineProps({
  seed: { type: String, default: 'SAdmin' },
})

const src = computed(() => {
  const url = new URL('https://api.dicebear.com/9.x/lorelei/svg')
  url.searchParams.set('seed', props.seed)
  url.searchParams.set('size', '128')
  return url.href
})

const handleLogout = async () => {
  const currentUserData = currentUser.value
  logout()

  // Log logout activity before navigating
  if (currentUserData?.username) {
    await logUserLoggedOut(currentUserData.username, currentUserData.role, currentUserData.storeId)
  }

  isDropdownOpen.value = false
  window.history.pushState(null, null, window.location.href)
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  initializeDarkMode()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <!-- User Profile Button -->
    <button
      @click="isDropdownOpen = !isDropdownOpen"
      class="flex gap-5 mr-4 items-center px-2 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
    >
      <div class="border border-blue-400 rounded-full size-11 flex items-center justify-center">
        <img :src="src" alt="Avatar" class="w-8 h-8 rounded-full bg-gray-200" />
      </div>
      <div class="flex flex-col text-left">
        <h2 class="font-inter font-semibold text-sm">
          {{ currentUser?.firstName }} {{ currentUser?.lastName }}
        </h2>
        <p class="text-xs text-gray-500">{{ currentUser?.role }}</p>
      </div>
      <!-- Chevron Down Icon -->
      <ChevronDown
        class="w-4 h-4 text-gray-600 transition"
        :class="isDropdownOpen ? 'rotate-180' : ''"
      />
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <!-- Profile Option -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-900">
            {{ currentUser?.firstName }} {{ currentUser?.lastName }}
          </p>
          <p class="text-xs text-gray-500">{{ currentUser?.email }}</p>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          <button
            @click="isDropdownOpen = false"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50 transition"
          >
            Profile Settings
          </button>
          <button
            @click="isDropdownOpen = false"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50 transition"
          >
            Help & Support
          </button>
        </div>

        <!-- Logout Button -->
        <div class="border-t border-gray-100 px-4 py-2">
          <button
            @click="handleLogout"
            class="w-full px-3 py-2 text-sm text-red-600 hover:cursor-pointer hover:bg-red-50 rounded-lg transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
