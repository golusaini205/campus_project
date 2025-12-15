import { Request, Response } from "express";
import { prisma } from "../db.js";
import { bookSchema, updateBookingSchema } from "../validators/common.js";

export async function bookResource(req: Request, res: Response) {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { resourceId, startTime, endTime, notes } = parsed.data;
  const start = new Date(startTime), end = new Date(endTime);
  if (start >= end) return res.status(400).json({ error: "Invalid time range" });

  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource || !resource.isActive) return res.status(404).json({ error: "Resource not found" });

  const overlaps = await prisma.booking.findMany({
    where: {
      resourceId,
      status: { in: ["BOOKED", "COMPLETED"] },
      startTime: { lt: end },
      endTime: { gt: start },
    },
    take: 1
  });
  if (overlaps.length) return res.status(409).json({ error: "Slot not available" });

  const booking = await prisma.booking.create({
    data: {
      userId: (req as any).user.id,
      resourceId,
      startTime: start,
      endTime: end,
      notes,
    }
  });
  res.status(201).json({ booking });
}

export async function cancelBooking(req: Request, res: Response) {
  const { bookingId } = req.body;
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  const user = (req as any).user;
  if (booking.userId !== user.id && user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

  const updated = await prisma.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
  res.json({ booking: updated });
}

export async function updateBooking(req: Request, res: Response) {
  const parsed = updateBookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { bookingId, startTime, endTime, notes } = parsed.data;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  const user = (req as any).user;
  if (booking.userId !== user.id && user.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

  const newStart = startTime ? new Date(startTime) : booking.startTime;
  const newEnd = endTime ? new Date(endTime) : booking.endTime;
  if (newStart >= newEnd) return res.status(400).json({ error: "Invalid time range" });

  const overlaps = await prisma.booking.findMany({
    where: {
      resourceId: booking.resourceId,
      id: { not: booking.id },
      status: { in: ["BOOKED", "COMPLETED"] },
      startTime: { lt: newEnd },
      endTime: { gt: newStart },
    },
    take: 1
  });
  if (overlaps.length) return res.status(409).json({ error: "Slot not available" });

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { startTime: newStart, endTime: newEnd, notes }
  });
  res.json({ booking: updated });
}
