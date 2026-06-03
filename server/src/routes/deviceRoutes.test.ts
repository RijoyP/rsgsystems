import request from "supertest";
import { app } from "../app";
import { DEFAULT_DEVICE_READ_TOKEN } from "../auth/deviceReadAuth";

describe("deviceRoutes", () => {
  it("GET /api/devices returns devices", async () => {
    const response = await request(app)
      .get("/api/devices")
      .set("Authorization", `Bearer ${DEFAULT_DEVICE_READ_TOKEN}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("status");
  });

  it("GET /api/devices returns 401 when authorization header is missing", async () => {
    const response = await request(app).get("/api/devices");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Missing or invalid bearer token.",
    });
  });

  it("GET /api/devices returns 403 when token does not have deviceread role", async () => {
    const response = await request(app)
      .get("/api/devices")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Forbidden. Required role: deviceread.",
    });
  });
});
