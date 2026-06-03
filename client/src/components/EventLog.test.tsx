import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EventLog } from "./EventLog";
import { fetchEventPage } from "../api/monitoringApi";

jest.mock("../api/monitoringApi", () => ({
  fetchEventPage: jest.fn(),
}));

describe("EventLog", () => {
  it("filters events when a filter button is clicked", async () => {
    (fetchEventPage as jest.Mock)
      .mockResolvedValueOnce({
        items: [
          {
            id: "evt-001",
            timestamp: "2026-05-28T08:12:00Z",
            severity: "info",
            source: "device-001",
            message: "Normal reading",
          },
        ],
        page: 1,
        pageSize: 6,
        total: 1,
        totalPages: 1,
      })
      .mockResolvedValueOnce({
        items: [
          {
            id: "evt-002",
            timestamp: "2026-05-28T08:16:00Z",
            severity: "critical",
            source: "device-002",
            message: "Critical event",
          },
        ],
        page: 1,
        pageSize: 6,
        total: 1,
        totalPages: 1,
      });

    render(<EventLog />);

    expect(await screen.findByText("Normal reading")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "critical" }));

    await waitFor(() => {
      expect(screen.queryByText("Normal reading")).not.toBeInTheDocument();
    });
    expect(await screen.findByText("Critical event")).toBeInTheDocument();
    expect(fetchEventPage).toHaveBeenNthCalledWith(1, { page: 1, pageSize: 6 }, "all");
    expect(fetchEventPage).toHaveBeenNthCalledWith(2, { page: 1, pageSize: 6 }, "critical");
  });

  it("renders empty state when there are no events", async () => {
    (fetchEventPage as jest.Mock).mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 6,
      total: 0,
      totalPages: 1,
    });
    render(<EventLog />);

    expect(await screen.findByText("No events for this filter.")).toBeInTheDocument();
  });
});
