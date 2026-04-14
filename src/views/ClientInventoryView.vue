<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Edit, Trash2, AlertTriangle, Boxes, TrendingDown } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import { useActivityLog } from '../composables/useActivityLog'

const { getUser } = useAuth()
const { logInventoryUpdated } = useActivityLog()
const currentUser = getUser()

const inventory = ref([])
const products = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const editingId = ref(null)
const formData = ref({
  productId: '',
  quantity: 0,
  minThreshold: 10,
  maxCapacity: 100,
})

const filteredInventory = computed(() => {
  return inventory.value.filter((item) => {
    const product = getProduct(item.productId)
    return product && product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const lowStockItems = computed(() => {
  return filteredInventory.value.filter((item) => item.quantity < item.minThreshold)
})

const getProduct = (productId) => {
  return products.value.find((p) => p.id === productId)
}

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

    // Load inventory
    const inventoryRes = await fetch('http://localhost:3005/inventory')
    if (inventoryRes.ok) {
      const allInventory = await inventoryRes.json()
      inventory.value = allInventory.filter((i) => i.storeId === currentUser.storeId)
    }
  } catch (err) {
    console.error('Failed to load data:', err)
  } finally {
    loading.value = false
  }
}

const openModal = (item = null) => {
  if (item) {
    editingId.value = item.id
    formData.value = { ...item }
  } else {
    editingId.value = null
    formData.value = {
      productId: '',
      quantity: 0,
      minThreshold: 10,
      maxCapacity: 100,
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const saveInventory = async () => {
  if (!formData.value.productId) {
    alert('Product selection is required')
    return
  }

  try {
    const dataToSave = {
      ...formData.value,
      quantity: parseInt(formData.value.quantity),
      minThreshold: parseInt(formData.value.minThreshold),
      maxCapacity: parseInt(formData.value.maxCapacity),
      storeId: currentUser.storeId,
      id: editingId.value || Date.now().toString(),
      updatedAt: new Date().toISOString(),
    }

    const product = getProduct(formData.value.productId)
    if (editingId.value) {
      await fetch(`http://localhost:3005/inventory/${editingId.value}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })
    } else {
      await fetch('http://localhost:3005/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })
    }

    if (product) {
      await logInventoryUpdated(product.name, formData.value.quantity)
    }

    await loadData()
    closeModal()
  } catch (err) {
    console.error('Failed to save inventory:', err)
  }
}

const deleteInventory = async (id) => {
  if (confirm('Are you sure you want to remove this item?')) {
    try {
      await fetch(`http://localhost:3005/inventory/${id}`, {
        method: 'DELETE',
      })
      await loadData()
    } catch (err) {
      console.error('Failed to delete inventory:', err)
    }
  }
}

const getStockStatus = (item) => {
  if (item.quantity < item.minThreshold) {
    return { color: 'text-red-600 bg-red-50', label: 'Low Stock' }
  }
  if (item.quantity === 0) {
    return { color: 'text-red-600 bg-red-50', label: 'Out of Stock' }
  }
  if (item.quantity >= item.maxCapacity) {
    return { color: 'text-yellow-600 bg-yellow-50', label: 'Full' }
  }
  return { color: 'text-green-600 bg-green-50', label: 'In Stock' }
}

const getStockPercentage = (item) => {
  return Math.round((item.quantity / item.maxCapacity) * 100)
}
</script>

<template>
  <div class="flex mt-12 ml-64 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p class="text-gray-600 mt-1">Track stock levels of your products</p>
          </div>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">Inventory</span>
        </nav>

        <!-- Low Stock Alert -->
        <div
          v-if="lowStockItems.length > 0"
          class="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3"
        >
          <AlertTriangle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 class="font-semibold text-red-900">Low Stock Warning</h3>
            <p class="text-sm text-red-700">
              {{ lowStockItems.length }} item(s) are below minimum threshold
            </p>
          </div>
        </div>

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

        <!-- Inventory Table -->
        <div v-if="!loading" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div v-if="filteredInventory.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Product
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Current Stock
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Stock Level
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
                <tr v-for="item in filteredInventory" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">
                    {{ getProduct(item.productId)?.name || 'Unknown Product' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ item.quantity }} / {{ item.maxCapacity }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <div class="w-32">
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div
                          class="bg-emerald-600 h-2 rounded-full transition-all"
                          :style="{ width: getStockPercentage(item) + '%' }"
                        ></div>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">{{ getStockPercentage(item) }}%</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      :class="getStockStatus(item).color"
                      class="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <TrendingDown class="w-3 h-3" />
                      {{ getStockStatus(item).label }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex gap-2">
                      <button
                        @click="openModal(item)"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteInventory(item.id)"
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
            <Boxes class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No inventory tracked yet</p>
            <button
              @click="openModal()"
              class="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Start tracking inventory →
            </button>
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
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-2xl font-bold mb-4">{{ editingId ? 'Edit' : 'Add' }} Inventory</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <select
                v-model="formData.productId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a product</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Quantity</label>
              <input
                v-model.number="formData.quantity"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Threshold</label>
              <input
                v-model.number="formData.minThreshold"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Capacity</label>
              <input
                v-model.number="formData.maxCapacity"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div class="flex gap-4">
              <button
                @click="saveInventory"
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
