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
  <div class="bg-white rounded-lg border border-gray-200 shadow-container">
    <div class="p-6 flex flex-col">
      <div class="flex items-center gap-2">
        <AlertCircle class="w-5 h-5 text-red-600" />
        <h2 class="text-xl font-bold text-gray-900">Stores with Issues</h2>
      </div>
      <p class="text-gray-500 text-sm mt-1">Stores that have offline kiosks requiring attention</p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Loading stores data...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      Error loading data: {{ error }}
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b-2 border-gray-200">
            <th
              class="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider"
            >
              Store Name
            </th>
            <th
              class="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider"
            >
              Offline Kiosks
            </th>
            <th
              class="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider"
            >
              Total Kiosks
            </th>
            <th
              class="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="store in storesWithIssues"
            :key="store.id"
            @click="navigateToStoreDetail(store.id)"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <td class="py-4 px-6 text-gray-900 font-medium flex items-center gap-2">
              <span class="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              {{ store.name }}
            </td>
            <td class="py-4 px-6">
              <div class="flex">
                <span
                  class="flex px-3 py-1.5 items-center rounded-lg gap-2"
                  :class="getStatusColor(store)"
                >
                  <CircleCheck
                    class="w-4 h-4"
                    :class="store.status === 'active' ? 'text-green-600' : 'text-gray-400'"
                  />
                  <span :class="[' text-sm font-medium ']">
                    {{ getStoreStatus(store) }}
                  </span>
                </span>
              </div>
            </td>
            <td class="py-4 px-6">
              <span
                class="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 w-fit"
              >
                <AlertCircle class="w-4 h-4" />
                {{ store.offlineKiosks }} Offline
              </span>
            </td>
            <td class="py-4 px-6 text-gray-900">{{ store.kiosksCount }}</td>
            <td class="py-4 px-6">
              <button
                @click.stop="navigateToStoreDetail(store.id)"
                class="text-blue-600 hover:text-blue-800 hover:cursor-pointer font-medium text-sm transition"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="storesWithIssues.length === 0" class="text-center py-8">
        <p class="text-gray-500">No stores with issues. All kiosks are running smoothly!</p>
      </div>
    </div>
  </div>
</template>
