import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import { useActivityLog } from './useActivityLog'
import { useToast } from './useToast'
import { apiService } from '../api/apiService.js'

const staffList = ref([])
const staffActivityLogs = ref([])

export const useStaffData = () => {
  const { getUser } = useAuth()
  const { logStaffAdded, logStaffUpdated, logStaffDeleted } = useActivityLog()
  const { success, error } = useToast()

  // Fetch all staff members for current store
  const fetchStaffData = async () => {
    try {
      const user = getUser()
      if (!user?.storeId) {
        console.warn('No store ID found in user data')
        return
      }

      const storeId = String(user.storeId)
      const allData = await apiService.getStaff()
      if (!allData) {
        throw new Error('Failed to fetch staff')
      }

      // Filter by current store ID on client side
      const filteredData = allData.filter(staff => String(staff.storeId) === storeId)
      staffList.value = filteredData
    } catch (err) {
      console.error('Error fetching staff:', err)
      error('Failed to load staff')
    }
  }

  // Fetch staff activity logs
  const fetchStaffActivityLogs = async () => {
    try {
      const user = getUser()
      if (!user?.storeId) return

      const storeId = String(user.storeId)
      const allLogs = await apiService.getStaffActivityLogs()
      if (!allLogs) {
        throw new Error('Failed to fetch staff activity logs')
      }

      // Filter by store ID on client side
      const filteredLogs = allLogs
        .filter(log => String(log.storeId) === storeId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10)
      staffActivityLogs.value = filteredLogs
    } catch (err) {
      console.error('Error fetching staff activity logs:', err)
    }
  }

  // Add new staff member
  const addStaff = async (staffData) => {
    try {
      const user = getUser()
      if (!user?.storeId) {
        throw new Error('No store ID available')
      }

      const newStaff = {
        storeId: String(user.storeId),
        status: 'active',
        ...staffData,
      }

      const addedStaff = await apiService.createStaff(newStaff)
      if (!addedStaff) {
        throw new Error('Failed to add staff')
      }

      staffList.value.push(addedStaff)

      // Log activity
      await logStaffAdded(`${staffData.firstName} ${staffData.lastName}`)

      // Log staff activity
      await logStaffActivity('Staff Added', `${staffData.firstName} ${staffData.lastName} added to staff`)

      success('Staff member added successfully')
      return addedStaff
    } catch (err) {
      console.error('Error adding staff:', err)
      error('Failed to add staff member')
      throw err
    }
  }

  // Update staff member
  const updateStaff = async (staffId, staffData) => {
    try {
      const user = getUser()
      if (!user?.storeId) {
        throw new Error('No store ID available')
      }

      const updatedStaff = await apiService.updateStaff(staffId, staffData)
      if (!updatedStaff) {
        throw new Error('Failed to update staff')
      }

      const index = staffList.value.findIndex((s) => s.id === staffId)
      if (index >= 0) {
        staffList.value[index] = updatedStaff
      }

      // Log activity
      await logStaffUpdated(`${updatedStaff.firstName} ${updatedStaff.lastName}`)

      // Log staff activity
      await logStaffActivity(
        'Staff Updated',
        `${updatedStaff.firstName} ${updatedStaff.lastName} profile updated`
      )

      success('Staff member updated successfully')
      return updatedStaff
    } catch (err) {
      console.error('Error updating staff:', err)
      error('Failed to update staff member')
      throw err
    }
  }

  // Delete staff member
  const deleteStaff = async (staffId, staffName) => {
    try {
      const user = getUser()
      if (!user?.storeId) {
        throw new Error('No store ID available')
      }

      // Make the delete request via apiService
      await apiService.updateStaff(staffId, { deleted: true })

      staffList.value = staffList.value.filter((s) => s.id !== staffId)

      // Log activity
      await logStaffDeleted(staffName)

      // Log staff activity
      await logStaffActivity('Staff Deleted', `${staffName} removed from staff`)

      success('Staff member deleted successfully')
    } catch (err) {
      console.error('Error deleting staff:', err)
      error('Failed to delete staff member')
      throw err
    }
  }

  // Log staff activity (login, logout, modifications)
  const logStaffActivity = async (type, description, staffId = null) => {
    try {
      const user = getUser()
      if (!user?.storeId) return

      const activityLog = {
        storeId: String(user.storeId),
        staffId,
        type,
        description,
      }

      const log = await apiService.createStaffActivityLog(activityLog)
      if (!log) {
        throw new Error('Failed to log activity')
      }

      staffActivityLogs.value.unshift(log)
      return log
    } catch (err) {
      console.error('Error logging staff activity:', err)
    }
  }

  // Filter staff by status
  const filterByStatus = (status) => {
    return staffList.value.filter((staff) => staff.status === status)
  }

  // Search staff by name or position
  const searchStaff = (query) => {
    const lowercaseQuery = query.toLowerCase()
    return staffList.value.filter((staff) => {
      const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase()
      const position = (staff.position || '').toLowerCase()
      return fullName.includes(lowercaseQuery) || position.includes(lowercaseQuery)
    })
  }

  // Computed properties
  const activeStaff = computed(() => filterByStatus('active'))
  const inactiveStaff = computed(() => filterByStatus('inactive'))
  const recentActivityLogs = computed(() => staffActivityLogs.value.slice(0, 5))

  // Initialize on first use
  if (staffList.value.length === 0) {
    fetchStaffData()
  }

  return {
    staffList,
    staffActivityLogs,
    recentActivityLogs,
    activeStaff,
    inactiveStaff,
    fetchStaffData,
    fetchStaffActivityLogs,
    addStaff,
    updateStaff,
    deleteStaff,
    logStaffActivity,
    filterByStatus,
    searchStaff,
  }
}
