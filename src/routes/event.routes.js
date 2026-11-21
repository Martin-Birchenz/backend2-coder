import { Router } from "express";
import eventController from "../controllers/event.controller.js";
import ticketController from "../controllers/ticket.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Públicos
router.get("/", eventController.getAll);
router.get("/:id", eventController.getById);

// Protegidos (creación solo organizer o admin; modificación/cancelación validan dueño o admin en service)
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

// Rutas anidadas de tickets por evento
router.post("/:eid/tickets", requireAuth, ticketController.book);
router.get(
  "/:eid/tickets",
  requireAuth,
  authorizeRoles("organizer", "admin"),
  ticketController.getByEvent,
);

export default router;
