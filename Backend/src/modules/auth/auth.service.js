import { randomUUID } from "crypto";
import { HashUtils } from "../../utils/hash.js";
import { CacheService } from "../../utils/cache.js";
import { JWT } from "../../utils/jwt.js";
import { AuthRepository } from "./auth.repository.js";
import { createOTP } from "../../services/otp/otp.service.js";
import { sendEmail } from "../../services/email/email.service.js";
import { baseEmailTemplate } from "../../templates/email.template.js";
import { 
  uploadToCloudinary,
  deleteFromCloudinary
}  from "../../utils/cloudinary.js";


// REGISTER
const register = async (data) => {
  const { first_name, last_name, email, password } = data;

  const existing = await AuthRepository.findUserByEmail(email);

  if (existing) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword =
    await HashUtils.hashPassword(password);
    
  const otp = createOTP();
  
  const hashedOTP = await HashUtils.hashOTP(otp);

  const cacheKey = `otp:register:${email}`;

  const userData = {
    first_name,
    last_name,
    email,
    password: hashedPassword,
    otp: hashedOTP,
  };

  await CacheService.set(
    cacheKey,
    userData,
    600
  );

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

// LOGIN
const login = async (data) => {
  const { email, password } = data;
  
  const user = await AuthRepository.findUserByEmail(email);
  
  if (!user) throw new Error("User with this email doesn't exist");
  
  const isMatch = 
    await HashUtils.comparePassword(password, user.password);
  if (!isMatch) throw new Error("Incorrect password");
  
  if (!user.is_active) throw new Error("Account banned or deactivated, please contact support");
  
  const session_id = randomUUID();
  
  const payload = {
    userId: user.id,
    role: user.role,
    session_id,
  };
  
  const accessToken = await JWT.generateAccessToken(payload);
  const refreshToken = await JWT.generateRefreshToken(payload);
  
  const hashedToken = await HashUtils.hashToken(refreshToken);
  
  await AuthRepository.createToken({
    token_id: session_id,
    user_id: user.id,
    token: hashedToken
  });
  
  return { 
    user:{
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      is_active: user.is_active,
    }, 
    accessToken,
    refreshToken
  };
};

// EMAIL VERIFICATION
const verifyEmail = async ({ email, otp }) => {
  
  if(!email || !otp) throw new Error("Missing required fields");

  const cacheKey = `otp:register:${email}`;

  const pendingUser = await CacheService.get(cacheKey);

  if (!pendingUser) {
    throw new Error(
      "OTP expired or registration not found"
    );
  }
  
  if(!otp) throw new Error("OTP not provided");

  const isOtpValid = await HashUtils.compareOTP(
    otp,
    pendingUser.otp
  );

  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }

  const user = await AuthRepository.register({
    first_name: pendingUser.first_name,
    last_name: pendingUser.last_name,
    email: pendingUser.email,
    password: pendingUser.password,
  });

  await CacheService.del(cacheKey);

  const session_id = randomUUID();

  const payload = {
    userId: user.id,
    role: user.role,
    session_id,
  };

  const accessToken = await JWT.generateAccessToken(payload);

  const refreshToken = await JWT.generateRefreshToken(payload);

  const hashedToken = await HashUtils.hashToken(refreshToken);

  await AuthRepository.createToken({
    token_id: session_id,
    user_id: user.id,
    token: hashedToken,
  });

  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

// LOGOUT
const logout = async(payload) => {
  const { session_id, userId } = payload;
  
  if(!userId) throw new Error("User not found");
  
  if(!session_id) throw new Error("session_id not found");
  
  const session = await AuthRepository.findTokenBySession({token_id: session_id});
  
  if (!session) throw new Error("Session not found");
  
  if(session.revoked) throw new Error("This session has already been revoked");
  
  const result = await AuthRepository.revokeToken({
    user_id: userId,
    session_id
  });
  
  return result;
};

// GET ME
const getMe = async (userId) => {
  if(!userId) throw new Error("User id not found");
  
  const user = await AuthRepository.findUserById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// REFRESH
const refresh = async(oldRefreshToken, payloadData) => {
  const { userId, session_id } = payloadData;
  
  if(!userId) throw new Error("User id not found");
  
  if(!session_id) throw new Error("session_id not found");
  
  const user = await AuthRepository.findUserById(userId);
  
  if(!user) throw new Error("User not found");
  
  const session = await AuthRepository.findTokenBySession({token_id: session_id});
  
  if (!session) throw new Error("Session not found");

  if (session.revoked) throw new Error("This session has already been revoked");
  
  if (!session.token) throw new Error("Refresh token not found");
  
  if(!session.token) throw new Error("Refresh Token not found");
  
  const isTokenValid = await HashUtils.compareToken(
    oldRefreshToken, session.token
  );
  
  if(!isTokenValid) throw new Error("Token expired or invalid");
  
  const payload = {
    userId: user.id,
    role: user.role,
    session_id,
  };
  
  const newAccessToken = await JWT.generateAccessToken(payload);
  
  return { newAccessToken };
};

// UPDATE
const updateUser = async ({
  userId,
  bodyData,
  avatar_buffer,
}) => {

  const { first_name, last_name } = bodyData;

  if (!userId) {
    throw new Error("User id not found");
  }

  const user = await AuthRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  let avatar_url = user.avatar_url;
  let avatar_public_id = user.avatar_public_id;

  if (avatar_buffer) {
    const uploaded = await uploadToCloudinary(
      avatar_buffer,
      `profiles/${userId}`
    );
    if (user.avatar_public_id) {
      await deleteFromCloudinary(user.avatar_public_id);
    }
    avatar_url = uploaded.secure_url;
    avatar_public_id = uploaded.public_id;
  }

  const result = await AuthRepository.updateUser({
    id: userId,
    first_name,
    last_name,
    avatar_url,
    avatar_public_id,
  });

  return result;
};

// FORGOT PASSWORD
const forgotPassword = async({email}) => {
  
  if(!email) throw new Error("Email is required")
  
  const existing = await AuthRepository.findUserByEmail(email);

  if(!existing) throw new Error("User with this email doesn't exist");
  
  if (!existing.is_active) throw new Error("Your account temporarily locked");
  
  const cacheKey = `otp:reset:${email}`
  
  const otp = createOTP();
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
  
  const pendingUser = await CacheService.get(cacheKey);
  
  if (!pendingUser) {
    throw new Error(
      "OTP expired or registration not found"
    );
  }
  
  if(!otp) throw new Error("OTP not provided")

  const isOtpValid =
    await HashUtils.compareOTP(
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
  
  return {
    message: "Password reset successfully"
  }
  
}

// RESEND OTP
const resendOTP = async ({ email, type }) => {
  if(!type) throw new Error("OTP type not provided")
  
  const cacheKey = `otp:${type}:${email}`;

  const existing = await AuthRepository.findUserByEmail(email);

  if (!existing) throw new Error("User not found");

  const otp = createOTP();
  const hashedOTP = await HashUtils.hashOTP(otp);
  
  const userData = {
    email,
    otp: hashedOTP,
  }

  await CacheService.set(cacheKey, userData, 600);
  
  const subject = type==="reset" 
    ? `Your password reset code is ${otp}`
    : `Your email verification code is ${otp}`
  
  const title = type==="reset"
    ? "reset"
    : "registeration"
  

  sendEmail({
    to: email,
    subject,
  
    template: baseEmailTemplate({
      headerIcon: "🔐",
      title: otp,
      subtitle: `Enter this code to complete the ${title}`,
      greeting: "Hello Sana,",
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
  register,
  login,
  logout,
  refresh,
  updateUser,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendOTP,
}