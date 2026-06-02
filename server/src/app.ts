import cors from "cors";
import express from "express";
import { type NextFunction, type Request, type Response } from "express";
import client from "prom-client";
import swaggerUi from "swagger-ui-express";
import { deviceRouter } from "./routes/deviceRoutes";
import { eventRouter } from "./routes/eventRoutes";
import { monitoringRouter } from "./routes/monitoringRoutes";
import { swaggerDocument } from "./swagger";

const app = express();
type MetricsGlobals = typeof globalThis & {
  __RSG_METRICS_REGISTER__?: client.Registry;
  __RSG_METRICS_INITIALIZED__?: boolean;
  __RSG_HTTP_REQUESTS_TOTAL__?: client.Counter<"method" | "route">;
  __RSG_HTTP_RESPONSES_TOTAL__?: client.Counter<"method" | "route" | "status_code">;
  __RSG_HTTP_REQUEST_DURATION__?: client.Histogram<"method" | "route" | "status_code">;
};

const metricsGlobals = globalThis as MetricsGlobals;
const metricsRegister = metricsGlobals.__RSG_METRICS_REGISTER__ ?? new client.Registry();

if (!metricsGlobals.__RSG_METRICS_INITIALIZED__) {
  metricsRegister.setDefaultLabels({
    service: process.env.OTEL_SERVICE_NAME || "rsgsystem-server",
  });

  client.collectDefaultMetrics({
    register: metricsRegister,
    prefix: "rsg_",
  });

  metricsGlobals.__RSG_METRICS_REGISTER__ = metricsRegister;
  metricsGlobals.__RSG_METRICS_INITIALIZED__ = true;
}

const httpRequestDuration =
  metricsGlobals.__RSG_HTTP_REQUEST_DURATION__ ||
  new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    registers: [metricsRegister],
  });

const httpRequestsTotal =
  metricsGlobals.__RSG_HTTP_REQUESTS_TOTAL__ ||
  new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests received",
    labelNames: ["method", "route"],
    registers: [metricsRegister],
  });

const httpResponsesTotal =
  metricsGlobals.__RSG_HTTP_RESPONSES_TOTAL__ ||
  new client.Counter({
    name: "http_responses_total",
    help: "Total number of HTTP responses sent",
    labelNames: ["method", "route", "status_code"],
    registers: [metricsRegister],
  });

metricsGlobals.__RSG_HTTP_REQUEST_DURATION__ = httpRequestDuration;
metricsGlobals.__RSG_HTTP_REQUESTS_TOTAL__ = httpRequestsTotal;
metricsGlobals.__RSG_HTTP_RESPONSES_TOTAL__ = httpResponsesTotal;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  const route = req.path;

  httpRequestsTotal.labels(req.method, route).inc();

  res.on("finish", () => {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1_000_000_000;
    const resolvedRoute = (req.route?.path as string | undefined) || route;

    httpResponsesTotal.labels(req.method, resolvedRoute, String(res.statusCode)).inc();
    httpRequestDuration.labels(req.method, resolvedRoute, String(res.statusCode)).observe(durationSeconds);
  });

  next();
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", metricsRegister.contentType);
  res.end(await metricsRegister.metrics());
});

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerDocument);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", monitoringRouter);
app.use("/api/devices", deviceRouter);
app.use("/api/events", eventRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  res.status(500).json({
    message: "Unexpected server error.",
  });
});

export { app };
