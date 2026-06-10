import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { UsersController } from "./users.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { updateUserProfileSchema } from "./users.validation.js";
 
const router = Router();

router.get(
  "/profile", 
  protect, 
  UsersController.getUserProfile
);
 
router.patch(
  "/profile", 
  protect,
  upload.single("avatar"),
  validate(updateUserProfileSchema),
  UsersController.updateUserProfile
);

router.post(
  "/push-token", 
  protect, 
  UsersController.savePushToken
);

export default router;