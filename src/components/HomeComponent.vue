<script setup>
import DashboardNavLinks from './DashboardNavLinks.vue'
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
        header
      </header>
    </div>
  </div>
</template>
