# Authentication & Database Setup Guide

This guide covers the setup of authentication, Redux state management, and Prisma database migrations for AssetTrackPro.

## Table of Contents
1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Database Initialization](#database-initialization)
4. [Testing Authentication](#testing-authentication)

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

**Note**: The following packages are already in `package.json`:
- `jsonwebtoken` - JWT token generation and verification
- `bcryptjs` - Password hashing
- `@prisma/client` - Prisma database client

### 2. Configure Environment Variables

The `.env` file has been created with:
- `DATABASE_URL` - PostgreSQL connection string (Prisma format)
- `JWT_SECRET` - Secret key for JWT signing (change in production!)
- `JWT_EXPIRE` - Token expiration time (default 24h)
- `CORS_ORIGIN` - Frontend URL for CORS

**Important**: In production, change `JWT_SECRET` to a strong random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Setup Prisma

```bash
# Generate Prisma Client from schema
npx prisma generate

# Create migration for initial schema
npx prisma migrate dev --name initial_schema

# Open Prisma Studio (optional - visual database browser)
npx prisma studio
```

### 4. Start Backend Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Backend will start on `http://localhost:5000`

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install

# Add Redux Toolkit if not already installed
npm install @reduxjs/toolkit react-redux

# Add Axios (for HTTP requests)
npm install axios

# Add React Router (for navigation)
npm install react-router-dom
```

### 2. Configure Environment Variables

Frontend `.env.example` contains:
```
VITE_API_URL=http://localhost:5000/api
```

Create `.env` or use the example as-is for development.

### 3. Update main.tsx/main.jsx

Wrap your App with Redux Provider:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```

### 4. Update App.tsx (Router Setup)

Example router configuration:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

### 5. Start Frontend Server

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

---

## Database Initialization

### 1. Create PostgreSQL Database

```bash
# Using psql
createdb assettrackpro_dev

# Or using GUI tools like pgAdmin
```

### 2. Run Prisma Migrations

```bash
cd backend
npx prisma migrate dev --name initial_schema
```

This will:
- Create all 10 tables (Organization, Branch, Building, Zone, Gate, Employee, Asset, AssetAssignment, MovementEvent, Alert, User)
- Create indexes and constraints
- Generate Prisma Client

### 3. Verify Database

```bash
# Open Prisma Studio
npx prisma studio

# Or connect with SQL client and verify tables:
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

---

## Backend API Endpoints

All endpoints are prefixed with `/api`

### Public Routes (No Auth Required)

```bash
# Register
POST /auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "organization_id": "org_xxxxx"
}

# Login
POST /auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}

# Refresh Token
POST /auth/refresh
Headers: {
  "Authorization": "Bearer <token>"
}

# Logout
POST /auth/logout
```

### Protected Routes (Auth Required)

```bash
# Get Current User Profile
GET /auth/me
Headers: {
  "Authorization": "Bearer <token>"
}

# Change Password
POST /auth/change-password
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## Testing Authentication

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "organization_id": "org_test"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Current User (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Frontend

1. Navigate to `http://localhost:5173/register`
2. Create account with:
   - Email: test@example.com
   - Password: password123
   - Full Name: Test User
   - Organization ID: org_test

3. You'll be redirected to dashboard with JWT token in localStorage

### Using Postman

1. Create collection: `AssetTrackPro`
2. Create requests:
   - `POST` `/api/auth/login` - Login endpoint
   - `GET` `/api/auth/me` - Protected endpoint

3. In Postman, go to `Tests` tab and add:
   ```javascript
   if (pm.response.code === 200) {
     pm.environment.set("token", pm.response.json().token);
   }
   ```

4. For protected routes, in `Authorization` tab:
   - Type: Bearer Token
   - Token: `{{token}}`

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
Solution: Ensure PostgreSQL is running
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Start PostgreSQL service from Services
```

### JWT Secret Not Set
```
Error: JWT_SECRET is not defined
```
Solution: Set JWT_SECRET in `.env` file

### Prisma Migration Error
```
Error: The current database has migrations under the 'prisma' folder
```
Solution:
```bash
npx prisma migrate resolve --rolled-back initial_schema
npx prisma migrate dev --name initial_schema
```

### Token Invalid/Expired
- Token is verified using `JWT_SECRET`
- Default expiration: 24 hours
- Use `/api/auth/refresh` endpoint to get new token

---

## Security Checklist

Before production deployment:

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS for all communication
- [ ] Set `CORS_ORIGIN` to frontend domain only
- [ ] Enable database SSL connections
- [ ] Setup rate limiting on auth endpoints
- [ ] Configure password policy (min 8 chars, special chars, etc.)
- [ ] Enable user account lockout after failed login attempts
- [ ] Setup email verification for new accounts
- [ ] Enable refresh token rotation
- [ ] Configure secure cookie flags if using httpOnly cookies

---

## Next Steps

1. Implement asset management endpoints (`/api/assets`)
2. Implement RFID webhook endpoint (`/api/rfid-webhook/movement-event`)
3. Implement alert management endpoints (`/api/alerts`)
4. Create more Redux slices for assets, alerts, zones
5. Build frontend components for dashboard, assets list, alerts
6. Implement real-time updates with WebSocket (Phase 2)

---

**Last Updated**: March 15, 2026
**Version**: 2.0.0 - RFID Production-Ready
