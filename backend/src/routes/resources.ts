import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createResource, updateResource } from "../controllers/resources.controller.js";
import { deleteResource, filterResources, getResource, listResources, searchResources } from "../controllers/resources.controller.js";
import { bookResource, cancelBooking, updateBooking } from "../controllers/bookings.controller.js";

const router = Router();

router.get("/", listResources);
router.get("/:id", getResource);

router.post("/book", requireAuth(), bookResource);
router.post("/", requireAuth("ADMIN"), createResource);
router.put("/:id", requireAuth("ADMIN"), updateResource);
router.put("/:id/cancel", requireAuth(), cancelBooking);
router.put("/:id/update", requireAuth(), updateBooking);

router.get("/search", searchResources);
router.get("/filter", filterResources);

router.delete("/:id", requireAuth("ADMIN"), deleteResource);

export default router;
