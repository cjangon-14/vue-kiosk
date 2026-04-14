<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Plus, Edit, Trash2, PackageOpen, AlertCircle } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import { useActivityLog } from '../composables/useActivityLog'

const { getUser } = useAuth()
const { logProductAdded, logProductUpdated, logProductDeleted } = useActivityLog()
const currentUser = getUser()

const products = ref([])
const categories = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const editingId = ref(null)
const formData = ref({
  name: '',
  category: '',
  price: '',
  description: '',
  image: '',
  isAvailable: true,
})

const filteredProducts = computed(() => {
  return products.value.filter((prod) =>
    prod.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    // Load products
    const productsRes = await fetch('http://localhost:3005/products')
    if (productsRes.ok) {
      const allProducts = await productsRes.json()
      products.value = allProducts.filter((p) => p.storeId === currentUser.storeId)
    }

    // Load categories
    const categoriesRes = await fetch('http://localhost:3005/categories')
    if (categoriesRes.ok) {
      const allCategories = await categoriesRes.json()
      categories.value = allCategories.filter((c) => c.storeId === currentUser.storeId)
    }
  } catch (err) {
    console.error('Failed to load data:', err)
  } finally {
    loading.value = false
  }
}

const openModal = (product = null) => {
  if (product) {
    editingId.value = product.id
    formData.value = { ...product }
  } else {
    editingId.value = null
    formData.value = {
      name: '',
      category: '',
      price: '',
      description: '',
      image: '',
      isAvailable: true,
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const saveProduct = async () => {
  if (!formData.value.name || !formData.value.category || !formData.value.price) {
    alert('Name, category, and price are required')
    return
  }

  try {
    const dataToSave = {
      ...formData.value,
      price: parseFloat(formData.value.price),
      storeId: currentUser.storeId,
      id: editingId.value || Date.now().toString(),
      createdAt: editingId.value ? undefined : new Date().toISOString(),
    }

    if (editingId.value) {
      await fetch(`http://localhost:3005/products/${editingId.value}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })
      await logProductUpdated(formData.value.name)
    } else {
      await fetch('http://localhost:3005/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })
      await logProductAdded(formData.value.name)
    }

    await loadData()
    closeModal()
  } catch (err) {
    console.error('Failed to save product:', err)
  }
}

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const productToDelete = products.value.find((p) => p.id === id)
      await fetch(`http://localhost:3005/products/${id}`, {
        method: 'DELETE',
      })
      if (productToDelete) {
        await logProductDeleted(productToDelete.name)
      }
      await loadData()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }
}

const toggleAvailability = async (product) => {
  try {
    await fetch(`http://localhost:3005/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: !product.isAvailable }),
    })
    await loadData()
  } catch (err) {
    console.error('Failed to update product:', err)
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
            <h1 class="text-3xl font-bold text-gray-900">Products</h1>
            <p class="text-gray-600 mt-1">Manage your menu items and prices</p>
          </div>
          <button
            @click="openModal()"
            class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus class="w-4 h-4" />
            Add Product
          </button>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">Products</span>
        </nav>

        <!-- Search -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="relative">
            <Search class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Products Table -->
        <div v-if="!loading" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div v-if="filteredProducts.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Name
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Category
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Price
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Status
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ product.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ product.category }}</td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${{ product.price }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      @click="toggleAvailability(product)"
                      :class="
                        product.isAvailable
                          ? 'px-3 py-1 bg-green-50 text-green-600 cursor-pointer'
                          : 'px-3 py-1 bg-red-50 text-red-600 cursor-pointer'
                      "
                      class="rounded-full text-xs font-semibold inline-block"
                    >
                      {{ product.isAvailable ? 'Available' : 'Unavailable' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex gap-2">
                      <button
                        @click="openModal(product)"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteProduct(product.id)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="px-6 py-12 text-center">
            <PackageOpen class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No products found</p>
          </div>
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
        <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">{{ editingId ? 'Edit' : 'Add' }} Product</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="e.g., Big Mac"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="formData.category"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                v-model="formData.price"
                type="number"
                step="0.01"
                placeholder="9.99"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="formData.description"
                placeholder="Describe this product..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows="2"
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
            <div class="flex items-center">
              <input
                v-model="formData.isAvailable"
                type="checkbox"
                class="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <label class="ml-2 text-sm text-gray-700">Available for sale</label>
            </div>
            <div class="flex gap-4">
              <button
                @click="saveProduct"
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
