import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { AdminController } from "./admin.controller.js";


const router = Router();

// GET ALL VENDORS
router.get(
  "/vendors", 
  protect,
  authorize("admin"),
  AdminController.getVendors);
  
  
  
  
  export default router;