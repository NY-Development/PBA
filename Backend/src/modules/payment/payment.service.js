import axios from "axios";
import { Env } from "../../configs/env.js";


const verifyCBE = async({
  userId,
  bodyData
}) => {
  
  const response = await axios.post(
      "https://verifyapi.leulzenebe.pro/verify-cbe",
      bodyData,
      {
         headers: {
            "x-api-key": `${Env.PAYMENT_API_KEY}`
         }
      }
   );
  
  return response.data;
}

export const PaymentService = {
  verifyCBE
}