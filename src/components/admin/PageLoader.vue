<script setup>
import { ref } from 'vue'
import { Zap } from '@lucide/vue'

const isLoading = ref(false)

defineProps({
  message: {
    type: String,
    default: 'Loading Dashboard',
  },
})

const showLoader = () => {
  isLoading.value = true
}

const hideLoader = () => {
  isLoading.value = false
}

defineExpose({
  showLoader,
  hideLoader,
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-linear-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center z-[9999]"
    >
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-10 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 1s"
        ></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center gap-6">
        <!-- Logo/Icon -->
        <div class="flex items-center gap-3">
          <div class="relative">
            <Zap class="w-10 h-10 text-white" />
            <div
              class="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"
            ></div>
          </div>
          <h1 class="text-3xl font-bold text-white">Kiosk Admin</h1>
        </div>

        <!-- Loading spinner -->
        <div class="relative w-16 h-16">
          <div
            class="absolute inset-0 border-4 border-white/30 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"
          ></div>
        </div>

        <!-- Loading text -->
        <div class="text-center">
          <p class="text-white/90 font-semibold text-lg">{{ message }}</p>
          <p class="text-white/60 text-sm mt-1">Please wait...</p>
        </div>

        <!-- Progress indicator -->
        <div class="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            class="h-full bg-white rounded-full"
            style="
              width: 60%;
              animation: shimmer 1.5s infinite;
            "
          ></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    width: 30%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 30%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
