# Local Monitoring Dashboard

A full-stack local dashboard built for your evaluation using:

- React + Vite + TypeScript (frontend)
- Node.js + Express + TypeScript (backend)
- Local JSON mock data files (no cloud dependency)

## What This App Includes

1. System Overview
- Total device count
- Number of OK devices
- Number of warnings
- Number of critical/offline devices

2. Device List
- Device name
- Type
- Current value
- Status
- Last seen timestamp

3. Event Log
- Sorted newest first
- Severity badges (info, warning, critical)
- Filter by severity

4. Simple Visualizations
- Device status distribution bars
- Event severity distribution bars

5. Local Execution
- Runs fully on localhost
- Minimal setup
- Uses local JSON files in `server/src/data`

## Project Structure

```text
.
├─ client/                     # React app
│  ├─ src/
│  │  ├─ api/                  # HTTP API wrapper
│  │  ├─ components/           # UI sections
│  │  ├─ hooks/                # Data-fetching hook
│  │  ├─ types/                # Shared frontend types
│  │  └─ utils/
│  └─ vite.config.ts           # Includes /api proxy to backend
├─ server/                     # Express API
│  ├─ src/
│  │  ├─ data/                 # devices.json + events.json
│  │  ├─ routes/               # API routes
│  │  ├─ services/             # Data loading + overview logic
│  │  ├─ types/                # Backend domain types
│  │  ├─ app.ts
│  │  └─ server.ts
└─ package.json                # Root scripts to run both apps
```

## Installation

From the project root:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Run Locally

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Swagger UI: http://localhost:4000/api-docs

## Build

```bash
npm run build
```

## Tests (Jest)

Run all tests from root:

```bash
npm test
```

Run only backend tests:

```bash
npm run test:server
```

Run only frontend tests:

```bash
npm run test:client
```

## Lint

Run lint for both client and server:

```bash
npm run lint
```

Run lint only for server:

```bash
npm run lint:server
```

Run lint only for client:

```bash
npm run lint:client
```

## Docker

Build Docker images:

```bash
docker build -t rsgsystem-server:local ./server
docker build -t rsgsystem-client:local ./client
```

Run server container:

```bash
docker run --rm -p 4000:4000 rsgsystem-server:local
```

Run client container:

```bash
docker run --rm -p 8080:80 rsgsystem-client:local
```

- Server API in Docker: http://localhost:4000
- Client UI in Docker: http://localhost:8080

## GitHub Actions CI

Workflow files:

1. `.github/workflows/server_ci.yml`
2. `.github/workflows/client_ci.yml`

Each workflow runs test, build, and docker image build for its own side.

## Technical Choices

- TypeScript end-to-end for clear interfaces and safer refactors.
- Vite is used as the build/dev tool for React + TypeScript (fast local startup and simple config).
- Express service layer keeps file-reading and aggregation logic separate from route handlers.
- React component composition keeps each requirement isolated (overview, table, log, charts).
- Vite proxy (`/api`) avoids hardcoded backend URLs in UI code.
- Local JSON data allows predictable behavior for evaluation and offline execution.

## What I Would Improve With More Time

1. Improve observability
- Structured logging
- Request timing metrics

2. Add richer charts
- Time-series trend chart for selected devices
- Interactive drill-down for events

3. Add UX enhancements
- Search + pagination for events/devices
