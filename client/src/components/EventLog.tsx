import { useEffect, useState } from "react";
import { fetchEventPage } from "../api/monitoringApi";
import { type EventSeverity, type MonitoringEvent } from "../types/monitoring";
import { formatTimestamp } from "../utils/date";

const FILTERS: Array<EventSeverity | "all"> = ["all", "info", "warning", "critical"];
const PAGE_SIZE = 6;

interface EventLogProps {
  initialFilter?: EventSeverity | "all";
}

export function EventLog({ initialFilter = "all" }: EventLogProps) {
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [filter, setFilter] = useState<EventSeverity | "all">(initialFilter);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const result = await fetchEventPage({ page, pageSize: PAGE_SIZE }, filter);
        setEvents(result.items);
        setTotalPages(result.totalPages);
      } catch {
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    }

    void loadEvents();
  }, [filter, page]);

  return (
    <section className="panel">
      <div className="section-header">
        <h2 className="panel-title">Event Log</h2>
        <div className="filter-group" role="group" aria-label="Filter by severity">
          {FILTERS.map((severity) => (
            <button
              key={severity}
              type="button"
              className={`filter-btn ${filter === severity ? "active" : ""}`}
              onClick={() => {
                setFilter(severity);
                setPage(1);
              }}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p>Loading events...</p> : null}
      {error ? <p>{error}</p> : null}

      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event-row">
            <span className={`badge badge-${event.severity}`}>{event.severity}</span>
            <p>{event.message}</p>
            <p className="event-meta">
              {event.source} • {formatTimestamp(event.timestamp)}
            </p>
          </li>
        ))}
        {events.length === 0 ? <li className="empty-state">No events for this filter.</li> : null}
      </ul>

      <div className="pagination" aria-label="Event pagination">
        <button
          type="button"
          className="page-btn"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>
        <span className="page-indicator">Page {page} of {totalPages}</span>
        <button
          type="button"
          className="page-btn"
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page >= totalPages || loading}
        >
          Next
        </button>
      </div>
    </section>
  );
}
