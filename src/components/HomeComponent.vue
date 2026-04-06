<script setup>
import DashboardNavLinks from './DashboardNavLinks.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<template>
  <div>
    <div class="grid grid-cols-[250px_1fr]">
      <!-- sidebar -->
      <DashboardNavLinks />

      <!-- header -->
      <header
        class="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8"
      >
        <h1 class="text-lg font-semibold">{{ route.name }}</h1>
      </header>
    </div>
  </div>
</template>
