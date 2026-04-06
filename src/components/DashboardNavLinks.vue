<script setup>
import { useRouter } from 'vue-router'
import DynamicIcons from './DynamicIcons.vue'

const router = useRouter()

const myroutes = router.getRoutes().find((route) => route.name === 'HomeViewLayout').children
</script>

<template>
  <div class="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
    <div class="h-16 flex items-center px-6 border-b border-gray-200 bg-red-200">
      <h2>Logo</h2>
    </div>
    <div class="mt-16">
      <aside class="shrink-0 z-50 bg-transparent transition-all duration-300">
        <div class="">
          <!-- Navigation -->
          <div class="flex flex-col gap-4">
            <nav class="flex flex-col gap-2">
              <router-link
                v-for="route in myroutes"
                :key="route.path"
                :to="route.path"
                v-slot="{ isActive }"
              >
                <div
                  class="grid grid-cols-[30px_1fr] transition-all duration-300 p-4 rounded-lg text-gray-400"
                  :class="
                    isActive
                      ? 'bg-sidebar-active text-primary-text font-semibold '
                      : 'hover:bg-[#c3ddff]'
                  "
                >
                  <DynamicIcons
                    :name="route.meta.icon"
                    class="shrink-0"
                    :class="isActive ? 'text-[#155DFC]' : 'text-[#364153]'"
                  />
                  <span class="text-sm font-medium">{{ route.name }}</span>
                </div>
              </router-link>
            </nav>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Pacifico:regular);
.logo {
  font-family: Pacifico;
}
</style>

<!-- :class="hoveredCardId === card.id ? 'bg-[#4E5257]' : 'bg-[#EBE8E8]'" -->
