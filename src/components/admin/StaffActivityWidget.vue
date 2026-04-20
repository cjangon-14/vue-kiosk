<script setup>
import { onMounted } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useStaffData } from '@/composables/useStaffData'

const { isDarkMode } = useDarkMode()
const { recentActivityLogs, fetchStaffActivityLogs } = useStaffData()

onMounted(() => {
  fetchStaffActivityLogs()
})

const getActivityIcon = (type) => {
  switch (type) {
    case 'Staff Added':
      return '➕'
    case 'Staff Updated':
      return '✏️'
    case 'Staff Deleted':
      return '❌'
    case 'Login':
      return '🔓'
    case 'Logout':
      return '🔒'
    default:
      return '📝'
  }
}

const getActivityColor = (type) => {
  if (isDarkMode.value) {
    switch (type) {
      case 'Staff Added':
        return 'bg-green-900/30 border-l-4 border-green-500'
      case 'Staff Updated':
        return 'bg-blue-900/30 border-l-4 border-blue-500'
      case 'Staff Deleted':
        return 'bg-red-900/30 border-l-4 border-red-500'
      case 'Login':
        return 'bg-purple-900/30 border-l-4 border-purple-500'
      case 'Logout':
        return 'bg-yellow-900/30 border-l-4 border-yellow-500'
      default:
        return 'bg-slate-900/30 border-l-4 border-slate-500'
    }
  } else {
    switch (type) {
      case 'Staff Added':
        return 'bg-green-50 border-l-4 border-green-500'
      case 'Staff Updated':
        return 'bg-blue-50 border-l-4 border-blue-500'
      case 'Staff Deleted':
        return 'bg-red-50 border-l-4 border-red-500'
      case 'Login':
        return 'bg-purple-50 border-l-4 border-purple-500'
      case 'Logout':
        return 'bg-yellow-50 border-l-4 border-yellow-500'
      default:
        return 'bg-slate-50 border-l-4 border-slate-500'
    }
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div
    :class="[
      'rounded-lg border p-6',
      isDarkMode
        ? 'border-slate-700 bg-slate-800'
        : 'border-gray-200 bg-white',
    ]"
  >
    <div class="flex items-center justify-between">
      <h3 :class="['text-lg font-semibold', isDarkMode ? 'text-slate-50' : 'text-gray-900']">
        Staff Activity
      </h3>
      <router-link
        to="/client/staff-activity"
        :class="[
          'text-sm font-medium transition',
          isDarkMode
            ? 'text-blue-400 hover:text-blue-300'
            : 'text-blue-600 hover:text-blue-700',
        ]"
      >
        View All →
      </router-link>
    </div>

    <div class="mt-4 space-y-3">
      <div
        v-for="log in recentActivityLogs"
        :key="log.id"
        :class="['rounded-lg p-4 transition', getActivityColor(log.type)]"
      >
        <div class="flex items-start gap-3">
          <span class="mt-0.5 text-lg">{{ getActivityIcon(log.type) }}</span>
          <div class="flex-1 min-w-0">
            <p :class="['text-sm font-medium', isDarkMode ? 'text-slate-50' : 'text-gray-900']">
              {{ log.type }}
            </p>
            <p :class="['mt-0.5 text-sm', isDarkMode ? 'text-slate-300' : 'text-gray-600']">
              {{ log.description }}
            </p>
            <p :class="['mt-1 text-xs', isDarkMode ? 'text-slate-500' : 'text-gray-500']">
              {{ formatTime(log.timestamp) }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="recentActivityLogs.length === 0"
        :class="[
          'rounded-lg p-4 text-center',
          isDarkMode ? 'bg-slate-700' : 'bg-gray-50',
        ]"
      >
        <p :class="[isDarkMode ? 'text-slate-400' : 'text-gray-600']">
          No activity recorded yet
        </p>
      </div>
    </div>
  </div>
</template>
