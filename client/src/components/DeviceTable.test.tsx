import { fireEvent, render, screen } from "@testing-library/react";
import { DeviceTable } from "./DeviceTable";
import { fetchDevicePage } from "../api/monitoringApi";

jest.mock("../api/monitoringApi", () => ({
  fetchDevicePage: jest.fn(),
}));

describe("DeviceTable", () => {
  it("renders device rows and paginates", async () => {
    (fetchDevicePage as jest.Mock)
      .mockResolvedValueOnce({
        items: [
          {
            id: "device-001",
            name: "Device A",
            type: "temperature",
            status: "ok",
            value: 42.4,
            unit: "C",
            lastSeen: "2026-05-28T08:15:00Z",
          },
        ],
        page: 1,
        pageSize: 5,
        total: 2,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        items: [
          {
            id: "device-002",
            name: "Device B",
            type: "pressure",
            status: "warning",
            value: 17.2,
            unit: "bar",
            lastSeen: "2026-05-28T08:16:00Z",
          },
        ],
        page: 2,
        pageSize: 5,
        total: 2,
        totalPages: 2,
      });

    render(<DeviceTable />);

    expect(screen.getByText("Device List")).toBeInTheDocument();
    expect(await screen.findByText("Device A")).toBeInTheDocument();
    expect(screen.getByText("temperature")).toBeInTheDocument();
    expect(screen.getByText("42.4 C")).toBeInTheDocument();
    expect(screen.getByText("ok")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByText("Device B")).toBeInTheDocument();
    expect(fetchDevicePage).toHaveBeenNthCalledWith(1, { page: 1, pageSize: 5 });
    expect(fetchDevicePage).toHaveBeenNthCalledWith(2, { page: 2, pageSize: 5 });
  });
});
