<script setup>
import { ref, watch } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useStaffData } from '@/composables/useStaffData'

const { isDarkMode } = useDarkMode()

const props = defineProps({
  staff: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'staff-updated'])

const { updateStaff } = useStaffData()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  status: 'active',
})

const phoneParts = ref({
  countryCode: '63',
  part1: '',
  part2: '',
  part3: '',
})

const isLoading = ref(false)
const error = ref('')

const buildPhoneValue = () => {
  const parts = [
    phoneParts.value.countryCode,
    phoneParts.value.part1,
    phoneParts.value.part2,
    phoneParts.value.part3,
  ].filter(Boolean)
  return parts.length ? parts.join('-') : ''
}

watch(
  () => props.staff,
  (newStaff) => {
    if (newStaff) {
      const segments = (newStaff.phone || '').split('-').filter(Boolean)
      const countryCode = segments.length === 4 ? segments[0] : '63'
      const numberParts = segments.length === 4 ? segments.slice(1) : segments
      formData.value = {
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        email: newStaff.email,
        phone: newStaff.phone || '',
        position: newStaff.position || '',
        status: newStaff.status,
      }
      phoneParts.value = {
        countryCode,
        part1: numberParts[0] || '',
        part2: numberParts[1] || '',
        part3: numberParts[2] || '',
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  if (!formData.value.firstName || !formData.value.lastName || !formData.value.email) {
    error.value = 'Please fill in all required fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await updateStaff(props.staff.id, {
      ...formData.value,
      phone: buildPhoneValue(),
    })
    emit('staff-updated')
  } catch (err) {
    error.value = 'Failed to update staff member'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div :class="['w-full max-w-md rounded-lg p-6', isDarkMode ? 'bg-slate-800' : 'bg-white']">
      <div class="flex items-center justify-between">
        <h2 :class="['text-xl font-bold', isDarkMode ? 'text-slate-50' : 'text-slate-900']">Edit Staff Member</h2>
        <button
          @click="$emit('close')"
          :class="[isDarkMode ? 'text-slate-400 hover:text-slate-50' : 'text-slate-600 hover:text-slate-900']"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
        <!-- First Name -->
        <div>
          <label :class="['block text-sm font-medium', isDarkMode ? 'text-slate-300' : 'text-slate-700']">First Name *</label>
          <input
            v-model="formData.firstName"
            type="text"
            :class="[
              'mt-1 w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              isDarkMode
                ? 'border-slate-600 bg-slate-700 text-slate-50 placeholder-slate-400'
                : 'border-slate-300 bg-white text-slate-900',
            ]"
            placeholder="John"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label :class="['block text-sm font-medium', isDarkMode ? 'text-slate-300' : 'text-slate-700']">Last Name *</label>
          <input
            v-model="formData.lastName"
            type="text"
            :class="[
              'mt-1 w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              isDarkMode
                ? 'border-slate-600 bg-slate-700 text-slate-50 placeholder-slate-400'
                : 'border-slate-300 bg-white text-slate-900',
            ]"
            placeholder="Doe"
          />
        </div>

        <!-- Email -->
        <div>
          <label :class="['block text-sm font-medium', isDarkMode ? 'text-slate-300' : 'text-slate-700']">Email *</label>
          <input
            v-model="formData.email"
            type="email"
            :class="[
              'mt-1 w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              isDarkMode
                ? 'border-slate-600 bg-slate-700 text-slate-50 placeholder-slate-400'
                : 'border-slate-300 bg-white text-slate-900',
            ]"
            placeholder="john@example.com"
          />
        </div>

        <!-- Phone -->
        <div>
          <label :class="['block text-sm font-medium', isDarkMode ? 'text-slate-300' : 'text-slate-700']">Phone</label>
          <div class="mt-1 flex flex-wrap items-center gap-2">
            <div :class="[
              'flex items-center rounded-lg border px-3 py-2 text-sm',
              isDarkMode ? 'border-slate-600 bg-slate-700 text-slate-50' : 'border-slate-300 bg-white text-slate-900',
            ]">
              +
            </div>
            <input
              v-model="phoneParts.countryCode"
              type="tel"
              maxlength="3"
              :class="[
                'w-24 rounded-lg border px-3 py-2 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                isDarkMode
                  ? 'border-slate-600 bg-slate-700 text-slate-50 placeholder-slate-400'
                  : 'border-slate-300 bg-white text-slate-900',
              ]"
              placeholder="63"
            />
            <span :class="['text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-500']">-</span>
            <input
              v-model="phoneParts.part1"
              type="tel"
              maxlength="3"
              :class="[
                'w-24 rounded-lg border px-3 py-2 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                isDarkMode
                  ? 'border-slate-600 bg-slate-700 text-slate-50 placeholder-slate-400'
                  : 'border-slate-300 bg-white text-slate-900',
              ]"
              placeholder="912"
            />
            <span :class="['text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-500']">-</span>
            <input
              v-model="phoneParts.part2"
              type="tel"
              maxlength="3"
              :class="[
                'w-24 rounded-lg border px-3 py-2 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                isDarkMode
                  ? 'border-slate-600 bg-slate-700 text-slate-50 placeholder-slate-400'
                  : 'border-slate-300 bg-white text-slate-900',
              ]"
              placeholder="234"
            />
            <span :class="['text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-500']">-</span>
            <input
              v-model="phoneParts.part3"
              type="tel"
              maxlength="4"
              :class="[
                'w-28 rounded-lg border px-3 py-2 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                isDarkMode
                  ? 'border-slate-600 bg-slate-700 text-slate-50 placeholder-slate-400'
                  : 'border-slate-300 bg-white text-slate-900',
              ]"
              placeholder="5678"
            />
          </div>
        </div>

        <!-- Position -->
        <div>
          <label :class="['block text-sm font-medium', isDarkMode ? 'text-slate-300' : 'text-slate-700']">Position</label>
          <input
            v-model="formData.position"
            type="text"
            :class="[
              'mt-1 w-full rounded-lg border px-3 py-2 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              isDarkMode
                ? 'border-slate-600 bg-slate-700 text-slate-50 placeholder-slate-400'
                : 'border-slate-300 bg-white text-slate-900',
            ]"
            placeholder="Manager"
          />
        </div>

        <!-- Status -->
        <div>
          <label :class="['block text-sm font-medium', isDarkMode ? 'text-slate-300' : 'text-slate-700']">Status</label>
          <select
            v-model="formData.status"
            :class="[
              'mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              isDarkMode
                ? 'border-slate-600 bg-slate-700 text-slate-50'
                : 'border-slate-300 bg-white text-slate-900',
            ]"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Error Message -->
        <div v-if="error" :class="['rounded-lg p-3 text-sm', isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600']">
          {{ error }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
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
            type="submit"
            :disabled="isLoading"
            class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Updating...' : 'Update Staff' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
