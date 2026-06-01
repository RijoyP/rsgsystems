import { fireEvent, render, screen } from "@testing-library/react";
import { EventLog } from "./EventLog";

describe("EventLog", () => {
  it("calls onFilterChange when a filter button is clicked", () => {
    const onFilterChange = jest.fn();

    render(
      <EventLog
        events={[
          {
            id: "evt-001",
            timestamp: "2026-05-28T08:12:00Z",
            severity: "info",
            source: "device-001",
            message: "Normal reading",
          },
        ]}
        filter="all"
        onFilterChange={onFilterChange}
      />, 
    );

    fireEvent.click(screen.getByRole("button", { name: "critical" }));
    expect(onFilterChange).toHaveBeenCalledWith("critical");
  });

  it("renders empty state when there are no events", () => {
    render(<EventLog events={[]} filter="all" onFilterChange={jest.fn()} />);

    expect(screen.getByText("No events for this filter.")).toBeInTheDocument();
  });
});
