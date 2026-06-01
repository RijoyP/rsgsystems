import { calculateOverview, getDevices, getEvents } from "./monitoringService";

describe("monitoringService", () => {
  it("calculates overview counts correctly", () => {
    const overview = calculateOverview([
      { id: "a", name: "A", type: "temperature", status: "ok", value: 1, unit: "C", lastSeen: "2026-05-28T08:00:00Z" },
      { id: "b", name: "B", type: "pressure", status: "warning", value: 2, unit: "bar", lastSeen: "2026-05-28T08:00:00Z" },
      { id: "c", name: "C", type: "flow", status: "critical", value: 3, unit: "L/s", lastSeen: "2026-05-28T08:00:00Z" },
      { id: "d", name: "D", type: "humidity", status: "offline", value: 4, unit: "%", lastSeen: "2026-05-28T08:00:00Z" },
    ]);

    expect(overview).toEqual({
      totalDevices: 4,
      okDevices: 1,
      warningDevices: 1,
      criticalOrOfflineDevices: 2,
    });
  });

  it("returns events sorted newest first", async () => {
    const events = await getEvents();
    const timestamps = events.map((event) => new Date(event.timestamp).getTime());

    const sorted = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sorted);
  });

  it("returns devices list", async () => {
    const devices = await getDevices();

    expect(Array.isArray(devices)).toBe(true);
    expect(devices.length).toBeGreaterThan(0);
  });
});
