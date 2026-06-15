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
    { name: "license", maxCount: 1 }
  ]),
  VendorsController.register
);

router.get(
  "/", 
  protect,
  authorize("admin"),
  VendorsController.getVendors
);

router.patch(
  "/profile", 
  protect,
  authorize("vendor"),
  VendorsController.updateProfile
);

router.patch(
  "/logo", 
  protect,
  authorize("vendor"),
  upload.single("logo"),
  VendorsController.uploadLogo
);

router.patch(
  "/banner", 
  protect,
  authorize("vendor"),
  upload.single("banner"),
  VendorsController.uploadBanner
);


export default router;