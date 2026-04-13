<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  stores: {
    type: Array,
    required: true,
  },
  admins: {
    type: Object,
    required: true,
  },
  kiosks: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit-store', 'delete-store', 'store-selected'])

const router = useRouter()

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
  emit('edit-store', store)
}

const handleDeleteStore = (store, event) => {
  event.stopPropagation()
  emit('delete-store', store)
}

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
  <div
    class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-smooth overflow-hidden animate-slide-in"
  >
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">STORE NAME</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">NUMBER OF KIOSKS</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">NUMBER OF ADMINS</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">STATUS</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">LAST ACTIVITY</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">ACTIONS</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="store in stores"
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
              :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusColor(store.status)]"
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
    <div v-if="stores.length === 0 && !loading" class="px-6 py-12 text-center">
      <p class="text-gray-500">No stores found matching your search criteria.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="px-6 py-12 text-center">
      <p class="text-gray-500">Loading stores...</p>
    </div>
  </div>
</template>
