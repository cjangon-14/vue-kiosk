// API Service - works with mock data for Vercel deployment
// Simulates JSON Server API responses without needing a backend server

import { mockData } from './mockData.js';

// Helper to simulate network delay for realism
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Store mutations for simulating stateful API
let db = JSON.parse(JSON.stringify(mockData));

/**
 * Generic API fetch wrapper
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise}
 */
async function apiCall(endpoint, options = {}) {
  try {
    // Add small delay to simulate network
    await delay(50);

    // Try to use /api endpoints first (Vercel serverless functions)
    // Fall back to mock data if not available (local development)
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      // Fall back to mock data
      console.warn(`API endpoint ${endpoint} not available, using mock data`);
      return getMockData(endpoint, options);
    }
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Get mock data by endpoint
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options
 */
function getMockData(endpoint, options = {}) {
  const path = endpoint.replace(/^\/api\//, '').split('?')[0];

  // GET requests
  if (!options.body) {
    if (path === 'stores') return db.stores;
    if (path === 'admins') return db.admins;
    if (path === 'superadmin') return db.superadmin;
    if (path === 'kiosks') return db.kiosks;
    if (path === 'recentActivities') return db.recentActivities;
    if (path === 'staff') return db.staff;
    if (path === 'staffActivityLogs') return db.staffActivityLogs;
    if (path === 'categories') return db.categories;
    if (path === 'products') return db.products;
    if (path === 'menus') return db.menus;
    if (path === 'inventory') return db.inventory;
  }

  // POST requests (create)
  const body = options.body ? JSON.parse(options.body) : {};
  if (options.method === 'POST') {
    if (path === 'stores') {
      const id = Date.now().toString();
      const newStore = { id, ...body, status: 'active', lastActivity: new Date().toISOString() };
      db.stores.push(newStore);
      return newStore;
    }
    if (path === 'recentActivities') {
      const id = generateId();
      const newActivity = { id, timestamp: new Date().toISOString(), ...body };
      db.recentActivities.push(newActivity);
      return newActivity;
    }
    if (path === 'staff') {
      const id = generateId();
      const newStaff = { id, createdAt: new Date().toISOString(), ...body };
      db.staff.push(newStaff);
      return newStaff;
    }
  }

  // PUT requests (update)
  if (options.method === 'PUT') {
    const segments = path.split('/');
    const resource = segments[0];
    const id = segments[1];

    if (resource === 'stores') {
      const index = db.stores.findIndex(s => s.id === id);
      if (index !== -1) {
        db.stores[index] = { ...db.stores[index], ...body };
        return db.stores[index];
      }
    }
  }

  // PATCH requests (partial update)
  if (options.method === 'PATCH') {
    const segments = path.split('/');
    const resource = segments[0];
    const id = segments[1];

    if (resource === 'stores') {
      const index = db.stores.findIndex(s => s.id === id);
      if (index !== -1) {
        db.stores[index] = { ...db.stores[index], ...body };
        return db.stores[index];
      }
    }
  }

  // DELETE requests
  if (options.method === 'DELETE') {
    const segments = path.split('/');
    const resource = segments[0];
    const id = segments[1];

    if (resource === 'stores') {
      const index = db.stores.findIndex(s => s.id === id);
      if (index !== -1) {
        db.stores.splice(index, 1);
        return { success: true };
      }
    }
  }

  return null;
}

/**
 * Generate random ID similar to JSON Server
 */
function generateId() {
  return Math.random().toString(36).substr(2, 12);
}

// API Service public interface
export const apiService = {
  // Stores
  getStores: () => apiCall('/api/stores'),
  createStore: (data) => apiCall('/api/stores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateStore: (id, data) => apiCall(`/api/stores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteStore: (id) => apiCall(`/api/stores/${id}`, {
    method: 'DELETE'
  }),

  // Admins
  getAdmins: () => apiCall('/api/admins'),
  createAdmin: (data) => apiCall('/api/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateAdmin: (storeId, adminId, data) => apiCall(`/api/admins/${storeId}/${adminId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Superadmin
  getSuperadmin: () => apiCall('/api/superadmin'),

  // Kiosks
  getKiosks: () => apiCall('/api/kiosks'),
  createKiosk: (data) => apiCall('/api/kiosks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Activities
  getRecentActivities: () => apiCall('/api/recentActivities'),
  createActivity: (data) => apiCall('/api/recentActivities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Staff
  getStaff: () => apiCall('/api/staff'),
  createStaff: (data) => apiCall('/api/staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateStaff: (id, data) => apiCall(`/api/staff/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Staff Activity Logs
  getStaffActivityLogs: () => apiCall('/api/staffActivityLogs'),
  createStaffActivityLog: (data) => apiCall('/api/staffActivityLogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Categories
  getCategories: () => apiCall('/api/categories'),
  createCategory: (data) => apiCall('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Products
  getProducts: () => apiCall('/api/products'),
  createProduct: (data) => apiCall('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Menus
  getMenus: () => apiCall('/api/menus'),
  createMenu: (data) => apiCall('/api/menus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Inventory
  getInventory: () => apiCall('/api/inventory'),
  updateInventory: (id, data) => apiCall(`/api/inventory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
};
