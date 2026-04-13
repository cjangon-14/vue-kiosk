<!-- src/components/DynamicIcon.vue -->
<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

// Dynamically import the SVG component
const iconComponent = computed(() => {
  if (!props.name) return null
  return defineAsyncComponent(() => import(`@/assets/icons/${props.name}.svg`))
})
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" v-bind="$attrs" />
  <span v-else>Icon not found: {{ name }}</span>
</template>
