import "./App.css";
import { Suspense, lazy } from "react";
import { DeviceTable } from "./components/DeviceTable";
import { EventLog } from "./components/EventLog";
import { OverviewCards } from "./components/OverviewCards";
import { useDashboardData } from "./hooks/useDashboardData";

const Visualizations = lazy(() => import("./components/Visualizations").then((module) => ({ default: module.Visualizations })));

function App() {
  const { data, loading, error } = useDashboardData();

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
          <EventLog />
        </div>
      </section>

      <section id="charts">
        <Suspense fallback={<div className="panel">Loading charts...</div>}>
          <Visualizations />
        </Suspense>
      </section>
    </main>
  );
}

export default App;
