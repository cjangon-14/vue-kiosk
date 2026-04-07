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
  <div class="flex ml-64 pt-16 min-h-screen bg-gray-50">
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div class="space-y-10 h-full">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span class="font-medium text-gray-900">Dashboard</span>
          <span>→</span>
          <span>Overview</span>
        </nav>

        <!-- Quick Stats Bar -->
        <!-- <div class="h-1 bg-linear-to-r from-blue-500 via-purple-500 to-red-500 rounded-full"></div> -->

        <!-- Priority Alerts -->
        <!-- <PriorityAlerts /> -->

        <!-- Key Metrics with Icon Accents -->
        <div>
          <div class="flex items-center gap-2 mb-6">
            <Monitor class="w-5 h-5 text-gray-900" />
            <h2 class="text-xl font-bold text-gray-900">System Metrics</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid -cols-4 gap-6">
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

        <!-- Visual Divider -->
        <div class="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>

        <!-- Stores with Issues -->
        <div>
          <StoresWithIssues />
        </div>

        <!-- Recent Activity -->
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  </div>
</template>
