import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { AuthController } from "./auth.controller.js";
import { 
  registerSchema, 
  loginSchema
} from "./auth.validation.js";


const router = Router();

router.post(
  "/register-customer", 
  validate(registerSchema), 
  AuthController.registerCustomer
);

router.post(
  "/register-vendor", 
  validate(registerSchema), 
  AuthController.registerVendor
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
  "/logout-all", 
  protect, 
  AuthController.logoutAll
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

router.get(
  "/me", 
  protect, 
  AuthController.getMe
);




export default router;