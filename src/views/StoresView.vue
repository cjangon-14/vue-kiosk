<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFetchData } from '../composables/useFetchData'
import AddStoreModal from '../components/admin/AddStoreModal.vue'
import EditStoreModal from '../components/admin/EditStoreModal.vue'
import DeleteStoreModal from '../components/admin/DeleteStoreModal.vue'
import StoresHeader from '../components/admin/StoresHeader.vue'
import StoresTable from '../components/admin/StoresTable.vue'

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
const currentPage = ref(1)
const itemsPerPage = 10

const filteredStores = computed(() => {
  return stores.value.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      selectedStatus.value === 'All Status' ||
      store.status.toLowerCase() === selectedStatus.value.toLowerCase()
    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredStores.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredStores.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
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

const handleEditStore = (store) => {
  selectedStore.value = store
  isEditStoreModalOpen.value = true
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

const handleDeleteStore = (store) => {
  selectedStore.value = store
  isDeleteStoreModalOpen.value = true
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
    currentPage.value = 1
  } catch (err) {
    console.error('Failed to load stores', err)
  }
})
</script>

<template>
  <div class="flex ml-64 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
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
      <div class="mt-8 mb-12 animate-fade-in"></div>

      <!-- Search and Filter Section -->
      <StoresHeader
        :searchQuery="searchQuery"
        :selectedStatus="selectedStatus"
        @update:searchQuery="searchQuery = $event"
        @update:selectedStatus="selectedStatus = $event"
        @add-store="handleAddStoreClick"
      />

      <!-- Table Section -->
      <div class="">
        <StoresTable
          :stores="paginatedItems"
          :admins="admins"
          :kiosks="kiosks"
          :loading="loading"
          @edit-store="handleEditStore"
          @delete-store="handleDeleteStore"
        />

        <!-- Pagination Controls -->
        <div v-if="!loading && totalPages > 1" class="bg-white rounded-lg border border-gray-200 p-4 mt-6">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Showing <span class="font-semibold">{{ paginatedItems.length }}</span> of
              <span class="font-semibold">{{ filteredStores.length }}</span>
              stores
            </p>
            <div class="flex items-center gap-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="p-2 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div class="flex gap-1">
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="p-2 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
