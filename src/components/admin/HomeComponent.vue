<script setup>
import DashboardNavLinks from './DashboardNavLinks.vue'
import { useRoute } from 'vue-router'
import NotificationBell from './NotificationBell.vue'
import ThemeToggle from './ThemeToggle.vue'
import UserMenu from '../auth/UserMenu.vue'
import { useDarkMode } from '../../composables/useDarkMode'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const isScrolled = ref(false)
const route = useRoute()
const { isDarkMode } = useDarkMode()

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
      <DashboardNavLinks class="z-50" />

      <!-- header -->
      <header
        class="h-16 fixed top-0 right-0 left-64 z-50 flex items-center justify-between px-8 transition-colors duration-300"
        :class="
          isScrolled
            ? isDarkMode
              ? 'bg-slate-900/80 backdrop-blur-xl text-white'
              : 'bg-white/80 backdrop-blur-xl text-gray-900'
            : isDarkMode
              ? 'bg-slate-950 text-white'
              : 'bg-white text-gray-900'
        "
      >
        <h1 class="flex-1 text-lg font-semibold">{{ route.name }}</h1>

        <div class="flex items-center gap-8">
          <ThemeToggle />
          <NotificationBell />
          <!-- User Menu Dropdown -->
          <UserMenu :seed="props.seed" />
        </div>
      </header>
    </div>
  </div>
</template>
