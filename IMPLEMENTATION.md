# Backend & Frontend Implementation Files

This document lists all authentication-related files created and their purposes.

## Backend Files Created

### 1. **prisma/schema.prisma**
**Purpose**: Database schema definition using Prisma ORM
**Tables**: 
- organization, branch, building, zone, gate
- employee, asset, asset_assignment
- movement_event (append-only log ⭐)
- alert
- user (for auth)

**Key Features**:
- 10-table normalized schema
- Foreign key relationships
- Automatic timestamps (created_at, updated_at)
- Strategic indexes for performance
- Multi-tenant support (organization_id)

**Usage**:
```bash
npx prisma migrate dev --name "migration_name"
npx prisma studio
```

---

### 2. **src/utils/jwtUtils.js**
**Purpose**: JWT token utility functions
**Exports**:
- `generateToken(payload)` - Create new JWT token
- `verifyToken(token)` - Verify token validity
- `extractToken(authHeader)` - Extract token from "Bearer <token>"
- `decodeToken(token)` - Decode without verification

**Usage**:
```javascript
import { generateToken, verifyToken } from '../utils/jwtUtils.js';

const token = generateToken({ user_id: '123', email: 'user@example.com' });
const decoded = verifyToken(token);
```

---

### 3. **src/services/authService.js**
**Purpose**: Business logic for authentication
**Functions**:
- `registerUser(userData)` - Create new user with hashed password
- `loginUser(email, password)` - Authenticate and return token
- `verifyUserToken(token)` - Validate token
- `getUserById(userId)` - Fetch user profile
- `updatePassword(userId, currentPassword, newPassword)` - Change password
- `refreshToken(token)` - Generate new token from existing

**Usage**:
```javascript
import * as authService from '../services/authService.js';

const result = await authService.loginUser('user@example.com', 'password');
```

---

### 4. **src/controllers/authController.js**
**Purpose**: Request handlers for auth endpoints
**Functions**:
- `register(req, res)` - Handle registration
- `login(req, res)` - Handle login
- `getCurrentUser(req, res)` - Fetch authenticated user
- `logout(req, res)` - Clear session
- `refreshAccessToken(req, res)` - Refresh JWT
- `changePassword(req, res)` - Update password

**Usage**: Called by routes/authRoutes.js

---

### 5. **src/routes/authRoutes.js**
**Purpose**: Define authentication endpoints
**Routes**:
```
POST   /register          - Public: Register new user
POST   /login             - Public: Login user
POST   /refresh           - Public: Refresh token
POST   /logout            - Public: Logout
GET    /me                - Protected: Get current user
POST   /change-password   - Protected: Update password
```

**Usage**:
```javascript
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);
```

---

### 6. **src/middleware/auth.js** (Updated)
**Purpose**: Middleware for authentication and authorization
**Functions**:
- `authenticate(req, res, next)` - Verify JWT token
- `authorize(...roles)` - Check user roles
- `tenantScope(req, res, next)` - Enforce multi-tenancy

**Usage**:
```javascript
import { authenticate, authorize } from '../middleware/auth.js';

router.get('/admin-only', authenticate, authorize('ADMIN'), controller);
```

---

### 7. **.env** (Updated)
**Purpose**: Environment variables
**Key Variables**:
- `DATABASE_URL` - Prisma connection string
- `JWT_SECRET` - Token signing secret
- `JWT_EXPIRE` - Token lifetime (24h)
- `CORS_ORIGIN` - Frontend URL

---

## Frontend Files Created

### 1. **src/store/index.ts**
**Purpose**: Redux store configuration
**Features**:
- Configures all reducers
- Provides TypeScript types
- Exports RootState and AppDispatch

**Usage**:
```tsx
import { Provider } from 'react-redux';
import store from './store';

<Provider store={store}>
  <App />
</Provider>
```

---

### 2. **src/store/slices/authSlice.ts**
**Purpose**: Redux slice for auth state management
**State**:
```typescript
{
  token: string | null,
  user: AuthUser | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```

**Thunks** (Async Actions):
- `loginUser({ email, password })` - Login and set token
- `registerUser(userData)` - Register new account
- `getCurrentUser()` - Fetch current user
- `refreshAccessToken()` - Get new token

**Sync Actions**:
- `logout()` - Clear auth state
- `clearError()` - Clear error message
- `setToken(token)` - Manually set token

**Usage**:
```tsx
import { useAppDispatch, useAppSelector } from '../hooks';
import { loginUser } from '../store/slices/authSlice';

const dispatch = useAppDispatch();
await dispatch(loginUser({ email, password }));
```

---

### 3. **src/services/authService.ts**
**Purpose**: HTTP client for auth API calls
**Features**:
- Axios instance with automatic JWT injection
- Automatic token refresh on 401
- JWT interceptor for all requests
- localStorage integration

**Functions**:
- `login(email, password)` - POST /auth/login
- `register(userData)` - POST /auth/register
- `getCurrentUser()` - GET /auth/me
- `refreshToken()` - POST /auth/refresh
- `logout()` - POST /auth/logout
- `changePassword(currentPassword, newPassword)` - POST /auth/change-password

**Usage**:
```tsx
import { authService } from '../services/authService';

const result = await authService.login('user@example.com', 'password');
```

---

### 4. **src/hooks/useAuth.ts**
**Purpose**: Custom React hook for auth state and actions
**Returns**:
```typescript
{
  token: string | null,
  user: AuthUser | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean,
  login: (email, password) => Promise,
  register: (userData) => Promise,
  logout: () => void,
  clearError: () => void,
  getCurrentUser: () => Promise
}
```

**Usage**:
```tsx
const { user, login, loading, error } = useAuth();

<button onClick={() => login(email, password)}>
  {loading ? 'Logging in...' : 'Login'}
</button>
```

---

### 5. **src/components/ProtectedRoute.tsx**
**Purpose**: Route guard component for authenticated pages
**Features**:
- Redirects to /login if not authenticated
- Optional role-based access control
- Shows loading while checking auth

**Usage**:
```tsx
<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
  <AdminDashboard />
</ProtectedRoute>
```

---

### 6. **src/pages/LoginPage.tsx**
**Purpose**: Example login component
**Features**:
- Email/password form
- Error display
- Loading state
- Link to register page
- Redirect to dashboard on success

**Usage**: Route as `<Route path="/login" element={<LoginPage />} />`

---

### 7. **src/pages/RegisterPage.tsx**
**Purpose**: Example registration component
**Features**:
- Email, password, full name, organization ID fields
- Password confirmation validation
- Error display
- Loading state
- Link to login page
- Automatic login on successful registration

**Usage**: Route as `<Route path="/register" element={<RegisterPage />} />`

---

### 8. **.env.example** (Updated)
**Purpose**: Frontend environment template
**Variables**:
- `VITE_API_URL` - Backend API base URL

---

## Integration Steps

### Step 1: Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev --name initial_schema
npm run dev
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install @reduxjs/toolkit react-redux axios react-router-dom
npm run dev
```

### Step 3: Update App.tsx
```tsx
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import store from './store';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}
```

### Step 4: Test Flow
1. Visit `http://localhost:5173/register`
2. Create account
3. Redirected to `/dashboard` with token in localStorage
4. Close browser, revisit - Redux state persists (localStorage)
5. Try to access `/dashboard` without login - redirected to `/login`

---

## Architecture Overview

```
Frontend             Redux Store              Backend              Database
┌─────────┐        ┌──────────┐            ┌─────────┐           ┌────┐
│ Login   │───────▶│ auth     │────HTTP────▶│ POST    │──SQL─────▶│    │
│ Page    │        │ slice    │            │ /login  │           │    │
│         │        │          │            │         │           │ PG │
│ ✓ Token │◀──────│ setToken │◀──HTTP─────│ JWT     │           │    │
│ ✓ User  │        │ setUser  │            │ response│           │    │
└─────────┘        └──────────┘            └─────────┘           └────┘
                        │
                        │ useAuth()
                        │
                   ┌────▼────────┐
                   │ Components   │
                   │ can use:     │
                   │ - user       │
                   │ - token      │
                   │ - loading    │
                   │ - isAuth     │
                   └─────────────┘
```

---

## Key Security Features Implemented

1. **Password Hashing**: bcryptjs with 10 salt rounds
2. **JWT Tokens**: HS256 algorithm, 24h expiration
3. **Token Refresh**: Automatic renewal on 401 responses
4. **Multi-tenant**: organization_id filtering on all queries
5. **Role-based Access**: authorize() middleware for role checks
6. **Protected Routes**: ProtectedRoute component with role validation
7. **HTTPS Ready**: Secure cookie and HTTPS enforcement in production

---

## Configuration Checklist

- [ ] Backend `.env` configured with database URL
- [ ] Frontend `.env.example` copied to `.env`
- [ ] Prisma migrations run successfully
- [ ] Redux store integrated in main.tsx
- [ ] React Router setup with auth routes
- [ ] JWT_SECRET changed in production
- [ ] Database backups configured
- [ ] Rate limiting on auth endpoints
- [ ] Email verification flow (future)
- [ ] Refresh token rotation (future)

---

**Version**: 2.0.0
**Last Updated**: March 15, 2026
