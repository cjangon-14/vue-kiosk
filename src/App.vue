<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import PageLoader from '@/components/admin/PageLoader.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const loaderRef = ref(null)
const loaderMessage = ref('Logging in...')
const showContent = ref(false)
let loaderStartTime = 0
const { initializeDarkMode } = useDarkMode()
const { isAuthenticated } = useAuth()

// Watch for route changes and handle loader display
router.beforeEach((to, from) => {
  // Always show loader on login/logout transitions
  if (from.path === '/login' || to.path === '/login') {
    loaderStartTime = Date.now()
    showContent.value = false
    if (from.path === '/login') {
      loaderMessage.value = 'Logging in...'
    } else {
      loaderMessage.value = 'Logging out...'
    }
    loaderRef.value?.showLoader()
  }
})

router.afterEach(() => {
  const elapsedTime = Date.now() - loaderStartTime
  const minimumLoadTime = 800 // Longer wait to ensure no peeking

  setTimeout(() => {
    loaderRef.value?.hideLoader()
    showContent.value = true
  }, Math.max(minimumLoadTime - elapsedTime, minimumLoadTime))
})

onMounted(async () => {
  initializeDarkMode()

  // Show loader initially to prevent content flash
  loaderRef.value?.showLoader()

  // Wait for auth to be ready
  await new Promise(resolve => setTimeout(resolve, 200))

  showContent.value = true
  loaderRef.value?.hideLoader()
})
</script>

<template>
  <PageLoader ref="loaderRef" :message="loaderMessage" />
  <ToastContainer />
  <!-- Only show content after auth is verified -->
  <RouterView v-if="showContent" />
</template>

<style scoped></style>
