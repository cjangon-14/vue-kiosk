<script setup>
import DashboardNavLinks from './DashboardNavLinks.vue'
import { useRoute } from 'vue-router'
import NotificationBell from './NotificationBell.vue'
import UserMenu from '../auth/UserMenu.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const route = useRoute()

const props = defineProps({
  seed: { type: String, default: 'SAdmin' },
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 60
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
  <div>
    <div class="grid grid-cols-[250px_1fr]">
      <!-- sidebar -->
      <DashboardNavLinks />

      <!-- header -->
      <header
        class="h-16 fixed top-0 right-0 left-64 z-50 flex items-center justify-between px-8"
        :class="isScrolled ? ' backdrop-blur-xl' : 'bg-white'"
      >
        <h1 class="flex-1 text-lg font-semibold">{{ route.name }}</h1>

        <div class="flex items-center gap-8">
          <NotificationBell />
          <!-- User Menu Dropdown -->
          <UserMenu :seed="props.seed" />
        </div>
      </header>
    </div>
  </div>
</template>
