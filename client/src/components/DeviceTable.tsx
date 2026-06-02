import { useEffect, useState } from "react";
import { fetchDevices } from "../api/monitoringApi";
import { type Device } from "../types/monitoring";
import { formatTimestamp } from "../utils/date";

export function DeviceTable() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDevices() {
      try {
        setLoading(true);
        const result = await fetchDevices();
        setDevices(result);
      } catch {
        setError("Unable to load devices.");
      } finally {
        setLoading(false);
      }
    }

    void loadDevices();
  }, []);

  return (
    <section className="panel">
      <div className="section-header">
        <h2 className="panel-title">Device List</h2>
        <span className="chip">{devices.length} devices</span>
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
    </section>
  );
}
