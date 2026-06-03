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

  it("GET /api/devices?page=1&pageSize=2 returns paginated payload", async () => {
    const response = await request(app)
      .get("/api/devices")
      .query({ page: "1", pageSize: "2" })
      .set("Authorization", `Bearer ${DEFAULT_DEVICE_READ_TOKEN}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeLessThanOrEqual(2);
    expect(response.body).toMatchObject({
      page: 1,
      pageSize: 2,
    });
    expect(response.body.total).toBeGreaterThan(0);
    expect(response.body.totalPages).toBeGreaterThan(0);
  });
});
