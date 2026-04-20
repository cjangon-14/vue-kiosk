<script setup>
import { useToastStore } from '@/composables/useToast'
const { toasts, removeToast } = useToastStore()
const iconMap = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠️',
  error: '✕',
}
const accentMap = {
  info: '#5B8BFF',
  success: '#3dd597',
  warning: '#ffb347',
  error: '#ff6b6b',
}
</script>

<template>
  <div class="fixed right-4 bottom-4 flex flex-col gap-[0.85rem] z-10000 w-[min(360px,calc(100vw-2rem))] p-1 pointer-events-none" v-show="toasts.length">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-[1rem]  bg-slate-900/95 text-slate-50 shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-[18px]"
        :style="{ '--toast-accent': accentMap[toast.type] }"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1.5 rounded-r" :style="{ backgroundColor: accentMap[toast.type] }"></div>

        <div class="relative grid h-10 w-10 shrink-0 place-items-center rounded-[1rem] bg-slate-800/80 border border-white/5">
          <span class="relative z-10 text-base text-slate-100">{{ iconMap[toast.type] }}</span>
        </div>

        <div class="flex-1 min-w-0">
          <p class="m-0 text-slate-100 text-sm leading-5">{{ toast.message }}</p>
        </div>

        <button
          type="button"
          class="shrink-0 grid h-8 w-8 place-items-center rounded-full border-none bg-slate-800/70 text-slate-200 text-lg transition duration-150 ease-in-out hover:scale-105 hover:bg-slate-700/75 focus:outline-none"
          aria-label="Dismiss"
          @click.stop="removeToast(toast.id)"
        >
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateX(110%);
}

.toast-enter-active {
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms ease;
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-active {
  transition: transform 200ms ease, opacity 200ms ease;
}
</style>
