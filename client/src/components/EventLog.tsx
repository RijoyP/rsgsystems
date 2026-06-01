import { type EventSeverity, type MonitoringEvent } from "../types/monitoring";
import { formatTimestamp } from "../utils/date";

interface EventLogProps {
  events: MonitoringEvent[];
  filter: EventSeverity | "all";
  onFilterChange: (value: EventSeverity | "all") => void;
}

const FILTERS: Array<EventSeverity | "all"> = ["all", "info", "warning", "critical"];

export function EventLog({ events, filter, onFilterChange }: EventLogProps) {
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
              onClick={() => onFilterChange(severity)}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

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
    </section>
  );
}
