import { AdminRepository } from "./admin.repository.js";
import { sendEmail } from "../../services/email/email.service.js";


// GET VENDORS 
const getVendors = async() => {
  const result = await AdminRepository.getVendors();
  
  return result;
};



export const AdminService = {
  getVendors,
};