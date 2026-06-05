import { PaymentService } from "./payment.service.js";
import logger from "../../utils/logger.js";

const verifyCBE = async(req, res) => {
  try{
    const data = await PaymentService.verifyCBE({
      userId: req.user.userId,
      bodyData: req.body
    })
    
    res.status(200).json({
      message: "Payment is pending, you'll receive notification once confirmed",
      data
    })
  }catch(err){
  console.log(err.response?.data);

  logger.error(
    `Error verifying CBE payment: ${
      err.response?.data?.message || err.message
    }`
  );
    
    res.status(500).json({
      message: err.message
    })
  }
}



export const PaymentController = {
  verifyCBE,
}