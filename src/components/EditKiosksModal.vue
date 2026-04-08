<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  kiosk: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  kioskNumber: '',
  status: 'active',
})

const errors = ref({})
const isSubmitting = ref(false)

watch(
  () => props.kiosk,
  (newVal) => {
    if (newVal) {
      formData.value = {
        kioskNumber: newVal.kioskNumber,
        status: newVal.status,
      }
    }
  },
  { immediate: true },
)

const validateForm = () => {
  errors.value = {}

  if (!formData.value.kioskNumber.trim()) {
    errors.value.kioskNumber = 'Kiosk number is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isSubmitting.value = true

    const response = await fetch(
      `http://localhost:3005/kiosks/${props.kiosk.storeId}/${props.kiosk.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kioskNumber: formData.value.kioskNumber,
          status: formData.value.status,
        }),
      },
    )

    if (!response.ok) throw new Error('Failed to update kiosk')

    const updatedKiosk = await response.json()
    emit('submit', updatedKiosk)

    handleClose()
  } catch (error) {
    console.error('Error updating kiosk:', error)
    errors.value.submit = 'Failed to update kiosk. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
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
        <h2 class="text-xl font-bold text-gray-900">Edit Kiosk</h2>
      </div>

      <!-- Form -->
      <div class="p-6">
        <!-- Error Message -->
        <div v-if="errors.submit" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ errors.submit }}</p>
        </div>

        <!-- Kiosk Number Field -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Kiosk Number <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.kioskNumber"
            type="text"
            placeholder="e.g., K-001"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.kioskNumber ? 'border-red-500' : 'border-gray-300',
            ]"
          />
          <p v-if="errors.kioskNumber" class="text-sm text-red-500 mt-1">
            {{ errors.kioskNumber }}
          </p>
        </div>

        <!-- Status Field -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="formData.status"
            :class="[
              'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.status ? 'border-red-500' : 'border-gray-300',
            ]"
          >
            <option value="active">Active</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
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
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>
