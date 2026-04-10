<script setup>
import RecentActivity from '@/components/RecentActivity.vue'
</script>

<template>
  <div class="ml-64 p-8 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
    <div class="flex flex-col mx-auto w-[85%]">
      <!-- Header -->
      <div class="mb-12"></div>

      <!-- Recent Activity -->
      <div class="animate-slide-in" style="animation-delay: 0.1s">
        <RecentActivity />
      </div>
    </div>
  </div>
</template>
