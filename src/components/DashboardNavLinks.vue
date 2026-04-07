<script setup>
import { useRouter } from 'vue-router'
import DynamicIcons from './DynamicIcons.vue'

const router = useRouter()

const myroutes = router.getRoutes().find((route) => route.name === 'HomeViewLayout').children
</script>

<template>
  <div class="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
    <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-red-200">
      <h2 class="font-semibold text-gray-900">Logo</h2>
    </div>
    <div class="">
      <aside class="shrink-0 z-50 bg-transparent transition-all duration-300">
        <div class="">
          <!-- Navigation -->
          <div class="flex flex-col">
            <nav class="flex-1 px-4 py-6 space-y-1">
              <router-link
                v-for="route in myroutes"
                :key="route.path"
                :to="route.path"
                v-slot="{ isActive }"
                class="flex items-center"
              >
                <div
                  class="w-full flex gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
                  :class="
                    isActive
                      ? 'bg-sidebar-active text-primary-text-active font-bold hover:bg-[#d7e8fd] '
                      : 'hover:bg-gray-100'
                  "
                >
                  <DynamicIcons
                    :name="route.meta.icon"
                    class="shrink-0"
                    :class="isActive ? 'text-[#155DFC]' : 'text-secondary-text'"
                  />
                  <span class="text-sm" :class="isActive ? 'font-bold ' : 'text-secondary-text'">{{
                    route.name
                  }}</span>
                </div>
              </router-link>
            </nav>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped></style>

<!-- :class="hoveredCardId === card.id ? 'bg-[#4E5257]' : 'bg-[#EBE8E8]'" -->
