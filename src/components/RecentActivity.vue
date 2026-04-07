<script setup>
import { ref, onMounted } from 'vue'
import { Plus, UserPlus, AlertTriangle, Home, Wrench, Activity } from '@lucide/vue'
import { useFetchData } from '../composables/useFetchData'

const { loading, error, fetchRecentActivities } = useFetchData()
const activities = ref([])

onMounted(async () => {
  try {
    activities.value = await fetchRecentActivities()
  } catch (err) {
    console.error('Failed to load recent activities:', err)
  }
})

const getActivityColor = (type) => {
  const colorMap = {
    'Kiosk Added': 'text-blue-600',
    'Admin Created': 'text-green-600',
    'Status Change': 'text-orange-600',
    'Store Created': 'text-purple-600',
    'Kiosk Maintenance': 'text-red-600',
  }
  return colorMap[type] || 'text-gray-600'
}

const getActivityIcon = (type) => {
  const iconMap = {
    'Kiosk Added': Plus,
    'Admin Created': UserPlus,
    'Status Change': AlertTriangle,
    'Store Created': Home,
    'Kiosk Maintenance': Wrench,
  }
  return iconMap[type] || null
}

const getActivityBgColor = (type) => {
  const colorMap = {
    'Kiosk Added': 'bg-blue-50',
    'Admin Created': 'bg-green-50',
    'Status Change': 'bg-orange-50',
    'Store Created': 'bg-purple-50',
    'Kiosk Maintenance': 'bg-red-50',
  }
  return colorMap[type] || 'bg-gray-50'
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <div class="p-6 flex">
      <div class="flex items-center gap-2">
        <activity class="w-5 h-5 text-gray-900" />
        <h2 class="text-xl font-bold text-gray-900">Recent Activity</h2>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Loading activities...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      Error loading data: {{ error }}
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-100">
            <th class="text-left py-3 px-6 font-semibold text-gray-700 text-sm uppercase">Type</th>
            <th class="text-left py-3 px-6 font-semibold text-gray-700 text-sm uppercase">
              Description
            </th>
            <th class="text-left py-3 px-6 font-semibold text-gray-700 text-sm uppercase">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="activity in activities"
            :key="activity.id"
            class="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <div :class="['p-2 rounded-lg', getActivityBgColor(activity.type)]">
                  <component
                    :is="getActivityIcon(activity.type)"
                    :class="['w-4 h-4', getActivityColor(activity.type)]"
                  />
                </div>
                <span :class="['font-medium', getActivityColor(activity.type)]">
                  {{ activity.type }}
                </span>
              </div>
            </td>
            <td class="py-4 px-6 text-gray-700">{{ activity.description }}</td>
            <td class="py-4 px-6 text-gray-500 text-sm">{{ activity.timestamp }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="activities.length === 0" class="text-center py-8">
        <p class="text-gray-500">No recent activities.</p>
      </div>
    </div>
  </div>
</template>
