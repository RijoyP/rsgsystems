export type DeviceStatus = "ok" | "warning" | "critical" | "offline";

export type EventSeverity = "info" | "warning" | "critical";

export interface Device {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  value: number;
  unit: string;
  lastSeen: string;
}

export interface MonitoringEvent {
  id: string;
  timestamp: string;
  severity: EventSeverity;
  source: string;
  message: string;
}

export interface SystemOverview {
  totalDevices: number;
  okDevices: number;
  warningDevices: number;
  criticalOrOfflineDevices: number;
}

export interface DashboardResponse {
  overview: SystemOverview;
  devices: Device[];
  events: MonitoringEvent[];
}
