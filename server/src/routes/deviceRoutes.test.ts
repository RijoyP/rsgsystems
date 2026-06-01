import request from "supertest";
import { app } from "../app";

describe("deviceRoutes", () => {
  it("GET /api/devices returns devices", async () => {
    const response = await request(app).get("/api/devices");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("status");
  });
});
