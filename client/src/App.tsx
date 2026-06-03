import "./App.css";
import { Suspense, lazy, useState } from "react";
import { DeviceTable } from "./components/DeviceTable";
import { EventLog } from "./components/EventLog";
import { OverviewCards } from "./components/OverviewCards";
import { useDashboardData } from "./hooks/useDashboardData";
import { type EventSeverity } from "./types/monitoring";

const Visualizations = lazy(() => import("./components/Visualizations").then((module) => ({ default: module.Visualizations })));

function App() {
  const { data, loading, error } = useDashboardData();
  const [drilldownFilter, setDrilldownFilter] = useState<EventSeverity | null>(null);
  const [drilldownRequestId, setDrilldownRequestId] = useState(0);

  const handleSeverityDrilldown = (severity: EventSeverity) => {
    setDrilldownFilter(severity);
    setDrilldownRequestId((current) => current + 1);
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return <main className="app-shell">Loading dashboard data...</main>;
  }

  if (error || !data) {
    return <main className="app-shell">{error ?? "Unable to load data."}</main>;
  }

  return (
    <main className="app-shell">
      <header className="hero-header">
        <p className="kicker">Local Monitoring</p>
        <h1>Operational Dashboard</h1>
        <p className="subtitle">
          Devices, events, and system health from local mock data.
        </p>
      </header>

      <section id="overview">
        <OverviewCards overview={data.overview} />
      </section>

      <section className="two-col">
        <div id="devices">
          <DeviceTable />
        </div>
        <div id="events">
          <EventLog
            key={`event-log-${drilldownRequestId}`}
            initialFilter={drilldownFilter ?? "all"}
          />
        </div>
      </section>

      <section id="charts">
        <Suspense fallback={<div className="panel">Loading charts...</div>}>
          <Visualizations onSeveritySelect={handleSeverityDrilldown} />
        </Suspense>
      </section>
    </main>
  );
}

export default App;
