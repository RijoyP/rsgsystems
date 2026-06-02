import { useEffect, useMemo, useState } from "react";
import { fetchEvents } from "../api/monitoringApi";
import { type EventSeverity, type MonitoringEvent } from "../types/monitoring";
import { formatTimestamp } from "../utils/date";

const FILTERS: Array<EventSeverity | "all"> = ["all", "info", "warning", "critical"];

export function EventLog() {
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [filter, setFilter] = useState<EventSeverity | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const result = await fetchEvents();
        setEvents(result);
      } catch {
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    }

    void loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (filter === "all") {
      return events;
    }

    return events.filter((event) => event.severity === filter);
  }, [events, filter]);

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
              onClick={() => setFilter(severity)}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p>Loading events...</p> : null}
      {error ? <p>{error}</p> : null}

      <ul className="event-list">
        {filteredEvents.map((event) => (
          <li key={event.id} className="event-row">
            <span className={`badge badge-${event.severity}`}>{event.severity}</span>
            <p>{event.message}</p>
            <p className="event-meta">
              {event.source} • {formatTimestamp(event.timestamp)}
            </p>
          </li>
        ))}
        {filteredEvents.length === 0 ? <li className="empty-state">No events for this filter.</li> : null}
      </ul>
    </section>
  );
}
