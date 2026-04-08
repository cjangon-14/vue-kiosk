<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  name: '',
  status: 'active',
})

const errors = ref({})
const isSubmitting = ref(false)

const validateForm = () => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Store name is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isSubmitting.value = true

    const newStoreData = {
      id: Date.now().toString(),
      name: formData.value.name,
      status: formData.value.status,
      kiosksCount: 0,
      adminsCount: 0,
      lastActivity: 'just now',
    }

    const response = await fetch('http://localhost:3005/stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStoreData),
    })

    if (!response.ok) throw new Error('Failed to create store')

    const newStore = await response.json()
    emit('submit', newStore || newStoreData)

    handleClose()
  } catch (error) {
    console.error('Error creating store:', error)
    errors.value.submit = 'Failed to create store. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  formData.value = { name: '', status: 'active' }
  errors.value = {}
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-xl font-bold text-gray-900">Create New Store</h2>
      </div>

      <!-- Form -->
      <div class="p-6">
        <!-- Error Message -->
        <div v-if="errors.submit" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ errors.submit }}</p>
        </div>

        <!-- Store Name Field -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Store Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Enter store name"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.name ? 'border-red-500' : 'border-gray-300',
            ]"
          />
          <p v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</p>
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
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ isSubmitting ? 'Creating...' : 'Create Store' }}
        </button>
      </div>
    </div>
  </div>
</template>
