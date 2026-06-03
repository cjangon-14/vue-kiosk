# API Migration Guide: JSON Server → Mock Data + Vercel Serverless

## Overview

This project has been migrated from using `json-server` (a local development-only tool) to a Vercel-compatible mock data system that works both locally and in production.

## What Changed

### 1. **Removed json-server Dependency**
- ✅ Removed `json-server` npm package
- ✅ Removed `"server"` script from package.json
- ✅ No need to run separate backend server

### 2. **Created Mock Data Module** (`src/api/mockData.js`)
- All data from `db.json` is now in a JavaScript module
- Works in browser memory (no file system dependency)
- Can be deployed to serverless environments

### 3. **Created API Service Layer** (`src/api/apiService.js`)
- Unified API interface for all data operations
- Falls back to mock data when serverless functions aren't available
- Uses `/api/*` endpoints (compatible with Vercel Functions)
- Simulates network delays for realistic testing

### 4. **Updated Composables**
All composables now use `apiService` instead of direct fetch calls:
- `useFetchData.js`
- `useActivityLog.js`
- `useStoreData.js`
- `useStaffData.js`

### 5. **Created Vercel Serverless Functions** (`/api/*.js`)
These endpoints serve mock data in production:
- `/api/stores`
- `/api/admins`
- `/api/kiosks`
- `/api/recentActivities`
- `/api/staff`
- `/api/staffActivityLogs`
- `/api/categories`
- `/api/products`
- `/api/menus`
- `/api/inventory`

## How It Works

### Local Development
```bash
npm install
npm run dev
```

1. App runs with Vite dev server
2. API calls hit `/api/` endpoints
3. Falls back to `apiService` which uses `mockData` from memory
4. Everything works instantly - no separate server process needed!

### Vercel Deployment
```bash
vercel deploy
```

1. App is built and deployed to Vercel
2. `/api/` routes are deployed as serverless functions
3. API calls to `/api/stores`, `/api/admins`, etc. hit these functions
4. Functions return mock data from `mockData.js`
5. Zero-cost hosting for the API layer

## Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Local Development** | Required separate json-server process | Just `npm run dev` |
| **Dependencies** | json-server package | None (mock data is internal) |
| **Production Ready** | ❌ Not deployable | ✅ Deploy to Vercel |
| **Cold Starts** | N/A | ~50-200ms (serverless) |
| **Scaling** | Single machine | Automatic (serverless) |
| **Cost** | N/A | Free tier available |

## API Service Usage

The app uses a unified API service. Example:

```javascript
import { apiService } from '@/api/apiService.js'

// Fetch stores
const stores = await apiService.getStores()

// Create activity
await apiService.createActivity({
  type: 'Login',
  description: 'User logged in'
})

// Update store
await apiService.updateStore(storeId, { name: 'New Name' })
```

## Switching to a Real Backend

When you're ready to connect a real API (Laravel, Node.js, etc.), simply update the `apiCall()` function in `src/api/apiService.js` to point to your backend server:

```javascript
async function apiCall(endpoint, options = {}) {
  const apiBase = process.env.VITE_API_URL || 'http://localhost:3000'
  const response = await fetch(`${apiBase}${endpoint}`, options)
  return await response.json()
}
```

Then set `VITE_API_URL` in your environment variables.

## Data Persistence

⚠️ **Note:** Data is stored in memory. Page refreshes will reset to initial mock data.

For persistent data during development, you can:
1. Add browser IndexedDB storage
2. Use localStorage for small datasets
3. Connect to a real backend (recommended for production)

## Migration Checklist

- [x] Remove json-server package
- [x] Create mockData.js module
- [x] Create apiService.js layer
- [x] Update all composables
- [x] Create Vercel functions
- [x] Add vercel.json config
- [x] Test locally
- [x] Deploy to Vercel

## Next Steps

1. **Test Locally**
   ```bash
   npm install  # Update to remove json-server
   npm run dev
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Monitor Performance**
   - Check Vercel dashboard for serverless function logs
   - Monitor cold start times and memory usage

4. **Future: Real Backend**
   - Implement actual API endpoints
   - Update `apiService.js` to call your backend
   - Add authentication tokens if needed
