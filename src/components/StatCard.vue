<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: Object,
  color: {
    type: String,
    default: 'blue',
  },
  trend: {
    type: String,
    default: null,
  },
  trendValue: {
    type: String,
    default: null,
  },
})

const gradients = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-emerald-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-red-600',
}

const lightBgs = {
  blue: 'from-blue-50 to-blue-100/50',
  green: 'from-emerald-50 to-emerald-100/50',
  purple: 'from-purple-50 to-purple-100/50',
  red: 'from-red-50 to-red-100/50',
}

const iconBgClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-emerald-100 text-emerald-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
}

const trendColorClasses = {
  up: 'text-emerald-600 bg-emerald-50',
  down: 'text-red-600 bg-red-50',
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-smooth group cursor-default animate-slide-in"
  >
    <!-- Gradient background -->
    <div :class="`absolute inset-0 bg-gradient-to-br ${lightBgs[color]} opacity-40`"></div>

    <!-- Gradient accent in top-right -->
    <div
      :class="`absolute
      -top-12
      -right-12
      w-32
      h-32
      bg-gradient-to-br
      ${gradients[color]}
      rounded-full
      opacity-5
      group-hover:opacity-10
      transition-smooth`"
    ></div>

    <!-- Content -->
    <div class="relative z-10 flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-2">{{ title }}</p>
        <div class="flex items-end gap-3">
          <p class="text-5xl font-bold text-gray-900 font-sans tracking-tight">
            {{ value }}
          </p>
          <div
            v-if="trend"
            :class="[
              'px-2.5 py-1 rounded-full text-xs font-semibold mb-1 flex items-center gap-1',
              trendColorClasses[trend],
            ]"
          >
            <span>{{ trend === 'up' ? '↑' : '↓' }}</span>
            <span v-if="trendValue">{{ trendValue }}</span>
          </div>
        </div>
      </div>
      <div
        :class="['p-3 rounded-xl transition-smooth group-hover:scale-110', iconBgClasses[color]]"
      >
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.4s ease-out backwards;
}

.animate-slide-in:nth-child(1) {
  animation-delay: 0.1s;
}

.animate-slide-in:nth-child(2) {
  animation-delay: 0.2s;
}

.animate-slide-in:nth-child(3) {
  animation-delay: 0.3s;
}

.animate-slide-in:nth-child(4) {
  animation-delay: 0.4s;
}
</style>
