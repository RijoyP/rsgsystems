import { render, screen } from "@testing-library/react";
import { DeviceTable } from "./DeviceTable";

describe("DeviceTable", () => {
  it("renders device rows", () => {
    render(
      <DeviceTable
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
      />,
    );

    expect(screen.getByText("Device List")).toBeInTheDocument();
    expect(screen.getByText("Device A")).toBeInTheDocument();
    expect(screen.getByText("temperature")).toBeInTheDocument();
    expect(screen.getByText("42.4 C")).toBeInTheDocument();
    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});
