import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { VendorsController } from "./vendors.controller.js"


const router = Router();

router.post(
  "/register", 
  protect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  VendorsController.register
);

export default router;