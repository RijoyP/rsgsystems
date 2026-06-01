import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  type Device,
  type MonitoringEvent,
  type SystemOverview,
} from "../types/monitoring";

const DATA_DIR = path.resolve(__dirname, "..", "data");

function resolveDataPath(fileName: string): string {
  if (!existsSync(DATA_DIR)) {
    throw new Error(`Mock data directory not found: ${DATA_DIR}`);
  }

  return path.join(DATA_DIR, fileName);
}

async function readMockFile<T>(fileName: string): Promise<T> {
  const fullPath = resolveDataPath(fileName);
  const fileContent = await readFile(fullPath, "utf-8");
  return JSON.parse(fileContent) as T;
}

export async function getDevices(): Promise<Device[]> {
  return readMockFile<Device[]>("devices.json");
}

export async function getEvents(): Promise<MonitoringEvent[]> {
  const events = await readMockFile<MonitoringEvent[]>("events.json");

  return events.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

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
