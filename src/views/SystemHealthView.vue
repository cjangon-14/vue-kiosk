<script setup>
// import SystemHealth from '@/components/admin/SystemHealth.vue'
import StoresWithIssues from '@/components/admin/StoresWithIssues.vue'
import PriorityAlerts from '@/components/admin/PriorityAlerts.vue'
</script>

<template>
  <div class="ml-64 p-8 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
    <div class="flex flex-col mx-auto w-[85%]">
      <!-- Header -->
      <div class="mb-12"></div>

      <!-- System Metrics -->
      <!-- <div class="mb-8 animate-slide-in" style="animation-delay: 0.1s">
        <SystemHealth />
      </div> -->

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
