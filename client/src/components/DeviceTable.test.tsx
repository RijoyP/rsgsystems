import { render, screen } from "@testing-library/react";
import { DeviceTable } from "./DeviceTable";
import { fetchDevices } from "../api/monitoringApi";

jest.mock("../api/monitoringApi", () => ({
  fetchDevices: jest.fn(),
}));

describe("DeviceTable", () => {
  it("renders device rows", async () => {
    (fetchDevices as jest.Mock).mockResolvedValue([
      {
        id: "device-001",
        name: "Device A",
        type: "temperature",
        status: "ok",
        value: 42.4,
        unit: "C",
        lastSeen: "2026-05-28T08:15:00Z",
      },
    ]);

    render(<DeviceTable />);

    expect(screen.getByText("Device List")).toBeInTheDocument();
    expect(await screen.findByText("Device A")).toBeInTheDocument();
    expect(screen.getByText("temperature")).toBeInTheDocument();
    expect(screen.getByText("42.4 C")).toBeInTheDocument();
    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});
