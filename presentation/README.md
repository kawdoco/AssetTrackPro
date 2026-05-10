# AssetTrackPro Presentation Guide

This folder is for presentation notes, demo flow, and stakeholder talking points for AssetTrackPro.

## Audience

Use these materials for:

- Executives who need business value and operational risk reduction.
- IT teams who need architecture, setup, and integration details.
- Operations teams who need a practical workflow demo.
- Security or audit teams who care about movement history and accountability.

## Current Product Story

AssetTrackPro helps organizations know where their tagged assets are, who is responsible for them, and how assets move through physical locations. The system combines a setup workflow, RFID gate/reader configuration, asset inventory, movement history, and reports.

The setup flow is:

```text
Organization -> Branch -> Building -> Zone -> Gate -> RFID Reader -> Asset/Employee -> Reports
```

## Recommended Demo Flow

1. Log in and open the main dashboard.
2. Create or show an organization.
3. Create a branch, then a building, then zones.
4. Open the branch map editor and show the branch boundary/map context.
5. Add a gate marker to the map and select the correct zone.
6. Open Gates and RFID Readers and show the reader assigned to that gate.
7. Create or review an asset and an employee assignment.
8. Show movement events or explain the RFID webhook flow.
9. Open Reports and review KPIs, charts, CSV export, and PDF export.

## Key Messages

- Clear setup order prevents missing relationships and empty dropdowns.
- Gates and reader devices are separate on purpose: gates represent physical access points, readers represent installed hardware.
- The map editor is for spatial placement and branch context.
- The Gates and RFID Readers page is for operational hardware setup.
- Reports turn setup and movement data into decisions: coverage, status, activity, and alerts.
- Backend console logs make local troubleshooting easier during demos and development.

## Suggested Slide Outline

| Slide | Topic | Purpose |
| --- | --- | --- |
| 1 | Problem | Manual asset tracking is slow and incomplete |
| 2 | Solution | AssetTrackPro combines inventory, RFID movement, and reports |
| 3 | Setup Model | Organization to reader hierarchy |
| 4 | Map Editor | Branch map, zones, and gate placement |
| 5 | Gates and Readers | Hardware assignment and operational readiness |
| 6 | Asset Inventory | Asset records, ownership, status, and actions |
| 7 | RFID Flow | Reader event to movement event |
| 8 | Reports | KPIs, charts, CSV export, PDF export |
| 9 | Architecture | React frontend, Express backend, Prisma database |
| 10 | Next Steps | Pilot setup, reader installation, data import |

## Demo Data Checklist

Before presenting, prepare:

- One organization.
- One branch.
- At least one building.
- Three zones such as Office, Storage, and Exit.
- Two gates, including one exit gate.
- One or two RFID reader devices assigned to gates.
- Several assets with RFID tag values.
- A few employees.
- A handful of movement events and alerts if available.

## Demo Tips

- Start with the setup hierarchy so the audience understands why each dropdown exists.
- When adding a gate on the map, explicitly mention that the selected zone is the source of the gate relationship.
- Use the Gates and RFID Readers page to show the real hardware assignment.
- Use Reports at the end to make the value visible: counts, health, movement activity, and export.
- Keep the RFID hardware explanation simple unless the audience is technical.

## Export Talking Points

The Reports page supports:

- CSV export for spreadsheet analysis and operations handoff.
- PDF export for printable summaries, stakeholder updates, and audit packets.

Exports are generated from the same report summary API used by the dashboard charts, so the numbers shown on screen and the exported files stay aligned.

## Technical Talking Points

- Frontend: React, Vite, TypeScript, Redux Toolkit, Recharts.
- Backend: Express, Prisma, JWT authentication, Swagger UI.
- Database: Prisma schema with organization, branch, building, zone, gate, reader, asset, employee, movement, and alert records.
- API integration: frontend service modules call backend routes through Redux slices.
- Logging: backend logs requests, responses, errors, startup, and process failures to the console.

## Useful Links

- Main project README: [../README.md](../README.md)
- Backend README: [../backend/README.md](../backend/README.md)
- Prisma schema: [../backend/prisma/schema.prisma](../backend/prisma/schema.prisma)
- Source code: [../backend/](../backend/) and [../frontend/](../frontend/)
