<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Plus, Edit, Trash2, LayoutList } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import { useActivityLog } from '../composables/useActivityLog'

const { getUser } = useAuth()
const { logMenuAdded, logMenuUpdated, logMenuDeleted } = useActivityLog()
const currentUser = getUser()

const menus = ref([])
const products = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const editingId = ref(null)
const formData = ref({
  name: '',
  description: '',
  price: '',
  items: [],
  isActive: true,
})

const filteredMenus = computed(() => {
  return menus.value.filter((menu) =>
    menu.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    loading.value = true

    // Load menus
    const menusRes = await fetch('http://localhost:3005/menus')
    if (menusRes.ok) {
      const allMenus = await menusRes.json()
      menus.value = allMenus.filter((m) => m.storeId === currentUser.storeId)
    }

    // Load products
    const productsRes = await fetch('http://localhost:3005/products')
    if (productsRes.ok) {
      const allProducts = await productsRes.json()
      products.value = allProducts.filter((p) => p.storeId === currentUser.storeId)
    }
  } catch (err) {
    console.error('Failed to load data:', err)
  } finally {
    loading.value = false
  }
}

const openModal = (menu = null) => {
  if (menu) {
    editingId.value = menu.id
    formData.value = { ...menu }
  } else {
    editingId.value = null
    formData.value = {
      name: '',
      description: '',
      price: '',
      items: [],
      isActive: true,
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const saveMenu = async () => {
  if (!formData.value.name || !formData.value.price) {
    alert('Menu name and price are required')
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
      await fetch(`http://localhost:3005/menus/${editingId.value}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })
      await logMenuUpdated(formData.value.name)
    } else {
      await fetch('http://localhost:3005/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })
      await logMenuAdded(formData.value.name)
    }

    await loadData()
    closeModal()
  } catch (err) {
    console.error('Failed to save menu:', err)
  }
}

const deleteMenu = async (id) => {
  if (confirm('Are you sure you want to delete this menu?')) {
    try {
      const menuToDelete = menus.value.find((m) => m.id === id)
      await fetch(`http://localhost:3005/menus/${id}`, {
        method: 'DELETE',
      })
      if (menuToDelete) {
        await logMenuDeleted(menuToDelete.name)
      }
      await loadData()
    } catch (err) {
      console.error('Failed to delete menu:', err)
    }
  }
}

const toggleActive = async (menu) => {
  try {
    await fetch(`http://localhost:3005/menus/${menu.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !menu.isActive }),
    })
    await loadData()
  } catch (err) {
    console.error('Failed to update menu:', err)
  }
}
</script>

<template>
  <div class="flex mt-8 ml-64 bg-linear-to-br from-gray-50 to-gray-100">
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Menus</h1>
            <p class="text-gray-600 mt-1">Create combo meals and special offers</p>
          </div>
          <button
            @click="openModal()"
            class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus class="w-4 h-4" />
            Add Menu
          </button>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">Menus</span>
        </nav>

        <!-- Search -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="relative">
            <Search class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search menus..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- Menus Table -->
        <div v-if="!loading" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div v-if="filteredMenus.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Name
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Price
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Items
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
                <tr v-for="menu in filteredMenus" :key="menu.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ menu.name }}</td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900">${{ menu.price }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ menu.items ? menu.items.length : 0 }} items
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      @click="toggleActive(menu)"
                      :class="
                        menu.isActive
                          ? 'px-3 py-1 bg-green-50 text-green-600 cursor-pointer'
                          : 'px-3 py-1 bg-gray-50 text-gray-600 cursor-pointer'
                      "
                      class="rounded-full text-xs font-semibold inline-block"
                    >
                      {{ menu.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex gap-2">
                      <button
                        @click="openModal(menu)"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteMenu(menu.id)"
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
            <LayoutList class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No menus found</p>
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
          <h2 class="text-2xl font-bold mb-4">{{ editingId ? 'Edit' : 'Add' }} Menu</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Menu Name</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="e.g., Happy Meal Combo"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
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
                placeholder="Describe this menu..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows="2"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Items in Menu</label>
              <p class="text-xs text-gray-600 mb-2">
                Select products to include (comma-separated product names)
              </p>
              <input
                v-model="formData.items"
                type="text"
                placeholder="Product1, Product2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div class="flex items-center">
              <input
                v-model="formData.isActive"
                type="checkbox"
                class="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
              />
              <label class="ml-2 text-sm text-gray-700">Active menu</label>
            </div>
            <div class="flex gap-4">
              <button
                @click="saveMenu"
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
