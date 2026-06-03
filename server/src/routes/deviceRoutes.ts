import { Router } from "express";
import { requireDeviceReadRole } from "../auth/deviceReadAuth";
import { getDevices } from "../services/monitoringService";

const deviceRouter = Router();

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

deviceRouter.get("/", requireDeviceReadRole, async (req, res, next) => {
  try {
    const devices = await getDevices();

    const page = parsePositiveInteger(req.query.page);
    const pageSize = parsePositiveInteger(req.query.pageSize);

    if (page === null || pageSize === null) {
      res.json(devices);
      return;
    }

    const total = devices.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const items = devices.slice(start, start + pageSize);

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

export { deviceRouter };
