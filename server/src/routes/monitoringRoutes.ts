import { Router } from "express";
import { getDevices, calculateOverview } from "../services/monitoringService";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/overview", async (_req, res, next) => {
  try {
    const devices = await getDevices();
    res.json(calculateOverview(devices));
  } catch (error) {
    next(error);
  }
});

export { router as monitoringRouter };
