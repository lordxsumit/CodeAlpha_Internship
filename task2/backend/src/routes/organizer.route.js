import { Router } from "express";
import { getCurrentOrganizer, loginOrganizer, registerOrganizer } from "../controllers/organizer.controller.js";
import { verifyOrganizer } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerOrganizer);
router.post("/login", loginOrganizer);
router.get("/me", verifyOrganizer, getCurrentOrganizer);

export default router;
