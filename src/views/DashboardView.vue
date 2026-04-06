<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<template>
  <div class="ml-64 pt-16 min-h-screen bg-amber-200">{{ route.name }}</div>
</template>
