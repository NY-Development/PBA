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
  license_buffer,
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
  
  const logoResult = await uploadToCloudinary(logo_buffer, `vendors/logo/${userId}`)
  const bannerResult = await uploadToCloudinary(banner_buffer, `vendors/banner/${userId}`)
  const licenseResult = await uploadToCloudinary(
    license_buffer, 
    `vendors/license/${userId}`,
    {
      type: "private"
    },
  )

  const vendor = await VendorsRepository.register({
    userId,
    store_name,
    description,
    payout_email,
    tin_number,
    license_type: licenseResult.resource_type,
    logo_url: logoResult.secure_url,
    banner_url: bannerResult.secure_url,
    license_public_id: licenseResult.public_id,
    logo_public_id: logoResult.public_id,
    banner_public_id: bannerResult.public_id,
  })
  
  sendEmail({
    to: "matusalasana@gmail.com",
    subject: "New Vendor Application",
    template: baseEmailTemplate({
      appName: "PBA",
      headerIcon: "📩",
      title: `${store_name} wants to join PBA`,
  
      subtitle: "Waiting for your approval.",
      greeting: `Hello,`,
      message: "Please verify the vendor documents uploaded and take necessary steps to proceed.",
      alertType: "info",
      buttonText: "Open Dashboard",
    }),
  });

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
    subject: "Vendor Application Approved",
    template: baseEmailTemplate({
      appName: "PBA",
      headerIcon: "✅",
      title: "Vendor Application Approved",
  
      subtitle: "You can now start selling products.",
      greeting: `${user.first_name},`,
      message: "Congratulations! Your application has been approved successfully. Yo can now:",
      highlightContent: "Your vendor account is now active.",
      alertType: "success",
      listItems: [
        "Add products",
        "Manage inventory",
        "Track orders",
        "Receive payouts",
      ],
      buttonText: "Open Dashboard",
      buttonUrl: "",
      supportEmail: "",
      footerText: "Thank you for joining us.",
    }),
  });
};

export const VendorsService = {
  register,
  verifyVendor
}