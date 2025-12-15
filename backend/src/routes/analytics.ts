import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { topRooms, usageAnalytics } from "../controllers/analytics.controller.js";

const router = Router();
router.get("/usage", requireAuth(), usageAnalytics);
router.get("/top-rooms", requireAuth(), topRooms);
export default router;
