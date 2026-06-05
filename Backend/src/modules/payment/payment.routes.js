import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { PaymentController } from "./payment.controller.js"


const router = Router();

router.post("/verify-cbe", protect, PaymentController.verifyCBE);

export default router;