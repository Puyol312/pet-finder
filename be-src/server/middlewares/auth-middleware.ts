import jwt from "jsonwebtoken";
import { SECRET } from "../../config";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Token not provided",
    });
  }
  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization header format",
    });
  }
  try {
    console.log(token);
    const payload = jwt.verify(token, SECRET) as { id: number };
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}