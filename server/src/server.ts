import "./telemetry.js";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { app } from "./app";
import {
  calculateOverview,
  getDevices,
  getEvents,
  watchDataFiles,
} from "./services/monitoringService";

const PORT = Number(process.env.PORT) || 4000;

const httpServer = http.createServer(app);
const wss = new WebSocketServer({ server: httpServer });

function broadcast(data: unknown): void {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

async function broadcastLatest(): Promise<void> {
  const [devices, events] = await Promise.all([getDevices(), getEvents()]);
  const overview = calculateOverview(devices);
  broadcast({ type: "update", payload: { overview, devices, events } });
}

watchDataFiles(() => {
  void broadcastLatest();
});

httpServer.listen(PORT, () => {
  console.log(`Monitoring API is running on http://localhost:${PORT}`);
});
