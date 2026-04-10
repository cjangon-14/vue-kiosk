<script setup>
import SystemHealth from '@/components/SystemHealth.vue'
import StoresWithIssues from '@/components/StoresWithIssues.vue'
import PriorityAlerts from '@/components/PriorityAlerts.vue'
</script>

<template>
  <div class="ml-64 p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    <div class="flex flex-col mx-auto w-[85%]">
      <!-- Header -->
      <div class="mb-12"></div>

      <!-- System Metrics -->
      <div class="mb-8 animate-slide-in" style="animation-delay: 0.1s">
        <SystemHealth />
      </div>

      <!-- Priority Alerts -->
      <div class="mb-8 animate-slide-in" style="animation-delay: 0.2s">
        <PriorityAlerts />
      </div>

      <!-- Stores with Issues -->
      <div class="animate-slide-in" style="animation-delay: 0.3s">
        <StoresWithIssues />
      </div>
    </div>
  </div>
</template>
