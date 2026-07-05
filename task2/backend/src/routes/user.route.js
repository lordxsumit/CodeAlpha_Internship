import { Router } from "express";
import { cancelRegistration, getUserRegistrations } from "../controllers/user.controller.js";

const router = Router();

router.route("/:email/registrations").get(getUserRegistrations);
router.route("/:email/registrations/:eventId").delete(cancelRegistration);

export default router;
