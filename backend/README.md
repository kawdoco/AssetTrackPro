# AssetTrackPro Backend

This backend is the Express and Prisma API for AssetTrackPro. It provides authenticated CRUD APIs for the setup hierarchy, asset inventory, RFID gates/readers, movement events, alerts, and reports.

## Core Setup Order

```text
Organization -> Branch -> Building -> Zone -> Gate -> RFID Reader
```

The order matters because each child record depends on the parent record. A building needs a branch, a zone needs a building, a gate needs a zone, and a reader device is installed at a gate.

## Stack

- Node.js with ES modules
- Express 5
- Prisma Client
- MySQL-compatible Prisma schema
- JWT authentication
- Swagger UI
- Console request/error logging

## Local Setup

Install dependencies:

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

Generate Prisma client and sync the database:

```bash
npx prisma generate
npx prisma db push
```

Start the API:

```bash
npm run dev
```

Production start:

```bash
npm start
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the backend with nodemon |
| `npm start` | Start the backend with Node |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema changes to the database |
| `npx prisma studio` | Open Prisma Studio |

## API Routes

| Area | Base Route | Notes |
| --- | --- | --- |
| Auth | `/api/auth` | Login and authenticated user flows |
| Organizations | `/api/organizations` | Tenant root records |
| Branches | `/api/branches` | Branch CRUD and branch-level map data |
| Buildings | `/api/buildings` | Building CRUD under branches |
| Zones | `/api/zones` | Zone CRUD under buildings |
| Gates | `/api/gates` | Gate CRUD, status/active fields, reader links |
| Reader Devices | `/api/reader-devices` | Reader CRUD and gate assignment |
| Assets | `/api/assets` | Asset inventory CRUD and assignment context |
| Employees | `/api/employees` | Employee CRUD |
| Movement Events | `/api/movement-events` | Asset movement history |
| RFID Webhook | `/api/rfid-webhook` | Public RFID ingestion endpoint |
| Reports | `/api/reports` | Report summaries for dashboard charts/export |

Swagger UI is available at:

```text
http://localhost:5000/api-docs
```

## Reports

The reports service currently exposes:

```text
GET /api/reports/summary
```

The summary is designed for the frontend Reports page and includes counts, status distributions, movement activity, alerts, reader health, gate coverage, and location coverage. CSV and PDF exports are generated in the frontend from this API response.

## RFID Flow

1. A reader detects an RFID tag.
2. Middleware or a simulator sends the event to `/api/rfid-webhook`.
3. The backend normalizes the payload.
4. The movement event service resolves the asset, reader, gate, and zone context.
5. A movement event is recorded.
6. Asset last-seen data and reader heartbeat fields are updated when applicable.

Development payloads can use fields such as `reader_key`, `reader_id`, `gate_id`, `asset_tag_uid`, `event_type`, and `event_time`.

## Logging

Console logging is enabled by the backend middleware and server entry point.

Set this in `.env` for verbose development logs:

```env
LOG_LEVEL=debug
```

The logger records:

- Server startup and listening port.
- Request method, URL, status, duration, and user context when available.
- Controller/service errors through the error handler.
- Unhandled promise rejections.
- Uncaught exceptions.

Sensitive values such as passwords, authorization headers, and tokens are redacted before logging.

## Prisma Notes

The Prisma schema lives at:

```text
backend/prisma/schema.prisma
```

When changing models:

```bash
npx prisma generate
npx prisma db push
```

Use migrations when the schema change needs to be preserved for deployment:

```bash
npx prisma migrate dev --name change_name
```

## Development Guidelines

- Keep tenant/organization scoping in every protected data query.
- Keep movement events append-friendly because they are audit records.
- Use the service layer for business logic and keep controllers thin.
- Validate parent-child relationships before creating dependent records.
- Prefer soft status changes where the UI expects active/inactive controls.
- Keep route responses in the existing `{ success, data, message }` shape.
