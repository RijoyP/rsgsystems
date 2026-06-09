import { useEffect, useState } from "react";
import { fetchOverview } from "../api/monitoringApi";
import { type DashboardResponse, type SystemOverview } from "../types/monitoring";

const WS_URL = `ws://${window.location.hostname}:4000`;

export function useDashboardData() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const overview = await fetchOverview();
        setData({ overview });
      } catch {
        setError("Unable to load overview data. Please check that the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as {
          type: string;
          payload: { overview: SystemOverview };
        };

        if (message.type === "update") {
          setData({ overview: message.payload.overview });
          setRefreshSignal((prev) => prev + 1);
        }
      } catch {
        // ignore malformed messages
      }
    };

    return () => ws.close();
  }, []);

  return { data, loading, error, refreshSignal };
}
