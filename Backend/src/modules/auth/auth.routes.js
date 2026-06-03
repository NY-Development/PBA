import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware.js"
import { AuthController } from "./auth.controller.js"
const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", protect, AuthController.logout);
// router.post("/update", AuthController.update);
// router.post("/refresh", AuthController.refresh);
router.get("/me", protect, AuthController.getMe);

export default router;