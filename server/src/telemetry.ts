import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const serviceName = process.env.OTEL_SERVICE_NAME || "rsgsystem-server";

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || "http://otel-collector:4318/v1/traces",
});

const metricExporter = new OTLPMetricExporter({
  url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || "http://otel-collector:4318/v1/metrics",
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 15_000,
});

const telemetry = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: serviceName,
  }),
  traceExporter,
  metricReader,
  instrumentations: [getNodeAutoInstrumentations()],
});

try {
  telemetry.start();
} catch (error) {
  console.error("OpenTelemetry failed to start", error);
}

const shutdownTelemetry = () => {
  telemetry
    .shutdown()
    .catch((error) => {
      console.error("OpenTelemetry failed to stop", error);
    })
    .finally(() => {
      process.exit(0);
    });
};

process.once("SIGINT", shutdownTelemetry);
process.once("SIGTERM", shutdownTelemetry);
