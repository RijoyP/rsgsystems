import client from "prom-client";

type MetricsGlobals = typeof globalThis & {
  __RSG_METRICS_REGISTER__?: client.Registry;
  __RSG_METRICS_INITIALIZED__?: boolean;
  __RSG_HTTP_REQUESTS_TOTAL__?: client.Counter<"method" | "route">;
  __RSG_HTTP_RESPONSES_TOTAL__?: client.Counter<"method" | "route" | "status_code">;
  __RSG_HTTP_REQUEST_DURATION__?: client.Histogram<"method" | "route" | "status_code">;
};

const metricsGlobals = globalThis as MetricsGlobals;

export const metricsRegister = metricsGlobals.__RSG_METRICS_REGISTER__ ?? new client.Registry();

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

export const httpRequestDuration =
  metricsGlobals.__RSG_HTTP_REQUEST_DURATION__ ||
  new client.Histogram<"method" | "route" | "status_code">({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    registers: [metricsRegister],
  });

export const httpRequestsTotal =
  metricsGlobals.__RSG_HTTP_REQUESTS_TOTAL__ ||
  new client.Counter<"method" | "route">({
    name: "http_requests_total",
    help: "Total number of HTTP requests received",
    labelNames: ["method", "route"],
    registers: [metricsRegister],
  });

export const httpResponsesTotal =
  metricsGlobals.__RSG_HTTP_RESPONSES_TOTAL__ ||
  new client.Counter<"method" | "route" | "status_code">({
    name: "http_responses_total",
    help: "Total number of HTTP responses sent",
    labelNames: ["method", "route", "status_code"],
    registers: [metricsRegister],
  });

metricsGlobals.__RSG_HTTP_REQUEST_DURATION__ = httpRequestDuration;
metricsGlobals.__RSG_HTTP_REQUESTS_TOTAL__ = httpRequestsTotal;
metricsGlobals.__RSG_HTTP_RESPONSES_TOTAL__ = httpResponsesTotal;