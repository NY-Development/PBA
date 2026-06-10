import { PaymentService } from "./payment.service.js";
import logger from "../../utils/logger.js";

// CBE
const verifyCBE = async(req, res) => {
  try{
    const data = await PaymentService.verifyCBE({
      userId: req.user.userId,
      reference: req.body.reference,
      accountSuffix: req.body.accountSuffix,
      order_id: req.body.order_id
    });
    
    res.status(200).json(data);
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
    
    res.status(200).json(data);
  }catch(err){
    logger.error(
      `Error verifying payment: ${
        err.response?.data?.message || err.message
      }`
    );
  
    res.status(err.response?.status).json(err.response?.data);
  }
};

// SCREENSHOT VERIFY
const verifyScreenshot = async (req, res) => {
  try {
    const file = req.file;
    const data = await PaymentService.verifyScreenshot({
      file,
      suffix: req.body.suffix,
    });

    return res.status(200).json(data);

  } catch (err) {
  console.log("FULL API ERROR:", err.response?.data);

  logger.error(
    `Error verifying screenshot: ${
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message
    }`
  );

  return res.status(err.response?.status || 500).json({
    success: false,
    message:
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message,
  });
}
};


export const PaymentController = {
  verifyCBE,
  verifyTelebirr,
  verifyScreenshot,
};