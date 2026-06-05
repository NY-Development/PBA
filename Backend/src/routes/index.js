import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import vendorsRoutes from "../modules/vendors/vendors.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/vendors", vendorsRoutes);

export default router