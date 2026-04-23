# Kiosk Admin Project - Alternative Tasks (Inertia + Laravel + Vue Stack)

## THURSDAY: Set Up Laravel Inertia Stack and Database

### 1. Create New Laravel + Inertia Project

- [ ] Run: `laravel new kiosk-admin --stack=inertia --typescript`
- [ ] Navigate into project: `cd kiosk-admin`
- [ ] Verify Inertia, Vue 3, and Tailwind are installed
- [ ] Test dev server: `npm run dev` and `php artisan serve`
- [ ] Confirm page loads at http://localhost:8000

### 2. Database Setup

- [ ] Configure `.env` with database credentials (MySQL/SQLite)
- [ ] Create migration: Admins table with roles and permissions
- [ ] Create migration: Stores table
- [ ] Create migration: Kiosks table with store_id foreign key
- [ ] Create migration: Staff table with store_id foreign key
- [ ] Create migration: Activity Logs table
- [ ] Create migration: Products table with category_id
- [ ] Create migration: Categories table
- [ ] Create migration: Menus table
- [ ] Create migration: Users table (already exists, extend as needed)
- [ ] Run migrations: `php artisan migrate`

### 3. Create Eloquent Models

- [ ] Create Admin model with relationships
- [ ] Create Store model with hasMany relationships
- [ ] Create Kiosk model with belongsTo Store
- [ ] Create Staff model with belongsTo Store
- [ ] Create ActivityLog model
- [ ] Create Product model with belongsTo Category
- [ ] Create Category model with hasMany Products
- [ ] Create Menu model
- [ ] Add model scopes and mutators as needed

### 4. Import Local Data

- [ ] Write seeder: Import admins from db.json
- [ ] Write seeder: Import stores from db.json
- [ ] Write seeder: Import kiosks from db.json
- [ ] Write seeder: Import staff from db.json
- [ ] Write seeder: Import activity logs from db.json
- [ ] Run seeders: `php artisan db:seed`
- [ ] Verify data in database

### 5. Authentication Setup

- [ ] Create AuthController for login/logout
- [ ] Implement admin/client role-based authentication
- [ ] Use Inertia to handle session and redirects
- [ ] Set up middleware for role checking
- [ ] Create LoginPage.vue component
- [ ] Test login flow

### 6. Middleware & Authorization

- [ ] Create AdminMiddleware (check admin role)
- [ ] Create ClientMiddleware (check client role)
- [ ] Create StaffMiddleware (check staff role)
- [ ] Apply middleware to routes

---

## FRIDAY: Build Vue Components and Admin Panel

### 1. Project Structure & Layout

- [ ] Use starter kit's built-in collapsible sidebar component
- [ ] Customize sidebar navigation links for admin routes
- [ ] Customize sidebar navigation links for client routes
- [ ] Create AdminLayout.vue extending sidebar for admin pages
- [ ] Create ClientLayout.vue extending sidebar for client pages
- [ ] Set up page transitions with Inertia
- [ ] Create NotificationBell component
- [ ] Create UserMenu component
- [ ] Create DarkMode/ThemeToggle component
- [ ] Test sidebar collapse/expand on mobile and desktop

### 2. Admin Dashboard Pages

- [ ] Create Dashboard/Index.vue (main admin dashboard)
- [ ] Add StatCards for key metrics (stores, kiosks, staff, orders)
- [ ] Add charts/graphs for activity (optional: use Chart.js or similar)
- [ ] Create SystemHealth.vue page
- [ ] Create RecentActivity.vue widget
- [ ] Create PriorityAlerts.vue component

### 3. Admin Management Pages

- [ ] Create Admins/Index.vue (list all admins)
- [ ] Create Admins/Edit.vue (edit admin)
- [ ] Create Admins/Create.vue (create new admin)
- [ ] Create Stores/Index.vue (list all stores)
- [ ] Create Stores/Show.vue (store details)
- [ ] Create Stores/Edit.vue (edit store)
- [ ] Create Stores/Create.vue (create new store)
- [ ] Create Kiosks/Index.vue (list kiosks)
- [ ] Create Kiosks/Edit.vue (edit kiosk)
- [ ] Create Kiosks/Create.vue (create new kiosk)
- [ ] Create Staff/Index.vue (list staff)
- [ ] Create Staff/Edit.vue (edit staff)
- [ ] Create Staff/Create.vue (create new staff)

### 4. Create Admin Routes & Controllers

- [ ] Create AdminController@index, store, update, destroy
- [ ] Create StoreController@index, show, store, update, destroy
- [ ] Create KioskController@index, store, update, destroy
- [ ] Create StaffController@index, store, update, destroy
- [ ] Create ActivityLogController@index
- [ ] Set up routes in `routes/web.php` with Inertia render
- [ ] Add route model binding where applicable

### 5. Client Panel Pages

- [ ] Create ClientLayout.vue with client-specific navigation
- [ ] Create ClientDashboard.vue (client home)
- [ ] Create Products/Index.vue (list client's products)
- [ ] Create Products/Create.vue & Edit.vue
- [ ] Create Categories/Index.vue
- [ ] Create Categories/Create.vue & Edit.vue
- [ ] Create Menus/Index.vue
- [ ] Create Menus/Create.vue & Edit.vue
- [ ] Create Inventory/Index.vue
- [ ] Create ClientSettings.vue

### 6. Create Client Routes & Controllers

- [ ] Create ProductController (client scoped)
- [ ] Create CategoryController (client scoped)
- [ ] Create MenuController (client scoped)
- [ ] Create ClientDashboardController
- [ ] Set up routes with authentication and role checks
- [ ] Ensure clients only see their store data

### 7. Form Validation & Error Handling

- [ ] Add form validation rules in controllers
- [ ] Display validation errors in Vue components
- [ ] Create global toast/notification system
- [ ] Handle errors gracefully with try-catch in controllers
- [ ] Test error scenarios (validation, authorization, etc.)

### 8. Testing & Refinement

- [ ] Test admin login and dashboard access
- [ ] Test admin CRUD operations for all entities
- [ ] Test client login and dashboard access
- [ ] Test client can only see their data
- [ ] Test role-based access control
- [ ] Test dark/light mode toggle
- [ ] Test notifications and activity logs
- [ ] Check console for errors
- [ ] Verify data persists in database

### 9. UI Polish & Tailwind Styling

- [ ] Ensure all components use Tailwind classes
- [ ] Make responsive design mobile-friendly
- [ ] Add hover/focus states to buttons and inputs
- [ ] Implement smooth transitions between pages
- [ ] Style tables, modals, and forms consistently
- [ ] Test on different screen sizes

---

## Optional (If Time Permits)

- [ ] Add search and filtering to data tables
- [ ] Implement pagination for large datasets
- [ ] Add export to CSV/PDF functionality
- [ ] Create advanced dashboard charts
- [ ] Add email notifications
- [ ] Implement activity audit trail with timestamps
- [ ] Add user profile/settings page
- [ ] Set up Laravel scheduling for background tasks
- [ ] Add request logging and monitoring
- [ ] Deploy to production

---

## Notes

- Use Inertia to pass data from Laravel to Vue components
- Keep database queries optimized with eager loading (with())
- Use Laravel's authorization (Gates/Policies) for access control
- Leverage Tailwind for consistent styling across all pages
- Test authentication on every route change
- Keep git commits clean and descriptive
