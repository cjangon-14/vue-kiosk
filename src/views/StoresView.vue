<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<template>
  <div class="ml-64 pt-16 min-h-screen bg-amber-200">
    <div class="p-8">
      <div class="space-y-8 bg-blue-200 min-h-screen">
        <h1 class="text-2xl font-bold">Stores View</h1>
        <p>Current route: {{ route.name }}</p>
      </div>
    </div>
  </div>
</template>
