import { VendorsService } from "./vendors.service.js";
import logger from "../../utils/logger.js"


// REGISTER
const register = async (req, res) => {
  try {
    const vendor = await VendorsService.register({
      userId: req.user.userId, 
      bodyData: req.body,
      logo_buffer: req.files.logo[0].buffer,
      banner_buffer: req.files.banner[0].buffer
    });

    return res.status(200).json({
      message: "Vendor registered successfully, waiting for admin approval",
      vendor
    });

  } catch (error) {
    logger.error("Error registering vendor:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

export const VendorsController = {
  register,
}