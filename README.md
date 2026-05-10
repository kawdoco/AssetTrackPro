# AssetTrackPro

AssetTrackPro is a full-stack RFID asset tracking system for managing organizations, branches, buildings, zones, gates, RFID readers, employees, assets, movement events, alerts, and operational reports.

The current application is built around a clear setup order:

```text
Organization -> Branch -> Building -> Zone -> Gate -> RFID Reader -> Assets and Employees -> Reports
```

This order matters because each level feeds the next dropdown and API relation. For example, a gate belongs to a zone, an RFID reader is assigned to a gate, and the map editor can place a gate marker only after the branch and zone context exists.

## What Is Included

- Authentication with JWT and role-aware protected routes.
- Organization, branch, building, zone, gate, reader, employee, and asset CRUD flows.
- Active/status controls for operational records where supported by the backend.
- Branch map editor with map boundaries, zone selection, gate markers, and gate creation.
- Gates and RFID Readers page for registering physical gates and binding reader devices.
- Asset inventory with list, create, update, delete, filters, and aligned management UI.
- RFID webhook and movement event processing for asset tracking events.
- Reports dashboard with KPIs, charts, operational tables, CSV export, and PDF export.
- Backend console logging for requests, responses, errors, startup, and process failures.
- Swagger UI exposed by the backend when the server is running.

## Tech Stack

### Frontend

- React 18
- Vite
- TypeScript
- Redux Toolkit and React Redux
- React Router
- Recharts
- MUI/Radix UI/lucide-react components and icons
- Axios API client

### Backend

- Node.js
- Express 5
- Prisma ORM
- MySQL-compatible Prisma schema
- JWT authentication
- Swagger UI
- Console logger middleware

## Project Structure

```text
AssetTrackPro/
  backend/
    prisma/
      schema.prisma
      migrations/
    src/
      controllers/
      middleware/
      routes/
      services/
      utils/
      app.js
      server.js
  frontend/
    src/
      app/components/
      app/layouts/
      services/
      store/slices/
      utils/
  docs/
  presentation/
  README.md
```

## Quick Start

Open two terminals, one for the backend and one for the frontend.

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/assettrackpro"
JWT_SECRET="replace-with-a-strong-secret"
LOG_LEVEL=debug
```

Prepare Prisma and start the API:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Swagger UI:

```text
http://localhost:5000/api-docs
```

### Frontend

```bash
cd frontend
npm install
```

Optional `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the UI:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Main API Areas

The frontend calls the backend through Redux slices and service modules. The main route groups are:

| Area | Base Route |
| --- | --- |
| Authentication | `/api/auth` |
| Organizations | `/api/organizations` |
| Branches | `/api/branches` |
| Buildings | `/api/buildings` |
| Zones | `/api/zones` |
| Gates | `/api/gates` |
| RFID Readers | `/api/reader-devices` |
| Assets | `/api/assets` |
| Employees | `/api/employees` |
| Movement Events | `/api/movement-events` |
| RFID Webhook | `/api/rfid-webhook` |
| Reports | `/api/reports` |

## Setup Workflow

1. Create an organization.
2. Create one or more branches under the organization.
3. Create buildings for each branch.
4. Create zones inside each building.
5. Create gates in the correct zone.
6. Register RFID readers and assign each reader to the gate where it is installed.
7. Add employees and assets.
8. Use RFID movement events and reports to monitor operations.

The UI includes setup guidance and tooltips around these flows so empty dropdowns and missing dependencies are easier to understand.

## Gates, Readers, and the Map Editor

Gates can be created from the Gates and RFID Readers page or from the branch map editor when placing a gate marker. The important relationship is:

```text
Zone owns Gate
Gate owns or links RFID Reader Devices
Movement Events reference the Gate/Reader context
```

When placing a gate on the map, select the zone that the gate belongs to. When configuring hardware, use the Gates and RFID Readers page to bind the actual reader device to that gate.

## Reports

Reports are available in the frontend Reports page and are powered by `/api/reports/summary`.

Current report coverage includes:

- Asset totals and status distribution.
- Employee and assignment counts.
- Branch, building, zone, gate, and reader coverage.
- Reader health/status.
- Movement and alert summaries.
- Charts for visual review.
- CSV export for spreadsheet workflows.
- PDF export for sharing or printing.

## Backend Logging

The backend writes logs to the console. In development, set:

```env
LOG_LEVEL=debug
```

Logged events include request start/end, response status, request duration, startup, handled errors, unhandled promise rejections, and uncaught exceptions. Sensitive fields such as passwords and tokens are redacted.

## Useful Commands

### Backend

```bash
cd backend
npm run dev
npm start
npx prisma generate
npx prisma db push
npx prisma studio
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
```

## Documentation

- Backend guide: [backend/README.md](backend/README.md)
- Presentation guide: [presentation/README.md](presentation/README.md)
- Prisma schema: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

## Current Verification

The frontend production build has been checked with:

```bash
cd frontend
npm run build
```

Backend touched files have also been syntax-checked with `node --check`.
