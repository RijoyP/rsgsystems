import { render, screen } from "@testing-library/react";
import { OverviewCards } from "./OverviewCards";

describe("OverviewCards", () => {
  it("renders all overview values", () => {
    render(
      <OverviewCards
        overview={{
          totalDevices: 6,
          okDevices: 2,
          warningDevices: 2,
          criticalOrOfflineDevices: 2,
        }}
      />,
    );

    expect(screen.getByText("System Overview")).toBeInTheDocument();
    expect(screen.getByText("Total devices")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.getByText("Warnings")).toBeInTheDocument();
    expect(screen.getByText("Critical / Offline")).toBeInTheDocument();
  });
});
