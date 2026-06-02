import { fireEvent, render, screen } from "@testing-library/react";
import { EventLog } from "./EventLog";
import { fetchEvents } from "../api/monitoringApi";

jest.mock("../api/monitoringApi", () => ({
  fetchEvents: jest.fn(),
}));

describe("EventLog", () => {
  it("filters events when a filter button is clicked", async () => {
    (fetchEvents as jest.Mock).mockResolvedValue([
      {
        id: "evt-001",
        timestamp: "2026-05-28T08:12:00Z",
        severity: "info",
        source: "device-001",
        message: "Normal reading",
      },
      {
        id: "evt-002",
        timestamp: "2026-05-28T08:16:00Z",
        severity: "critical",
        source: "device-002",
        message: "Critical event",
      },
    ]);

    render(<EventLog />);

    expect(await screen.findByText("Normal reading")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "critical" }));

    expect(screen.queryByText("Normal reading")).not.toBeInTheDocument();
    expect(screen.getByText("Critical event")).toBeInTheDocument();
  });

  it("renders empty state when there are no events", async () => {
    (fetchEvents as jest.Mock).mockResolvedValue([]);
    render(<EventLog />);

    expect(await screen.findByText("No events for this filter.")).toBeInTheDocument();
  });
});
