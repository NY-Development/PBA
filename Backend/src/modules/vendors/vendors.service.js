import { randomUUID } from "crypto";
import { HashUtils } from "../../utils/hash.js";
import { CacheService } from "../../utils/cache.js";
import { JWT } from "../../utils/jwt.js";
import { VendorsRepository } from "./vendors.repository.js";
import { createOTP } from "../../services/otp/otp.service.js"
import { sendVerificationEmail } from "../../services/email/email.service.js"
import { 
  uploadToCloudinary,
  deleteFromCloudinary
}  from "../../utils/cloudinary.js"

  
// REGISTER
const register = async ({
  userId,
  logo_buffer,
  banner_buffer,
  bodyData
}) => {
  const { 
    store_name,
    description,
    payout_email,
    tin_number
  } = bodyData;

  const existing = await VendorsRepository.findUserById(userId);

  if (!existing) {
    throw new Error("User doesn't exist, to become vendor, you must register first");
  }
  
  const vendorExists = await VendorsRepository.findVendorById
  if(vendorExists) throw new Error("you've already been registered as vendor")
  
  const logoResult = await uploadToCloudinary(logo_buffer, `vendors/logo-${userId}`)
  const bannerResult = await uploadToCloudinary(banner_buffer, `vendors/banner-${userId}`)

  const vendor = await VendorsRepository.register({
    userId,
    store_name,
    description,
    payout_email,
    tin_number,
    logo_url: logoResult.secure_url,
    banner_url: bannerResult.secure_url,
    logo_public_id: logoResult.public_id,
    banner_public_id: bannerResult.public_id,
  })
  
  sendVerificationEmail({
    to: "matusalasana@gmail.com",
    otp: "Vendor Application"
  })

  return vendor;
};

export const VendorsService = {
  register
}