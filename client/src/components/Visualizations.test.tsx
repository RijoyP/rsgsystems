import { render, screen } from "@testing-library/react";
import { Visualizations } from "./Visualizations";
import { fetchDevices, fetchEvents } from "../api/monitoringApi";

jest.mock("../api/monitoringApi", () => ({
  fetchDevices: jest.fn(),
  fetchEvents: jest.fn(),
}));

jest.mock("recharts", () => {
  const Mock = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return {
    ResponsiveContainer: Mock,
    BarChart: Mock,
    Bar: Mock,
    XAxis: Mock,
    YAxis: Mock,
    Tooltip: Mock,
    PieChart: Mock,
    Pie: Mock,
    Cell: Mock,
  };
});

describe("Visualizations", () => {
  it("renders chart headings", async () => {
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

    (fetchEvents as jest.Mock).mockResolvedValue([
      {
        id: "evt-001",
        timestamp: "2026-05-28T08:12:00Z",
        severity: "warning",
        source: "device-001",
        message: "Normal reading",
      },
    ]);

    render(
      <Visualizations />,
    );

    expect(await screen.findByText("Charts (Recharts)")).toBeInTheDocument();
    expect(await screen.findByText("Device Value Comparison")).toBeInTheDocument();
    expect(await screen.findByText("Event Severity Distribution")).toBeInTheDocument();
  });
});
