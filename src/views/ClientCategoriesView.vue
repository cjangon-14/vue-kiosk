<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Plus, Edit, Trash2, LayoutGrid } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import { useActivityLog } from '../composables/useActivityLog'

const { getUser } = useAuth()
const { logCategoryAdded, logCategoryUpdated, logCategoryDeleted } = useActivityLog()
const currentUser = getUser()

const categories = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const editingId = ref(null)
const formData = ref({
  name: '',
  description: '',
  image: '',
})

const filteredCategories = computed(() => {
  return categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

onMounted(async () => {
  await loadCategories()
})

const loadCategories = async () => {
  try {
    loading.value = true
    const res = await fetch('http://localhost:3005/categories')
    if (res.ok) {
      const allCategories = await res.json()
      categories.value = allCategories.filter((c) => c.storeId === currentUser.storeId)
    }
  } catch (err) {
    console.error('Failed to load categories:', err)
  } finally {
    loading.value = false
  }
}

const openModal = (category = null) => {
  if (category) {
    editingId.value = category.id
    formData.value = { ...category }
  } else {
    editingId.value = null
    formData.value = { name: '', description: '', image: '' }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
  formData.value = { name: '', description: '', image: '' }
}

const saveCategory = async () => {
  if (!formData.value.name) {
    alert('Category name is required')
    return
  }

  try {
    const dataToSave = {
      ...formData.value,
      storeId: currentUser.storeId,
      id: editingId.value || Date.now().toString(),
      createdAt: editingId.value ? undefined : new Date().toISOString(),
    }

    if (editingId.value) {
      await fetch(`http://localhost:3005/categories/${editingId.value}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })
      await logCategoryUpdated(formData.value.name)
    } else {
      await fetch('http://localhost:3005/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })
      await logCategoryAdded(formData.value.name)
    }

    await loadCategories()
    closeModal()
  } catch (err) {
    console.error('Failed to save category:', err)
  }
}

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      const categoryToDelete = categories.value.find((c) => c.id === id)
      await fetch(`http://localhost:3005/categories/${id}`, {
        method: 'DELETE',
      })
      if (categoryToDelete) {
        await logCategoryDeleted(categoryToDelete.name)
      }
      await loadCategories()
    } catch (err) {
      console.error('Failed to delete category:', err)
    }
  }
}
</script>

<template>
  <div class="flex mt-12 ml-64 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
            <p class="text-gray-600 mt-1">Organize your menu items into categories</p>
          </div>
          <button
            @click="openModal()"
            class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus class="w-4 h-4" />
            Add Category
          </button>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">Categories</span>
        </nav>

        <!-- Search -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="relative">
            <Search class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search categories..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Categories Grid -->
        <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div
                v-if="category.image"
                class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
              >
                <img
                  :src="category.image"
                  :alt="category.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <LayoutGrid class="w-8 h-8 text-emerald-600" />
              </div>
              <div class="flex gap-2">
                <button
                  @click="openModal(category)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
            <p class="text-sm text-gray-600">{{ category.description || 'No description' }}</p>
          </div>
        </div>

        <div v-if="!loading && filteredCategories.length === 0" class="text-center py-12">
          <LayoutGrid class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">No categories found</p>
        </div>

        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModal()"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-2xl font-bold mb-4">{{ editingId ? 'Edit' : 'Add' }} Category</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="e.g., Burgers"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="formData.description"
                placeholder="Describe this category..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                v-model="formData.image"
                type="text"
                placeholder="https://example.com/image.jpg"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div class="flex gap-4">
              <button
                @click="saveCategory"
                class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
              <button
                @click="closeModal"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
