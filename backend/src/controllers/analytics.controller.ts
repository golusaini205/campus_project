import { Request, Response } from "express";
import { prisma } from "../db.js";

export async function usageAnalytics(req: Request, res: Response) {
  const { from, to, granularity = "day" } = req.query as Record<string, string>;
  const start = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = to ? new Date(to) : new Date();

  const bookings = await prisma.booking.findMany({
    where: { createdAt: { gte: start, lte: end }, status: { in: ["BOOKED", "COMPLETED"] } },
    select: { createdAt: true, resourceId: true }
  });

  const byDate: Record<string, number> = {};
  for (const b of bookings) {
    const key = granularity === "week"
      ? weekKey(b.createdAt)
      : granularity === "month"
      ? monthKey(b.createdAt)
      : dateKey(b.createdAt);
    byDate[key] = (byDate[key] || 0) + 1;
  }

  const points = Object.entries(byDate)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, count]) => ({ date, count }));

  res.json({ data: points });
}

function dateKey(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString(); }
function monthKey(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1).toISOString(); }
function weekKey(d: Date) {
  const tmp = new Date(d);
  const day = tmp.getDay();
  const diff = tmp.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  const monday = new Date(tmp.setDate(diff));
  return new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()).toISOString();
}

export async function topRooms(req: Request, res: Response) {
  const { limit = "5" } = req.query as Record<string, string>;
  const grouped = await prisma.booking.groupBy({
    by: ["resourceId"],
    where: { status: { in: ["BOOKED", "COMPLETED"] } },
    _count: { resourceId: true },
    orderBy: { _count: { resourceId: "desc" } },
    take: parseInt(limit)
  });

  const resources = await prisma.resource.findMany({
    where: { id: { in: grouped.map(g => g.resourceId) } },
    select: { id: true, name: true }
  });

  const nameMap = Object.fromEntries(resources.map(r => [r.id, r.name]));
  const data = grouped.map(g => ({ id: g.resourceId, name: nameMap[g.resourceId] || g.resourceId, count: g._count.resourceId }));
  res.json({ data });
}
