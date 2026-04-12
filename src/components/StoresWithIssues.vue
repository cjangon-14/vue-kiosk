<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle, CircleCheck } from '@lucide/vue'
import { useFetchData } from '../composables/useFetchData'

const router = useRouter()
const { loading, error, fetchStoresAndKiosks, getStoresWithIssues } = useFetchData()
const storesWithIssues = ref([])

onMounted(async () => {
  try {
    const { stores, kiosks } = await fetchStoresAndKiosks()
    storesWithIssues.value = getStoresWithIssues(stores, kiosks)
  } catch (err) {
    console.error('Failed to load stores with issues:', err)
  }
})

const getStoreStatus = (store) => {
  return store.status === 'active' ? 'Active' : 'Inactive'
}

const getStatusColor = (store) => {
  return store.status === 'active'
    ? 'bg-green-100 text-green-700 border-green-200'
    : 'bg-gray-100 text-gray-700 border-gray-200'
}

const navigateToStoreDetail = (storeId) => {
  router.push(`/stores/${storeId}`)
}
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-smooth overflow-hidden h-auto"
  >
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50/50 to-white">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-red-100 rounded-lg">
          <AlertCircle class="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Stores with Issues</h2>
          <p class="text-xs text-gray-500 mt-0.5">
            Stores requiring attention due to offline kiosks
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-flex items-center gap-2 text-gray-500">
        <div
          class="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
        ></div>
        <p class="text-sm font-medium">Loading stores...</p>
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
    <div v-else-if="storesWithIssues.length === 0" class="p-12 text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
        <CircleCheck class="w-6 h-6 text-green-600" />
      </div>
      <p class="text-gray-700 font-semibold">All systems operational</p>
      <p class="text-sm text-gray-500 mt-1">All kiosks are running smoothly - no issues detected</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th
              class="text-left py-3 px-6 font-semibold text-gray-900 text-xs uppercase tracking-wider"
            >
              Store Name
            </th>
            <th
              class="text-left py-3 px-6 font-semibold text-gray-900 text-xs uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="text-left py-3 px-6 font-semibold text-gray-900 text-xs uppercase tracking-wider"
            >
              Offline Kiosks
            </th>
            <th
              class="text-left py-3 px-6 font-semibold text-gray-900 text-xs uppercase tracking-wider"
            >
              Total Kiosks
            </th>
            <th
              class="text-right py-3 px-6 font-semibold text-gray-900 text-xs uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="store in storesWithIssues"
            :key="store.id"
            class="border-b border-gray-100 hover:bg-red-50/30 transition-smooth group cursor-pointer"
            @click="navigateToStoreDetail(store.id)"
          >
            <!-- Store Name -->
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-subtle"></span>
                <span class="text-gray-900 font-semibold">{{ store.name }}</span>
              </div>
            </td>

            <!-- Status -->
            <td class="py-4 px-6">
              <span
                class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium transition-smooth"
                :class="
                  store.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                "
              >
                <CircleCheck class="w-4 h-4" />
                {{ getStoreStatus(store) }}
              </span>
            </td>

            <!-- Offline Kiosks -->
            <td class="py-4 px-6">
              <span
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-medium transition-smooth"
              >
                <AlertCircle class="w-4 h-4" />
                {{ store.offlineKiosks }} Offline
              </span>
            </td>

            <!-- Total Kiosks -->
            <td class="py-4 px-6">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {{ store.kiosksCount }} Total
              </span>
            </td>

            <!-- Action -->
            <td class="py-4 px-6 text-right">
              <button
                @click.stop="navigateToStoreDetail(store.id)"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-smooth hover:bg-blue-50 text-blue-600 hover:text-blue-700"
              >
                View Details
                <span>→</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
