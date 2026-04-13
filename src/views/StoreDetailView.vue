<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFetchData } from '../composables/useFetchData'
import AdminsTab from '../components/admin/AdminsTab.vue'
import KiosksTab from '../components/admin/KiosksTab.vue'

const router = useRouter()
const route = useRoute()
const { fetchStoresAndKiosks } = useFetchData()

const store = ref(null)
const storeAdmins = ref([])
const storeKiosks = ref([])
const activeTab = ref('Admins')
const loading = ref(true)
const error = ref(null)

const tabs = ['Admins', 'Kiosks']

const getStatusColor = (status) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    offline: 'bg-red-100 text-red-700',
    inactive: 'bg-gray-100 text-gray-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
  }
  return styles[status] || 'bg-blue-100 text-blue-700'
}

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const goBackToStores = () => {
  router.push('/stores')
}

onMounted(async () => {
  try {
    loading.value = true
    const storeId = route.params.id

    const storeRes = await fetch(`http://localhost:3005/stores/${storeId}`)
    if (!storeRes.ok) throw new Error('Failed to fetch store')
    store.value = await storeRes.json()

    const { admins, kiosks } = await fetchStoresAndKiosks()
    storeAdmins.value = admins[storeId] || []
    storeKiosks.value = kiosks[storeId] || []

    error.value = null
  } catch (err) {
    console.error('Failed to load store details:', err)
    error.value = 'Failed to load store details'
  } finally {
    loading.value = false
  }
})

const handleAdminAdded = (newAdmin) => {
  storeAdmins.value.push(newAdmin)
}

const handleAdminUpdated = (updatedAdmin) => {
  const index = storeAdmins.value.findIndex((a) => a.id === updatedAdmin.id)
  if (index !== -1) {
    storeAdmins.value[index] = updatedAdmin
  }
}

const handleAdminDeleted = (adminId) => {
  storeAdmins.value = storeAdmins.value.filter((a) => a.id !== adminId)
}

const handleKioskAdded = (newKiosk) => {
  storeKiosks.value.push(newKiosk)
}

const handleKioskDeleted = (kioskId) => {
  storeKiosks.value = storeKiosks.value.filter((k) => k.id !== kioskId)
}
</script>

<template>
  <div class="w-full bg-gray-50 min-h-screen">
    <div class="mt-18">
      <!-- Back Button -->
      <button
        @click="goBackToStores"
        class="text-blue-600 hover:cursor-pointer hover:text-blue-700 mb-8 flex items-center gap-2 font-medium transition"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
        Back to Stores
      </button>
    </div>
    <div class="p-12 mt-8 flex flex-col w-full max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Loading store details...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
      </div>

      <!-- Store Details Header -->
      <div v-if="store && !loading" class="mb-12">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-4">
              <h1 class="text-4xl font-bold text-gray-900">{{ store.name }}</h1>
              <span
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold',
                  getStatusColor(store.status),
                ]"
              >
                {{ getStatusLabel(store.status) }}
              </span>
            </div>

            <div class="flex gap-12 text-lg text-gray-600">
              <span class="font-medium">{{ storeKiosks.length }} Kiosks</span>
              <span class="font-medium">{{ storeAdmins.length }} Admins</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div v-if="store && !loading" class="mb-8 border-b border-gray-200">
        <div class="flex gap-12">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'pb-4 px-2 text-lg font-semibold hover:cursor-pointer transition border-b-2',
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900',
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Admins Tab Content -->
      <div v-if="activeTab === 'Admins' && store && !loading">
        <AdminsTab
          :admins="storeAdmins"
          :storeId="route.params.id"
          @admin-added="handleAdminAdded"
          @admin-updated="handleAdminUpdated"
          @admin-deleted="handleAdminDeleted"
        />
      </div>

      <!-- Kiosks Tab Content -->
      <div v-if="activeTab === 'Kiosks' && store && !loading">
        <KiosksTab
          :kiosks="storeKiosks"
          :storeId="route.params.id"
          @kiosk-added="handleKioskAdded"
          @kiosk-deleted="handleKioskDeleted"
        />
      </div>
    </div>
  </div>
</template>
