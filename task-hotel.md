# Hotel / Property Management Project Tasks

## Project Goal

Build a hotel/property management dashboard using Laravel + Inertia + Vue + Tailwind.
The app should manage properties, rooms, bookings, guests, housekeeping, and revenue/occupancy analytics.

## THURSDAY: Laravel + Inertia Setup and Data Modeling

### 1. Create New Starter Project

- [ ] Run: `laravel new hotel-admin --stack=inertia --typescript`
- [ ] Navigate into project: `cd hotel-admin`
- [ ] Install dependencies and verify Tailwind/ Vue / Inertia setup
- [ ] Run `npm run dev` and `php artisan serve`
- [ ] Confirm initial page loads correctly

### 2. Database Setup

- [ ] Configure `.env` database credentials
- [ ] Create migration: properties table
- [ ] Create migration: rooms table
- [ ] Create migration: bookings table
- [ ] Create migration: guests table
- [ ] Create migration: housekeeping_tasks table
- [ ] Create migration: staff table
- [ ] Create migration: invoices/payments table (optional)
- [ ] Run `php artisan migrate`

### 3. Models & Relationships

- [ ] Create Property model
- [ ] Create Room model with `belongsTo(Property)`
- [ ] Create Booking model with `belongsTo(Room)` and `belongsTo(Guest)`
- [ ] Create Guest model with `hasMany(Booking)`
- [ ] Create HousekeepingTask model with `belongsTo(Room)` and `belongsTo(Staff)`
- [ ] Create Staff model
- [ ] Create Invoice/Payment model if using billing
- [ ] Add model scopes for room status, booking date filters, and occupancy

### 4. Seed Local Data

- [ ] Create seeders for properties, rooms, guests, bookings, and staff
- [ ] Add sample occupancy and status data
- [ ] Run seeders: `php artisan db:seed`
- [ ] Verify records in the database

### 5. Authentication & Authorization

- [ ] Use Laravel Breeze or built-in auth for admin login
- [ ] Add role support for admin / front desk / housekeeping
- [ ] Create middleware for admin and staff access
- [ ] Protect routes with authentication

---

## FRIDAY: UI, Booking Flow, and Management Pages

### 1. Layout and Navigation

- [ ] Use starter kit’s collapsible sidebar design
- [ ] Create main Layout.vue with sidebar and header
- [ ] Create DashboardLayout.vue for admin pages
- [ ] Create components: NotificationBell, UserMenu, ThemeToggle
- [ ] Add responsive sidebar collapse behavior

### 2. Dashboard Overview

- [ ] Create Dashboard/Index.vue
- [ ] Show occupancy rate, available rooms, and today’s arrivals
- [ ] Add revenue summary widget
- [ ] Add room status summary (clean, occupied, vacant, maintenance)
- [ ] Add recent bookings/activity feed

### 3. Room Management

- [ ] Create Rooms/Index.vue
- [ ] Create Rooms/Create.vue
- [ ] Create Rooms/Edit.vue
- [ ] Create Rooms/Show.vue
- [ ] Display room list with status, type, rate, and property
- [ ] Add filtering by status and property

### 4. Booking Management

- [ ] Create Bookings/Index.vue
- [ ] Create Bookings/Create.vue
- [ ] Create Bookings/Edit.vue
- [ ] Create Bookings/Show.vue
- [ ] Add calendar or date-range search for bookings
- [ ] Show active bookings, upcoming check-ins, and check-outs

### 5. Guest Management

- [ ] Create Guests/Index.vue
- [ ] Create Guests/Create.vue
- [ ] Create Guests/Edit.vue
- [ ] Create Guests/Show.vue
- [ ] Add guest stay history and booking details

### 6. Housekeeping Workflow

- [ ] Create Housekeeping/Index.vue
- [ ] Add task list for room cleaning and inspection
- [ ] Set room status updates (needs cleaning, clean, maintenance)
- [ ] Assign tasks to staff members
- [ ] Show task status and priority

### 7. Staff Management

- [ ] Create Staff/Index.vue
- [ ] Create Staff/Create.vue
- [ ] Create Staff/Edit.vue
- [ ] Assign roles and schedules
- [ ] Display staff activity and assignments

### 8. Reporting & Analytics

- [ ] Create Reports/Occupancy.vue
- [ ] Create Reports/Revenue.vue
- [ ] Add date-range filters for reports
- [ ] Add charts for occupancy and revenue trends
- [ ] Add export/export summary section

### 9. Routes & Controllers

- [ ] Create PropertyController and routes
- [ ] Create RoomController and routes
- [ ] Create BookingController and routes
- [ ] Create GuestController and routes
- [ ] Create HousekeepingController and routes
- [ ] Create StaffController and routes
- [ ] Create DashboardController for the overview page
- [ ] Use Inertia render in `routes/web.php`

### 10. Validation & Error Handling

- [ ] Add form validation in controllers
- [ ] Display validation errors in Vue pages
- [ ] Create global toast notifications
- [ ] Handle auth and permission errors gracefully
- [ ] Test validation and error flows

---

## Optional Enhancements

- [ ] Add booking calendar view
- [ ] Add invoice/billing generation
- [ ] Add multi-property support
- [ ] Add housekeeping room map/status board
- [ ] Add SMS/email reservation notifications
- [ ] Add property manager user role
- [ ] Add booking confirmation and cancellation flow
- [ ] Add customer portal for guests to view bookings

---

## Notes

- Focus on strong data relationships first, then UI polish.
- Keep the sidebar and layout consistent across pages.
- Use Laravel policies or gates for access control.
- Keep Tailwind styling clean and responsive.
- Build the booking flow incrementally with room and guest CRUD.
