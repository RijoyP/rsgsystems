import { type Device, type MonitoringEvent } from "../types/monitoring";

const DEVICES_ENDPOINT = "/api/devices";
const EVENTS_ENDPOINT = "/api/events";

export async function fetchDevices(): Promise<Device[]> {
  const response = await fetch(DEVICES_ENDPOINT);

  if (!response.ok) {
    throw new Error("Unable to load device list.");
  }

  return (await response.json()) as Device[];
}

export async function fetchEvents(): Promise<MonitoringEvent[]> {
  const response = await fetch(EVENTS_ENDPOINT);

  if (!response.ok) {
    throw new Error("Unable to load event list.");
  }

  return (await response.json()) as MonitoringEvent[];
}
