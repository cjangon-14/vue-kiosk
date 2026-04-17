<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Edit, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import { useActivityLog } from '../composables/useActivityLog'
import { useToast } from '../composables/useToast'

const { getUser } = useAuth()
const { logKioskStatusChanged, logKioskUpdated } = useActivityLog()
const { success, error: showError, warning } = useToast()
const currentUser = getUser()

const kiosks = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('all')
const showModal = ref(false)
const editingId = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10
const formData = ref({
  kioskNumber: '',
  status: 'active',
  location: '',
})

const filteredKiosks = computed(() => {
  return kiosks.value.filter(
    (kiosk) =>
      (kiosk.kioskNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (kiosk.location && kiosk.location.toLowerCase().includes(searchQuery.value.toLowerCase()))) &&
      (selectedStatus.value === 'all' || kiosk.status === selectedStatus.value),
  )
})

const totalPages = computed(() => Math.ceil(filteredKiosks.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredKiosks.value.slice(start, end)
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

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  currentPage.value = 1
}

onMounted(async () => {
  await loadKiosks()
})

const loadKiosks = async () => {
  try {
    loading.value = true
    if (currentUser?.storeId) {
      const res = await fetch(`http://localhost:3005/kiosks`)
      if (res.ok) {
        const allKiosks = await res.json()
        const storeId = String(currentUser.storeId)
        kiosks.value = allKiosks[storeId] || []
      }
    }
    currentPage.value = 1
  } catch (err) {
    console.error('Failed to load kiosks:', err)
  } finally {
    loading.value = false
  }
}

const toggleStatus = async (kiosk) => {
  const newStatus = kiosk.status === 'active' ? 'offline' : 'active'
  try {
    const storeId = String(currentUser.storeId)

    // Fetch current kiosks
    const getRes = await fetch(`http://localhost:3005/kiosks`)
    if (!getRes.ok) throw new Error('Failed to fetch kiosks')
    const allKiosks = await getRes.json()
    const storeKiosks = allKiosks[storeId] || []

    // Update the kiosk status
    const updatedStoreKiosks = storeKiosks.map((k) =>
      k.id === kiosk.id
        ? {
            ...k,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
          }
        : k,
    )

    // PATCH the kiosks endpoint with updated store kiosks
    const patchRes = await fetch(`http://localhost:3005/kiosks`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [storeId]: updatedStoreKiosks,
      }),
    })

    if (!patchRes.ok) throw new Error('Failed to update kiosk status')

    // Log activity
    await logKioskStatusChanged(kiosk.kioskNumber, newStatus)
    const statusMsg = newStatus === 'active' ? 'activated' : 'taken offline'
    success(`Kiosk "${kiosk.kioskNumber}" ${statusMsg}!`)

    await loadKiosks()
  } catch (err) {
    console.error('Failed to update kiosk status:', err)
    showError('Failed to update kiosk status')
  }
}

const getStatusColor = (status) => {
  return status === 'active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
}

const getStatusIcon = (status) => {
  return status === 'active' ? CheckCircle : AlertCircle
}

const openModal = (kiosk = null) => {
  if (kiosk) {
    editingId.value = kiosk.id
    formData.value = { ...kiosk }
  } else {
    editingId.value = null
    formData.value = {
      kioskNumber: '',
      status: 'active',
      location: '',
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const saveKiosk = async () => {
  if (!formData.value.kioskNumber) {
    alert('Kiosk number is required')
    return
  }

  try {
    const storeId = String(currentUser.storeId)

    // Fetch current kiosks
    const getRes = await fetch(`http://localhost:3005/kiosks`)
    if (!getRes.ok) throw new Error('Failed to fetch kiosks')
    const allKiosks = await getRes.json()
    const storeKiosks = allKiosks[storeId] || []

    // Update existing kiosk
    const updatedStoreKiosks = storeKiosks.map((k) =>
      k.id === editingId.value
        ? {
            ...k,
            kioskNumber: formData.value.kioskNumber,
            status: formData.value.status,
            location: formData.value.location || '',
            lastUpdated: new Date().toISOString(),
          }
        : k,
    )

    // PATCH the kiosks endpoint with updated store kiosks
    const patchRes = await fetch(`http://localhost:3005/kiosks`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [storeId]: updatedStoreKiosks,
      }),
    })

    if (!patchRes.ok) throw new Error('Failed to save kiosk')

    // Log activity
    await logKioskUpdated(formData.value.kioskNumber)

    if (editingId.value) {
      success(`Kiosk "${formData.value.kioskNumber}" updated successfully!`)
    } else {
      success(`Kiosk "${formData.value.kioskNumber}" added successfully!`)
    }

    await loadKiosks()
    closeModal()
  } catch (err) {
    console.error('Failed to save kiosk:', err)
    showError('Failed to save kiosk. Please try again.')
  }
}
</script>

<template>
  <div class="flex mt-12 ml-64 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div class="space-y-6">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Kiosk Management</h1>
          <p class="text-gray-600 mt-1">View and monitor your kiosks</p>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">Kiosks</span>
        </nav>

        <!-- Search -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex gap-4">
            <div class="flex-1 relative">
              <Search class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by kiosk number or location..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              v-model="selectedStatus"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <button
              @click="clearFilters"
              class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Kiosks Table -->
        <div v-if="!loading" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div v-if="filteredKiosks.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Kiosk Number
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Location
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Status
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Last Updated
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="kiosk in paginatedItems" :key="kiosk.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">
                    {{ kiosk.kioskNumber }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ kiosk.location || '-' }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      @click="toggleStatus(kiosk)"
                      :class="`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${getStatusColor(kiosk.status)}`"
                    >
                      <component :is="getStatusIcon(kiosk.status)" class="w-3 h-3" />
                      {{ kiosk.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ new Date(kiosk.lastUpdated).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <button
                      @click="openModal(kiosk)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="px-6 py-12 text-center">
            <AlertCircle class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No kiosks found</p>
          </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="!loading && totalPages > 1" class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Showing <span class="font-semibold">{{ paginatedItems.length }}</span> of
              <span class="font-semibold">{{ filteredKiosks.length }}</span>
              kiosks
            </p>
            <div class="flex items-center gap-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="p-2 text-gray-600 hover:bg-gray-100 disabled:text-gray-300 rounded-lg transition-colors"
              >
                <ChevronLeft class="w-4 h-4" />
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
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModal()"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-2xl font-bold mb-4">Edit Kiosk</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kiosk Number</label>
              <input
                v-model="formData.kioskNumber"
                type="text"
                placeholder="e.g., K-001"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                v-model="formData.location"
                type="text"
                placeholder="e.g., Main Entrance"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="formData.status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="active">Active</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div class="flex gap-4">
              <button
                @click="saveKiosk"
                class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
              <button
                @click="closeModal"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
