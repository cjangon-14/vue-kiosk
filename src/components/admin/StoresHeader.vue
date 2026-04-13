<script setup>
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
  selectedStatus: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:searchQuery', 'update:selectedStatus', 'add-store'])

const statuses = ['All Status', 'Active', 'Inactive']

const handleAddStoreClick = () => {
  emit('add-store')
}
</script>

<template>
  <div class="flex gap-4 mb-8">
    <div class="flex-1 relative">
      <svg
        class="absolute left-4 top-3.5 text-gray-400"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="8" cy="8" r="6"></circle>
        <path d="M13 13l4 4"></path>
      </svg>
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text"
        placeholder="Search stores by name..."
        class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth placeholder-gray-500"
      />
    </div>
    <select
      :value="selectedStatus"
      @change="$emit('update:selectedStatus', $event.target.value)"
      class="px-4 py-3 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 font-medium transition-smooth hover:cursor-pointer hover:shadow-md"
    >
      <option v-for="status in statuses" :key="status" :value="status">
        {{ status }}
      </option>
    </select>
    <button
      @click="handleAddStoreClick"
      class="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition-smooth"
    >
      <span>+</span>
      <span>Create Store</span>
    </button>
  </div>
</template>
