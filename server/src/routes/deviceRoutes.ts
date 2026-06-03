import { Router } from "express";
import { requireDeviceReadRole } from "../auth/deviceReadAuth";
import { getDevices } from "../services/monitoringService";

const deviceRouter = Router();

deviceRouter.get("/", requireDeviceReadRole, async (_req, res, next) => {
  try {
    const devices = await getDevices();
    res.json(devices);
  } catch (error) {
    next(error);
  }
});

export { deviceRouter };
