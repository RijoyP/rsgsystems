import { type Device, type SystemOverview } from "../types/monitoring";

export function calculateOverview(devices: Device[]): SystemOverview {
  const okDevices = devices.filter((device) => device.status === "ok").length;
  const warningDevices = devices.filter(
    (device) => device.status === "warning",
  ).length;
  const criticalOrOfflineDevices = devices.filter(
    (device) => device.status === "critical" || device.status === "offline",
  ).length;

  return {
    totalDevices: devices.length,
    okDevices,
    warningDevices,
    criticalOrOfflineDevices,
  };
}
