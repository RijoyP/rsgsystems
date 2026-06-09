import { readFile } from "node:fs/promises";
import { existsSync, watch } from "node:fs";
import path from "node:path";
import {
  type Device,
  type MonitoringEvent,
  type SystemOverview,
} from "../types/monitoring";

const DATA_DIR_CANDIDATES = [
  path.resolve(process.cwd(), "src", "data"),
  path.resolve(process.cwd(), "server", "src", "data"),
  path.resolve(process.cwd(), "dist", "data"),
  path.resolve(process.cwd(), "server", "dist", "data"),
  path.resolve(__dirname, "..", "data"),
];

function resolveDataDir(): string {
  const dataDir = DATA_DIR_CANDIDATES.find((candidate) => existsSync(candidate));

  if (!dataDir) {
    throw new Error(
      `Mock data directory not found. Checked: ${DATA_DIR_CANDIDATES.join(", ")}`,
    );
  }

  return dataDir;
}

const DATA_DIR = resolveDataDir();

function resolveDataPath(fileName: string): string {
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

export function watchDataFiles(callback: () => void): void {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const trigger = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, 150);
  };

  watch(resolveDataPath("devices.json"), trigger);
  watch(resolveDataPath("events.json"), trigger);
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
