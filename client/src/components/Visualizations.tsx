import { useEffect, useState } from "react";
import { fetchDevices, fetchEvents } from "../api/monitoringApi";
import { type Device, type MonitoringEvent } from "../types/monitoring";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function Visualizations() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVisualizationData() {
      try {
        setLoading(true);
        const [deviceList, eventList] = await Promise.all([fetchDevices(), fetchEvents()]);
        setDevices(deviceList);
        setEvents(eventList);
      } catch {
        setError("Unable to load chart data.");
      } finally {
        setLoading(false);
      }
    }

    void loadVisualizationData();
  }, []);

  if (loading) {
    return <section className="panel visual-panel">Loading charts...</section>;
  }

  if (error) {
    return <section className="panel visual-panel">{error}</section>;
  }

  const deviceValueData = devices.map((device) => ({
    name: device.name,
    value: Number(device.value.toFixed(2)),
  }));

  const severityData = [
    {
      name: "info",
      value: events.filter((event) => event.severity === "info").length,
      color: "#5f9ed1",
    },
    {
      name: "warning",
      value: events.filter((event) => event.severity === "warning").length,
      color: "#e8a439",
    },
    {
      name: "critical",
      value: events.filter((event) => event.severity === "critical").length,
      color: "#d34f4f",
    },
  ];

  const formatSeverityName = (name: string): string =>
    name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <section className="panel visual-panel">
      <h2 className="panel-title">Charts (Recharts)</h2>
      <div className="viz-grid">
        <article>
          <h3>Device Value Comparison</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deviceValueData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#cc7f10" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article>
          <h3>Event Severity Distribution</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value, percent }) => {
                    if (!name || typeof value !== "number") {
                      return "";
                    }

                    const percentage = typeof percent === "number"
                      ? Math.round(percent * 100)
                      : 0;

                    return `${formatSeverityName(String(name))}: ${value} (${percentage}%)`;
                  }}
                >
                  {severityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}
