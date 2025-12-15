import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(role?: "ADMIN" | "FACULTY" | "STUDENT") {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
      (req as any).user = payload;
      if (role && payload.role !== role && payload.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
}
