import { Router } from "express";
import { getEvents } from "../services/monitoringService";
import { type EventSeverity } from "../types/monitoring";

const eventRouter = Router();

eventRouter.get("/", async (req, res, next) => {
  try {
    const severityQuery = req.query.severity;
    const events = await getEvents();

    if (
      typeof severityQuery === "string" &&
      ["info", "warning", "critical"].includes(severityQuery)
    ) {
      const filtered = events.filter(
        (event) => event.severity === (severityQuery as EventSeverity),
      );
      res.json(filtered);
      return;
    }

    res.json(events);
  } catch (error) {
    next(error);
  }
});

export { eventRouter };
