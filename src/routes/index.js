import { Router } from "express";
import sessionRoutes from "./session.routes.js";
import eventRoutes from "./event.routes.js";
import ticketRoutes from "./ticket.routes.js";

const router = Router();

router.use("/sessions", sessionRoutes);
router.use("/events", eventRoutes);
router.use("/tickets", ticketRoutes);

export default router;
