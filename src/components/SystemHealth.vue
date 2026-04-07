<script setup>
import { ref, onMounted } from 'vue'
import { useFetchData } from '../composables/useFetchData'

const { fetchStoresAndKiosks, calculateKioskStats } = useFetchData()
const healthPercentage = ref(0)
const loading = ref(true)

onMounted(async () => {
  try {
    const { kiosks } = await fetchStoresAndKiosks()
    const kioskStats = calculateKioskStats(kiosks)

    // Calculate health percentage (active / total * 100)
    const activePercentage =
      kioskStats.total > 0 ? Math.round((kioskStats.active / kioskStats.total) * 100) : 0
    healthPercentage.value = activePercentage
  } catch (err) {
    console.error('Failed to calculate system health:', err)
  } finally {
    loading.value = false
  }
})

const getHealthColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const getHealthBgColor = (percentage) => {
  if (percentage >= 90) return 'bg-green-100'
  if (percentage >= 70) return 'bg-yellow-100'
  return 'bg-red-100'
}
</script>

<template>
  <div
    class="bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500 text-sm font-medium uppercase tracking-wider">System Health</p>
        <p class="text-gray-600 text-sm mt-1">Overall kiosk availability</p>
      </div>

      <div v-if="!loading" class="flex flex-col items-center">
        <div class="relative w-24 h-24 flex items-center justify-center">
          <!-- Background circle -->
          <svg class="absolute w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="3" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              :stroke-dasharray="`${healthPercentage * 2.827} 282.7`"
              :class="[getHealthColor(healthPercentage), 'transition-all duration-500']"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
          <!-- Center text -->
          <div class="text-center">
            <p :class="['text-3xl font-bold', getHealthColor(healthPercentage)]">
              {{ healthPercentage }}%
            </p>
          </div>
        </div>
        <p
          :class="[
            'text-xs font-medium mt-3 px-3 py-1 rounded-full',
            getHealthBgColor(healthPercentage),
            getHealthColor(healthPercentage),
          ]"
        >
          {{
            healthPercentage >= 90
              ? 'Excellent'
              : healthPercentage >= 70
                ? 'Good'
                : 'Needs Attention'
          }}
        </p>
      </div>

      <div v-else class="text-gray-400">Loading...</div>
    </div>
  </div>
</template>
