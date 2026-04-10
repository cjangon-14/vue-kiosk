<script setup>
import { useRouter } from 'vue-router'
import DynamicIcons from './DynamicIcons.vue'
import { computed } from 'vue'

const router = useRouter()

// Get children of HomeViewLayout
const myroutes = router.getRoutes().find((route) => route.name === 'HomeViewLayout')?.children || []

const categorizedRoutes = computed(() => {
  const groups = {}

  myroutes.forEach((route) => {
    // Fallback to 'General' if no category is defined
    const catName = route.meta?.category || 'General'

    if (!groups[catName]) {
      groups[catName] = []
    }
    groups[catName].push(route)
  })

  // Convert object to array: [{ title: 'Overview', items: [...] }, ...]
  return Object.entries(groups).map(([title, items]) => ({
    title,
    items,
  }))
})
</script>

<template>
  <div
    class="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col shadow-sm"
  >
    <!-- Logo Header -->
    <div
      class="h-16 flex items-center px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600"
        >
          K
        </div>
        <span class="font-bold text-white text-lg">Kiosk Admin</span>
      </div>
    </div>

    <!-- Navigation -->
    <aside class="flex-1 overflow-y-auto">
      <div class="flex flex-col">
        <div v-for="(category, idx) in categorizedRoutes" :key="category.title">
          <!-- Category Separator -->
          <div v-if="idx > 0" class="my-2 mx-4 border-t border-gray-200"></div>

          <!-- Category Label -->
          <h3
            class="px-6 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-widest letter-spacing"
          >
            {{ category.title }}
          </h3>

          <!-- Navigation Items -->
          <nav class="px-3 py-1 space-y-1">
            <router-link
              v-for="route in category.items"
              :key="route.path"
              :to="route.path"
              v-slot="{ isActive }"
              class="block"
            >
              <div
                class="flex gap-3 px-4 py-2.5 rounded-lg transition-smooth cursor-pointer relative overflow-hidden group"
                :class="
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                "
              >
                <!-- Accent bar for active -->
                <div
                  v-if="isActive"
                  class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"
                ></div>

                <!-- Icon -->
                <DynamicIcons
                  :name="route.meta.icon"
                  class="shrink-0 transition-smooth"
                  :class="isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'"
                />

                <!-- Label -->
                <span class="text-sm font-medium flex-1">
                  {{ route.meta?.title || route.name }}
                </span>

                <!-- Hover indicator -->
                <div
                  v-if="!isActive"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-smooth"
                ></div>
              </div>
            </router-link>
          </nav>
        </div>
      </div>
    </aside>

    <!-- Footer -->
    <div class="border-t border-gray-200 p-4 bg-gray-50">
      <div class="text-xs text-gray-500 text-center">
        <p class="font-medium text-gray-600">Version 1.0</p>
      </div>
    </div>
  </div>
</template>
