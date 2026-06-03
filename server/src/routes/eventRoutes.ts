import { Router } from "express";
import { getEvents } from "../services/monitoringService";
import { type EventSeverity } from "../types/monitoring";

const eventRouter = Router();

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

eventRouter.get("/", async (req, res, next) => {
  try {
    const severityQuery = req.query.severity;
    const page = parsePositiveInteger(req.query.page);
    const pageSize = parsePositiveInteger(req.query.pageSize);
    const events = await getEvents();

    let result = events;

    if (
      typeof severityQuery === "string" &&
      ["info", "warning", "critical"].includes(severityQuery)
    ) {
      result = events.filter(
        (event) => event.severity === (severityQuery as EventSeverity),
      );
    }

    if (page === null || pageSize === null) {
      res.json(result);
      return;
    }

    const total = result.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const items = result.slice(start, start + pageSize);

    res.json({
      items,
      page: safePage,
      pageSize,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
});

export { eventRouter };
