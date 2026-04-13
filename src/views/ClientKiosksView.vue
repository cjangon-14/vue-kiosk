<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Filter, Plus, Edit, Trash2, CheckCircle, AlertCircle } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'

const { getUser } = useAuth()
const currentUser = getUser()

const kiosks = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('all')

const filteredKiosks = computed(() => {
  return kiosks.value.filter((kiosk) => {
    const matchesSearch =
      kiosk.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (kiosk.location && kiosk.location.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesStatus = selectedStatus.value === 'all' || kiosk.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

onMounted(async () => {
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
})

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50'
    case 'offline':
      return 'text-red-600 bg-red-50'
    case 'maintenance':
      return 'text-yellow-600 bg-yellow-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

const getStatusIcon = (status) => {
  return status === 'active' ? CheckCircle : AlertCircle
}
</script>

<template>
  <div class="flex mt-8 ml-64 bg-linear-to-br from-gray-50 to-gray-100">
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div v-if="loading" class="flex items-center justify-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <div v-else class="space-y-6">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Kiosks Management</h1>
          <p class="text-gray-600 mt-1">Manage and monitor all your store's kiosks</p>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">Kiosks</span>
          <span class="text-gray-400">→</span>
          <span class="text-gray-600">All Kiosks</span>
        </nav>

        <!-- Search and Filters -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by ID or location..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <!-- Filter -->
          <div class="flex items-center gap-2">
            <Filter class="w-4 h-4 text-gray-400" />
            <select
              v-model="selectedStatus"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <!-- Kiosks Table -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div v-if="filteredKiosks.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Kiosk ID
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Last Updated
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="kiosk in filteredKiosks"
                  :key="kiosk.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ kiosk.id }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ kiosk.location || 'N/A' }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      :class="`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getStatusColor(kiosk.status)}`"
                    >
                      <component :is="getStatusIcon(kiosk.status)" class="w-3 h-3" />
                      {{ kiosk.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ new Date(kiosk.lastUpdated).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex items-center gap-2">
                      <button
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit kiosk"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete kiosk"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="px-6 py-12 text-center">
            <AlertCircle class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No kiosks found matching your search</p>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <p class="text-sm text-gray-600">
            Showing <span class="font-semibold">{{ filteredKiosks.length }}</span> of
            <span class="font-semibold">{{ kiosks.length }}</span>
            kiosks
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
