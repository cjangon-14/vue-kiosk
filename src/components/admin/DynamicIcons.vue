<!-- src/components/admin/DynamicIcons.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import * as Icons from '@lucide/vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

// Map icon name to Lucide icon component
const iconComponent = computed(() => {
  if (!props.name) return null
  return Icons[props.name] || null
})
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" v-bind="$attrs" />
  <span v-else class="text-xs text-gray-500">Icon not found</span>
</template>
