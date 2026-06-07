import { PaymentService } from "./payment.service.js";
import logger from "../../utils/logger.js";

// CBE
const verifyCBE = async(req, res) => {
  try{
    const data = await PaymentService.verifyCBE({
      userId: req.user.userId,
      bodyData: req.body
    });
    
    res.status(200).json({
      message: "Payment verified successfully",
      data
    });
  }catch(err){
    logger.error(
      `Error verifying payment: ${
        err.response?.data?.message || err.message
      }`
    );
  
    res.status(err.response?.status).json(err.response?.data);
  }
};

// TELEBIRR 
const verifyTelebirr = async(req, res) => {
  try{
    const data = await PaymentService.verifyTelebirr({
      userId: req.user.userId,
      bodyData: req.body
    });
    
    res.status(200).json({
      message: "Payment verified successfully",
      data
    });
  }catch(err){
    logger.error(
      `Error verifying payment: ${
        err.response?.data?.message || err.message
      }`
    );
  
    res.status(err.response?.status).json(err.response?.data);
  }
};


export const PaymentController = {
  verifyCBE,
  verifyTelebirr
};