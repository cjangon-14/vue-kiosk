<script setup>
import { computed } from 'vue'
import DashboardNavLinks from './DashboardNavLinks.vue'
import { useRoute } from 'vue-router'
import NotificationBell from './NotificationBell.vue'
import { ref, onMounted, onUnmounted } from 'vue'
const isScrolled = ref(false)
const route = useRoute()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 60
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const props = defineProps({
  seed: { type: String, default: 'SAdmin' },
})

const src = computed(() => {
  const url = new URL('https://api.dicebear.com/9.x/lorelei/svg')
  url.searchParams.set('seed', props.seed)
  url.searchParams.set('size', '128')
  // ... other options
  return url.href
})
</script>
<template>
  <div>
    <div class="grid grid-cols-[250px_1fr]">
      <!-- sidebar -->
      <DashboardNavLinks />

      <!-- header -->
      <header
        class="h-16 border-b border-gray-100 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8"
        :class="isScrolled ? 'bg-white/70 backdrop-blur-sm' : 'bg-white'"
      >
        <h1 class="flex-1 text-lg font-semibold">{{ route.name }}</h1>

        <div class="flex items-center gap-8">
          <NotificationBell />
          <!-- User -->
          <div class="flex gap-5 mr-4 items-center px-2 py-2">
            <div
              class="border border-blue-400 rounded-full size-11 flex items-center justify-center"
            >
              <img :src="src" alt="Avatar" class="w-8 h-8 rounded-full bg-gray-200" />
            </div>
            <div class="flex flex-col">
              <h2 class="font-inter font-semibold text-sm">Admin User</h2>
              <p class="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  </div>
</template>
