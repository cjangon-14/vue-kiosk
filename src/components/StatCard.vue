<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: Object,
  color: {
    type: String,
    default: 'gray',
  },
  trend: {
    type: String,
    default: null, // 'up' or 'down'
  },
  trendValue: {
    type: String,
    default: null,
  },
})

const colorClasses = {
  blue: 'bg-gradient-to-br from-white to-blue-50 text-primary-text rounded-xl p-6 border border-blue-100',
  green:
    'bg-gradient-to-br from-white to-green-50 text-primary-text rounded-xl p-6 border border-green-100',
  purple:
    'bg-gradient-to-br from-white to-purple-50 text-primary-text rounded-xl p-6 border border-purple-100',
  red: 'bg-gradient-to-br from-white to-red-50 text-primary-text rounded-xl p-6 border border-red-100',
}

const iconBgClasses = {
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  purple: 'bg-purple-50',
  red: 'bg-red-50',
}

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  red: 'text-red-600',
}

const trendColorClasses = {
  up: 'text-green-600',
  down: 'text-red-600',
}
</script>

<template>
  <div
    :class="[
      'rounded-lg border p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in',
      colorClasses[color],
    ]"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-primary-text opacity-75">{{ title }}</p>
        <div class="flex items-center gap-2 mt-2">
          <p class="text-4xl font-bold">{{ value }}</p>
          <div
            v-if="trend"
            :class="['flex items-center gap-1 text-sm font-semibold', trendColorClasses[trend]]"
          >
            <span>{{ trend === 'up' ? '↑' : '↓' }}</span>
            <span v-if="trendValue">{{ trendValue }}</span>
          </div>
        </div>
      </div>
      <div :class="['p-3 rounded-lg', iconBgClasses[color]]">
        <component :is="icon" :class="['w-6 h-6', iconColorClasses[color]]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>
