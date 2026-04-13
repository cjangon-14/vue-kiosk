import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import { useActivityLog } from './useActivityLog'

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

      const res = await fetch('http://localhost:3005/stores')
      if (!res.ok) {
        throw new Error('Failed to fetch stores')
      }

      const stores = await res.json()
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

      const res = await fetch(`http://localhost:3005/stores/${storeData.value.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      })

      if (!res.ok) {
        throw new Error('Failed to update store name')
      }

      const updatedStore = await res.json()
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
