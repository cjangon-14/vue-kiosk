import { ref } from 'vue'

export function useFetchData() {
  const loading = ref(true)
  const error = ref(null)

  const fetchStoresAndKiosks = async () => {
    loading.value = true
    error.value = null
    try {
      const [storesRes, adminsRes, kiosksRes] = await Promise.all([
        fetch('http://localhost:3005/stores'),
        fetch('http://localhost:3005/admins'),
        fetch('http://localhost:3005/kiosks'),
      ])

      if (!storesRes.ok || !adminsRes.ok || !kiosksRes.ok) {
        throw new Error('Failed to fetch data from server')
      }

      const stores = await storesRes.json()
      const admins = await adminsRes.json()
      const kiosks = await kiosksRes.json()

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
      const res = await fetch('http://localhost:3005/recentActivities')

      if (!res.ok) {
        throw new Error('Failed to fetch recent activities')
      }

      const activities = await res.json()
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
        id: Date.now().toString(),
        type,
        description,
        timestamp: new Date().toISOString(),
      }

      const res = await fetch('http://localhost:3005/recentActivities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      })

      if (!res.ok) throw new Error('Failed to add activity')
      return newActivity
    } catch (err) {
      console.error('Error adding activity:', err)
      throw err
    }
  }

  const updateStoreLastActivity = async (storeId) => {
    try {
      const res = await fetch(`http://localhost:3005/stores/${storeId}`)
      if (!res.ok) throw new Error('Failed to fetch store')
      const store = await res.json()

      const updateRes = await fetch(`http://localhost:3005/stores/${storeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...store,
          lastActivity: new Date().toISOString(),
        }),
      })

      if (!updateRes.ok) throw new Error('Failed to update store lastActivity')
      return updateRes.json()
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
