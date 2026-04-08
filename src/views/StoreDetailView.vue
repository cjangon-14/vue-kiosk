<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

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

    // Fetch all admins and filter by store ID
    const adminsRes = await fetch(`http://localhost:3005/admins`)
    if (!adminsRes.ok) throw new Error('Failed to fetch admins')
    const allAdmins = await adminsRes.json()
    storeAdmins.value = allAdmins[storeId] || []

    // Fetch all kiosks and filter by store ID
    try {
      const kiosksRes = await fetch(`http://localhost:3005/kiosks`)
      if (kiosksRes.ok) {
        const allKiosks = await kiosksRes.json()
        storeKiosks.value = allKiosks[storeId] || []
      }
    } catch {
      storeKiosks.value = []
    }

    error.value = null
  } catch (err) {
    console.error('Failed to load store details:', err)
    error.value = 'Failed to load store details'
  } finally {
    loading.value = false
  }
})

const handleEditAdmin = (adminId, event) => {
  event.stopPropagation()
  console.log('Edit admin:', adminId)
}

const handleDeleteAdmin = (adminId, event) => {
  event.stopPropagation()
  console.log('Delete admin:', adminId)
}

const handleEditKiosk = (kioskId, event) => {
  event.stopPropagation()
  console.log('Edit kiosk:', kioskId)
}

const handleDeleteKiosk = (kioskId, event) => {
  event.stopPropagation()
  console.log('Delete kiosk:', kioskId)
}
</script>

<template>
  <div class="w-full bg-gray-50 min-h-screen">
    <div class="p-12 flex flex-col w-full max-w-7xl mx-auto">
      <!-- Back Button -->
      <button
        @click="goBackToStores"
        class="text-blue-600 hover:text-blue-700 mb-8 flex items-center gap-2 font-medium transition"
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
              <span class="font-medium">{{ store.kiosksCount }} Kiosks</span>
              <span class="font-medium">{{ store.adminsCount }} Admins</span>
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
              'pb-4 px-2 text-lg font-semibold transition border-b-2',
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
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
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
                    @click="handleEditAdmin(admin.id, $event)"
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
                    @click="handleDeleteAdmin(admin.id, $event)"
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
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 mb-4 rounded-md transition"
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
                  <span class="text-gray-900 font-medium">{{ kiosk.kioskNumber }}</span>
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
                  <span class="text-gray-600 text-sm">{{ kiosk.lastUpdated }}</span>
                </td>
                <td class="px-6 py-4 flex gap-3">
                  <button
                    @click="handleEditKiosk(kiosk.id, $event)"
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
                    @click="handleDeleteKiosk(kiosk.id, $event)"
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
