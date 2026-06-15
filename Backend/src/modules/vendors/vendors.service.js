import { VendorsRepository } from "./vendors.repository.js";
import { sendEmail } from "../../services/email/email.service.js";
import {
  uploadToCloudinary,
} from "../../utils/cloudinary.js";
import {
  baseEmailTemplate,
} from "../../templates/email.template.js";


// VERIFY VENDOR
const verifyVendor = async ({ id }) => {

  const vendor =
    await VendorsRepository.findVendorById(id);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status === "verified") {
    throw new Error("Vendor already verified");
  }

  const user =
    await VendorsRepository.findUserById(vendor.userId);

  const verifiedVendor =
    await VendorsRepository.verifyVendor(id);

  const notifyEmail =
    vendor.payoutEmail || user.email;

  await sendEmail({
    to: notifyEmail,

    subject: "Vendor Application Approved",

    template: baseEmailTemplate({
      appName: "PBA",

      headerIcon: "✅",

      title: "Vendor Application Approved",

      subtitle:
        "You can now start selling products.",

      greeting: `${user.firstName},`,

      message:
        "Congratulations! Your application has been approved successfully.",

      highlightContent:
        "Your vendor account is now active.",

      alertType: "success",

      listItems: [
        "Add products",
        "Manage inventory",
        "Track orders",
        "Receive payouts",
      ],

      buttonText: "Open Dashboard",
    }),
  });

  return verifiedVendor;
};

// REGISTER
const register = async ({
  userId,
  logo_buffer,
  banner_buffer,
  license_buffer,
  bodyData,
}) => {

  const {
    storeName,
    description,
    payoutEmail,
    tinNumber,
  } = bodyData;
  
  if(!userId){
    throw new Error("User id is required");
  }
  
  if (!logo_buffer) {
    throw new Error("Logo is required");
  }
  
  if (!banner_buffer) {
    throw new Error("Banner is required");
  }
  
  if (!license_buffer) {
    throw new Error("License document is required");
  }

  const existingUser =
    await VendorsRepository.findUserById(userId);

  if (!existingUser) {
    throw new Error(
      "User doesn't exist"
    );
  }

  const existingVendor =
    await VendorsRepository.findVendorByUserId(userId);

  if (existingVendor) {
    throw new Error(
      "You've already registered as vendor"
    );
  }

  // Upload files
  const logoResult = await uploadToCloudinary(
    logo_buffer,
    `vendors/logo/${userId}`
  );

  const bannerResult = await uploadToCloudinary(
    banner_buffer,
    `vendors/banner/${userId}`
  );

  const licenseResult = await uploadToCloudinary(
    license_buffer,
    `vendors/license/${userId}`,
    {
      type: "private",
    }
  );

  // Save vendor
  const vendor = await VendorsRepository.register({
    userId,

    storeName,
    description,

    payoutEmail,

    tinNumber,

    status: "pending",

    logoUrl: logoResult.secure_url,
    bannerUrl: bannerResult.secure_url,

    logoPublicId: logoResult.public_id,
    bannerPublicId: bannerResult.public_id,

    licensePublicId: licenseResult.public_id,
  });

  // Notify admin
  await sendEmail({
    to: "matusalasana@gmail.com",

    subject: "New Vendor Application",

    template: baseEmailTemplate({
      appName: "PBA",

      headerIcon: "📩",

      title: `${storeName} wants to join PBA`,

      subtitle: "Waiting for approval.",

      greeting: "Hello,",

      message:
        "Please review the uploaded vendor documents.",

      alertType: "info",

      buttonText: "Open Dashboard",
    }),
  });

  return vendor;
};

// GET VENDORS 
const getVendors = async() => {
  const result = await VendorsRepository.getVendors();
  
  return result;
};

// UPDATE VENDOR PROFILE
const updateProfile = async({
  userId,
  body
}) => {
  if(!userId) throw new Error("User id not found");
  
  const user = await VendorsRepository.findUserById(userId);
  
  if(!user) throw new Error("User not found");
  if(!user.isActive) throw new Error("Your account is temporarily locked/inactive");
  
  const vendor = await VendorsRepository.findVendorByUserId(userId);
  if(!vendor) throw new Error("Vendor not found");
  
  const allowedStates = ['pending', 'inactive', 'active'];
  if(!allowedStates.includes(vendor.status.toLowerCase())){
    throw new Error("Your Account status doesn't allow you to perform this action");
  };
  
  const { storeName, description } = body;
  
  const data = {};
  
  if(storeName !== undefined){
    data.storeName = storeName;
  }
  if(description !== undefined){
    data.description = description;
  }
  
  if (Object.keys(data).length === 0) {
    throw new Error('No data provided to update');
  }
  
  
  const result = await VendorsRepository.updateProfile({
    userId,
    data
  });
  
  return result;
};

export const VendorsService = {
  verifyVendor,
  register,
  getVendors,
  updateProfile,
};