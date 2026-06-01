import cors from "cors";
import express from "express";
import { type NextFunction, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { deviceRouter } from "./routes/deviceRoutes";
import { eventRouter } from "./routes/eventRoutes";
import { monitoringRouter } from "./routes/monitoringRoutes";
import { swaggerDocument } from "./swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerDocument);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", monitoringRouter);
app.use("/api/devices", deviceRouter);
app.use("/api/events", eventRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  res.status(500).json({
    message: "Unexpected server error.",
  });
});

export { app };
