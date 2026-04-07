<script setup>
import { ref } from 'vue'

const isLoading = ref(false)

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
  <div
    v-if="isLoading"
    class="fixed top-16 left-64 right-0 bottom-0 bg-white bg-opacity-50 flex items-center justify-center z-40"
  >
    <div class="flex flex-col items-center gap-4">
      <div
        class="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
      ></div>
      <p class="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
</template>

<style scoped></style>
