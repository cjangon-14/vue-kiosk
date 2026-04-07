import { ref } from 'vue'

export function useFetchData() {
  const loading = ref(true)
  const error = ref(null)

  const fetchStoresAndKiosks = async () => {
    loading.value = true
    error.value = null
    try {
      const [storesRes, kiosksRes] = await Promise.all([
        fetch('http://localhost:3005/stores'),
        fetch('http://localhost:3005/kiosks'),
      ])

      if (!storesRes.ok || !kiosksRes.ok) {
        throw new Error('Failed to fetch data from server')
      }

      const stores = await storesRes.json()
      const kiosks = await kiosksRes.json()

      return { stores, kiosks }
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

    Object.entries(kiosksData).forEach(([storeId, kiosks]) => {
      const offlineCount = kiosks.filter((k) => k.status === 'offline').length
      if (offlineCount > 0) {
        issuesMap[storeId] = offlineCount
      }
    })

    return stores
      .filter((store) => issuesMap[store.id])
      .map((store) => ({
        ...store,
        offlineKiosks: issuesMap[store.id],
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

  return {
    loading,
    error,
    fetchStoresAndKiosks,
    calculateKioskStats,
    getStoresWithIssues,
    fetchRecentActivities,
    setLoading,
    setError,
  }
}
