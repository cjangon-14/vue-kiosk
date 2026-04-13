<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Plus, Edit, Trash2, Users, Mail, Shield } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'

const { getUser } = useAuth()
const currentUser = getUser()

const staffMembers = ref([])
const loading = ref(false)
const searchQuery = ref('')

const filteredStaff = computed(() => {
  return staffMembers.value.filter((staff) => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase()
    const email = staff.email.toLowerCase()
    const query = searchQuery.value.toLowerCase()

    return fullName.includes(query) || email.includes(query)
  })
})

onMounted(async () => {
  try {
    loading.value = true
    if (currentUser?.storeId) {
      const res = await fetch('http://localhost:3005/admins')
      if (res.ok) {
        const adminsList = await res.json()
        staffMembers.value = adminsList[currentUser.storeId] || []
      }
    }
  } catch (err) {
    console.error('Failed to load staff:', err)
  } finally {
    loading.value = false
  }
})

const getRoleColor = (role) => {
  switch (role) {
    case 'Admin':
      return 'text-blue-600 bg-blue-50'
    case 'Super Admin':
      return 'text-purple-600 bg-purple-50'
    case 'Staff':
      return 'text-green-600 bg-green-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
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
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p class="text-gray-600 mt-1">Manage store administrators and staff members</p>
          </div>
          <button
            class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus class="w-4 h-4" />
            Add Staff
          </button>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">Staff</span>
          <span class="text-gray-400">→</span>
          <span class="text-gray-600">All Staff</span>
        </nav>

        <!-- Search -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Staff Table -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div v-if="filteredStaff.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Role
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
                  v-for="staff in filteredStaff"
                  :key="staff.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-semibold text-emerald-600"
                      >
                        {{ `${staff.firstName[0]}${staff.lastName[0]}`.toUpperCase() }}
                      </div>
                      <div>
                        <p class="font-medium">{{ staff.firstName }} {{ staff.lastName }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    <div class="flex items-center gap-2">
                      <Mail class="w-4 h-4 text-gray-400" />
                      {{ staff.email }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      :class="`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getRoleColor(staff.role)}`"
                    >
                      <Shield class="w-3 h-3" />
                      {{ staff.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex items-center gap-2">
                      <button
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit staff"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete staff"
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
            <Users class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No staff members found</p>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <p class="text-sm text-gray-600">
            Showing <span class="font-semibold">{{ filteredStaff.length }}</span> of
            <span class="font-semibold">{{ staffMembers.length }}</span>
            staff members
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
