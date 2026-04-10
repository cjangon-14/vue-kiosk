<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { UserPlus, AlertTriangle, Home, Wrench, Activity, MonitorUp, UserCog } from '@lucide/vue'
import { useFetchData } from '../composables/useFetchData'

const props = defineProps({
  showPagination: {
    type: Boolean,
    default: true,
  },
  maxItems: {
    type: Number,
    default: null,
  },
})

const { loading, error, fetchRecentActivities } = useFetchData()
const activities = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
let refreshIntervalId = null

const loadActivities = async () => {
  try {
    const data = await fetchRecentActivities()
    // Sort by timestamp in descending order (newest first)
    activities.value = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    currentPage.value = 1 // Reset to first page when activities reload
  } catch (err) {
    console.error('Failed to load recent activities:', err)
  }
}

const totalPages = computed(() => Math.ceil(activities.value.length / itemsPerPage))

const displayedActivities = computed(() => {
  let filtered = activities.value

  // Apply max items limit if set and pagination is disabled
  if (!props.showPagination && props.maxItems) {
    filtered = filtered.slice(0, props.maxItems)
  }

  // Apply pagination if enabled
  if (props.showPagination) {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filtered.slice(start, end)
  }

  return filtered
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const previousPage = () => goToPage(currentPage.value - 1)
const nextPage = () => goToPage(currentPage.value + 1)

onMounted(async () => {
  await loadActivities()

  // Refresh activities every 30 seconds
  refreshIntervalId = setInterval(() => {
    loadActivities()
  }, 30000)
})

const getActivityColor = (type) => {
  const colorMap = {
    'Kiosk Added': 'text-blue-600',
    'Admin Created': 'text-green-600',
    'Status Change': 'text-orange-600',
    'Store Created': 'text-purple-600',
    'Kiosk Maintenance': 'text-red-600',
    'Admin Updated': 'text-teal-600',
  }
  return colorMap[type] || 'text-gray-600'
}

const getActivityIcon = (type) => {
  const iconMap = {
    'Kiosk Added': MonitorUp,
    'Admin Created': UserPlus,
    'Status Change': AlertTriangle,
    'Store Created': Home,
    'Kiosk Maintenance': Wrench,
    'Admin Updated': UserCog,
  }
  return iconMap[type] || null
}

const getActivityBgColor = (type) => {
  const colorMap = {
    'Kiosk Added': 'bg-blue-50',
    'Admin Created': 'bg-green-50',
    'Status Change': 'bg-orange-50',
    'Store Created': 'bg-purple-50',
    'Kiosk Maintenance': 'bg-red-50',
    'Admin Updated': 'bg-teal-50',
  }
  return colorMap[type] || 'bg-gray-50'
}

// 1. Create a reactive 'now' state
const now = ref(Date.now())
let intervalId = null

const getTimeAgo = (dateString) => {
  if (!dateString) return 'never'
  const past = new Date(dateString)
  if (isNaN(past.getTime())) return 'invalid date'
  // Use the reactive 'now' value instead of new Date()
  const seconds = Math.floor((now.value - past) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

onMounted(() => {
  // 2. Update 'now' every 60 seconds
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 60000)
})

onUnmounted(() => {
  // 3. Stop the timer when leaving the page
  if (intervalId) clearInterval(intervalId)
  if (refreshIntervalId) clearInterval(refreshIntervalId)
})
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-smooth overflow-hidden"
  >
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center gap-3 justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <activity class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Recent Activity</h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Latest {{ displayedActivities.length }} changes
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-flex items-center gap-2 text-gray-500">
        <div
          class="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
        ></div>
        <p class="text-sm font-medium">Loading activities...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="m-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
    >
      ⚠️ Error loading data: {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="activities.length === 0" class="p-12 text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
        <activity class="w-6 h-6 text-gray-400" />
      </div>
      <p class="text-gray-600 font-medium">No recent activities yet</p>
      <p class="text-sm text-gray-500 mt-1">Activities will appear here as you make changes</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th
              class="text-left py-3 px-6 font-semibold text-gray-900 text-xs uppercase tracking-wider"
            >
              Type
            </th>
            <th
              class="text-left py-3 px-6 font-semibold text-gray-900 text-xs uppercase tracking-wider"
            >
              Description
            </th>
            <th
              class="text-right py-3 px-6 font-semibold text-gray-900 text-xs uppercase tracking-wider"
            >
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="activity in displayedActivities"
            :key="activity.id"
            class="border-b border-gray-100 hover:bg-blue-50/30 transition-smooth group"
          >
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'p-2.5 rounded-lg transition-smooth group-hover:scale-110',
                    getActivityBgColor(activity.type),
                  ]"
                >
                  <component
                    :is="getActivityIcon(activity.type)"
                    :class="['w-4 h-4', getActivityColor(activity.type)]"
                  />
                </div>
                <span :class="['font-semibold text-sm', getActivityColor(activity.type)]">
                  {{ activity.type }}
                </span>
              </div>
            </td>
            <td class="py-4 px-6">
              <p class="text-gray-700 text-sm font-medium">{{ activity.description }}</p>
            </td>
            <td class="py-4 px-6 text-right">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
              >
                {{ getTimeAgo(activity.timestamp) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div
      v-if="activities.length > 0 && showPagination"
      class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between"
    >
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, activities.length) }} of {{ activities.length }}
      </div>
      <div class="flex gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 text-sm rounded-lg transition',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
