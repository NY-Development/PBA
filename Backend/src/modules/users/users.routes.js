import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { UsersController } from "./users.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { updateUserProfileSchema } from "./users.validation.js";
 
const router = Router();

router.post(
  "/push-token", 
  protect, 
  UsersController.savePushToken
);

router.get(
  "/profile", 
  protect, 
  UsersController.getUserProfile
);
 
router.patch(
  "/profile", 
  protect,
  validate(updateUserProfileSchema),
  UsersController.updateUserProfile
);

router.patch(
  "/avatar", 
  protect,
  upload.single("avatar"),
  UsersController.uploadAvatar
);

router.get(
  "/addresses", 
  protect,
  UsersController.getAddresses
);

router.post(
  "/addresses", 
  protect,
  UsersController.createAddresses
);

router.get(
  "/addresses/:id", 
  protect,
  UsersController.getAddress
);

router.patch(
  "/addresses/:id", 
  protect,
  UsersController.updateAddress
);

router.delete(
  "/addresses/:id", 
  protect,
  UsersController.deleteAddress
);

router.get(
  "/notifications", 
  protect,
  UsersController.getNotifications
);


export default router;