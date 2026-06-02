import { useEffect, useState } from "react";
import { fetchOverview } from "../api/monitoringApi";
import { type DashboardResponse } from "../types/monitoring";

export function useDashboardData() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return {
    data,
    loading,
    error,
  };
}
