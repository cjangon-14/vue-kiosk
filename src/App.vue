<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import PageLoader from '@/components/admin/PageLoader.vue'
import { useDarkMode } from '@/composables/useDarkMode'

const router = useRouter()
const loaderRef = ref(null)
let loaderStartTime = 0
const { initializeDarkMode } = useDarkMode()

router.beforeEach(() => {
  loaderStartTime = Date.now()
  loaderRef.value?.showLoader()
})

router.afterEach(() => {
  const elapsedTime = Date.now() - loaderStartTime
  const minimumLoadTime = 500 // Minimum time to show loader in ms

  if (elapsedTime < minimumLoadTime) {
    setTimeout(() => {
      loaderRef.value?.hideLoader()
    }, minimumLoadTime - elapsedTime)
  } else {
    loaderRef.value?.hideLoader()
  }
})

onMounted(() => {
  initializeDarkMode()
})
</script>

<template>
  <PageLoader ref="loaderRef" />
  <RouterView />
</template>

<style scoped></style>
