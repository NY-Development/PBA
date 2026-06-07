import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { AuthController } from "./auth.controller.js";
import { 
  registerSchema, 
  loginSchema,
  updateUserSchema
} from "./auth.validation.js";


const router = Router();

router.post(
  "/register", 
  validate(registerSchema), 
  AuthController.register
);

router.post(
  "/login", 
  validate(loginSchema), 
  AuthController.login
);

router.post(
  "/logout", 
  protect, 
  AuthController.logout
);

router.post(
  "/refresh", 
  protect, 
  AuthController.refresh
);

router.post(
  "/verify-email", 
  AuthController.verifyEmail
);

router.post(
  "/resend-otp", 
  AuthController.resendOTP
);

router.post(
  "/forgot-password", 
  AuthController.forgotPassword
);

router.post(
  "/reset-password", 
  AuthController.resetPassword
);

router.post(
  "/logout-all", 
  protect, 
  AuthController.logoutAll
);

router.get(
  "/me", 
  protect, 
  AuthController.getMe
);



router.patch(
  "/update", 
  protect,
  upload.single("avatar"),
  validate(updateUserSchema),
  AuthController.update
);




export default router;