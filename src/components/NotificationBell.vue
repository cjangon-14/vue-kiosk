<script setup>
import { ref, onMounted } from 'vue'
import { Bell, X } from '@lucide/vue'
import { useFetchData } from '../composables/useFetchData'

const { fetchStoresAndKiosks, getStoresWithIssues } = useFetchData()
const isOpen = ref(false)
const notifications = ref([])
const unreadCount = ref(0)

onMounted(async () => {
  try {
    const { stores, kiosks } = await fetchStoresAndKiosks()
    const issues = getStoresWithIssues(stores, kiosks)
    notifications.value = issues.map((issue) => ({
      id: issue.id,
      title: issue.name,
      message: `${issue.offlineKiosks} kiosk${issue.offlineKiosks > 1 ? 's' : ''} offline`,
      type: 'warning',
      timestamp: 'just now',
      read: false,
    }))
    unreadCount.value = notifications.value.filter((n) => !n.read).length
  } catch (err) {
    console.error('Failed to load notifications:', err)
  }
})

const toggleNotifications = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    markAsRead()
  }
}

const markAsRead = () => {
  notifications.value.forEach((n) => {
    n.read = true
  })
  unreadCount.value = 0
}

const clearNotifications = () => {
  notifications.value = []
  unreadCount.value = 0
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      @click="toggleNotifications"
      class="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
      aria-label="Notifications"
    >
      <Bell class="w-6 h-6" />
      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Notification Dropdown -->
    <transition name="slide-down">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg"
        >
          <h3 class="font-semibold text-gray-900">Notifications</h3>
          <button
            @click="toggleNotifications"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500">
            <Bell class="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No notifications</p>
          </div>

          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div class="flex gap-3">
              <!-- Alert Icon -->
              <div class="flex-shrink-0 mt-1">
                <div
                  :class="[
                    'w-2 h-2 rounded-full',
                    notification.type === 'warning' ? 'bg-red-500' : 'bg-blue-500',
                  ]"
                ></div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900">{{ notification.title }}</p>
                <p class="text-sm text-gray-600 mt-0.5">{{ notification.message }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ notification.timestamp }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          v-if="notifications.length > 0"
          class="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg"
        >
          <button
            @click="clearNotifications"
            class="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </transition>

    <!-- Overlay to close -->
    <div v-if="isOpen" @click="toggleNotifications" class="fixed inset-0 z-40"></div>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
