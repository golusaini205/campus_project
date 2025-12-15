import { Request, Response } from "express";
import { prisma } from "../db.js";

export async function userBookings(req: Request, res: Response) {
  const { id } = req.params;
  const user = (req as any).user;
  if (user.id !== id && user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

  const bookings = await prisma.booking.findMany({
    where: { userId: id },
    include: { resource: true },
    orderBy: { startTime: "desc" }
  });
  res.json({ bookings });
}
