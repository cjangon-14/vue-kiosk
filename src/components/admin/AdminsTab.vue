<script setup>
import { ref } from 'vue'
import AddAdminModal from './AddAdminModal.vue'
import EditAdminModal from './EditAdminModal.vue'
import DeleteAdminModal from './DeleteAdminModal.vue'

const props = defineProps({
  admins: {
    type: Array,
    required: true,
  },
  storeId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['admin-added', 'admin-updated', 'admin-deleted'])

const isAddAdminModalOpen = ref(false)
const isEditAdminModalOpen = ref(false)
const isDeleteAdminModalOpen = ref(false)
const selectedAdmin = ref(null)

const handleAddAdminClick = () => {
  isAddAdminModalOpen.value = true
}

const handleAddAdminClose = () => {
  isAddAdminModalOpen.value = false
}

const handleAddAdminSubmit = async (newAdmin) => {
  emit('admin-added', newAdmin)
  isAddAdminModalOpen.value = false
}

const handleEditAdmin = (admin, event) => {
  event.stopPropagation()
  selectedAdmin.value = { ...admin, storeId: props.storeId }
  isEditAdminModalOpen.value = true
}

const handleEditAdminClose = () => {
  isEditAdminModalOpen.value = false
  selectedAdmin.value = null
}

const handleEditAdminSubmit = (updatedAdmin) => {
  emit('admin-updated', updatedAdmin)
  isEditAdminModalOpen.value = false
  selectedAdmin.value = null
}

const handleDeleteAdmin = (admin, event) => {
  event.stopPropagation()
  selectedAdmin.value = admin
  isDeleteAdminModalOpen.value = true
}

const handleDeleteAdminClose = () => {
  isDeleteAdminModalOpen.value = false
  selectedAdmin.value = null
}

const handleDeleteAdminSubmit = (adminId) => {
  emit('admin-deleted', adminId)
  isDeleteAdminModalOpen.value = false
  selectedAdmin.value = null
}
</script>

<template>
  <div>
    <AddAdminModal
      :isOpen="isAddAdminModalOpen"
      :storeId="storeId"
      @close="handleAddAdminClose"
      @submit="handleAddAdminSubmit"
    />
    <EditAdminModal
      :isOpen="isEditAdminModalOpen"
      :admin="selectedAdmin"
      @close="handleEditAdminClose"
      @submit="handleEditAdminSubmit"
    />
    <DeleteAdminModal
      :isOpen="isDeleteAdminModalOpen"
      :adminId="selectedAdmin?.id"
      :storeId="storeId"
      @close="handleDeleteAdminClose"
      @submit="handleDeleteAdminSubmit"
    />

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
            <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">USERNAME</th>
            <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">ROLE</th>
            <th class="px-6 py-5 text-left text-sm font-semibold text-gray-700">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="admin in admins" :key="admin.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-5">
              <span class="text-gray-900 font-medium">
                {{ admin.firstName }} {{ admin.lastName }}
              </span>
            </td>
            <td class="px-6 py-5">
              <span class="text-gray-700">{{ admin.email }}</span>
            </td>
            <td class="px-6 py-5">
              <span class="text-gray-700">{{ admin.username }}</span>
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
      <div v-if="admins.length === 0" class="px-6 py-16 text-center">
        <p class="text-gray-500 text-lg">No admins assigned to this store.</p>
      </div>
    </div>
  </div>
</template>
