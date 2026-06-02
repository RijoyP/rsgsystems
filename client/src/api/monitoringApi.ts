import { type Device, type MonitoringEvent, type SystemOverview } from "../types/monitoring";

const DEVICES_ENDPOINT = "/api/devices";
const EVENTS_ENDPOINT = "/api/events";
const OVERVIEW_ENDPOINT = "/api/overview";

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

export async function fetchOverview(): Promise<SystemOverview> {
  const response = await fetch(OVERVIEW_ENDPOINT);

  if (!response.ok) {
    throw new Error("Unable to load overview data.");
  }

  return (await response.json()) as SystemOverview;
}
