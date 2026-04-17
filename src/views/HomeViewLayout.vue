<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import HomeComponent from '@/components/admin/HomeComponent.vue'

const router = useRouter()
const isLoading = ref(false)
let loadingTimer = null

router.beforeEach((to, from) => {
  // Show loader for dashboard navigation (not login)
  if (from.name && to.path !== from.path && to.path !== '/login' && from.path !== '/login') {
    isLoading.value = true
  }
})

router.afterEach(() => {
  // Ensure minimum 300ms to show spinner
  clearTimeout(loadingTimer)
  loadingTimer = setTimeout(() => {
    isLoading.value = false
  }, 300)
})

</script>

<template>
  <main>
    <HomeComponent />

    <!-- Content area with spinner overlay -->
    <div class="relative">
      <!-- Spinner overlay -->
      <transition name="fade">
        <div
          v-if="isLoading"
          class="fixed flex items-center justify-center z-50"
          style="top: 64px; left: 250px; right: 0; bottom: 0"
        >
          <div class="flex flex-col items-center gap-3">
            <div class="relative w-10 h-10">
              <div class="absolute inset-0 border-3 border-blue-200 rounded-full"></div>
              <div
                class="absolute inset-0 border-3 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-spin"
              ></div>
            </div>
            <p class="text-gray-600 text-xs font-medium">Loading...</p>
          </div>
        </div>
      </transition>

      <!-- Router content -->
      <div v-show="!isLoading" class="transition-opacity duration-200">
        <router-view />
      </div>
    </div>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
