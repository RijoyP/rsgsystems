import { type Device, type MonitoringEvent, type SystemOverview } from "../types/monitoring";

const DEVICES_ENDPOINT = "/api/devices";
const EVENTS_ENDPOINT = "/api/events";
const OVERVIEW_ENDPOINT = "/api/overview";
const DEVICE_READ_TOKEN =
  (globalThis as { __RSGSYSTEM_DEVICE_READ_TOKEN__?: string }).__RSGSYSTEM_DEVICE_READ_TOKEN__ ??
  "rsg-deviceread-token";

const inFlightRequests = new Map<string, Promise<unknown>>();

async function fetchJson<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const existingRequest = inFlightRequests.get(endpoint);
  if (existingRequest) {
    return existingRequest as Promise<T>;
  }

  const request = (async () => {
    const response = await fetch(endpoint, init);

    if (!response.ok) {
      throw new Error(`Request failed for ${endpoint}`);
    }

    return (await response.json()) as T;
  })();

  inFlightRequests.set(endpoint, request);

  try {
    return await request;
  } finally {
    inFlightRequests.delete(endpoint);
  }
}

export async function fetchDevices(): Promise<Device[]> {
  try {
    return await fetchJson<Device[]>(DEVICES_ENDPOINT, {
      headers: { Authorization: `Bearer ${DEVICE_READ_TOKEN}` },
    });
  } catch {
    throw new Error("Unable to load device list.");
  }
}

export async function fetchEvents(): Promise<MonitoringEvent[]> {
  try {
    return await fetchJson<MonitoringEvent[]>(EVENTS_ENDPOINT);
  } catch {
    throw new Error("Unable to load event list.");
  }
}

export async function fetchOverview(): Promise<SystemOverview> {
  try {
    return await fetchJson<SystemOverview>(OVERVIEW_ENDPOINT);
  } catch {
    throw new Error("Unable to load overview data.");
  }
}
