<script setup>
import { ref, onMounted } from 'vue'
import { Store, AlertCircle, Activity, Monitor } from '@lucide/vue'
import StatCard from '../components/StatCard.vue'
import StoresWithIssues from '../components/StoresWithIssues.vue'
import RecentActivity from '../components/RecentActivity.vue'
import { useFetchData } from '../composables/useFetchData'

const { fetchStoresAndKiosks, calculateKioskStats } = useFetchData()

const stats = ref({
  totalStores: 0,
  totalKiosks: 0,
  activeKiosks: 0,
  offlineKiosks: 0,
})

const previousStats = ref({
  totalKiosks: 35,
  activeKiosks: 28,
})

onMounted(async () => {
  try {
    const { stores, kiosks } = await fetchStoresAndKiosks()

    stats.value.totalStores = stores.length

    const kioskStats = calculateKioskStats(kiosks)
    stats.value.totalKiosks = kioskStats.total
    stats.value.activeKiosks = kioskStats.active
    stats.value.offlineKiosks = kioskStats.offline
  } catch (err) {
    console.error('Failed to load dashboard:', err)
  }
})

const calculateTrend = (current, previous) => {
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return null
}

const calculateTrendValue = (current, previous) => {
  const diff = Math.abs(current - previous)
  return diff > 0 ? `${diff}` : null
}
</script>

<template>
  <div class="flex ml-64 bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div class="space-y-6 h-auto">
        <!-- Header Section -->
        <div class="animate-fade-in">
          <div class="mb-6"></div>

          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm text-gray-600">
            <span class="font-semibold text-gray-900">Dashboard</span>
            <span class="text-gray-400">→</span>
            <span class="text-gray-600">Overview</span>
          </nav>
        </div>

        <!-- System Metrics Section -->
        <div style="animation-delay: 0.1s" class="animate-slide-in">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Monitor class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">System Metrics</h2>
              <p class="text-sm text-gray-500">Real-time overview of your infrastructure</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Stores" :value="stats.totalStores" :icon="Store" color="blue" />
            <StatCard
              title="Total Kiosks"
              :value="stats.totalKiosks"
              :icon="Monitor"
              color="purple"
              :trend="calculateTrend(stats.totalKiosks, previousStats.totalKiosks)"
              :trend-value="calculateTrendValue(stats.totalKiosks, previousStats.totalKiosks)"
            />
            <StatCard
              title="Active Kiosks"
              :value="stats.activeKiosks"
              :icon="Activity"
              color="green"
              :trend="calculateTrend(stats.activeKiosks, previousStats.activeKiosks)"
              :trend-value="calculateTrendValue(stats.activeKiosks, previousStats.activeKiosks)"
            />
            <StatCard
              title="Offline Kiosks"
              :value="stats.offlineKiosks"
              :icon="AlertCircle"
              color="red"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

        <!-- Stores with Issues -->
        <div style="animation-delay: 0.2s" class="animate-slide-in">
          <StoresWithIssues />
        </div>

        <!-- Recent Activity -->
        <div style="animation-delay: 0.3s" class="animate-slide-in">
          <RecentActivity :show-pagination="false" :max-items="5" />
        </div>
      </div>
    </div>
  </div>
</template>
