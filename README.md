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

### Troubleshooting

- If `docker compose up` fails, run `docker compose ps` and `docker compose logs <service-name>` to isolate the failing service.
- If traces are missing, hit API endpoints to generate traffic and verify `server` and `otel-collector` logs.
- If metrics are missing in Grafana, confirm Prometheus target health in `http://localhost:9090/targets`.
- If logs are missing in Kibana, verify Fluent Bit is running and check Elasticsearch indices.

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
