import {
  type Device,
  type EventSeverity,
  type MonitoringEvent,
  type PaginatedResponse,
  type SystemOverview,
} from "../types/monitoring";

const DEVICES_ENDPOINT = "/api/devices";
const EVENTS_ENDPOINT = "/api/events";
const OVERVIEW_ENDPOINT = "/api/overview";
const DEVICE_READ_TOKEN =
  (globalThis as { __RSGSYSTEM_DEVICE_READ_TOKEN__?: string }).__RSGSYSTEM_DEVICE_READ_TOKEN__ ??
  "rsg-deviceread-token";

const inFlightRequests = new Map<string, Promise<unknown>>();

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

function toPaginatedEndpoint(endpoint: string, options: PaginationOptions): string {
  const params = new URLSearchParams({
    page: String(options.page),
    pageSize: String(options.pageSize),
  });

  return `${endpoint}?${params.toString()}`;
}

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

export async function fetchDevicePage(
  options: PaginationOptions,
): Promise<PaginatedResponse<Device>> {
  try {
    return await fetchJson<PaginatedResponse<Device>>(
      toPaginatedEndpoint(DEVICES_ENDPOINT, options),
      {
        headers: { Authorization: `Bearer ${DEVICE_READ_TOKEN}` },
      },
    );
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

export async function fetchEventPage(
  options: PaginationOptions,
  severity?: EventSeverity | "all",
): Promise<PaginatedResponse<MonitoringEvent>> {
  try {
    const params = new URLSearchParams({
      page: String(options.page),
      pageSize: String(options.pageSize),
    });

    if (severity && severity !== "all") {
      params.set("severity", severity);
    }

    return await fetchJson<PaginatedResponse<MonitoringEvent>>(`${EVENTS_ENDPOINT}?${params.toString()}`);
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
