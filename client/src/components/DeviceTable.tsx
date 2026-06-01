import { type Device } from "../types/monitoring";
import { formatTimestamp } from "../utils/date";

interface DeviceTableProps {
  devices: Device[];
}

export function DeviceTable({ devices }: DeviceTableProps) {
  return (
    <section className="panel">
      <div className="section-header">
        <h2 className="panel-title">Device List</h2>
        <span className="chip">{devices.length} devices</span>
      </div>
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
