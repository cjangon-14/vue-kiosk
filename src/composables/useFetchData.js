import { ref } from 'vue'
import { apiService } from '../api/apiService.js'

export function useFetchData() {
  const loading = ref(true)
  const error = ref(null)

  const fetchStoresAndKiosks = async () => {
    loading.value = true
    error.value = null
    try {
      const [stores, admins, kiosks] = await Promise.all([
        apiService.getStores(),
        apiService.getAdmins(),
        apiService.getKiosks(),
      ])

      if (!stores || !admins || !kiosks) {
        throw new Error('Failed to fetch data from server')
      }

      return { stores, admins, kiosks }
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const calculateKioskStats = (kiosksData) => {
    let total = 0
    let active = 0
    let offline = 0
    let maintenance = 0

    Object.values(kiosksData).forEach((kioskArray) => {
      kioskArray.forEach((kiosk) => {
        total++
        if (kiosk.status === 'active') {
          active++
        } else if (kiosk.status === 'offline') {
          offline++
        } else if (kiosk.status === 'maintenance') {
          maintenance++
        }
      })
    })

    return { total, active, offline, maintenance }
  }

  const getStoresWithIssues = (stores, kiosksData) => {
    const issuesMap = {}
    const totalsMap = {}

    Object.entries(kiosksData).forEach(([storeId, kiosks]) => {
      const offlineCount = kiosks.filter((k) => k.status === 'offline').length
      const totalCount = kiosks.length
      totalsMap[storeId] = totalCount
      if (offlineCount > 0) {
        issuesMap[storeId] = offlineCount
      }
    })

    return stores
      .filter((store) => issuesMap[store.id])
      .map((store) => ({
        ...store,
        offlineKiosks: issuesMap[store.id],
        kiosksCount: totalsMap[store.id] || 0,
      }))
  }

  const setLoading = (value) => {
    loading.value = value
  }

  const setError = (value) => {
    error.value = value
  }

  const fetchRecentActivities = async () => {
    loading.value = true
    error.value = null
    try {
      const activities = await apiService.getRecentActivities()

      if (!activities) {
        throw new Error('Failed to fetch recent activities')
      }

      return activities
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch recent activities:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addRecentActivity = async (type, description) => {
    try {
      const newActivity = {
        type,
        description,
      }

      const result = await apiService.createActivity(newActivity)
      if (!result) throw new Error('Failed to add activity')
      return result
    } catch (err) {
      console.error('Error adding activity:', err)
      throw err
    }
  }

  const updateStoreLastActivity = async (storeId) => {
    try {
      const updateResult = await apiService.updateStore(storeId, {
        lastActivity: new Date().toISOString(),
      })
      if (!updateResult) throw new Error('Failed to update store lastActivity')
      return updateResult
    } catch (err) {
      console.error('Error updating store lastActivity:', err)
      throw err
    }
  }

  return {
    loading,
    error,
    fetchStoresAndKiosks,
    calculateKioskStats,
    getStoresWithIssues,
    fetchRecentActivities,
    addRecentActivity,
    updateStoreLastActivity,
    setLoading,
    setError,
  }
}
