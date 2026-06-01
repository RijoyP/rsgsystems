export type DeviceStatus = "ok" | "warning" | "critical" | "offline";

export type DeviceType = "temperature" | "pressure" | "humidity" | "power" | "flow";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  value: number;
  unit: string;
  lastSeen: string;
}

export type EventSeverity = "info" | "warning" | "critical";

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
