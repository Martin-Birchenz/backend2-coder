import { Router } from "express";
import ticketController from "../controllers/ticket.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/my-tickets", requireAuth, ticketController.getMyTickets);
router.patch("/:tid/cancel", requireAuth, ticketController.cancel);

export default router;
