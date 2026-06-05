import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const paymentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    
    return {
      folder: `payments/${req.params.orderId}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
      public_id: `screenshot_${Date.now()}`,
      resource_type: isPdf ? "raw" : "image",
      type: "private",
    };
  },
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `products/${req.user.id}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: `product_${Date.now()}`,
  }),
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `profiles/${req.user.id}`,
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: `avatar_${Date.now()}`,
    transformation: [{ width: 500, height: 500, crop: "fill" }] // Auto-resize
  }),
});




export const uploadPaymentScreenshot = multer({
  storage: paymentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadProductImages = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadProfilePicture = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});