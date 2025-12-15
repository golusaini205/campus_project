import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const bookSchema = z.object({
  resourceId: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  notes: z.string().optional(),
});

export const updateBookingSchema = z.object({
  bookingId: z.string().min(1),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  notes: z.string().optional(),
});
