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

5. Authorization
- Bearer token protection on the devices API (`GET /api/devices`)
- Role guard requirement: `deviceread`
- Proper 401 and 403 responses for missing/invalid access

6. Drill-Down Features
- Click a severity bar in charts to jump to Event Log and auto-apply severity filter
- Event Log supports severity filters (`all`, `info`, `warning`, `critical`)
- Device and Event views support pagination

7. Observability
- Logging pipeline with Fluent Bit -> Elasticsearch -> Kibana
- Distributed tracing with OpenTelemetry -> Jaeger and Zipkin
- Metrics collection with Prometheus and Grafana dashboards
- Pre-provisioned Grafana unified alert rules

8. Local Execution
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

## Authorization

The devices endpoint is protected by a bearer token role check.

- Protected endpoint: `GET /api/devices`
- Required header format: `Authorization: Bearer <token>`
- Default token: `rsg-deviceread-token`
- Required role: `deviceread`
- Missing/invalid token response: `401`
- Valid token without role response: `403`

Use a custom token by setting:

```bash
DEVICE_READ_TOKEN=your-token-value
```

Example request:

```bash
curl -H "Authorization: Bearer rsg-deviceread-token" http://localhost:4000/api/devices
```

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

## Docker Compose (Observability Stack)

Use Docker Compose to run the application and the full observability stack together.

### Prerequisites

- Docker Desktop installed and running
- Docker Compose v2 available (`docker compose version`)

### Start / Stop

Start the full local stack (app + tracing + metrics + logs):

```bash
npm run docker:up
```

Equivalent command:

```bash
docker compose up --build -d
```

Stop and remove all containers and named volumes:

```bash
npm run docker:down
```

Equivalent command:

```bash
docker compose down -v
```

Check running services:

```bash
docker compose ps
```

Follow logs for all services:

```bash
docker compose logs -f
```

### Service Endpoints

- App UI: http://localhost:8080
- API: http://localhost:4000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)
- Jaeger: http://localhost:16686
- Zipkin: http://localhost:9411
- Elasticsearch: http://localhost:9200
- Kibana: http://localhost:5601

### Microsoft Teams Alerts (Grafana)

Grafana alert rules are pre-provisioned and can notify a Microsoft Teams channel using an incoming webhook.

1. Create a Teams incoming webhook for the channel where you want alerts.
2. Set the webhook URL before starting Docker Compose:

```bash
# PowerShell
$env:MSTEAMS_WEBHOOK_URL = "https://outlook.office.com/webhook/your-webhook-url"
```

3. Start or restart the stack:

```bash
npm run docker:up
```

Provisioned alerting files:

- `observability/grafana/provisioning/alerting/rules.yml`
- `observability/grafana/provisioning/alerting/contact-points.yml`
- `observability/grafana/provisioning/alerting/notification-policies.yml`

### Docker Compose Services Included

- `server`: Node.js/Express API with OpenTelemetry tracing + metrics export enabled.
- `client`: React dashboard served on port 8080.
- `otel-collector`: Receives OTLP telemetry and exports traces/metrics to observability backends.
- `jaeger`: Trace UI backend for distributed traces.
- `zipkin`: Alternative trace UI backend.
- `prometheus`: Metrics scraper for server and collector metrics.
- `grafana`: Pre-provisioned dashboards and data sources.
- `elasticsearch`: Log storage backend.
- `kibana`: Log exploration UI.
- `kibana-init`: One-time helper that creates a default Kibana data view (`docker-logs-*`).
- `fluent-bit`: Log shipper that forwards Docker container logs to Elasticsearch.

### Tracing (Jaeger + Zipkin)

- Backend traces are exported from `server` to `otel-collector` using OTLP HTTP.
- Collector exports traces to both:
- Jaeger Zipkin endpoint (`http://jaeger:9412/api/v2/spans`)
- Zipkin endpoint (`http://zipkin:9411/api/v2/spans`)

Generate sample trace traffic:

```bash
curl http://localhost:4000/api/devices
curl http://localhost:4000/api/events
```

Then open:

- Jaeger UI: choose service `rsgsystem-server` and click Find Traces.
- Zipkin UI: search for service `rsgsystem-server`.

### Drill-Down (Charts -> Events)

The dashboard supports a direct drill-down interaction:

- In **Event Severity Distribution**, click a severity bar (`info`, `warning`, `critical`).
- The app scrolls to the Event Log section.
- The Event Log is reloaded with that severity pre-selected.

This allows quick investigation from aggregate chart signal to detailed event rows.

### Metrics (Prometheus + Grafana)

- Server metrics endpoint: `http://localhost:4000/metrics`
- Prometheus scrapes:
- `prometheus:9090`
- `server:4000/metrics`
- `otel-collector:8889`

Useful Prometheus checks:

```promql
up
http_requests_total
http_request_duration_seconds_count
```

Grafana details:

- URL: http://localhost:3000
- Credentials: `admin` / `admin`
- Home dashboard is preconfigured to `rsgsystem-overview.json`
- Provisioned data sources include Prometheus, Jaeger, Zipkin, and Elasticsearch.

### Logs (Elasticsearch + Fluent Bit + Kibana)

- Fluent Bit tails Docker container logs and sends them to Elasticsearch.
- Elasticsearch receives logs under index pattern `docker-logs-*` (Logstash format).
- Kibana is available at http://localhost:5601.
- `kibana-init` creates a default data view named `Docker Logs` for `docker-logs-*`.

Validate logs are indexed:

```bash
curl "http://localhost:9200/_cat/indices?v"
```

In Kibana:

- Open Discover.
- Select data view `Docker Logs`.
- Filter by fields such as `container_name`, `log`, or `source`.

What is wired:

- Tracing: backend emits OpenTelemetry traces to the collector, exported to both Jaeger and Zipkin.
- Metrics: backend exposes `/metrics` for Prometheus and also emits OTLP metrics through the collector.
- Includes `http_requests_total`, `http_responses_total`, `http_request_duration_seconds`, and process CPU metrics.
- Logging: container logs are shipped by Fluent Bit to Elasticsearch and are viewable in Kibana.

### Alerting (Grafana Unified Alerting)

Provisioned Grafana alerts are included for:

- Slow HTTP responses (P95 latency)
- Error logs detected in Elasticsearch

Rules are provisioned from:

- `observability/grafana/provisioning/alerting/rules.yml`

Default thresholds:

- HTTP P95 latency > `2s` for `5m`
- Server error/exception log count > `2` for `3m` (last `5m` window)

How to view alerts:

- Open Grafana at http://localhost:3000
- Navigate to **Alerting > Alert rules**
- Folder: `RSGSYSTEM`

How to tune thresholds:

- Edit `observability/grafana/provisioning/alerting/rules.yml`
- Update threshold values in the expression models
- Restart Grafana container: `docker compose restart grafana`

Quick test ideas:

- Latency alert: temporarily add an artificial delay in one API route or lower the latency threshold.
- Error-log alert: trigger an intentional server error and verify log lines with `error` or `exception` appear.

### Troubleshooting

- If `docker compose up` fails, run `docker compose ps` and `docker compose logs <service-name>` to isolate the failing service.
- If traces are missing, hit API endpoints to generate traffic and verify `server` and `otel-collector` logs.
- If metrics are missing in Grafana, confirm Prometheus target health in `http://localhost:9090/targets`.
- If logs are missing in Kibana, verify Fluent Bit is running and check Elasticsearch indices.

## GitHub Actions CI

Workflow files:

1. `.github/workflows/server_ci.yml`
2. `.github/workflows/client_ci.yml`

Each workflow reuses `.github/workflows/service_ci_template.yml` and runs staged CI for its own side.

Pipeline stages (in order):

1. `lint`
- Runs ESLint and publishes JUnit-formatted lint results as checks/artifacts.

2. `test`
- Runs Jest tests and publishes JUnit test reports.

3. `build`
- Builds the service (`npm run build`).

4. `docker`
- Builds Docker image (`rsgsystem-server:ci` or `rsgsystem-client:ci`).

5. `trivy`
- Runs Trivy security scanning (SARIF, table, JUnit output).
- Uploads SARIF to GitHub Security and publishes scan results.

Trigger behavior:

- `server_ci.yml` runs on server-related path changes.
- `client_ci.yml` runs on client-related path changes.

## Technical Choices

- TypeScript end-to-end for clear interfaces and safer refactors.
- Vite is used as the build/dev tool for React + TypeScript (fast local startup and simple config).
- Express service layer keeps file-reading and aggregation logic separate from route handlers.
- React component composition keeps each requirement isolated (overview, table, log, charts).
- Vite proxy (`/api`) avoids hardcoded backend URLs in UI code.
- Local JSON data allows predictable behavior for evaluation and offline execution.

## What I Would Improve With More Time

1. Add richer charts
- Time-series trend chart for selected devices
- Multi-dimensional drill-down (device + severity + time window)

2. Add UX enhancements
- Search + pagination for events/devices

---

## Improvements Implemented

### 1. Live Data — WebSocket Push Updates

The dashboard now receives live updates via WebSocket instead of relying solely on the initial HTTP fetch.

**How it works:**

```
Edit devices.json or events.json
        ↓
fs.watch detects the file change (debounced 150ms)
        ↓
Server reads both JSON files and recalculates overview
        ↓
Broadcasts { type: "update", payload: { overview, devices, events } }
        ↓
WebSocket pushes message to all connected browsers
        ↓
useDashboardData updates overview state → OverviewCards re-renders
refreshSignal increments → DeviceTable and EventLog re-fetch current page
```

**Files changed:**

- `server/src/server.ts` — HTTP server upgraded to support WebSocket via `ws`. A `broadcastLatest()` function reads both JSON files and pushes the full update to all connected clients.
- `server/src/services/monitoringService.ts` — Added `watchDataFiles(callback)` which uses `fs.watch` on `devices.json` and `events.json` with a 150ms debounce to prevent duplicate triggers on a single save.
- `client/src/hooks/useDashboardData.ts` — Opens a WebSocket connection on mount. When an `update` message arrives, the overview state is updated immediately and a `refreshSignal` counter increments.
- `client/src/App.tsx` — Passes `refreshSignal` down to `DeviceTable` and `EventLog`.
- `client/src/components/DeviceTable.tsx` — Accepts `refreshSignal` prop. Added to `useEffect` dependency array so the current device page re-fetches when data changes.
- `client/src/components/EventLog.tsx` — Accepts `refreshSignal` prop. Added to `useEffect` dependency array so the current event page re-fetches, respecting the active severity filter.

**To test:**

1. Start the app with `npm run dev`
2. Open the dashboard at http://localhost:5173
3. Edit `server/src/data/events.json` or `devices.json` and save
4. The dashboard updates within 150ms without a page refresh

---

### 2. Architecture: Scaling to Production (Design Notes)

The current WebSocket + `fs.watch` implementation demonstrates the live push pattern locally. The path to production would be:

| Local (current) | Production |
|---|---|
| `fs.watch` on JSON files | IoT devices → Azure IoT Hub (MQTT) |
| Express WebSocket server | Kafka consumer reads from IoT Hub Event Hub endpoint |
| Single server process | Redis Pub/Sub bridges WebSocket messages across multiple pods |
| Docker Compose | AKS with HPA — scales Express pods on CPU > 70% |
| Env var secrets | Azure Key Vault via Secrets Store CSI driver |

**Why Redis Pub/Sub is needed for multi-pod WebSocket:**

With multiple AKS pods, a WebSocket client connects to one specific pod. If an event arrives on pod-1, only pod-1's clients would receive it. Redis Pub/Sub solves this — every pod publishes incoming events to Redis and subscribes to receive them, so all pods broadcast to their own connected clients regardless of which pod received the original event.

**Why IoT devices do not connect to Kafka directly:**

IoT devices (sensors, PLCs, industrial controllers) use lightweight protocols — MQTT, CoAP, or HTTP — because they are resource constrained. Azure IoT Hub acts as the bridge: devices connect via MQTT/HTTPS, and IoT Hub exposes a Kafka-compatible Event Hub endpoint that the Node.js consumer connects to using the same `kafkajs` client.
