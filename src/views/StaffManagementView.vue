<script setup>
import { ref, onMounted } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useStaffData } from '@/composables/useStaffData'
import { useAuth } from '@/composables/useAuth'
import StaffListTable from '@/components/admin/StaffListTable.vue'
import AddStaffModal from '@/components/admin/AddStaffModal.vue'
import EditStaffModal from '@/components/admin/EditStaffModal.vue'
import DeleteStaffModal from '@/components/admin/DeleteStaffModal.vue'

const { isDarkMode } = useDarkMode()
const { getUser } = useAuth()
const {
  staffList,
  activeStaff,
  inactiveStaff,
  fetchStaffData,
  fetchStaffActivityLogs,
} = useStaffData()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedStaff = ref(null)
const filterStatus = ref('all')
const searchQuery = ref('')

onMounted(() => {
  fetchStaffData()
  fetchStaffActivityLogs()
})

const openAddModal = () => {
  showAddModal.value = true
}

const openEditModal = (staff) => {
  selectedStaff.value = staff
  showEditModal.value = true
}

const openDeleteModal = (staff) => {
  selectedStaff.value = staff
  showDeleteModal.value = true
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  selectedStaff.value = null
}

const handleStaffAdded = () => {
  fetchStaffData()
  closeModals()
}

const handleStaffUpdated = () => {
  fetchStaffData()
  closeModals()
}

const handleStaffDeleted = () => {
  fetchStaffData()
  closeModals()
}

const getFilteredStaff = () => {
  const user = getUser()
  const currentStoreId = user?.storeId
  let filtered = staffList.value

  if (filterStatus.value === 'active') {
    filtered = activeStaff.value
  } else if (filterStatus.value === 'inactive') {
    filtered = inactiveStaff.value
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((staff) => {
      const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase()
      const position = (staff.position || '').toLowerCase()
      return fullName.includes(query) || position.includes(query)
    })
  }

  if (currentStoreId) {
    filtered = filtered.filter((staff) => staff.storeId === String(currentStoreId))
  }

  return filtered
}
</script>

<template>
  <div
    :class="[
      'flex mt-12 ml-64 min-h-screen',
      isDarkMode
        ? 'bg-slate-950'
        : 'bg-linear-to-br from-gray-50 to-gray-100',
    ]"
  >
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 :class="['text-2xl font-bold', isDarkMode ? 'text-slate-50' : 'text-gray-900']">
              Staff Management
            </h1>
            <p :class="['mt-1 text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
              Manage your staff members, track activities, and monitor status
            </p>
          </div>
          <button
            @click="openAddModal"
            :class="[
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-offset-slate-900'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-offset-white',
            ]"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Staff
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            :class="[
              'rounded-lg border p-6',
              isDarkMode
                ? 'border-slate-700 bg-slate-800'
                : 'border-gray-200 bg-white',
            ]"
          >
            <div class="flex items-center justify-between">
              <div>
                <p :class="['text-sm font-medium', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
                  Total Staff
                </p>
                <p :class="['mt-2 text-3xl font-bold', isDarkMode ? 'text-slate-50' : 'text-gray-900']">
                  {{ staffList.length }}
                </p>
              </div>
              <div :class="['rounded-lg p-3', isDarkMode ? 'bg-blue-900' : 'bg-blue-100']">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 19H9a6 6 0 016-6v0a6 6 0 016 6v1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            :class="[
              'rounded-lg border p-6',
              isDarkMode
                ? 'border-slate-700 bg-slate-800'
                : 'border-gray-200 bg-white',
            ]"
          >
            <div class="flex items-center justify-between">
              <div>
                <p :class="['text-sm font-medium', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
                  Active
                </p>
                <p class="mt-2 text-3xl font-bold text-green-600">{{ activeStaff.length }}</p>
              </div>
              <div :class="['rounded-lg p-3', isDarkMode ? 'bg-green-900' : 'bg-green-100']">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            :class="[
              'rounded-lg border p-6',
              isDarkMode
                ? 'border-slate-700 bg-slate-800'
                : 'border-gray-200 bg-white',
            ]"
          >
            <div class="flex items-center justify-between">
              <div>
                <p :class="['text-sm font-medium', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
                  Inactive
                </p>
                <p :class="['mt-2 text-3xl font-bold', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
                  {{ inactiveStaff.length }}
                </p>
              </div>
              <div :class="['rounded-lg p-3', isDarkMode ? 'bg-slate-700' : 'bg-slate-100']">
                <svg class="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16H9v-4m0 0H5m4 4v4m11-11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div
          :class="[
            'flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:gap-4',
            isDarkMode
              ? 'border-slate-700 bg-slate-800'
              : 'border-gray-200 bg-white',
          ]"
        >
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or position..."
              :class="[
                'w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500',
                isDarkMode
                  ? 'border-slate-600 bg-slate-700 text-slate-50 placeholder-slate-400 focus:border-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500',
              ]"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="filterStatus"
              :class="[
                'rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500',
                isDarkMode
                  ? 'border-slate-600 bg-slate-700 text-slate-50 focus:border-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500',
              ]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Staff List Table -->
        <StaffListTable :staff="getFilteredStaff()" @edit="openEditModal" @delete="openDeleteModal" />

        <!-- Modals -->
        <AddStaffModal
          v-if="showAddModal"
          @close="closeModals"
          @staff-added="handleStaffAdded"
        />

        <EditStaffModal
          v-if="showEditModal && selectedStaff"
          :staff="selectedStaff"
          @close="closeModals"
          @staff-updated="handleStaffUpdated"
        />

        <DeleteStaffModal
          v-if="showDeleteModal && selectedStaff"
          :staff="selectedStaff"
          @close="closeModals"
          @staff-deleted="handleStaffDeleted"
        />
      </div>
    </div>
  </div>
</template>
