<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Edit, CheckCircle, AlertCircle } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import { useActivityLog } from '../composables/useActivityLog'

const { getUser } = useAuth()
const { logKioskStatusChanged, logKioskUpdated } = useActivityLog()
const currentUser = getUser()

const kiosks = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const editingId = ref(null)
const formData = ref({
  kioskNumber: '',
  status: 'active',
  location: '',
})

const filteredKiosks = computed(() => {
  return kiosks.value.filter(
    (kiosk) =>
      kiosk.kioskNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (kiosk.location && kiosk.location.toLowerCase().includes(searchQuery.value.toLowerCase())),
  )
})

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

    await loadKiosks()
  } catch (err) {
    console.error('Failed to update kiosk status:', err)
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

    await loadKiosks()
    closeModal()
  } catch (err) {
    console.error('Failed to save kiosk:', err)
    alert('Failed to save kiosk. Please try again.')
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
          <div class="relative">
            <Search class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by kiosk number or location..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
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
                <tr v-for="kiosk in filteredKiosks" :key="kiosk.id" class="hover:bg-gray-50">
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
