import { useEffect, useMemo, useState } from "react";
import { fetchDevices, fetchEvents } from "../api/monitoringApi";
import {
  type DashboardResponse,
  type EventSeverity,
  type MonitoringEvent,
} from "../types/monitoring";
import { calculateOverview } from "../utils/overview";

export function useDashboardData() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<EventSeverity | "all">(
    "all",
  );

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [devices, events] = await Promise.all([fetchDevices(), fetchEvents()]);
        setData({
          overview: calculateOverview(devices),
          devices,
          events,
        });
      } catch {
        setError("Unable to load devices/events data. Please check that the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const filteredEvents = useMemo((): MonitoringEvent[] => {
    if (!data) {
      return [];
    }

    if (severityFilter === "all") {
      return data.events;
    }

    return data.events.filter((event) => event.severity === severityFilter);
  }, [data, severityFilter]);

  return {
    data,
    loading,
    error,
    severityFilter,
    setSeverityFilter,
    filteredEvents,
  };
}
