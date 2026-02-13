# AssetTrackPro
## RFID-Based Real-Time Asset Tracking System

<p align="center">
  <strong>Enterprise-grade multi-tenant platform for tracking IT assets with RFID technology</strong>
</p>

<p align="center">
  📡 Real-Time Tracking | 🚨 Instant Alerts | 🏢 Multi-Tenant | 📊 Complete Audit Trail
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [RFID Integration](#rfid-integration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Roadmap](#roadmap)

---

## 🎯 Overview

**AssetTrackPro** is a production-ready, enterprise-grade RFID-based real-time asset tracking system designed to monitor the physical movement of company assets (laptops, tablets, phones) as they transit through zones and gates within organizational buildings.

ER Diagram

![rfid_erd_full](https://github.com/user-attachments/assets/a3e9b068-51d9-4710-87e4-9b4fef300739)


Use Case Diagram

![rfid_use_case_full](https://github.com/user-attachments/assets/b95281ee-6c4c-411c-a2f4-08ab24d0b276)


Flow Chart

![rfid_flowchart_full](https://github.com/user-attachments/assets/4cb367a9-5aa6-43a9-a500-f5970bc90b2d)


DATABASE SCHEMA (Relational, production-ready)

ORGANIZATION
organization_id (PK)
name
industry_type
created_at

BRANCH
branch_id (PK)
organization_id (FK)
name
city
status

BUILDING
building_id (PK)
branch_id (FK)
name

ZONE
zone_id (PK)
building_id (FK)
zone_name
zone_type (STORAGE, OFFICE, EXIT, SECURE)

GATE
gate_id (PK)
zone_id (FK)
gate_name
direction (ENTRY, EXIT, BOTH)

EMPLOYEE
employee_id (PK)
organization_id (FK)
employee_code
name
status (ACTIVE, RESIGNED)

ASSET
asset_id (PK)
organization_id (FK)
asset_tag_uid (RFID EPC / UUID)
asset_type (LAPTOP, TABLET, PHONE)
status (ACTIVE, LOST, RECOVERED)
last_seen_zone_id (FK)
last_seen_time

ASSET_ASSIGNMENT (history matters)
assignment_id (PK)
asset_id (FK)
employee_id (FK)
assigned_at
returned_at (nullable)

MOVEMENT_EVENT (heart of the system)
event_id (PK)
asset_id (FK)
gate_id (FK)
zone_from_id (FK)
zone_to_id (FK)
event_type (ENTER, EXIT)
event_time
trigger_source (RFID, SIMULATED)


Append-only. Never update. Never delete.

ALERT / INCIDENT
alert_id (PK)
asset_id (FK)
event_id (FK)
alert_type (UNAUTHORIZED_EXIT, OVERDUE_RETURN)
severity
created_at
resolved_at

Unlike traditional inventory management systems that require manual check-in/check-out, AssetTrackPro provides:

✅ **Real-time location tracking** via RFID gates  
✅ **Unauthorized exit detection and alerting** (< 1 second latency)  
✅ **Immutable movement audit trail** (append-only event log)  
✅ **Multi-tenant architecture** (one system, many organizations)  
✅ **Hierarchical location model** (Organization → Branch → Building → Zone → Gate)  
✅ **Production-ready scale** (10,000+ assets, 100,000+ events/day)

### Use Cases

🔐 **IT Asset Security**: Prevent unauthorized removal of company laptops/devices  
📋 **Compliance & Audit**: Complete immutable trail of who had what, when  
🚨 **Loss Prevention**: Real-time alerts when assets exit buildings unexpectedly  
📊 **Utilization Tracking**: Analytics on asset movement patterns  
📍 **Inventory Management**: Always know where every asset is located

---

## ✨ Key Features

### Core Asset Management
- **RFID-Tagged Assets**: Each asset has unique RFID tag (EPC Gen2 UHF)
- **Hierarchical Locations**: Organization → Branch → Building → Zone → Gate
- **Asset Assignment**: Track who has what asset at any time
- **Asset Status**: ACTIVE, LOST, RECOVERED, RETIRED
- **Asset Types**: LAPTOP, TABLET, PHONE, MONITOR, etc.

### Real-Time RFID Tracking ⭐
- **Automatic Detection**: RFID readers detect tags as assets move through gates
- **Movement Events**: Every gate crossing creates an immutable event record
- **Last Seen Location**: Real-time tracking of asset current zone
- **Movement History**: Complete audit trail of all asset movements
- **Event Volume**: Handles 100,000+ events/day per organization

### Security & Alerting 🚨
- **Unauthorized Exit Detection**: Alert when assets leave without authorization
- **Overdue Return Alerts**: Notify when assets not returned on time
- **Lost Asset Detection**: Flag assets not seen for 30+ days
- **Zone Violation Alerts**: Detect assets entering restricted areas
- **Tampered Tag Detection**: Alert on damaged/removed RFID tags

### Multi-Tenant Architecture 🏢
- **Organization Isolation**: Complete data separation between tenants
- **Row-Level Security**: Database-enforced tenant isolation (PostgreSQL RLS)
- **Per-Organization Users**: Role-based access control (admin, manager, security, viewer)
- **Scalable**: Supports thousands of organizations on single infrastructure

### Analytics & Reporting 📊
- **Real-Time Dashboard**: Live asset locations and alert status
- **Movement Analytics**: Track busiest zones, gates, assets
- **Utilization Reports**: Identify underutilized assets
- **Compliance Reports**: Generate audit trails for specific time periods
- **Zone Occupancy**: View current assets per zone in real-time

---

## 🏗 System Architecture

```
┌──────────────┐
│   Clients    │  (Web Browser / Mobile App)
│  (React UI)  │
└──────┬───────┘
       │ HTTPS/REST API
       ▼
┌──────────────┐
│  Express.js  │  (Node.js Backend - Port 5000)
│   Backend    │  • JWT Authentication
└──────┬───────┘  • Multi-tenant filtering
       │ SQL       • Alert rules engine
       ▼
┌──────────────┐
│  PostgreSQL  │  (10-table production schema)
│   Database   │  • Hierarchical location model
└──────────────┘  • Append-only movement_event table
       ▲
       │ RFID Events
       │
┌──────────────┐
│  RFID        │  (Impinj ItemSense Middleware)
│  Middleware  │  • Event aggregation
└──────┬───────┘  • Webhook to backend
       │
       ▼
┌──────────────┐
│ RFID Readers │  (Impinj R700, Zebra FX, etc.)
│  at Gates    │  • Detect tags as assets pass
└──────────────┘  • 1-10 meter read range
```

📚 **Detailed Architecture**: See [docs/Architecture-Diagram.md](docs/Architecture-Diagram.md)

---

## 🛠 Technology Stack

### Frontend
- **React 19.2.0**: Modern UI library with hooks
- **Vite 7.2.4**: Lightning-fast build tool and dev server
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing
- **CSS3/Tailwind**: Responsive styling

### Backend
- **Node.js 18+ LTS**: JavaScript runtime
- **Express.js 5.2.1**: Web framework (ES Modules)
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing
- **Winston/Pino**: Structured logging
- **Joi**: Request validation

### Database
- **PostgreSQL 14+** (Recommended):
  - Row-level security (RLS) for multi-tenancy
  - Table partitioning for `movement_event` (millions of rows)
  - JSONB for flexible metadata
  - Advanced indexing (B-tree, GiST)
- **MySQL 8+** (Alternative): InnoDB with proper indexing

### RFID Hardware
- **RFID Readers**: Impinj R700/R420, Zebra FX9600
- **RFID Tags**: EPC Gen2 (ISO 18000-6C) passive UHF tags
- **Frequency**: 860-960 MHz (region-dependent)
- **Read Range**: 1-10 meters (tag and power dependent)
- **Middleware**: Impinj ItemSense or Zebra Savanna

### DevOps & Tools
- **Git/GitHub**: Version control
- **ESLint/Prettier**: Code quality
- **Docker**: Containerization (optional)
- **Jest/Mocha**: Unit testing
- **Cypress**: E2E testing

---

## 📁 Project Structure

```
AssetTrackPro/
├── backend/                        # Backend API server (ES Modules)
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   │   └── database.js        # DB connection pool
│   │   ├── controllers/           # Request handlers
│   │   │   ├── assetController.js
│   │   │   ├── movementEventController.js
│   │   │   ├── rfidWebhookController.js ⭐ (RFID integration)
│   │   │   ├── alertController.js
│   │   │   └── zoneController.js
│   │   ├── middleware/            # Custom middleware
│   │   │   ├── auth.js            # JWT verification
│   │   │   ├── tenantScope.js ⭐  # Multi-tenant filtering
│   │   │   └── errorHandler.js
│   │   ├── models/                # Data models (10 tables)
│   │   │   ├── Organization.js    # Tenant root
│   │   │   ├── Branch.js          # Office locations
│   │   │   ├── Building.js
│   │   │   ├── Zone.js            # STORAGE, OFFICE, EXIT, SECURE
│   │   │   ├── Gate.js 📡         # RFID reader locations
│   │   │   ├── Employee.js
│   │   │   ├── Asset.js 🏷️       # RFID-tagged devices
│   │   │   ├── AssetAssignment.js
│   │   │   ├── MovementEvent.js ⭐ # Immutable event log
│   │   │   └── Alert.js 🚨
│   │   ├── routes/                # API routes
│   │   │   ├── assetRoutes.js
│   │   │   ├── movementEventRoutes.js
│   │   │   ├── rfidWebhookRoutes.js ⭐
│   │   │   ├── alertRoutes.js
│   │   │   ├── zoneRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── services/              # Business services
│   │   │   ├── alertRulesEngine.js ⭐ # Violation detection
│   │   │   ├── rfidEventProcessor.js  # Event normalization
│   │   │   ├── notificationService.js # Email, SMS, push
│   │   │   └── cacheService.js        # Redis (optional)
│   │   ├── utils/                 # Utilities
│   │   │   ├── helpers.js
│   │   │   ├── logger.js
│   │   │   └── validators.js
│   │   ├── migrations/            # Database schema
│   │   │   ├── 001_create_organization_branch_building.sql
│   │   │   ├── 002_create_zone_gate.sql
│   │   │   ├── 003_create_employee_asset.sql
│   │   │   ├── 004_create_movement_event.sql ⭐
│   │   │   ├── 005_create_alert.sql
│   │   │   └── 006_add_indexes_and_constraints.sql
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Server entry point
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/                       # React frontend
│   ├── public/                    # Static files
│   ├── src/
│   │   ├── assets/                # Images, fonts, etc.
│   │   ├── components/            # Reusable components
│   │   │   ├── layout/            # Header, Footer, Nav
│   │   │   ├── assets/            # Asset components
│   │   │   ├── rfid/ ⭐           # RFID-specific UI
│   │   │   │   ├── ZoneViewer.jsx
│   │   │   │   ├── GateStatus.jsx
│   │   │   │   └── RFIDTagScanner.jsx
│   │   │   ├── alerts/            # Alert panel, list
│   │   │   ├── movements/         # Movement history, heatmap
│   │   │   └── zones/             # Zone list, occupancy
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useFetch.js
│   │   │   ├── useAssets.js
│   │   │   ├── useAlerts.js
│   │   │   ├── useRealtime.js     # WebSocket (Phase 2)
│   │   │   └── useZones.js
│   │   ├── pages/                 # Page components
│   │   │   ├── Home/
│   │   │   ├── Dashboard/         # Real-time dashboard
│   │   │   ├── Assets/
│   │   │   ├── Zones/
│   │   │   ├── Alerts/
│   │   │   ├── Analytics/
│   │   │   └── Settings/
│   │   ├── services/              # API service layer
│   │   │   ├── api.js             # Axios config + JWT interceptor
│   │   │   ├── assetService.js
│   │   │   ├── movementService.js
│   │   │   ├── alertService.js
│   │   │   ├── zoneService.js
│   │   │   └── rfidService.js ⭐
│   │   ├── utils/                 # Utility functions
│   │   │   ├── helpers.js
│   │   │   ├── constants.js
│   │   │   ├── dateFormatter.js
│   │   │   └── rfidParser.js ⭐  # Parse RFID tag formats
│   │   ├── App.jsx                # Main app component
│   │   ├── App.css
│   │   ├── main.jsx               # Entry point
│   │   └── index.css
│   ├── .env.example
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── docs/                           # Documentation
│   ├── Database-Schema.md ⭐      # Complete SQL schema (946 lines)
│   ├── Architecture-Diagram.md    # System architecture diagrams
│   ├── Notes.txt                  # Technical documentation
│   └── README.md                  # Documentation index
│
├── presentation/                   # Presentation materials
│   └── README.md                  # Presentation guide
│
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** v18+ LTS
- **npm** or **yarn**
- **Git**
- **PostgreSQL** 14+ (or MySQL 8+)
- **RFID Hardware** (optional for development - can simulate)

### Quick Start

```bash
# Clone repository
git clone https://github.com/kawdoco/AssetTrackPro.git
cd AssetTrackPro

# Setup backend
cd backend
npm install
copy .env.example .env
# Edit .env with your database credentials
npm start

# Setup frontend (in new terminal)
cd ../frontend
npm install
copy .env.example .env
npm run dev

# Access application
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=assettrackpro_dev
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# RFID Integration
API_KEY_RFID_MIDDLEWARE=your_rfid_middleware_api_key

# Notifications (Optional)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Redis (Optional - Phase 2)
REDIS_URL=redis://localhost:6379
```

### 4. Database Setup

```bash
# Create database
createdb assettrackpro_dev

# Run migrations
npm run migrate

# Seed test data (optional)
npm run seed
```

### 5. Start Backend Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Backend API: `http://localhost:5000`

---

## 💻 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server

```bash
npm run dev
```

Frontend: `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📡 RFID Integration

### RFID Hardware Setup

1. **Install RFID Readers** at strategic gates (entries/exits)
   - Main building exits
   - Storage room doors
   - Secure server room access points
   - Office floor transitions

2. **Configure RFID Middleware** (Impinj ItemSense):
   ```json
   {
     "webhookUrl": "http://your-backend.com/api/rfid-webhook/movement-event",
     "headers": {
       "X-API-Key": "your_rfid_middleware_api_key"
     },
     "aggregation": {
       "enabled": true,
       "timeWindow": 3000,
       "method": "logical"
     }
   }
   ```

3. **Attach RFID Tags** to assets:
   - Laptops: adhesive label on bottom
   - Tablets: case-integrated or back adhesive
   - Phones: SIM tray sticker

### Simulating RFID Events (Development)

For development without physical RFID hardware:

```bash
# Send test RFID event
POST http://localhost:5000/api/rfid-webhook/movement-event
Content-Type: application/json
X-API-Key: your_rfid_middleware_api_key

{
  "reader_id": "READER-001",
  "gate_id": "<gate-uuid>",
  "asset_tag_uid": "RFID-E200-34161B5A8C7D",
  "event_type": "EXIT",
  "event_time": "2026-02-13T14:30:45Z",
  "signal_strength": -45,
  "zone_from": "<zone-storage-uuid>",
  "zone_to": "<zone-exit-uuid>"
}
```

Or use the included test script:

```bash
npm run test:rfid-event
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All endpoints (except RFID webhook) require JWT authentication:

```
Authorization: Bearer <jwt_token>
```

### Key Endpoints

#### Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/assets` | List all assets (filtered by organization) |
| GET    | `/assets/:id` | Get asset details |
| GET    | `/assets/tag/:rfid_tag` ⭐ | Get asset by RFID tag UID |
| GET    | `/assets/:id/location` | Get current location hierarchy |
| GET    | `/assets/:id/history` | Get movement history |
| POST   | `/assets` | Register new asset |
| PUT    | `/assets/:id` | Update asset |
| POST   | `/assets/:id/assign` | Assign to employee |
| POST   | `/assets/:id/return` | Mark as returned |

#### Movement Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/rfid-webhook/movement-event` ⭐ | Receive RFID events |
| GET    | `/movement-events` | List events (paginated) |
| GET    | `/movement-events/:id` | Get event details |
| POST   | `/movement-events/simulate` | Create test event |

#### Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/alerts` | List alerts |
| GET    | `/alerts/unresolved` | Active alerts only |
| GET    | `/alerts/:id` | Get alert details |
| POST   | `/alerts/:id/resolve` | Mark alert resolved |
| POST   | `/alerts/:id/escalate` | Increase alert severity |

#### Zones & Gates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/zones` | List all zones |
| GET    | `/zones/:id/assets` | List assets in zone |
| GET    | `/gates` | List all gates |
| GET    | `/gates/:id/recent-events` | Recent gate crossings |

#### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/analytics/dashboard` | Dashboard summary stats |
| GET    | `/analytics/movement-heatmap` | Busiest gates/zones |
| GET    | `/analytics/zone-occupancy` | Current assets per zone |
| GET    | `/reports/audit-trail` | Generate audit report |

### Example Response

```json
{
  "success": true,
  "data": {
    "asset_id": "a7b39d2e-1234-5678-abcd-ef1234567890",
    "asset_tag_uid": "RFID-E200-34161B5A8C7D",
    "asset_type": "LAPTOP",
    "model": "MacBook Pro 16",
    "status": "ACTIVE",
    "last_seen_zone_id": "zone-storage-floor-1",
    "last_seen_time": "2026-02-13T14:30:45Z"
  },
  "timestamp": "2026-02-13T14:35:00Z"
}
```

📖 **Full API Documentation**: See [docs/Notes.txt](docs/Notes.txt) - Section 5

---

## 🗄 Database Schema

The system uses a **10-table production-ready schema**:

### Core Tables

1. **organization**: Multi-tenant root (organization_id on all top-level entities)
2. **branch**: Office locations (city, address)
3. **building**: Physical buildings within branches
4. **zone**: Logical areas (STORAGE, OFFICE, EXIT, SECURE)
5. **gate**: RFID reader locations (direction: ENTRY, EXIT, BOTH)
6. **employee**: Staff members (can have asset assignments)
7. **asset**: RFID-tagged devices (unique `asset_tag_uid` 🏷️)
8. **asset_assignment**: Who has what (assigned_at, returned_at)
9. **movement_event** ⭐: Immutable event log (NEVER update/delete!)
10. **alert**: Security incidents (UNAUTHORIZED_EXIT, LOST_ASSET, etc.)

### Key Relationships

```
organization (1) → branches (N) → buildings (N) → zones (N) → gates (N)
organization (1) → employees (N)
organization (1) → assets (N) → movement_events (MILLIONS) ⭐
asset (1) → asset_assignments (N)
asset (1) → alerts (N)
movement_event (1) → alerts (N)
```

### Critical Indexes

- `asset.asset_tag_uid` (UNIQUE B-tree) ← RFID lookup < 1ms
- `movement_event (asset_id, event_time DESC)` ← Most common query
- `movement_event (gate_id, event_time DESC)`
- `alert (severity, resolved_at)`

📖 **Complete Schema**: See [docs/Database-Schema.md](docs/Database-Schema.md) (946 lines, comprehensive)

---

## 🔨 Development

### Available Scripts

#### Backend
```bash
npm start              # Start server (production mode)
npm run dev            # Start with nodemon (hot reload)
npm run migrate        # Run database migrations
npm run seed           # Seed test data
npm test               # Run unit tests
npm run test:coverage  # Test coverage report
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors
```

#### Frontend
```bash
npm run dev            # Start dev server (hot reload)
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
npm run test           # Run unit tests (Vitest)
npm run test:e2e       # Run E2E tests (Cypress)
```

### Code Structure Best Practices

1. **ES Modules**: Backend uses `"type": "module"` - always use `import`/`export`
2. **File Extensions**: Include `.js` in imports: `import Asset from './models/Asset.js'`
3. **Multi-Tenant Aware**: All queries MUST filter by `organization_id`
4. **Append-Only Events**: NEVER update/delete `movement_event` records
5. **Async/Await**: Use async/await for all async operations (no callbacks)
6. **Error Handling**: Use try-catch in all controllers
7. **Validation**: Validate all user inputs with Joi/express-validator
8. **Logging**: Use Winston/Pino for structured logging

### Alert Rules Engine

Located in `backend/src/services/alertRulesEngine.js`:

```javascript
// Example: Unauthorized Exit Detection
if (zone_to.zone_type === 'EXIT' && event_type === 'EXIT') {
  const assignment = await getActiveAssignment(asset_id);
  if (!assignment || isOverdue(assignment)) {
    await createAlert({
      type: 'UNAUTHORIZED_EXIT',
      severity: 'HIGH',
      asset_id,
      event_id
    });
  }
}
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` (64+ random characters)
- [ ] Set strong `API_KEY_RFID_MIDDLEWARE`
- [ ] Configure PostgreSQL with proper indexes and partitioning
- [ ] Enable database backups (daily minimum)
- [ ] Set up monitoring (New Relic, Datadog, or Sentry)
- [ ] Configure SSL/TLS for all endpoints
- [ ] Set up load balancing for backend (if needed)
- [ ] Configure SMTP/SendGrid for email notifications
- [ ] Set rate limiting on API endpoints
- [ ] Enable CORS only for trusted domains
- [ ] Review database RLS policies
- [ ] Test RFID event ingestion at scale

### Recommended Hosting

**Frontend**: Vercel, Netlify, or AWS CloudFront  
**Backend**: Heroku, Railway, or AWS EC2/ECS  
**Database**: AWS RDS (PostgreSQL), DigitalOcean Managed DB, Azure Database  
**Monitoring**: New Relic, Datadog  
**Error Tracking**: Sentry

### Docker Deployment (Optional)

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/rfid-dashboard-improvements`
3. **Make changes** and commit: `git commit -m "Add: Real-time zone occupancy heatmap"`
4. **Push to branch**: `git push origin feature/rfid-dashboard-improvements`
5. **Create Pull Request** with description of changes

### Coding Standards

- **ESLint**: Follow project ESLint rules (auto-fix: `npm run lint:fix`)
- **Naming**: Use camelCase for variables/functions, PascalCase for classes/components
- **Comments**: Add JSDoc comments for all functions
- **Commits**: Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- **Tests**: Write tests for new features (aim for >80% coverage)

### Bug Reports

Use GitHub Issues with:
- **Clear title**: "RFID webhook fails with invalid gate_id"
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment**: Node.js version, database, OS

---

## 🗺 Roadmap

### Current Version: 2.0.0 (RFID Production-Ready)
✅ 10-table production database schema  
✅ Multi-tenant architecture with RLS  
✅ RFID webhook integration  
✅ Alert rules engine  
✅ Movement event tracking (append-only)  
✅ Comprehensive documentation (946 lines)

### Phase 2 (Q3 2026)
- [ ] Real-time WebSocket dashboard (< 1 second latency)
- [ ] Mobile app (React Native) with push notifications
- [ ] Advanced analytics with ML anomaly detection
- [ ] PDF/CSV export for reports
- [ ] Bulk RFID tag registration

### Phase 3 (Q4 2026)
- [ ] HR system integration (auto-sync employees)
- [ ] Procurement system integration (auto-import assets)
- [ ] Geo-fencing for assets outside buildings
- [ ] Maintenance scheduling & reminders
- [ ] Asset depreciation tracking

### Phase 4 (2027)
- [ ] AI-powered insights & predictions
- [ ] Blockchain audit trail (high-security option)
- [ ] IoT sensor integration (temp, humidity, shock)
- [ ] Cross-organization asset transfers
- [ ] Advanced role-based permissions (ABAC)

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👥 Team

**Project**: AssetTrackPro  
**Version**: 2.0.0 (RFID Production-Ready)  
**Last Updated**: February 13, 2026

For questions, support, or contributions:
- **GitHub**: https://github.com/kawdoco/AssetTrackPro
- **Documentation**: See `docs/` folder
- **Issues**: https://github.com/kawdoco/AssetTrackPro/issues

---

## 🎓 Further Information

This project demonstrates:

✅ **Production-Ready Database Design**: 10-table normalized schema (3NF) with proper constraints  
✅ **Multi-Tenant Architecture**: Row-level security and organization_id isolation  
✅ **Append-Only Event Log**: Immutable `movement_event` table for compliance  
✅ **Hierarchical Data Model**: Organization → Branch → Building → Zone → Gate  
✅ **RFID Integration**: Real-world IoT/hardware integration  
✅ **Alert Rules Engine**: Complex business logic with event-driven architecture  
✅ **Performance Optimization**: Strategic indexing, partitioning, caching strategy  
✅ **Security**: JWT authentication, RLS, input validation, API key protection  
✅ **Scalability**: Handles 10,000+ assets, 100,000+ events/day  
✅ **Documentation**: Comprehensive (946-line schema docs, architecture diagrams)  

**Key Learning Outcomes**: Full-stack development, database design, real-time systems, multi-tenancy, IoT integration, production deployment

---

**🚀 Happy Tracking!**
