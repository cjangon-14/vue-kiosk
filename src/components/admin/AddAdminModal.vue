<script setup>
import { ref } from 'vue'
import { useFetchData } from '../../composables/useFetchData'

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
const { addRecentActivity, updateStoreLastActivity } = useFetchData()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref({})
const isSubmitting = ref(false)

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.firstName.trim()) {
    errors.value.firstName = 'First name is required'
  }

  if (!formData.value.lastName.trim()) {
    errors.value.lastName = 'Last name is required'
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!validateEmail(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (!formData.value.password.trim()) {
    errors.value.password = 'Password is required'
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  if (!formData.value.confirmPassword.trim()) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isSubmitting.value = true

    // 1. Fetch the existing data first to avoid overwriting other users
    const getRes = await fetch(`http://localhost:3005/admins`)
    const currentData = await getRes.json()

    // 2. Get the specific list for this store (e.g., list "1")
    const storeList = currentData[props.storeId] || []

    // 3. Create the new user/kiosk object
    const newEntry = {
      id: Date.now().toString(),
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      password: formData.value.password,
      role: 'Admin',
    }

    // 4. PATCH the specific key with the updated array
    const response = await fetch(`http://localhost:3005/admins`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [props.storeId]: [...storeList, newEntry], // This adds the new group to list 1
      }),
    })

    if (!response.ok) throw new Error('Failed to update')

    // Update store's last activity
    await updateStoreLastActivity(props.storeId)

    // Add recent activity
    await addRecentActivity(
      'Admin Created',
      `${formData.value.firstName} ${formData.value.lastName} added as admin`,
    )

    emit('submit', newEntry)
    handleClose()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  formData.value = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }
  errors.value = {}
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-xl font-bold text-gray-900">Add New Admin</h2>
      </div>

      <!-- Form -->
      <div class="p-6">
        <!-- Error Message -->
        <div v-if="errors.submit" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">{{ errors.submit }}</p>
        </div>

        <!-- First Name Field -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            First Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.firstName"
            type="text"
            placeholder="Enter first name"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.firstName ? 'border-red-500' : 'border-gray-300',
            ]"
          />
          <p v-if="errors.firstName" class="text-sm text-red-500 mt-1">{{ errors.firstName }}</p>
        </div>

        <!-- Last Name Field -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.lastName"
            type="text"
            placeholder="Enter last name"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.lastName ? 'border-red-500' : 'border-gray-300',
            ]"
          />
          <p v-if="errors.lastName" class="text-sm text-red-500 mt-1">{{ errors.lastName }}</p>
        </div>

        <!-- Email Field -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="Enter email address"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.email ? 'border-red-500' : 'border-gray-300',
            ]"
          />
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password Field -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="Enter password (min 6 characters)"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.password ? 'border-red-500' : 'border-gray-300',
            ]"
          />
          <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password Field -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Confirm password"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300',
            ]"
          />
          <p v-if="errors.confirmPassword" class="text-sm text-red-500 mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Role Field -->
        <!-- <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            v-model="formData.role"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Operator">Operator</option>
          </select>
        </div> -->
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
        <button
          @click="handleClose"
          :disabled="isSubmitting"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:cursor-pointer hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:cursor-pointer hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ isSubmitting ? 'Adding...' : 'Add Admin' }}
        </button>
      </div>
    </div>
  </div>
</template>
