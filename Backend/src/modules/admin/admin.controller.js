import { AdminService } from "./admin.service.js";
import logger from "../../utils/logger.js";

// GET VENDORS
const getVendors = async(req, res) => {
  try{
    const vendors = await AdminService.getVendors();
    
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




export const AdminController = {
  getVendors,
};