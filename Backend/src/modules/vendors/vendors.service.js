import { randomUUID } from "crypto";
import { HashUtils } from "../../utils/hash.js";
import { CacheService } from "../../utils/cache.js";
import { JWT } from "../../utils/jwt.js";
import { VendorsRepository } from "./vendors.repository.js";
import { createOTP } from "../../services/otp/otp.service.js"
import { sendEmail } from "../../services/email/email.service.js"
import { 
  baseEmailTemplate,
} from "../../templates/email.template.js";
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
  
  sendEmail({
    to: "matusalasana@gmail.com",
    subject: "New Vendor Application",
    template: baseEmailTemplate({
      headerIcon: "📩",
      title: "New Vendor Application",
      subtitle: "waiting for your approval",
      message: `Store named ${store_name} applied to become vendor`,
    })
  })

  return vendor;
};

const verifyVendor = async({
  id
}) => {
  const vendor = await VendorsRepository.findVendorById(id);
  
  if(!vendor) throw new Error("Vendor not found");
  
  if(!vendor.status) throw new Error("Vendor status not found");
  
  const user = await VendorsRepository.findUserById(id);
  
  const verified = await VendorsRepository.verifyVendor(id)

  const notifyEmail = vendor.payout_email
    ? payout_email
    : user.email
  
  sendEmail({
    to: notifyEmail,
    subject: "Application Approved",
    template: baseEmailTemplate({
      logo: "",
      headerIcon: "✅",
      title: "Your application to become vendor has been approved",
      subtitle: "You can now sell your products",
      message: "Name sana matusala hdh djhjdj djdbdjd dtdbd adhdjdjjdksjdjdiejejdjr djd djdbd djd djd dbd dhd dbd dbd d dbd dnd dbd dbddjd dbdjd dbedjd d djdjdd d djdjdjd sjdbd dj dj ejrj eufuf hdjjd jrud",
      highlightContent: "your application is accepted",
      buttonText: "Now you're memeber of our clients",
      buttonUrl: "https://www.linkedin.com/in/sana-matusala-b111a7366",
    })
  })
};

export const VendorsService = {
  register,
  verifyVendor
}