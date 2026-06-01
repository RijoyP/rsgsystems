import request from "supertest";
import { app } from "../app";

describe("monitoringRoutes", () => {
  it("GET /api/health returns status ok", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("GET /api/overview returns overview object", async () => {
    const response = await request(app).get("/api/overview");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("totalDevices");
    expect(response.body).toHaveProperty("okDevices");
    expect(response.body).toHaveProperty("warningDevices");
    expect(response.body).toHaveProperty("criticalOrOfflineDevices");
  });
});
