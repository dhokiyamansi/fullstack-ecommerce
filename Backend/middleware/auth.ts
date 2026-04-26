import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";

const getJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env");
  }
  return secret;
};

const getAuthToken = (authorizationHeader: string | undefined): string | null => {
  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() === "bearer" && token) {
    return token;
  }

  return authorizationHeader;
};

const hasUserId = (payload: JwtPayload): payload is JwtPayload & { id: string } =>
  typeof payload.id === "string" && payload.id.length > 0;

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = getAuthToken(req.header("Authorization"));
  if (!token) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  try {
    const verified = jwt.verify(token, getJwtSecret());
    if (typeof verified === "string" || !hasUserId(verified)) {
      res.status(400).json({ message: "Invalid Token" });
      return;
    }

    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;
