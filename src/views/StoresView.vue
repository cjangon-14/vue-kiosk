<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<template>
  <div class="flex ml-64 pt-16 bg-amber-200 min-h-screen">
    <div class="p-8 flex flex-col mx-auto w-10/12">
      <div class="space-y-8 bg-blue-200 h-full">
        <h1 class="text-2xl font-bold">Stores View</h1>
        <p>Current route: {{ route.name }}</p>
      </div>
    </div>
  </div>
</template>
