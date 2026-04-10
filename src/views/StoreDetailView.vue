<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFetchData } from '../composables/useFetchData'
import AddAdminModal from '../components/AddAdminModal.vue'
import AddKiosksModal from '../components/AddKiosksModal.vue'
import EditAdminModal from '../components/EditAdminModal.vue'
import EditKiosksModal from '../components/EditKiosksModal.vue'
import DeleteAdminModal from '../components/DeleteAdminModal.vue'
import DeleteKiosksModal from '../components/DeleteKiosksModal.vue'

const router = useRouter()
const route = useRoute()
const { fetchStoresAndKiosks } = useFetchData()

const store = ref(null)
const storeAdmins = ref([])
const storeKiosks = ref([])
const activeTab = ref('Admins')
const loading = ref(true)
const error = ref(null)
const isAddAdminModalOpen = ref(false)
const isAddKiosksModalOpen = ref(false)
const isEditAdminModalOpen = ref(false)
const isDeleteAdminModalOpen = ref(false)
const isDeleteKiosksModalOpen = ref(false)
const selectedAdmin = ref(null)
const selectedKiosk = ref(null)

const tabs = ['Admins', 'Kiosks']

const getStatusColor = (status) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    offline: 'bg-red-100 text-red-700',
    inactive: 'bg-gray-100 text-gray-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
  }

  // Return the match, or a default style if the status isn't found
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

    // Fetch store details
    const storeRes = await fetch(`http://localhost:3005/stores/${storeId}`)
    if (!storeRes.ok) throw new Error('Failed to fetch store')
    store.value = await storeRes.json()

    // Fetch all data using composable
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

const handleEditAdmin = (admin, event) => {
  event.stopPropagation()
  selectedAdmin.value = { ...admin, storeId: route.params.id }
  isEditAdminModalOpen.value = true
}

const handleDeleteAdmin = (admin, event) => {
  event.stopPropagation()
  selectedAdmin.value = admin
  isDeleteAdminModalOpen.value = true
}

// const handleEditKiosk = (kiosk, event) => {
//   event.stopPropagation()
//   selectedKiosk.value = { ...kiosk, storeId: route.params.id }
//   isEditKiosksModalOpen.value = true
// }

const handleDeleteKiosk = (kiosk, event) => {
  event.stopPropagation()
  selectedKiosk.value = kiosk
  isDeleteKiosksModalOpen.value = true
}

const handleEditAdminClose = () => {
  isEditAdminModalOpen.value = false
  selectedAdmin.value = null
}

const handleEditAdminSubmit = (updatedAdmin) => {
  const index = storeAdmins.value.findIndex((a) => a.id === updatedAdmin.id)
  if (index !== -1) {
    storeAdmins.value[index] = updatedAdmin
  }
  isEditAdminModalOpen.value = false
  selectedAdmin.value = null
}

const handleDeleteAdminClose = () => {
  isDeleteAdminModalOpen.value = false
  selectedAdmin.value = null
}

const handleDeleteAdminSubmit = (adminId) => {
  storeAdmins.value = storeAdmins.value.filter((a) => a.id !== adminId)
  isDeleteAdminModalOpen.value = false
  selectedAdmin.value = null
}

// const handleEditKioskClose = () => {
//   isEditKiosksModalOpen.value = false
//   selectedKiosk.value = null
// }

// const handleEditKioskSubmit = (updatedKiosk) => {
//   const index = storeKiosks.value.findIndex((k) => k.id === updatedKiosk.id)
//   if (index !== -1) {
//     storeKiosks.value[index] = updatedKiosk
//   }
//   isEditKiosksModalOpen.value = false
//   selectedKiosk.value = null
// }

const handleDeleteKioskClose = () => {
  isDeleteKiosksModalOpen.value = false
  selectedKiosk.value = null
}

const handleDeleteKioskSubmit = (kioskId) => {
  storeKiosks.value = storeKiosks.value.filter((k) => k.id !== kioskId)
  isDeleteKiosksModalOpen.value = false
  selectedKiosk.value = null
}

const handleAddAdminClick = () => {
  isAddAdminModalOpen.value = true
}

const handleAddAdminClose = () => {
  isAddAdminModalOpen.value = false
}

const handleAddAdminSubmit = async (newAdmin) => {
  storeAdmins.value.push(newAdmin)
  isAddAdminModalOpen.value = false
}

const handleAddKioskClick = () => {
  isAddKiosksModalOpen.value = true
}

const handleAddKioskClose = () => {
  isAddKiosksModalOpen.value = false
}

const handleAddKioskSubmit = async (newKiosk) => {
  storeKiosks.value.push(newKiosk)
  isAddKiosksModalOpen.value = false
}

const handleAddKiosk = (storeId, event) => {
  event.stopPropagation()
  handleAddKioskClick()
}

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
  <div class="w-full bg-gray-50 min-h-screen">
    <AddAdminModal
      :isOpen="isAddAdminModalOpen"
      :storeId="route.params.id"
      @close="handleAddAdminClose"
      @submit="handleAddAdminSubmit"
    />
    <AddKiosksModal
      :isOpen="isAddKiosksModalOpen"
      :storeId="route.params.id"
      :existingKiosks="storeKiosks"
      @close="handleAddKioskClose"
      @submit="handleAddKioskSubmit"
    />
    <EditAdminModal
      :isOpen="isEditAdminModalOpen"
      :admin="selectedAdmin"
      @close="handleEditAdminClose"
      @submit="handleEditAdminSubmit"
    />
    <EditKiosksModal
      :isOpen="isEditKiosksModalOpen"
      :kiosk="selectedKiosk"
      @close="handleEditKioskClose"
      @submit="handleEditKioskSubmit"
    />
    <DeleteAdminModal
      :isOpen="isDeleteAdminModalOpen"
      :adminId="selectedAdmin?.id"
      :storeId="route.params.id"
      @close="handleDeleteAdminClose"
      @submit="handleDeleteAdminSubmit"
    />
    <DeleteKiosksModal
      :isOpen="isDeleteKiosksModalOpen"
      :kioskId="selectedKiosk?.id"
      :storeId="route.params.id"
      @close="handleDeleteKioskClose"
      @submit="handleDeleteKioskSubmit"
    />
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
        <div class="flex justify-end mb-8">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200 hover:cursor-pointer"
            @click="handleAddAdminClick"
          >
            + Add Admin
          </button>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">NAME</th>
                <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">EMAIL</th>
                <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">ROLE</th>
                <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="admin in storeAdmins" :key="admin.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-5">
                  <span class="text-gray-900 font-medium">
                    {{ admin.firstName }} {{ admin.lastName }}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <span class="text-gray-700">{{ admin.email }}</span>
                </td>
                <td class="px-6 py-5">
                  <span class="text-gray-700">{{ admin.role }}</span>
                </td>
                <td class="px-6 py-5 flex gap-3">
                  <button
                    @click="handleEditAdmin(admin, $event)"
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
                    @click="handleDeleteAdmin(admin, $event)"
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
          <div v-if="storeAdmins.length === 0" class="px-6 py-16 text-center">
            <p class="text-gray-500 text-lg">No admins assigned to this store.</p>
          </div>
        </div>
      </div>

      <!-- Kiosks Tab Content -->
      <div v-if="activeTab === 'Kiosks' && store && !loading">
        <div class="flex justify-end">
          <button
            @click="handleAddKiosk(store.id, $event)"
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 mb-4 rounded-md transition hover:cursor-pointer"
          >
            Add Kiosk
          </button>
        </div>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div v-if="storeKiosks.length === 0" class="px-6 py-16 text-center">
            <p class="text-gray-500 text-lg">No kiosks assigned to this store.</p>
          </div>
          <table v-if="storeKiosks.length > 0" class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                  KIOSK NUMBER
                </th>
                <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">STATUS</th>
                <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                  LAST UPDATED
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="kiosk in storeKiosks" :key="kiosk.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-5">
                  <span class="text-gray-900 font-medium uppercase">{{ kiosk.kioskNumber }}</span>
                </td>
                <td class="px-6 py-5">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      getStatusColor(kiosk.status),
                    ]"
                  >
                    {{ getStatusLabel(kiosk.status) }}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <span class="text-gray-600 text-sm">{{ getTimeAgo(kiosk.lastUpdated) }}</span>
                </td>
                <td class="px-6 py-4 flex gap-3">
                  <!-- <button
                    @click="handleEditKiosk(kiosk, $event)"
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
                  </button> -->
                  <button
                    @click="handleDeleteKiosk(kiosk, $event)"
                    class="text-red-500 hover:text-red-700 transition hover:cursor-pointer"
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
  display: inline-block;
}
</style>
