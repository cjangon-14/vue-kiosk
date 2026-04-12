<script setup>
import { ref, onMounted } from 'vue'
import { useFetchData } from '../composables/useFetchData'
import { Settings } from '@lucide/vue'

const { fetchStoresAndKiosks, calculateKioskStats } = useFetchData()
const healthPercentage = ref(0)
const kioskStats = ref({ active: 0, offline: 0, unconfigured: 0, total: 0 })
const loading = ref(true)

onMounted(async () => {
  try {
    const { kiosks } = await fetchStoresAndKiosks()
    const stats = calculateKioskStats(kiosks)

    // Calculate unconfigured as the difference (32 + 4 + unconfigured = 39)
    const unconfigured = Math.max(0, 39 - (stats.active + stats.offline))

    kioskStats.value = {
      active: stats.active,
      offline: stats.offline,
      unconfigured: unconfigured,
      total: 39,
    }

    // Calculate availability as (active / total) * 100, rounded to one decimal place
    const activePercentage = Math.round((stats.active / 39) * 1000) / 10;
    healthPercentage.value = activePercentage;
  } catch (err) {
    console.error('Failed to calculate system health:', err)
  } finally {
    loading.value = false
  }
})

const getHealthColor = (percentage) => {
  if (percentage >= 95) return 'text-emerald-600'
  if (percentage >= 80) return 'text-amber-600'
  return 'text-red-600'
}

const getHealthGradient = (percentage) => {
  if (percentage >= 95) return 'from-emerald-500 to-emerald-600'
  if (percentage >= 80) return 'from-amber-500 to-amber-600'
  return 'from-red-500 to-red-600'
}

const getHealthLightBg = (percentage) => {
  if (percentage >= 95) return 'from-emerald-50 to-emerald-100/50'
  if (percentage >= 80) return 'from-amber-50 to-amber-100/50'
  return 'from-red-50 to-red-100/50'
}

const getHealthIconBg = (percentage) => {
  if (percentage >= 95) return 'bg-emerald-100 text-emerald-600'
  if (percentage >= 80) return 'bg-amber-100 text-amber-600'
  return 'bg-red-100 text-red-600'
}

const getHealthStatus = (percentage) => {
  if (percentage >= 95) return 'Good'
  if (percentage >= 80) return 'Warning'
  return 'Critical'
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default animate-slide-in"
  >
    <!-- Gradient background -->
    <div
      :class="`absolute inset-0 bg-gradient-to-br ${getHealthLightBg(healthPercentage)} opacity-40`"
    ></div>

    <!-- Gradient accent in top-right -->
    <div
      :class="`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${getHealthGradient(healthPercentage)} rounded-full opacity-5 group-hover:opacity-10 transition-all duration-300`"
    ></div>

    <!-- Content -->
    <div class="relative z-10">
      <!-- Header with icon -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <p class="text-sm font-medium text-gray-600 mb-1">System Health</p>
          <p class="text-gray-500 text-xs">Overall kiosk availability</p>
        </div>
        <!-- <div :class="['p-3 rounded-xl transition-all duration-300 group-hover:scale-110', getHealthIconBg(healthPercentage)]">
          <Settings class="w-6 h-6" />
        </div> -->
      </div>

      <!-- Main content -->
      <div v-if="!loading" class="space-y-5">
        <!-- Top row: Three main stats -->
        <div class="grid grid-cols-3 gap-4">
          <!-- Active Kiosks - Primary focus, larger -->
          <div class="col-span-1 bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100 rounded-2xl p-8 border border-emerald-200 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 cursor-pointer">
            <p class="text-xs text-emerald-700 font-bold mb-3 uppercase tracking-widest">Online</p>
            <div class="flex items-baseline gap-3 mb-3">
              <p class="text-6xl font-extrabold text-emerald-900">{{ kioskStats.active }}</p>
              <p class="text-sm text-emerald-700 font-semibold">of 39</p>
            </div>
            <p class="text-xs text-emerald-600">Kiosks operational</p>
          </div>

          <!-- Offline Kiosks -->
          <div class="col-span-1 bg-gradient-to-br from-red-50 via-red-50 to-red-100 rounded-2xl p-8 border border-red-200 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 cursor-pointer">
            <p class="text-xs text-red-700 font-bold mb-3 uppercase tracking-widest">Offline</p>
            <div class="flex items-baseline gap-3 mb-3">
              <p class="text-6xl font-bold text-red-900">{{ kioskStats.offline }}</p>
              <p class="text-sm text-red-700 font-semibold">of 39</p>
            </div>
            <p class="text-xs text-red-600">{{ kioskStats.offline > 0 ? 'Attention needed' : 'None' }}</p>
          </div>

          <!-- Unconfigured/Empty Stores -->
          <div class="col-span-1 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 cursor-pointer">
            <p class="text-xs text-gray-700 font-bold mb-3 uppercase tracking-widest">Unconfigured</p>
            <div class="flex items-baseline gap-3 mb-3">
              <p class="text-6xl font-extrabold text-gray-900">{{ kioskStats.unconfigured }}</p>
              <p class="text-sm text-gray-700 font-semibold">of 39</p>
            </div>
            <p class="text-xs text-gray-600">Empty stores</p>
          </div>
        </div>

        <!-- Secondary row: Status and availability -->
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-2xl p-6 border border-amber-200 shadow-sm transition-all duration-300 bg-gradient-to-br from-amber-50 to-amber-100/50 h-auto flex items-center">
            <div class="flex items-center justify-between w-full">
              <div>
                <p class="text-xs font-bold mb-1 uppercase tracking-widest text-amber-700">System Status</p>
                <p class="text-2xl font-bold text-amber-900">{{ getHealthStatus(healthPercentage) }}</p>
              </div>
              <div class="text-right">
                <p class="text-4xl font-bold text-amber-900">{{ healthPercentage }}%</p>
                <p class="text-xs font-semibold mt-1 text-amber-700">Available</p>
              </div>
            </div>
          </div>

          <!-- Recent Alerts -->
          <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col h-auto">
            <p class="text-xs font-bold mb-4 uppercase tracking-widest text-gray-700">Recent Alerts</p>
            <div class="space-y-0 flex-1">
              <div v-if="kioskStats.offline > 0" class="flex items-start gap-2 py-2 px-1 border-b border-gray-100">
                <div class="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                <p class="text-xs text-gray-700"><span class="font-semibold">{{ kioskStats.offline }} kiosks offline</span> - Check connectivity</p>
              </div>
              <div v-if="kioskStats.unconfigured > 0" class="flex items-start gap-2 py-2 px-1 border-b border-gray-100">
                <div class="w-2 h-2 mt-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
                <p class="text-xs text-gray-700"><span class="font-semibold">{{ kioskStats.unconfigured }} stores unconfigured</span> - Setup pending</p>
              </div>
              <div v-if="healthPercentage < 90" class="flex items-start gap-2 py-2 px-1 border-b border-gray-100">
                <div class="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                <p class="text-xs text-gray-700"><span class="font-semibold">Health below 90%</span> - Action required</p>
              </div>
              <div v-if="kioskStats.offline === 0 && kioskStats.unconfigured === 0" class="flex items-start gap-2 py-2 px-1">
                <div class="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                <p class="text-xs text-gray-700"><span class="font-semibold">All systems operational</span></p>
              </div>
            </div>
            <div class="mt-4 pt-2 border-t border-gray-100 flex justify-end">
              <a href="#" class="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline">View All →</a>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="h-40 flex items-center justify-center">
        <div class="text-gray-400 animate-pulse">Loading...</div>
      </div>
    </div>
  </div>
</template>
