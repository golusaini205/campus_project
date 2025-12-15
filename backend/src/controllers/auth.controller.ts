import { Request, Response } from "express";
import { prisma } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema, signupSchema } from "../validators/common.js";

export async function signup(req: Request, res: Response) {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash, role: "STUDENT" } });
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not configured" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not configured" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
