<script setup>
import { Moon, Sun } from '@lucide/vue'
import { useDarkMode } from '../../composables/useDarkMode'
import { ref } from 'vue'

const { isDarkMode, toggleDarkMode } = useDarkMode()
const isAnimating = ref(false)

const handleToggle = () => {
  isAnimating.value = true
  toggleDarkMode()
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}
</script>

<template>
  <button
    @click="handleToggle"
    class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300"
    :class="isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-200 hover:bg-blue-300'"
    aria-label="Toggle dark mode"
  >
    <!-- Sliding background pill -->
    <span
      class="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 flex items-center justify-center"
      :class="[
        isDarkMode ? 'translate-x-7' : 'translate-x-1',
        isAnimating ? 'scale-75 rotate-180' : 'scale-100 rotate-0',
      ]"
    >
      <Moon
        v-if="isDarkMode"
        class="h-4 w-4 text-slate-700 transition-all duration-300"
        :class="isAnimating ? 'rotate-180' : 'rotate-0'"
      />
      <Sun
        v-else
        class="h-4 w-4 text-blue-600 transition-all duration-300"
        :class="isAnimating ? 'rotate-180' : 'rotate-0'"
      />
    </span>
  </button>
</template>

<style scoped>
button {
  flex-shrink: 0;
}
</style>
