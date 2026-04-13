<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AddKiosksModal from './AddKiosksModal.vue'
import DeleteKiosksModal from './DeleteKiosksModal.vue'

defineProps({
  kiosks: {
    type: Array,
    required: true,
  },
  storeId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['kiosk-added', 'kiosk-deleted'])

const isAddKiosksModalOpen = ref(false)
const isDeleteKiosksModalOpen = ref(false)
const selectedKiosk = ref(null)

// Time ago functionality
const now = ref(Date.now())
let intervalId = null

const getTimeAgo = (dateString) => {
  if (!dateString) return 'never'
  const past = new Date(dateString)
  if (isNaN(past.getTime())) return 'invalid date'
  const seconds = Math.floor((now.value - past) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

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

const handleAddKioskClick = () => {
  isAddKiosksModalOpen.value = true
}

const handleAddKioskClose = () => {
  isAddKiosksModalOpen.value = false
}

const handleAddKioskSubmit = async (newKiosk) => {
  emit('kiosk-added', newKiosk)
  isAddKiosksModalOpen.value = false
}

const handleDeleteKiosk = (kiosk, event) => {
  event.stopPropagation()
  selectedKiosk.value = kiosk
  isDeleteKiosksModalOpen.value = true
}

const handleDeleteKioskClose = () => {
  isDeleteKiosksModalOpen.value = false
  selectedKiosk.value = null
}

const handleDeleteKioskSubmit = (kioskId) => {
  emit('kiosk-deleted', kioskId)
  isDeleteKiosksModalOpen.value = false
  selectedKiosk.value = null
}

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 60000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div>
    <AddKiosksModal
      :isOpen="isAddKiosksModalOpen"
      :storeId="storeId"
      :existingKiosks="kiosks"
      @close="handleAddKioskClose"
      @submit="handleAddKioskSubmit"
    />
    <DeleteKiosksModal
      :isOpen="isDeleteKiosksModalOpen"
      :kioskId="selectedKiosk?.id"
      :storeId="storeId"
      @close="handleDeleteKioskClose"
      @submit="handleDeleteKioskSubmit"
    />

    <div class="flex justify-end">
      <button
        @click="handleAddKioskClick"
        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 mb-4 rounded-md transition hover:cursor-pointer"
      >
        Add Kiosk
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="kiosks.length === 0" class="px-6 py-16 text-center">
        <p class="text-gray-500 text-lg">No kiosks assigned to this store.</p>
      </div>
      <table v-if="kiosks.length > 0" class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">KIOSK NUMBER</th>
            <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">STATUS</th>
            <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">LAST UPDATED</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="kiosk in kiosks" :key="kiosk.id" class="hover:bg-gray-50 transition">
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
</template>
