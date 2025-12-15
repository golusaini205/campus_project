# Campus Resource Booking System

A full-stack web application for students, faculty, and admins to **book campus rooms, labs, or sports facilities** and track usage trends.

---

## Features

**JWT-based signup/login**
**Book, cancel, and update reservations**
**View available resources** (rooms, labs, sports facilities)
**Search, filter, and sort resources** by name, type, date, or status
**Booking analytics** using Recharts
**Booking timeline** using Chrono
**Facility image carousel** with Slick
**Popup alerts** for booking confirmations
**Icons** with React Icons
**Global state management** via React Context
**Admin panel** to create, edit, activate/deactivate resources

---

## Tech Stack

**Frontend**
- React + Vite
- React Router
- Recharts, Chrono, Slick Carousel, React Icons
- Context API for global state

-- Frontend Setup
- cd ../frontend
- npm install
- npm run dev
//Frontend runs at http://localhost:5173

**Backend**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT authentication
- Zod validation

-- Backend Setup

**Database Setup (Choose one option):**

**Option 1: Using Docker (Recommended)**
- Install Docker Desktop if not already installed
- From project root, run: `docker-compose up -d`
- This will start PostgreSQL on port 5432

**Option 2: Local PostgreSQL Installation**
- Install PostgreSQL from https://www.postgresql.org/download/windows/
- Create a database named `campus_booking`
- Update `backend/.env` with your PostgreSQL credentials if different

**After database is running:**
- cd backend
- npm install
- npx prisma generate
- npx prisma migrate dev --name init
- npm run prisma:seed
- npm run dev   //start backend


** Default Admin Account **
After seeding login with 
- Email: admin@gmail.com
- Password: admin@123


** API Endpoints **

Auth
- POST /api/auth/signup
- POST /api/auth/login

Resources

- GET /api/resources
- GET /api/resources/:id
- POST /api/resources/book
- PUT /api/resources/:id/cancel
- PUT /api/resources/:id/update
- GET /api/resources/search?query=...
- GET /api/resources/filter?type=...&status=...
- DELETE /api/resources/:id (admin)
- POST /api/resources (admin create)
- PUT /api/resources/:id (admin update)


Analytics
- GET /api/analytics/usage
- GET /api/analytics/top-rooms

Users
- GET /api/users/:id/bookings

**Deployment**
- Docker / Supabase / Neon (Postgres)
- Render / Fly.io (backend hosting)

---

##  Project Structure

