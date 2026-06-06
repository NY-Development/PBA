import axios from "axios";
import { Env } from "../../configs/env.js";
import { 
  sendEmail
} from "../../services/email/email.service.js";
import { 
  verificationEmailTemplate,
  paymentSuccessTemplate,
} from "../../templates/email.template.js";


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
  
  await sendEmail({
    to: "matusalasana@gmail.com",
    subject: "Payment verified",
    template: paymentSuccessTemplate({
      customerName: "Sana Matusala",
      amount: "3000",
      orderId: "cbe-1346788"
    })
  })
  
  return response.data;
}

const verifyTelebirr = async({
  userId,
  bodyData
}) => {
  const response = await axios.post(
      "https://verifyapi.leulzenebe.pro/verify-telebirr",
      bodyData,
      {
         headers: {
            "x-api-key": `${Env.PAYMENT_API_KEY}`
         }
      }
   );
  
  return response.data;
};



export const PaymentService = {
  verifyCBE,
  verifyTelebirr
}