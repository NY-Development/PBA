import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import vendorsRoutes from "../modules/vendors/vendors.routes.js";
import paymentRoutes from "../modules/payment/payment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/vendors", vendorsRoutes);
router.use("/payment", paymentRoutes);

export default router