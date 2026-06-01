import { render, screen } from "@testing-library/react";
import { Visualizations } from "./Visualizations";

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
  it("renders chart headings", () => {
    render(
      <Visualizations
        devices={[
          {
            id: "device-001",
            name: "Device A",
            type: "temperature",
            status: "ok",
            value: 42.4,
            unit: "C",
            lastSeen: "2026-05-28T08:15:00Z",
          },
        ]}
        events={[
          {
            id: "evt-001",
            timestamp: "2026-05-28T08:12:00Z",
            severity: "warning",
            source: "device-001",
            message: "Normal reading",
          },
        ]}
      />,
    );

    expect(screen.getByText("Charts (Recharts)")).toBeInTheDocument();
    expect(screen.getByText("Device Value Comparison")).toBeInTheDocument();
    expect(screen.getByText("Event Severity Distribution")).toBeInTheDocument();
  });
});
