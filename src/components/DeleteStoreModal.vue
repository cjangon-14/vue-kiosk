<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  storeId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['close', 'submit'])

const isSubmitting = ref(false)

const handleConfirmDelete = async () => {
  try {
    isSubmitting.value = true

    const response = await fetch(`http://localhost:3005/stores/${props.storeId}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Failed to delete store')

    emit('submit', props.storeId)
    handleClose()
  } catch (error) {
    console.error('Error deleting store:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-xl font-bold text-gray-900">Delete Store</h2>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="flex gap-4">
          <div class="shrink-0">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4v2m0 0v2m0-12v-2"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900">Are you sure?</h3>
            <p class="mt-2 text-sm text-gray-600">
              This action cannot be undone. The store and all associated data will be permanently
              deleted.
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
        <button
          @click="handleClose"
          :disabled="isSubmitting"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          @click="handleConfirmDelete"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          {{ isSubmitting ? 'Deleting...' : 'Delete Store' }}
        </button>
      </div>
    </div>
  </div>
</template>
