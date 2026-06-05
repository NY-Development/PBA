import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { AuthController } from "./auth.controller.js"
import { registerSchema, loginSchema } from "./auth.validation.js"


const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/logout", protect, AuthController.logout);
router.patch("/update", protect, AuthController.update);
router.post("/refresh", protect, AuthController.refresh);
router.get("/me", protect, AuthController.getMe);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/resend-otp", AuthController.resendOTP);
router.post(
  "/profile-picture", 
  protect,
  authorize("customer"),
  upload.single("avatar"), 
  AuthController.updateProfilePicture
);

export default router;