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

const filteredStores = computed(() => {
  return stores.value.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      selectedStatus.value === 'All Status' ||
      store.status.toLowerCase() === selectedStatus.value.toLowerCase()
    return matchesSearch && matchesStatus
  })
})

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
          :stores="filteredStores"
          :admins="admins"
          :kiosks="kiosks"
          :loading="loading"
          @edit-store="handleEditStore"
          @delete-store="handleDeleteStore"
        />
      </div>
    </div>
  </div>
</template>
