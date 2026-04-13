<script setup>
import { ref, onMounted } from 'vue'
import { AlertTriangle } from '@lucide/vue'
import { useFetchData } from '../../composables/useFetchData'

const { fetchStoresAndKiosks, getStoresWithIssues } = useFetchData()
const priorityAlerts = ref([])

onMounted(async () => {
  try {
    const { stores, kiosks } = await fetchStoresAndKiosks()
    const issues = getStoresWithIssues(stores, kiosks)
    // Get top 3 critical issues
    priorityAlerts.value = issues.slice(0, 3)
  } catch (err) {
    console.error('Failed to load priority alerts:', err)
  }
})
</script>

<template>
  <div v-if="priorityAlerts.length > 0" class="animate-fade-in">
    <div class="flex items-center gap-2 mb-4">
      <AlertTriangle class="w-5 h-5 text-red-600" />
      <h3 class="text-lg font-semibold text-gray-900">Priority Alerts</h3>
      <span class="ml-auto text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
        {{ priorityAlerts.length }} issue{{ priorityAlerts.length > 1 ? 's' : '' }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div
        v-for="alert in priorityAlerts"
        :key="alert.id"
        class="bg-linear-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
      >
        <div class="flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 truncate">{{ alert.name }}</p>
            <p class="text-sm text-red-700 mt-1">
              {{ alert.offlineKiosks }} offline out of {{ alert.kiosksCount }}
            </p>
            <p class="text-xs text-red-600 mt-2">Requires immediate attention</p>
          </div>
        </div>
      </div>
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>
