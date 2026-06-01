import { Router } from "express";
import { getDevices } from "../services/monitoringService";

const deviceRouter = Router();

deviceRouter.get("/", async (_req, res, next) => {
  try {
    const devices = await getDevices();
    res.json(devices);
  } catch (error) {
    next(error);
  }
});

export { deviceRouter };
