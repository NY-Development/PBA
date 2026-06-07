import axios from "axios";
import { Env } from "../../configs/env.js";
import { 
  sendEmail
} from "../../services/email/email.service.js";
import { baseEmailTemplate } from "../../templates/email.template.js";


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
  
  sendEmail({
    to: "matusalasana@gmail.com",
    subject: "Payment verified successfully",
  
    template: baseEmailTemplate({
      headerIcon: "✅",
      title: "You have successfully ordered the:",
      subtitle: "You can now track delivery.",
      greeting: "Hello Sana,",
      message: "Congratulations! Your application has been approved successfully.",
      highlightContent: "Your vendor account is now active. You can now:",
      alertType: "success",
      listItems: [
        "Add products",
        "Manage inventory",
        "Track orders",
        "Receive payouts",
      ],
      buttonText: "Open Dashboard",
      buttonUrl: "https://yourapp.com/vendor/dashboard",
      supportEmail: "support@yourapp.com",
      footerText: "Thank you for using PBA.",
    }),
  });
  
  return response.data;
};

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
};