import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { userBookings } from "../controllers/users.controller.js";

const router = Router();
router.get("/:id/bookings", requireAuth(), userBookings);
export default router;
