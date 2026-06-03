import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import { useActivityLog } from './useActivityLog'
import { apiService } from '../api/apiService.js'

const storeData = ref({
  id: null,
  name: 'Store',
  status: 'active',
})

export const useStoreData = () => {
  const { getUser } = useAuth()
  const { logActivity } = useActivityLog()

  const fetchStoreData = async () => {
    try {
      const user = getUser()
      if (!user?.storeId) {
        console.warn('No store ID found in user data')
        return
      }

      const stores = await apiService.getStores()
      if (!stores) {
        throw new Error('Failed to fetch stores')
      }

      const currentStore = stores.find((s) => s.id === user.storeId)

      if (currentStore) {
        storeData.value = {
          id: currentStore.id,
          name: currentStore.name,
          status: currentStore.status,
        }
      }
    } catch (err) {
      console.error('Error fetching store data:', err)
    }
  }

  const updateStoreName = async (newName) => {
    try {
      const user = getUser()
      if (!user?.storeId || !storeData.value.id) {
        throw new Error('No store ID available')
      }

      const updatedStore = await apiService.updateStore(storeData.value.id, { name: newName })
      if (!updatedStore) {
        throw new Error('Failed to update store name')
      }

      storeData.value.name = updatedStore.name

      // Log activity
      await logActivity('Store Updated', `Store name changed to "${newName}"`)

      return updatedStore
    } catch (err) {
      console.error('Error updating store name:', err)
      throw err
    }
  }

  const storeName = computed(() => storeData.value.name || 'Store')

  // Initialize on first use
  if (!storeData.value.id) {
    fetchStoreData()
  }

  return {
    storeData,
    storeName,
    fetchStoreData,
    updateStoreName,
  }
}
