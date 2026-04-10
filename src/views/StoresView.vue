<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFetchData } from '../composables/useFetchData'
import AddStoreModal from '../components/AddStoreModal.vue'
import EditStoreModal from '../components/EditStoreModal.vue'
import DeleteStoreModal from '../components/DeleteStoreModal.vue'

const router = useRouter()
const { fetchStoresAndKiosks, loading } = useFetchData()

const stores = ref([])
const searchQuery = ref('')
const selectedStatus = ref('All Status')
const isAddStoreModalOpen = ref(false)
const isEditStoreModalOpen = ref(false)
const isDeleteStoreModalOpen = ref(false)
const selectedStore = ref(null)
const admins = ref({})
const kiosks = ref({})

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

const navigateToStore = (storeId) => {
  router.push(`/stores/${storeId}`)
}

const handleViewStore = (storeId, event) => {
  event.stopPropagation()
  navigateToStore(storeId)
}

const handleEditStore = (store, event) => {
  event.stopPropagation()
  selectedStore.value = store
  isEditStoreModalOpen.value = true
}

const handleDeleteStore = (store, event) => {
  event.stopPropagation()
  selectedStore.value = store
  isDeleteStoreModalOpen.value = true
}

const handleEditStoreClose = () => {
  isEditStoreModalOpen.value = false
  selectedStore.value = null
}

const handleEditStoreSubmit = (updatedStore) => {
  const index = stores.value.findIndex((s) => s.id === updatedStore.id)
  if (index !== -1) {
    stores.value[index] = updatedStore
  }
  isEditStoreModalOpen.value = false
  selectedStore.value = null
}

const handleDeleteStoreClose = () => {
  isDeleteStoreModalOpen.value = false
  selectedStore.value = null
}

const handleDeleteStoreSubmit = (storeId) => {
  stores.value = stores.value.filter((s) => s.id !== storeId)
  isDeleteStoreModalOpen.value = false
  selectedStore.value = null
}

const handleAddStoreClick = () => {
  isAddStoreModalOpen.value = true
}

const handleAddStoreClose = () => {
  isAddStoreModalOpen.value = false
}

const handleAddStoreSubmit = async (newStore) => {
  stores.value.push(newStore)
  isAddStoreModalOpen.value = false
}
onMounted(async () => {
  try {
    const {
      stores: fetchedStores,
      admins: fetchedAdmins,
      kiosks: fetchedKiosks,
    } = await fetchStoresAndKiosks()
    stores.value = fetchedStores
    admins.value = fetchedAdmins
    kiosks.value = fetchedKiosks
  } catch (err) {
    console.error('Failed to load stores', err)
  }
})

// 1. Create a reactive 'now' state
const now = ref(Date.now())
let intervalId = null

const getTimeAgo = (dateString) => {
  if (!dateString) return 'never'
  const past = new Date(dateString)
  if (isNaN(past.getTime())) return 'invalid date'
  // Use the reactive 'now' value instead of new Date()
  const seconds = Math.floor((now.value - past) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

onMounted(() => {
  // 2. Update 'now' every 60 seconds
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 60000)
})

onUnmounted(() => {
  // 3. Stop the timer when leaving the page
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="flex ml-64 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    <AddStoreModal
      :isOpen="isAddStoreModalOpen"
      @close="handleAddStoreClose"
      @submit="handleAddStoreSubmit"
    />
    <EditStoreModal
      :isOpen="isEditStoreModalOpen"
      :store="selectedStore"
      @close="handleEditStoreClose"
      @submit="handleEditStoreSubmit"
    />
    <DeleteStoreModal
      :isOpen="isDeleteStoreModalOpen"
      :storeId="selectedStore?.id"
      @close="handleDeleteStoreClose"
      @submit="handleDeleteStoreSubmit"
    />
    <RouterView />
    <div v-if="!$route.params.id" class="p-8 flex flex-col w-full max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-12 animate-fade-in"></div>

      <!-- Search and Filter Section -->
      <div class="flex gap-4 mb-8">
        <div class="flex-1 relative">
          <svg
            class="absolute left-4 top-3.5 text-gray-400"
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
            placeholder="Search stores by name..."
            class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth placeholder-gray-500"
          />
        </div>
        <select
          v-model="selectedStatus"
          class="px-4 py-3 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 font-medium transition-smooth hover:cursor-pointer hover:shadow-md"
        >
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <button
          @click="handleAddStoreClick"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition-smooth"
        >
          <span>+</span>
          <span>Create Store</span>
        </button>
      </div>

      <!-- Table Section -->
      <div
        class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-smooth overflow-hidden animate-slide-in"
      >
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
                <span class="text-gray-700">{{ kiosks[String(store.id)]?.length || 0 }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-700">{{ admins[String(store.id)]?.length || 0 }}</span>
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
                <span class="text-gray-600 text-sm">{{ getTimeAgo(store.lastActivity) }}</span>
              </td>
              <td class="px-6 py-4 flex gap-3">
                <button
                  @click="handleViewStore(store.id, $event)"
                  class="text-blue-500 hover:cursor-pointer hover:text-blue-700 transition"
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
                  @click="handleEditStore(store, $event)"
                  class="text-gray-500 hover:cursor-pointer hover:text-gray-700 transition"
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
                  @click="handleDeleteStore(store, $event)"
                  class="text-red-500 hover:cursor-pointer hover:text-red-700 transition"
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
