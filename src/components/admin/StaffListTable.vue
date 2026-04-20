<script setup>
import { useDarkMode } from '@/composables/useDarkMode'

const { isDarkMode } = useDarkMode()

defineProps({
  staff: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

const getStatusBadgeClass = (status) => {
  if (status === 'active') {
    return isDarkMode.value
      ? 'bg-green-900/40 text-green-300 border border-green-700'
      : 'bg-green-50 text-green-800 border border-green-200'
  }
  return isDarkMode.value
    ? 'bg-slate-700 text-slate-300'
    : 'bg-slate-100 text-slate-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div
    :class="[
      'overflow-x-auto rounded-lg border',
      isDarkMode
        ? 'border-slate-700 bg-slate-800'
        : 'border-gray-200 bg-white',
    ]"
  >
    <table class="w-full">
      <thead :class="[isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-gray-50', 'border-b']">
        <tr>
          <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDarkMode ? 'text-slate-300' : 'text-gray-700']">
            Name
          </th>
          <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDarkMode ? 'text-slate-300' : 'text-gray-700']">
            Position
          </th>
          <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDarkMode ? 'text-slate-300' : 'text-gray-700']">
            Email
          </th>
          <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDarkMode ? 'text-slate-300' : 'text-gray-700']">
            Phone
          </th>
          <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDarkMode ? 'text-slate-300' : 'text-gray-700']">
            Status
          </th>
          <th :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', isDarkMode ? 'text-slate-300' : 'text-gray-700']">
            Joined
          </th>
          <th :class="['px-6 py-3 text-center text-xs font-medium uppercase tracking-wider', isDarkMode ? 'text-slate-300' : 'text-gray-700']">
            Actions
          </th>
        </tr>
      </thead>
      <tbody :class="['divide-y', isDarkMode ? 'divide-slate-700' : 'divide-gray-200']">
        <tr
          v-for="staffMember in staff"
          :key="staffMember.id"
          :class="['transition', isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50']"
        >
          <td class="whitespace-nowrap px-6 py-4">
            <div class="flex items-center gap-3">
              <div :class="['flex h-10 w-10 items-center justify-center rounded-full', isDarkMode ? 'bg-blue-900' : 'bg-blue-100']">
                <span :class="['text-sm font-medium', isDarkMode ? 'text-blue-200' : 'text-blue-700']">
                  {{ staffMember.firstName.charAt(0) }}{{ staffMember.lastName.charAt(0) }}
                </span>
              </div>
              <div>
                <p :class="['font-medium', isDarkMode ? 'text-slate-50' : 'text-gray-900']">
                  {{ staffMember.firstName }} {{ staffMember.lastName }}
                </p>
              </div>
            </div>
          </td>
          <td :class="['whitespace-nowrap px-6 py-4 text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
            {{ staffMember.position || 'N/A' }}
          </td>
          <td :class="['whitespace-nowrap px-6 py-4 text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
            {{ staffMember.email }}
          </td>
          <td :class="['whitespace-nowrap px-6 py-4 text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
            {{ staffMember.phone ? '+' + staffMember.phone : 'N/A' }}
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <span
              :class="[
                'inline-block rounded-full px-3 py-1 text-xs font-semibold',
                getStatusBadgeClass(staffMember.status),
              ]"
            >
              {{ staffMember.status }}
            </span>
          </td>
          <td :class="['whitespace-nowrap px-6 py-4 text-sm', isDarkMode ? 'text-slate-400' : 'text-gray-600']">
            {{ formatDate(staffMember.createdAt || new Date()) }}
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div class="flex items-center justify-center gap-2">
              <button
                @click="$emit('edit', staffMember)"
                :class="[
                  'rounded-lg p-2 transition',
                  isDarkMode
                    ? 'bg-blue-900 text-blue-400 hover:bg-blue-800'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200',
                ]"
                title="Edit staff"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="$emit('delete', staffMember)"
                :class="[
                  'rounded-lg p-2 transition',
                  isDarkMode
                    ? 'bg-red-900 text-red-400 hover:bg-red-800'
                    : 'bg-red-100 text-red-600 hover:bg-red-200',
                ]"
                title="Delete staff"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="staff.length === 0">
          <td colspan="7" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center gap-2">
              <svg
                :class="['h-12 w-12', isDarkMode ? 'text-slate-600' : 'text-slate-400']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 19H9a6 6 0 016-6v0a6 6 0 016 6v1"
                />
              </svg>
              <p :class="[isDarkMode ? 'text-slate-400' : 'text-slate-600']">No staff members found</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
