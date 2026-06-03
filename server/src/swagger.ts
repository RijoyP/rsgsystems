export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Monitoring Dashboard API",
    version: "1.0.0",
    description: "Local API for devices, events, and overview.",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Device" },
    { name: "Event" },
    { name: "Overview" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                  },
                  required: ["status"],
                },
              },
            },
          },
        },
      },
    },
    "/api/devices": {
      get: {
        tags: ["Device"],
        summary: "List devices",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Array of devices",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Device" },
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid bearer token",
          },
          "403": {
            description: "Bearer token does not include deviceread role",
          },
        },
      },
    },
    "/api/events": {
      get: {
        tags: ["Event"],
        summary: "List events",
        description:
          "Returns newest events first. Optional severity filter supports info, warning, or critical.",
        parameters: [
          {
            name: "severity",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["info", "warning", "critical"],
            },
          },
        ],
        responses: {
          "200": {
            description: "Array of events",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/MonitoringEvent" },
                },
              },
            },
          },
        },
      },
    },
    "/api/overview": {
      get: {
        tags: ["Overview"],
        summary: "Get system overview",
        responses: {
          "200": {
            description: "Calculated overview metrics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SystemOverview" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "Token",
      },
    },
    schemas: {
      Device: {
        type: "object",
        properties: {
          id: { type: "string", example: "device-001" },
          name: { type: "string", example: "Device A" },
          type: { type: "string", example: "temperature" },
          status: {
            type: "string",
            enum: ["ok", "warning", "critical", "offline"],
            example: "ok",
          },
          value: { type: "number", example: 42.4 },
          unit: { type: "string", example: "C" },
          lastSeen: {
            type: "string",
            format: "date-time",
            example: "2026-05-28T08:15:00Z",
          },
        },
        required: ["id", "name", "type", "status", "value", "unit", "lastSeen"],
      },
      MonitoringEvent: {
        type: "object",
        properties: {
          id: { type: "string", example: "evt-001" },
          timestamp: {
            type: "string",
            format: "date-time",
            example: "2026-05-28T08:12:00Z",
          },
          severity: {
            type: "string",
            enum: ["info", "warning", "critical"],
            example: "warning",
          },
          source: { type: "string", example: "device-002" },
          message: {
            type: "string",
            example: "Pressure above normal threshold",
          },
        },
        required: ["id", "timestamp", "severity", "source", "message"],
      },
      SystemOverview: {
        type: "object",
        properties: {
          totalDevices: { type: "number", example: 6 },
          okDevices: { type: "number", example: 2 },
          warningDevices: { type: "number", example: 2 },
          criticalOrOfflineDevices: { type: "number", example: 2 },
        },
        required: [
          "totalDevices",
          "okDevices",
          "warningDevices",
          "criticalOrOfflineDevices",
        ],
      },
    },
  },
} as const;
