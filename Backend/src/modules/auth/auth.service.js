import { randomUUID } from "crypto";
import { HashUtils } from "../../utils/hash.js";
import { CacheService } from "../../utils/cache.js";
import { JWT } from "../../utils/jwt.js";
import { AuthRepository } from "./auth.repository.js";
import { OTPRepository } from "../../services/otp/otp.service.js";
import { generateOTP } from "../../services/otp/otp.service.js";
import { sendEmail } from "../../services/email/email.service.js";
import { baseEmailTemplate } from "../../templates/email.template.js";
import { 
  uploadToCloudinary,
  deleteFromCloudinary
}  from "../../utils/cloudinary.js";


// REGISTER CUSTOMER 
const registerCustomer = async ({ 
  firstName, 
  lastName, 
  email, 
  password,
}) => {

  const existing = await AuthRepository.findUserByEmail(email);

  if (existing) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await HashUtils.hashPassword(password);
    
  const otp = generateOTP();
  
  const hashedOTP = await HashUtils.hashOTP(otp);

  const cacheKey = `otp:register:${email}`;

  const pendingUser = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    otp: hashedOTP,
  };

  await CacheService.set(
    cacheKey,
    pendingUser,
    600
  );
  
  await OTPRepository.createOTP({
    email,
    otp: hashedOTP,
    type: "register",
    firstName,
    lastName,
    password: hashedPassword,
  });

  sendEmail({
  to: email,
  subject: `Your email verification code is ${otp}`,
  template: baseEmailTemplate({
    headerIcon: "🔐",
    title: otp,

    subtitle: "Enter this code to complete the registration.",
    message:
        "This code will expire in 10 minutes. If you didn't request this pin, we recommend you change your PBA password. Go to Settings & Privacy > Sign in & security > Change password. To further secure your account, you should also enable two-step verification",
    alertType: "info",
    supportEmail: "",
    footerText: "Thank you for using PBA.",
  }),
});

  return {
    message: "OTP sent successfully to your email, please check your email",
  };
};

// REGISTER VENDOR 
const registerVendor = async ({ 
  userId,
  logo_buffer,
  banner_buffer,
  license_buffer,
  bodyData,
}) => {
  const {
    firstName, 
    lastName, 
    email, 
    password,
    
    store_name,
    description,
    payout_email,
    tin_number,
  } = bodyData;
  
  const vendorExists = await AuthRepository.findVendorByEmail(email);

  if (vendorExists) {
    throw new Error("Vendor with this email already exists");
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

  const hashedPassword = await HashUtils.hashPassword(password);
    
  const otp = generateOTP();
  
  const hashedOTP = await HashUtils.hashOTP(otp);

  const cacheKey = `otp:register:${email}`;

  const pendingVendor = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    
    description,
    payoutEmail: payout_email,
    tinNumber: tin_number,
    storeName: store_name,
    logoUrl: logoResult.secure_url,
    bannerUrl: bannerResult.secure_url,
    logoPublicId: logoResult.public_id,
    bannerPublicId: bannerResult.public_id,
    licensePublicId: licenseResult.public_id,
    
    otp: hashedOTP,
  };

  await CacheService.set(
    cacheKey,
    pendingVendor,
    600
  );
  
  await OTPRepository.createOTP({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    
    description,
    payoutEmail: payout_email,
    tinNumber: tin_number,
    storeName: store_name,
    logoUrl: logoResult.secure_url,
    bannerUrl: bannerResult.secure_url,
    logoPublicId: logoResult.public_id,
    bannerPublicId: bannerResult.public_id,
    licensePublicId: licenseResult.public_id,
    
    otp: hashedOTP,
  });

  sendEmail({
  to: email,
  subject: `Your email verification code is ${otp}`,
  template: baseEmailTemplate({
    headerIcon: "🔐",
    title: otp,

    subtitle: "Enter this code to complete the registration.",
    message:
        "This code will expire in 10 minutes. If you didn't request this pin, we recommend you change your PBA password. Go to Settings & Privacy > Sign in & security > Change password. To further secure your account, you should also enable two-step verification",
    alertType: "info",
    supportEmail: "",
    footerText: "Thank you for using PBA.",
  }),
});

  return {
    message: "OTP sent successfully to your email, please check your email",
  };
};

// EMAIL VERIFICATION
const verifyEmail = async ({ email, role, otp }) => {
  
  if(!email || !otp || !role) throw new Error("Missing required fields");
  
  const cacheKey = `otp:register:${email}`;
  
  let pending = await CacheService.get(cacheKey);

  if (!pending) {
    pendingUser = await OTPRepository.findOTP({
      email,
      type: "register",
    });
  }
  
  if (!pending) {
    throw new Error("OTP expired or invalid");
  }
  
  const emailMatch = email === pending.email;
  if(!emailMatch) throw new Error("Email doesn't match");

  const isOtpValid = await HashUtils.compareOTP(
    otp,
    pending.otp
  );

  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }
  
  let user;
  
  if(role==="customer"){
    user = await AuthRepository.registerCustomer({
      firstName: pending.firstName,
      lastName: pending.lastName,
      email: pending.email,
      password: pending.password
    });
  }
  
  if(role==="vendor"){
    user = await AuthRepository.registerCustomer({
      userData: {
        firstName: pending.firstName,
        lastName: pending.lastName,
        email: pending.email,
        password: pending.password
      },
    vendorData: {
      storeName: pending.storeName,
      description: pending.description,
      logoUrl: pending.logoUrl,
      bannerUrl: pending.bannerUrl,
      logoPublicId: pending.logoPublicId,
      bannerPublicId: pending.bannerPublicId,
      tinNumber: pending.tinNumber,
    }
    });
  }

  await CacheService.del(cacheKey);

  await OTPRepository.deleteOTP({
    email,
    type: "register",
  });

  const sessionId = randomUUID();

  const payload = {
    userId: user.id,
    role: user.role,
    sessionId,
  };

  const accessToken = await JWT.generateAccessToken(payload);

  const refreshToken = await JWT.generateRefreshToken(payload);

  const hashedToken = await HashUtils.hashToken(refreshToken);

  await AuthRepository.createToken({
    sessionId,
    userId: user.id,
    token: hashedToken,
  });

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

// LOGIN
const login = async (data) => {
  const { email, password } = data;
  
  const user = await AuthRepository.findUserByEmail(email);
  
  if (!user) throw new Error("User with this email doesn't exist");
  
  const isMatch = 
    await HashUtils.comparePassword(password, user.password);
  if (!isMatch) throw new Error("Incorrect password");
  
  if (!user.isActive) throw new Error("Account banned or deactivated, please contact support");
  
  const sessionId = randomUUID();
  
  const payload = {
    userId: user.id,
    role: user.role,
    sessionId,
  };
  
  const accessToken = await JWT.generateAccessToken(payload);
  const refreshToken = await JWT.generateRefreshToken(payload);
  
  const hashedToken = await HashUtils.hashToken(refreshToken);
  
  await AuthRepository.createToken({
    sessionId,
    userId: user.id,
    token: hashedToken
  });
  
  return { 
    user:{
      isActive: user.isActive,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar_url: user.avatarUrl,
    }, 
    accessToken,
    refreshToken
  };
};

// LOGOUT
const logout = async(payload) => {
  const { sessionId, userId } = payload;
  
  if(!userId) throw new Error("User not found");
  
  if(!sessionId) throw new Error("sessionId not found");
  
  const session = await AuthRepository.findTokenBySession(sessionId);
  
  if (!session) throw new Error("Session not found");
  
  if(session.revoked) throw new Error("This session has already been revoked");
  
  
  const result = await AuthRepository.revokeToken({
    userId,
    sessionId
  });
  
  return result;
};

// LOGOUT ALL
const logoutAll = async({
  userId,
  sessionId
}) => {
  if(!userId) throw new Error("UserId not found");
  
  const user = await AuthRepository.findUserById(userId);
  
  if(!user) throw new Error("User not found");
  if(!user.isActive) throw new Error("Account is not active");
  
  if(!sessionId) throw new Error("sessionId not found");
  
  const session = await AuthRepository.findTokenBySession(sessionId);
  
  if (!session) throw new Error("Session not found");
  
  if(session.revoked) throw new Error("This session has already been revoked");
  
  await AuthRepository.logoutAll(userId);
  
  return {
    message: "All sessions deleted"
  };
};

// GET ME
const getMe = async ({
  userId,
  sessionId
}) => {
  if(!userId) throw new Error("User id not found");
  
  const user = await AuthRepository.findUserById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }
  
  if(!sessionId) throw new Error("sessionId not found");
  
  const session = await AuthRepository.findTokenBySession(sessionId);
  
  if (!session) throw new Error("Session not found");
  
  if(session.revoked) throw new Error("This session has already been revoked");
  
  return {
      id: user.id,
      isActive: user.isActive,
      role: user.role,
      email: user.email
  };
};

// REFRESH
const refresh = async({
  userId,
  sessionId,
  oldRefreshToken
}) => {
  
  if(!userId) throw new Error("User id not found");
  
  if(!sessionId) throw new Error("sessionId not found");
  
  const user = await AuthRepository.findUserById(userId);
  
  if(!user) throw new Error("User not found");
  
  const session = await AuthRepository.findTokenBySession(sessionId);
  
  if (!session) throw new Error("Session not found");
  
  if (!session.token) throw new Error("Refresh token not found");

  if (session.revoked) throw new Error("This session has already been revoked/logged out");
  
  if (!oldRefreshToken) throw new Error("oldRefresh token not found");
  
  const isTokenValid = await HashUtils.compareToken(
    oldRefreshToken, session.token
  );
  
  if(!isTokenValid) throw new Error("Token expired or invalid");
  
  const payload = {
    userId: user.id,
    role: user.role,
    sessionId,
  };
  
  const newAccessToken = await JWT.generateAccessToken(payload);
  
  return { newAccessToken };
};

// FORGOT PASSWORD
const forgotPassword = async({email}) => {
  
  if(!email) throw new Error("Email is required")
  
  const existing = await AuthRepository.findUserByEmail(email);

  if(!existing) throw new Error("User with this email doesn't exist");
  
  if (!existing.isActive) throw new Error("Your account temporarily locked");
  
  const cacheKey = `otp:reset:${email}`
  
  const otp = generateOTP();
  const hashedOTP = await HashUtils.hashOTP(otp);
  
  const userData = {
    email,
    otp: hashedOTP,
  };
  
  await CacheService.set(
    cacheKey,
    userData,
    600
  );
  
  await OTPRepository.createOTP({
    email,
    otp: hashedOTP,
    type: "reset"
  })
  
  sendEmail({
    to: email,
    subject: `Your password reset code is ${otp}`,
    template: baseEmailTemplate({
      headerIcon: "🔐",
      title: otp,
  
      subtitle: "Enter this code to complete the reset.",
      message:
          "This code will expire in 10 minutes. If you didn't request this pin, we recommend you change your PBA password. Go to Settings & Privacy > Sign in & security > Change password. To further secure your account, you should also enable two-step verification",
      alertType: "info",
      supportEmail: "",
      footerText: "Thank you for using PBA.",
    }),
  });

  return {
    message: "OTP sent successfully to your email, please check your email",
  };
  
}

// RESET PASSWORD
const resetPassword = async({email, otp, password}) => {
  const cacheKey = `otp:reset:${email}`;
  
  if(!email || !otp || !password){
    throw new Error("Missing required fields");
  }
  
  let pendingUser = await CacheService.get(cacheKey);
  
  if (!pendingUser) {
    pendingUser = await OTPRepository.findOTP({
      email,
      type: "reset"
    })
  }
  
  if (!pendingUser) {
    throw new Error("OTP expired or invalid")
  }

  const isOtpValid = await HashUtils.compareOTP(
    otp,
    pendingUser.otp
  );

  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }
  
  const hashedPassword = await HashUtils.hashPassword(password)
  
  await AuthRepository.resetPassword({
    email, 
    password: hashedPassword 
  });
  
  await CacheService.del(cacheKey);
  
  await OTPRepository.deleteOTP({
    email,
    type: "reset"
  })
  
  return {
    message: "Password reset successfully"
  }
  
}

// RESEND OTP
const resendOTP = async ({ email, type }) => {
  if(!type || !email){
    throw new Error("Missing required fields")
  }
  
  const cacheKey = `otp:${type}:${email}`;

  const otp = generateOTP();
  const hashedOTP = await HashUtils.hashOTP(otp);
  
  const userData = {
    email,
    otp: hashedOTP,
  }

  await CacheService.set(cacheKey, userData, 600);
  
  await OTPRepository.createOTP({
    email,
    type,
    otp: hashedOTP
  });
  
  const subject = type==="reset" 
    ? `Your password reset code is ${otp}`
    : `Your email verification code is ${otp}`
  
  const title = type==="reset"
    ? "reset"
    : "registration"
  

  sendEmail({
    to: email,
    subject,
  
    template: baseEmailTemplate({
      headerIcon: "🔐",
      title: otp,
      subtitle: `Enter this code to complete the ${title}`,
      message:
        "This code will expire in 10 minutes. If you didn't request this pin, we recommend you change your PBA password. Go to Settings & Privacy > Sign in & security > Change password. To further secure your account, you should also enable two-step verification",
  
      alertType: "info",
      supportEmail: "",
    }),
  });

  return {
    message: "OTP resent successfully",
  };
};



export const AuthService = {
  registerCustomer,
  registerVendor,
  login,
  logout,
  refresh,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendOTP,
  logoutAll
}