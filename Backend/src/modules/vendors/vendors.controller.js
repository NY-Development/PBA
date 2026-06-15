import { VendorsService } from "./vendors.service.js";
import logger from "../../utils/logger.js";

// VERIFY VENDOR
const verifyVendor = async(req, res) => {
  try{
    const data = await VendorsService.verifyVendor(req.body);
    
    res.status(200).json({
      success: true,
      data
    });
  }catch(err){
    logger.error(`Error verifying vendor: ${err.message}`);
    
    res.status(400).json({
      message: err.message
    });
  }
};

// REGISTER
const register = async (req, res) => {
  try {
    const vendor = await VendorsService.register({
      userId: req.user.userId, 
      bodyData: req.body,
      logo_buffer: req.files?.logo?.[0]?.buffer,
      banner_buffer: req.files?.banner?.[0]?.buffer,
      license_buffer: req.files?.license?.[0]?.buffer,
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

// GET VENDORS
const getVendors = async(req, res) => {
  try{
    const vendors = await VendorsService.getVendors();
    
    res.status(200).json({
      success: true,
      vendors
    });
  }catch(err){
    logger.error(`Error getting vendors: ${err.cause || err.message}`);
    
    res.status(400).json({
      success: false,
      message: err.cause || err.message
    });
  }
};



export const VendorsController = {
  verifyVendor,
  register,
  getVendors,
};