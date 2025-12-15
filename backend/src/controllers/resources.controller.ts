import { Request, Response } from "express";
import { prisma } from "../db.js";

export async function createResource(req: Request, res: Response) {
  const { name, type, location, capacity, images = [], amenities = [] } = req.body;
  if (!name || !type || !location || !capacity) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const resource = await prisma.resource.create({
    data: { name, type: type.toUpperCase(), location, capacity, images, amenities, isActive: true }
  });
  res.status(201).json({ resource });
}

export async function updateResource(req: Request, res: Response) {
  const { id } = req.params;
  const { name, type, location, capacity, images, amenities, isActive } = req.body;
  const resource = await prisma.resource.update({
    where: { id },
    data: { name, type, location, capacity, images, amenities, isActive }
  });
  res.json({ resource });
}

export async function listResources(req: Request, res: Response) {
  const { page = "1", limit = "10", type, q } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where: any = { isActive: true };
  if (type) where.type = type.toUpperCase();
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { location: { contains: q, mode: "insensitive" } }];

  const [items, total] = await prisma.$transaction([
    prisma.resource.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: "desc" } }),
    prisma.resource.count({ where }),
  ]);

  res.json({ items, page: parseInt(page), total });
}

export async function getResource(req: Request, res: Response) {
  const { id } = req.params;
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource || !resource.isActive) return res.status(404).json({ error: "Resource not found" });
  res.json({ resource });
}

export async function searchResources(req: Request, res: Response) {
  const { query } = req.query as Record<string, string>;
  if (!query) return res.status(400).json({ error: "Missing query" });
  const items = await prisma.resource.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } }
      ],
    }
  });
  res.json({ items });
}

export async function filterResources(req: Request, res: Response) {
  const { type, status } = req.query as Record<string, string>;
  const where: any = {};
  if (type) where.type = type.toUpperCase();
  if (status) where.isActive = status.toLowerCase() === "active";
  const items = await prisma.resource.findMany({ where });
  res.json({ items });
}

export async function deleteResource(req: Request, res: Response) {
  const { id } = req.params;
  const resource = await prisma.resource.update({ where: { id }, data: { isActive: false } });
  res.json({ resource });
}
