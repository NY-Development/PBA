import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { VendorsController } from "./vendors.controller.js";


const router = Router();


router.post(
  "/verify-vendor", 
  protect,
  authorize("admin"),
  VendorsController.verifyVendor);

router.post(
  "/register", 
  protect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  VendorsController.register
);

router.get(
  "/", 
  protect,
  authorize("admin"),
  VendorsController.getVendors
);


export default router;