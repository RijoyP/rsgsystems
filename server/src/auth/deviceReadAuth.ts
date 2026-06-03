import { type NextFunction, type Request, type Response } from "express";

type Role = "deviceread";

const DEVICE_READ_ROLE: Role = "deviceread";
const DEFAULT_DEVICE_READ_TOKEN = "rsg-deviceread-token";

const roleByToken = new Map<string, Set<Role>>([
  [process.env.DEVICE_READ_TOKEN ?? DEFAULT_DEVICE_READ_TOKEN, new Set([DEVICE_READ_ROLE])],
]);

function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export function requireDeviceReadRole(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.header("Authorization"));

  if (!token) {
    res.status(401).json({
      message: "Missing or invalid bearer token.",
    });
    return;
  }

  const roles = roleByToken.get(token);
  if (!roles || !roles.has(DEVICE_READ_ROLE)) {
    res.status(403).json({
      message: "Forbidden. Required role: deviceread.",
    });
    return;
  }

  next();
}

export { DEFAULT_DEVICE_READ_TOKEN, DEVICE_READ_ROLE };