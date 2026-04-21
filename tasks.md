# Kiosk Admin Project - Remaining Tasks

## THURSDAY: Laravel Backend Setup & Database Migration

### 1. Laravel Project Initialization

- [ ] Install XAMPP (if not already installed)
- [ ] Install Composer (if not already installed)
- [ ] Create new Laravel project: `composer create-project laravel/laravel kiosk-admin-api`
- [ ] Set up .env file with database credentials
- [ ] Configure database (MySQL/SQLite) in XAMPP
- [ ] Test Laravel setup with `php artisan serve`

### 2. Database Design & Migrations

- [ ] Create migration: Admins table
- [ ] Create migration: Stores table
- [ ] Create migration: Kiosks table
- [ ] Create migration: Staff table
- [ ] Create migration: Activity Logs table
- [ ] Create migration: Users table (for authentication)
- [ ] Create migration: Products table
- [ ] Create migration: Categories table
- [ ] Create migration: Menus table
- [ ] Run migrations: `php artisan migrate`

### 3. Data Migration from db.json

- [ ] Write seeders to import admins from db.json
- [ ] Write seeders to import stores from db.json
- [ ] Write seeders to import kiosks from db.json
- [ ] Write seeders to import staff from db.json
- [ ] Write seeders to import activity logs from db.json
- [ ] Run seeders: `php artisan db:seed`
- [ ] Verify all data migrated successfully

### 4. API Routes & Controllers Setup

- [ ] Create AuthController for login/logout
- [ ] Create AdminController with CRUD routes
- [ ] Create StoreController with CRUD routes
- [ ] Create KioskController with CRUD routes
- [ ] Create StaffController with CRUD routes
- [ ] Create ActivityLogController
- [ ] Create ProductController with CRUD routes
- [ ] Create CategoryController with CRUD routes
- [ ] Create MenuController with CRUD routes
- [ ] Set up API routes in `routes/api.php`

### 5. Authentication & Security Setup

- [ ] Install Laravel Sanctum for API authentication
- [ ] Configure Sanctum in `config/sanctum.php`
- [ ] Implement JWT token generation
- [ ] Set up password hashing with bcrypt
- [ ] Create login endpoint
- [ ] Create logout endpoint
- [ ] Create token refresh endpoint

### 6. CORS Configuration

- [ ] Install CORS package (laravel-cors or configure manually)
- [ ] Allow requests from http://localhost:5173 (Vue dev server)
- [ ] Set appropriate headers for credentials

---

## FRIDAY: Frontend Integration & Testing

### 1. Update Vue API Endpoints

- [ ] Update `useFetchData.js` to use Laravel API
- [ ] Update `useAuth.js` to use Laravel authentication
- [ ] Update `useActivityLog.js` to use Laravel endpoints
- [ ] Update `useStaffData.js` to use Laravel endpoints
- [ ] Update `useStoreData.js` to use Laravel endpoints
- [ ] Remove all mock API calls and db.json references
- [ ] Test all API calls in console

### 2. Authentication Implementation

- [ ] Update LoginView.vue to use Laravel JWT
- [ ] Implement token storage (localStorage or cookies)
- [ ] Add token to all API request headers
- [ ] Implement logout functionality
- [ ] Add token refresh mechanism
- [ ] Handle authentication errors gracefully
- [ ] Remove demo credentials from codebase

### 3. Admin Panel Testing

- [ ] Test admin login flow
- [ ] Test admin CRUD operations (create, read, update, delete)
- [ ] Test store management
- [ ] Test kiosk management
- [ ] Test staff management
- [ ] Test activity log display
- [ ] Verify all data persists in database

### 4. Client Panel Testing

- [ ] Test client login flow
- [ ] Test product management
- [ ] Test category management
- [ ] Test menu management
- [ ] Test inventory management
- [ ] Verify client can only see their own store data
- [ ] Verify role-based access control

### 5. Validation & Error Handling

- [ ] Add server-side input validation
- [ ] Add error response handling in Vue
- [ ] Display validation errors to users
- [ ] Create global error handler
- [ ] Test error scenarios (wrong password, invalid data, etc.)
- [ ] Implement proper HTTP status codes in Laravel

### 6. Security Hardening

- [ ] Create `.env` file for sensitive variables
- [ ] Remove hard-coded API URLs
- [ ] Implement CSRF protection
- [ ] Set up secure password policy (min 8 chars, complexity)
- [ ] Add rate limiting to login endpoint
- [ ] Implement SQL injection prevention
- [ ] Test security vulnerabilities

### 7. Final Testing & Documentation

- [ ] Test complete user workflows (admin & client)
- [ ] Test on different browsers
- [ ] Check console for errors/warnings
- [ ] Test dark/light mode toggle
- [ ] Test notifications functionality
- [ ] Document API endpoints
- [ ] Create setup instructions for deployment

---

## Optional (If Time Permits)

- [ ] Add refresh token mechanism for better security
- [ ] Implement role-based access control (RBAC) middleware
- [ ] Add API rate limiting
- [ ] Set up centralized logging system
- [ ] Add email notifications
- [ ] Implement search/filter optimization
- [ ] Add caching layer (Redis)
- [ ] Set up automated backups

---

## Notes

- Keep Vue dev server running on port 5173
- Run Laravel API on port 8000 (default)
- Ensure MySQL/Database is running before migrations
- Test thoroughly after each step
- Keep git commits clean and descriptive
