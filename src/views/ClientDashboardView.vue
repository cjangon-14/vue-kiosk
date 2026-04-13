<script setup>
import { ref, onMounted } from 'vue'
import { PackageOpen, UtensilsCrossed, LayoutList, TrendingUp, AlertCircle } from '@lucide/vue'
import StatCard from '../components/admin/StatCard.vue'
import { useAuth } from '../composables/useAuth'

const { getUser } = useAuth()
const currentUser = getUser()

const stats = ref({
  totalProducts: 0,
  totalCategories: 0,
  activeMenus: 0,
  lowStockItems: 0,
})

const recentProducts = ref([])
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    if (currentUser?.storeId) {
      // Fetch products
      const productsRes = await fetch('http://localhost:3005/products')
      if (productsRes.ok) {
        const allProducts = await productsRes.json()
        const storeProducts = allProducts.filter((p) => p.storeId === currentUser.storeId)
        stats.value.totalProducts = storeProducts.length
        recentProducts.value = storeProducts.slice(0, 5)
      }

      // Fetch categories
      const categoriesRes = await fetch('http://localhost:3005/categories')
      if (categoriesRes.ok) {
        const allCategories = await categoriesRes.json()
        const storeCategories = allCategories.filter((c) => c.storeId === currentUser.storeId)
        stats.value.totalCategories = storeCategories.length
      }

      // Fetch menus
      const menusRes = await fetch('http://localhost:3005/menus')
      if (menusRes.ok) {
        const allMenus = await menusRes.json()
        const storeMenus = allMenus.filter((m) => m.storeId === currentUser.storeId)
        stats.value.activeMenus = storeMenus.filter((m) => m.isActive).length
      }

      // Fetch inventory
      const inventoryRes = await fetch('http://localhost:3005/inventory')
      if (inventoryRes.ok) {
        const allInventory = await inventoryRes.json()
        const storeInventory = allInventory.filter((i) => i.storeId === currentUser.storeId)
        stats.value.lowStockItems = storeInventory.filter((i) => i.quantity < i.minThreshold).length
      }
    }
  } catch (err) {
    console.error('Failed to load dashboard:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex mt-8 ml-64 bg-linear-to-br from-gray-50 to-gray-100">
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div v-if="loading" class="flex items-center justify-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <div v-else class="space-y-6">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
          <p class="text-gray-600 mt-1">Manage your kiosk menu, products, and inventory</p>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">Dashboard</span>
          <span class="text-gray-400">→</span>
          <span class="text-gray-600">Overview</span>
        </nav>

        <!-- Metrics Section -->
        <div style="animation-delay: 0.1s" class="animate-slide-in">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-emerald-100 rounded-lg">
              <UtensilsCrossed class="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Menu Overview</h2>
              <p class="text-sm text-gray-500">Your current menu catalog</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Products"
              :value="stats.totalProducts"
              :icon="PackageOpen"
              color="purple"
            />
            <StatCard
              title="Categories"
              :value="stats.totalCategories"
              :icon="LayoutList"
              color="blue"
            />
            <StatCard
              title="Active Menus"
              :value="stats.activeMenus"
              :icon="TrendingUp"
              color="green"
            />
            <StatCard
              title="Low Stock Items"
              :value="stats.lowStockItems"
              :icon="AlertCircle"
              color="red"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-2"></div>

        <!-- Recent Products -->
        <div style="animation-delay: 0.2s" class="animate-slide-in">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-blue-100 rounded-lg">
              <PackageOpen class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Recent Products</h2>
              <p class="text-sm text-gray-500">Recently added items</p>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div v-if="recentProducts.length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Product Name
                    </th>
                    <th
                      class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="product in recentProducts" :key="product.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ product.name }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ product.category }}</td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${{ product.price }}
                    </td>
                    <td class="px-6 py-4 text-sm">
                      <span
                        :class="
                          product.isAvailable
                            ? 'px-3 py-1 bg-green-50 text-green-600'
                            : 'px-3 py-1 bg-gray-50 text-gray-600'
                        "
                        class="rounded-full text-xs font-semibold"
                      >
                        {{ product.isAvailable ? 'Available' : 'Unavailable' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="px-6 py-12 text-center">
              <PackageOpen class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">No products yet</p>
              <router-link
                to="/client/products"
                class="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Create your first product →
              </router-link>
            </div>
          </div>

          <div v-if="recentProducts.length > 0" class="mt-4 text-center">
            <router-link
              to="/client/products"
              class="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All Products
              <span>→</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
