import { useEffect, useState } from "react";
import { fetchDevicePage } from "../api/monitoringApi";
import { type Device } from "../types/monitoring";
import { formatTimestamp } from "../utils/date";

const PAGE_SIZE = 5;

export function DeviceTable() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDevices, setTotalDevices] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDevices() {
      try {
        setLoading(true);
        const result = await fetchDevicePage({ page, pageSize: PAGE_SIZE });
        setDevices(result.items);
        setTotalPages(result.totalPages);
        setTotalDevices(result.total);
      } catch {
        setError("Unable to load devices.");
      } finally {
        setLoading(false);
      }
    }

    void loadDevices();
  }, [page]);

  return (
    <section className="panel">
      <div className="section-header">
        <h2 className="panel-title">Device List</h2>
        <span className="chip">{totalDevices} devices</span>
      </div>

      {loading ? <p>Loading devices...</p> : null}
      {error ? <p>{error}</p> : null}

      <div className="table-wrap">
        <table className="device-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Current Value</th>
              <th>Status</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.name}</td>
                <td>{device.type}</td>
                <td>{`${device.value} ${device.unit}`}</td>
                <td>
                  <span className={`badge badge-${device.status}`}>
                    {device.status}
                  </span>
                </td>
                <td>{formatTimestamp(device.lastSeen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination" aria-label="Device pagination">
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
