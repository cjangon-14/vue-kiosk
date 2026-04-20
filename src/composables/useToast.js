import { ref } from 'vue'

const toasts = ref([])
let nextToastId = 1
const defaultDuration = 3500

function removeToast(id) {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

function createToast(message, type = 'info') {
  const id = nextToastId++
  toasts.value.push({ id, message, type })

  setTimeout(() => removeToast(id), defaultDuration)
  return id
}

export function useToast() {
  return {
    success(message) {
      return createToast(message, 'success')
    },
    error(message) {
      return createToast(message, 'error')
    },
    warning(message) {
      return createToast(message, 'warning')
    },
    info(message) {
      return createToast(message, 'info')
    },
  }
}

export function useToastStore() {
  return {
    toasts,
    removeToast,
  }
}
