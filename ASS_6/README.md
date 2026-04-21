# 🚗 AutoDealr — Online Used Vehicle Marketplace & Appointment Booking

A full-stack **MERN application** (MongoDB, Express, React, Node.js) that combines:
- **E-Commerce Portal** — Browse, list, buy and sell used Vehicles (cars, bikes, scooters, trucks)
- **Appointment Booking** — Schedule test drives / inspections with sellers

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Frontend** | Vite + React (SPA) |
| **Auth** | JWT + bcryptjs |
| **File Uploads** | Multer |
| **Styling** | Vanilla CSS (dark glassmorphism theme) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongod`) or MongoDB Atlas URI

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/autodealr
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 3. Run

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev       # starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev       # starts on http://localhost:5173
```

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (auth) |

### Listings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | Browse with filters/pagination |
| GET | `/api/listings/featured` | Featured listings |
| GET | `/api/listings/my` | My listings (auth) |
| GET | `/api/listings/:id` | Single listing |
| POST | `/api/listings` | Create listing (auth) |
| PUT | `/api/listings/:id` | Update listing (auth, owner) |
| DELETE | `/api/listings/:id` | Delete listing (auth, owner) |

### Appointments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/appointments` | Book test drive (auth) |
| GET | `/api/appointments/my` | My bookings as buyer (auth) |
| GET | `/api/appointments/seller` | Incoming requests as seller (auth) |
| PUT | `/api/appointments/:id` | Confirm / Cancel (auth) |

---

## 🗂️ MongoDB Schemas

### User
```
name, email, password (hashed), phone, role, location
```

### Listing
```
title, category, make, model, year, price, mileage, condition,
transmission, fuelType, color, description, images[], location,
seller (ref), status, views, featured
```

### Appointment
```
listing (ref), buyer (ref), seller (ref), date, timeSlot,
message, status (pending/confirmed/cancelled/completed), sellerNote
```

---

## 🖥️ Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page, search, features |
| `/listings` | Browse | Filter & paginate listings |
| `/listings/:id` | Detail | Vehicle info + book appointment |
| `/create-listing` | Sell | Create a new listing |
| `/dashboard` | Dashboard | Manage listings & appointments |
| `/login` | Login | JWT authentication |
| `/register` | Register | New account signup |

---

## 👩‍💻 Academic Project Info

**Subject:** Full Stack Development Assignment  
**Technologies:** Node.js, Express.js, MongoDB, React, Vite
