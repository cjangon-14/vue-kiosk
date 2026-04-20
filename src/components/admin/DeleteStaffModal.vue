<script setup>
import { ref } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useStaffData } from '@/composables/useStaffData'

const { isDarkMode } = useDarkMode()

const props = defineProps({
  staff: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'staff-deleted'])

const { deleteStaff } = useStaffData()

const isLoading = ref(false)
const error = ref('')

const handleDelete = async () => {
  isLoading.value = true
  error.value = ''

  try {
    await deleteStaff(props.staff.id, `${props.staff.firstName} ${props.staff.lastName}`)
    emit('staff-deleted')
  } catch (err) {
    error.value = 'Failed to delete staff member'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div :class="['w-full max-w-md rounded-lg p-6', isDarkMode ? 'bg-slate-800' : 'bg-white']">
      <div class="flex items-center justify-between">
        <h2 :class="['text-xl font-bold', isDarkMode ? 'text-slate-50' : 'text-slate-900']">Delete Staff Member</h2>
        <button
          @click="$emit('close')"
          :class="[isDarkMode ? 'text-slate-400 hover:text-slate-50' : 'text-slate-600 hover:text-slate-900']"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mt-4">
        <div class="flex gap-3">
          <div :class="['flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full', isDarkMode ? 'bg-red-900' : 'bg-red-100']">
            <svg :class="['h-6 w-6', isDarkMode ? 'text-red-400' : 'text-red-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4v2m0 0H9m3 0h3M7 20H5a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 00.707-.293l1.414-1.414a2 2 0 012.828 0l1.414 1.414a1 1 0 00.707.293H17a2 2 0 012 2v10a2 2 0 01-2 2h-2"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p :class="['text-sm font-medium', isDarkMode ? 'text-slate-50' : 'text-slate-900']">
              Delete
              <span class="font-bold">{{ staff.firstName }} {{ staff.lastName }}</span>
              ?
            </p>
            <p :class="['mt-2 text-sm', isDarkMode ? 'text-slate-400' : 'text-slate-600']">
              This action cannot be undone. The staff member will be permanently removed from the system.
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          :class="['mt-4 rounded-lg p-3 text-sm', isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600']"
        >
          {{ error }}
        </div>

        <!-- Buttons -->
        <div class="mt-6 flex gap-3">
          <button
            type="button"
            @click="$emit('close')"
            :class="[
              'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition',
              isDarkMode
                ? 'border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
            ]"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleDelete"
            :disabled="isLoading"
            class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
