import axios from "axios";
import { Env } from "../../configs/env.js";
import { AuthRepository } from "../auth/auth.repository.js"
import { 
  sendEmail
} from "../../services/email/email.service.js";
import { baseEmailTemplate } from "../../templates/email.template.js";


const verifyCBE = async({
  userId,
  reference,
  accountSuffix,
  order_id
}) => {
  
  if(!userId) throw new Error("User id is required");
  
  if(!reference || !accountSuffix || !order_id) throw new Error("Missing required fields");
  
  const order = await OrderRepository.findById(order_id);
  
  if (!order) {
      throw new Error("Order not found");
   }

   if (order.status === "paid") {
      throw new Error("Already paid");
   }

   const existing = 
    await PaymentRepository.findByReference(reference);

   if (existing) {
      throw new Error("Reference already used");
   }
  
  const response = await axios.post(
      "https://verifyapi.leulzenebe.pro/verify-cbe",
      {reference, accountSuffix},
      {
         headers: {
            "x-api-key": `${Env.PAYMENT_API_KEY}`
         }
      }
   );
   
   const data = response.data;
   
   if(!response.data.success) throw new Error("Verification failed");
   
   if(data.amount !== order.total) {
     throw new Error("Amount mismatch");
   };
   
   const user = await AuthRepository.findUserById(userId);
  
   if(!user) throw new Error("User not found");
   
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