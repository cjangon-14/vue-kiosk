<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFetchData } from '../composables/useFetchData'

const router = useRouter()
const { fetchStoresAndKiosks, loading } = useFetchData()

const stores = ref([])
const searchQuery = ref('')
const selectedStatus = ref('All Status')

const statuses = ['All Status', 'Active', 'Inactive']

const filteredStores = computed(() => {
  return stores.value.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      selectedStatus.value === 'All Status' ||
      store.status.toLowerCase() === selectedStatus.value.toLowerCase()
    return matchesSearch && matchesStatus
  })
})

const getStatusColor = (status) => {
  return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

onMounted(async () => {
  try {
    const { stores: fetchedStores } = await fetchStoresAndKiosks()
    stores.value = fetchedStores
  } catch (err) {
    console.error('Failed to load stores', err)
  }
})

const navigateToStore = (storeId) => {
  router.push(`/stores/${storeId}`)
}

const handleViewStore = (storeId, event) => {
  event.stopPropagation()
  navigateToStore(storeId)
}

const handleEditStore = (storeId, event) => {
  event.stopPropagation()
  console.log('Edit store:', storeId)
}

const handleDeleteStore = (storeId, event) => {
  event.stopPropagation()
  console.log('Delete store:', storeId)
}
</script>

<template>
  <div class="flex ml-64 pt-16 bg-gray-50 min-h-screen">
    <RouterView />
    <div v-if="!$route.params.id" class="p-8 flex flex-col w-full max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Stores</h1>
          <p class="text-gray-600 mt-1">Manage all your store locations</p>
        </div>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
        >
          + Create Store
        </button>
      </div>

      <!-- Search and Filter Section -->
      <div class="flex gap-4 mb-6">
        <div class="flex-1 relative">
          <svg
            class="absolute left-3 top-3 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="8" cy="8" r="6"></circle>
            <path d="M13 13l4 4"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search stores..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          v-model="selectedStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
        >
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">STORE NAME</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                NUMBER OF KIOSKS
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                NUMBER OF ADMINS
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">STATUS</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">LAST ACTIVITY</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="store in filteredStores"
              :key="store.id"
              @click="navigateToStore(store.id)"
              class="hover:bg-gray-50 transition duration-150 cursor-pointer"
            >
              <td class="px-6 py-4">
                <span class="text-gray-900 font-medium">{{ store.name }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-700">{{ store.kiosksCount }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-700">{{ store.adminsCount }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getStatusColor(store.status),
                  ]"
                >
                  {{ getStatusLabel(store.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-600 text-sm">{{ store.lastActivity }}</span>
              </td>
              <td class="px-6 py-4 flex gap-3">
                <button
                  @click="handleViewStore(store.id, $event)"
                  class="text-blue-500 hover:text-blue-700 transition"
                  title="View"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <button
                  @click="handleEditStore(store.id, $event)"
                  class="text-gray-500 hover:text-gray-700 transition"
                  title="Edit"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                </button>
                <button
                  @click="handleDeleteStore(store.id, $event)"
                  class="text-red-500 hover:text-red-700 transition"
                  title="Delete"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    ></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredStores.length === 0" class="px-6 py-12 text-center">
          <p class="text-gray-500">No stores found matching your search criteria.</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Loading stores...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
  display: inline-block;
}
</style>
