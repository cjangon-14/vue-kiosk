<script setup>
import ClientNavLinks from './ClientNavLinks.vue'
import { useRoute } from 'vue-router'
import NotificationBell from '../admin/NotificationBell.vue'
import ThemeToggle from '../admin/ThemeToggle.vue'
import UserMenu from '../auth/UserMenu.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const route = useRoute()

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 60
}
</script>

<template>
  <div>
    <div class="grid grid-cols-[250px_1fr]">
      <!-- sidebar -->
      <ClientNavLinks />

      <!-- header -->
      <header
        class="h-16 border-b-gray-100 fixed top-0 right-0 left-64 z-50 flex items-center justify-between px-8"
        :class="isScrolled ? 'header-scroll backdrop-blur-sm' : 'bg-white'"
      >
        <h1 class="flex-1 text-lg font-semibold">{{ route.name }}</h1>

        <div class="flex items-center gap-8">
          <ThemeToggle />
          <NotificationBell />
          <!-- User Menu Dropdown -->
          <UserMenu />
        </div>
      </header>
    </div>
  </div>
</template>
