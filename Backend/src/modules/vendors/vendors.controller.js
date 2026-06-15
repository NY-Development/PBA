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

// UPDATE VENDOR PROFILE 
const updateProfile = async(req, res) => {
  try{
    const updated = await VendorsService.updateProfile({
      userId: req.user.userId,
      body: req.body
    });
    
    res.status(200).json({
      success: true,
      updated
    });
  }catch(err){
    logger.error(`Error updating vendor profile: ${err.cause || err.message}`);
    
    res.status(400).json({
      success: false,
      message: err.cause || err.message
    });
  }
};

// UPLOAD LOGO 
const uploadLogo = async(req, res) => {
  try{
    const { message } = await VendorsService.uploadLogo({
      userId: req.user.userId,
      logo_buffer: req.file?.buffer,
    });
    
    res.status(200).json({
      success: true,
      message
    });
  }catch(err){
    logger.error(`Error uploading logo: ${err.cause || err.message}`);
    
    res.status(400).json({
      success: false,
      message: err.cause || err.message
    });
  }
};

// UPLOAD BANNER 
const uploadBanner = async(req, res) => {
  try{
    const { message } = await VendorsService.uploadBanner({
      userId: req.user.userId,
      banner_buffer: req.file?.buffer,
    });
    
    res.status(200).json({
      success: true,
      message
    });
  }catch(err){
    logger.error(`Error uploading banner: ${err.cause || err.message}`);
    
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
  updateProfile,
  uploadLogo,
  uploadBanner
};