import { useAuth } from './useAuth'
import { apiService } from '../api/apiService.js'

export const useActivityLog = () => {
  const { getUser } = useAuth()

  const logActivity = async (type, description, allowWithoutUser = false) => {
    try {
      const user = getUser()
      if (!user && !allowWithoutUser) {
        console.warn('No user found for activity logging')
        return
      }

      const result = await apiService.createActivity({
        type,
        description,
      })

      if (!result) {
        throw new Error('Failed to log activity')
      }

      return result
    } catch (err) {
      console.error('Error logging activity:', err)
      // Don't throw - activity logging should not break the main operation
    }
  }

  // Activity logging functions for different actions
  const logCategoryAdded = (categoryName) =>
    logActivity('Category Added', `Category "${categoryName}" added`)
  const logCategoryUpdated = (categoryName) =>
    logActivity('Category Updated', `Category "${categoryName}" updated`)
  const logCategoryDeleted = (categoryName) =>
    logActivity('Category Deleted', `Category "${categoryName}" deleted`)

  const logProductAdded = (productName) =>
    logActivity('Product Added', `Product "${productName}" added`)
  const logProductUpdated = (productName) =>
    logActivity('Product Updated', `Product "${productName}" updated`)
  const logProductDeleted = (productName) =>
    logActivity('Product Deleted', `Product "${productName}" deleted`)

  const logMenuAdded = (menuName) => logActivity('Menu Added', `Menu "${menuName}" added`)
  const logMenuUpdated = (menuName) => logActivity('Menu Updated', `Menu "${menuName}" updated`)
  const logMenuDeleted = (menuName) => logActivity('Menu Deleted', `Menu "${menuName}" deleted`)

  const logInventoryUpdated = (productName, quantity) =>
    logActivity('Inventory Updated', `"${productName}" quantity updated to ${quantity}`)

  const logStaffAdded = (staffName) =>
    logActivity('Staff Added', `Staff member "${staffName}" added`)
  const logStaffUpdated = (staffName) =>
    logActivity('Staff Updated', `Staff member "${staffName}" updated`)
  const logStaffDeleted = (staffName) =>
    logActivity('Staff Deleted', `Staff member "${staffName}" deleted`)

  const logKioskAdded = (kioskNumber) => logActivity('Kiosk Added', `Kiosk "${kioskNumber}" added`)
  const logKioskUpdated = (kioskNumber) =>
    logActivity('Kiosk Updated', `Kiosk "${kioskNumber}" updated`)
  const logKioskStatusChanged = (kioskNumber, status) =>
    logActivity('Kiosk Status Changed', `Kiosk "${kioskNumber}" status changed to ${status}`)
  const logKioskDeleted = (kioskNumber) =>
    logActivity('Kiosk Deleted', `Kiosk "${kioskNumber}" deleted`)

  const logColorSchemeChanged = (schemeName) =>
    logActivity('Color Scheme Changed', `Color scheme changed to "${schemeName}"`)

  const logUserLoggedIn = async (username, role, storeId) => {
    if (role === 'Super Admin') {
      return logActivity('Login', `User "${username}" logged in`, true)
    } else {
      try {
        const activityLog = {
          storeId: String(storeId),
          staffId: null,
          type: 'Login',
          description: `User "${username}" logged in`,
        }

        const result = await apiService.createStaffActivityLog(activityLog)
        if (!result) {
          throw new Error('Failed to log activity')
        }
        return result
      } catch (err) {
        console.error('Error logging login activity:', err)
      }
    }
  }

  const logUserLoggedOut = async (username, role, storeId) => {
    if (role === 'Super Admin') {
      return logActivity('Logout', `User "${username}" logged out`, true)
    } else {
      try {
        const activityLog = {
          storeId: String(storeId),
          staffId: null,
          type: 'Logout',
          description: `User "${username}" logged out`,
        }

        const result = await apiService.createStaffActivityLog(activityLog)
        if (!result) {
          throw new Error('Failed to log activity')
        }
        return result
      } catch (err) {
        console.error('Error logging logout activity:', err)
      }
    }
  }

  return {
    logActivity,
    logCategoryAdded,
    logCategoryUpdated,
    logCategoryDeleted,
    logProductAdded,
    logProductUpdated,
    logProductDeleted,
    logMenuAdded,
    logMenuUpdated,
    logMenuDeleted,
    logInventoryUpdated,
    logStaffAdded,
    logStaffUpdated,
    logStaffDeleted,
    logKioskAdded,
    logKioskUpdated,
    logKioskStatusChanged,
    logKioskDeleted,
    logColorSchemeChanged,
    logUserLoggedIn,
    logUserLoggedOut,
  }
}
