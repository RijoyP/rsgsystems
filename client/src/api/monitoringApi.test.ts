import { fetchDevices, fetchEvents, fetchOverview } from "./monitoringApi";

describe("monitoringApi", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("deduplicates in-flight requests for the same endpoint", async () => {
    const json = jest.fn().mockResolvedValue([{ id: "device-1" }]);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json,
    });

    const [first, second] = await Promise.all([fetchDevices(), fetchDevices()]);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/devices", {
      headers: { Authorization: "Bearer rsg-deviceread-token" },
    });
    expect(first).toEqual(second);
    expect(json).toHaveBeenCalledTimes(1);
  });

  it("does not deduplicate different endpoints", async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === "/api/devices") {
        return Promise.resolve({ ok: true, json: async () => [] });
      }

      return Promise.resolve({ ok: true, json: async () => [] });
    });

    await Promise.all([fetchDevices(), fetchEvents(), fetchOverview()]);

    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it("allows retry after a failed request", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    await expect(fetchDevices()).rejects.toThrow("Unable to load device list.");
    await expect(fetchDevices()).resolves.toEqual([]);

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
