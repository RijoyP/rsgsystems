import request from "supertest";
import { app } from "../app";

describe("eventRoutes", () => {
  it("GET /api/events returns events", async () => {
    const response = await request(app).get("/api/events");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("severity");
  });

  it("GET /api/events?severity=critical filters by severity", async () => {
    const response = await request(app).get("/api/events").query({ severity: "critical" });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.every((event: { severity: string }) => event.severity === "critical")).toBe(true);
  });
});
