import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { UsersController } from "./users.controller.js";

const router = Router();


router.post(
  "/push-token", 
  protect, 
  UsersController.savePushToken
);

export default router;