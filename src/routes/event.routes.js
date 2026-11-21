import { Router } from "express";
import eventController from "../controllers/event.controller.js";
import ticketController from "../controllers/ticket.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", eventController.getAll);
router.get("/:id", eventController.getById);

router.post(
  "/",
  requireAuth,
  authorizeRoles("organizer", "admin"),
  eventController.create,
);
router.put(
  "/:id",
  requireAuth,
  authorizeRoles("organizer", "admin"),
  eventController.update,
);
router.patch(
  "/:id/status",
  requireAuth,
  authorizeRoles("organizer", "admin"),
  eventController.updateStatus,
);

router.post("/:eid/tickets", requireAuth, ticketController.book);
router.get(
  "/:eid/tickets",
  requireAuth,
  authorizeRoles("organizer", "admin"),
  ticketController.getByEvent,
);

export default router;
