import { Router } from "express";
import { createEvent, getAllEvents, getEventById, registerForEvent } from "../controllers/event.controller.js";
import { verifyOrganizer } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllEvents).post(verifyOrganizer, createEvent);
router.route("/:eventId").get(getEventById);
router.route("/:eventId/register").post(registerForEvent);

export default router;
