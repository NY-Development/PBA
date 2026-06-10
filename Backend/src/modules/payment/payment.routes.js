import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { PaymentController } from "./payment.controller.js";

const router = Router();

router.post(
  "/verify-cbe",
  protect,
  PaymentController.verifyCBE
);

router.post(
  "/verify-telebirr",
  protect,
  PaymentController.verifyTelebirr
);

router.post(
  "/verify-screenshot",
  upload.single("file"),
  PaymentController.verifyScreenshot
);

export default router; 