import { Router } from "express";
import { AuthController } from "./auth.controller.js"
const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
// router.post("/update", AuthController.update);
// router.post("/refresh", AuthController.refresh);
router.get("/me", AuthController.getMe);


export default router;