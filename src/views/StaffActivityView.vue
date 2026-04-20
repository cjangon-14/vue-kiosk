<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useStaffData } from '@/composables/useStaffData'

const { isDarkMode } = useDarkMode()
const { staffActivityLogs, fetchStaffActivityLogs } = useStaffData()

const currentPage = ref(1)
const itemsPerPage = 20

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
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return staffActivityLogs.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(staffActivityLogs.value.length / itemsPerPage)
})
</script>

<template>
  <div
    :class="[
      'flex mt-12 ml-64 min-h-screen',
      isDarkMode
        ? 'bg-slate-950'
        : 'bg-linear-to-br from-gray-50 to-gray-100',
    ]"
  >
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <!-- Header -->
      <div class="mb-8">
        <h1 :class="['text-3xl font-bold', isDarkMode ? 'text-slate-50' : 'text-gray-900']">
          Staff Activity
        </h1>
        <p
          :class="['mt-2 text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-600']"
        >
          View all staff activities including logins, logouts, and modifications
        </p>
      </div>

      <!-- Breadcrumb -->
      <nav :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
        <span :class="['font-semibold', isDarkMode ? 'text-slate-200' : 'text-gray-900']">Staff Activity</span>
        <span :class="[isDarkMode ? 'text-slate-600' : 'text-gray-400']">→</span>
        <span :class="[isDarkMode ? 'text-slate-400' : 'text-gray-600']">All Activities</span>
      </nav>

      <!-- Activity List -->
      <div
        :class="[
          'mt-8 rounded-lg border overflow-hidden',
          isDarkMode
            ? 'border-slate-700 bg-slate-900'
            : 'border-gray-200 bg-white',
        ]"
      >
        <div class="divide-y" :class="[isDarkMode ? 'divide-slate-700' : 'divide-gray-200']">
          <div
            v-for="log in paginatedLogs"
            :key="log.id"
            :class="[
              'p-6 transition hover:opacity-80',
              getActivityColor(log.type),
            ]"
          >
            <div class="flex items-start gap-4">
              <span class="mt-0.5 text-2xl flex-shrink-0">{{ getActivityIcon(log.type) }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p :class="['text-sm font-semibold', isDarkMode ? 'text-slate-50' : 'text-gray-900']">
                      {{ log.type }}
                    </p>
                    <p :class="['mt-1 text-sm', isDarkMode ? 'text-slate-300' : 'text-gray-600']">
                      {{ log.description }}
                    </p>
                  </div>
                  <p
                    :class="[
                      'text-xs whitespace-nowrap flex-shrink-0',
                      isDarkMode ? 'text-slate-500' : 'text-gray-500',
                    ]"
                  >
                    {{ formatTime(log.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="staffActivityLogs.length === 0" :class="['p-12 text-center', isDarkMode ? 'bg-slate-800' : 'bg-gray-50']">
            <p :class="[isDarkMode ? 'text-slate-400' : 'text-gray-600']">
              No staff activities recorded yet
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        :class="['mt-8 flex items-center justify-center gap-2']"
      >
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition',
            currentPage === 1
              ? isDarkMode
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isDarkMode
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Previous
        </button>

        <div :class="['flex items-center gap-1']">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 rounded text-sm font-medium transition',
              currentPage === page
                ? isDarkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white'
                : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-700'
                  : 'text-gray-600 hover:bg-gray-100',
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition',
            currentPage === totalPages
              ? isDarkMode
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isDarkMode
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
