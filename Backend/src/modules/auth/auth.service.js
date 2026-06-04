import { randomUUID } from "crypto";
import { HashUtils } from "../../utils/hash.js";
import { CacheService } from "../../utils/cache.js";
import { JWT } from "../../utils/jwt.js";
import { AuthRepository } from "./auth.repository.js";
import { createOTP } from "../../services/otp/otp.service.js"
import { sendVerificationEmail } from "../../services/email/email.service.js"


// REGISTER
const register = async (data) => {
  const { first_name, last_name, email, password } = data;

  // 1. Check existing user
  const existing = await AuthRepository.findUserByEmail(email);

  if (existing) {
    throw new Error("User with this email already exists");
  }

  // 2. Hash password
  const hashedPassword =
    await HashUtils.hashPassword(password);

  // 3. Generate OTP
  const otp = createOTP();
  
  const hashedOTP = await HashUtils.hashOTP(otp);

  // 4. Cache pending user
  const cacheKey = `pending_user:${email}`;

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

  // 5. Send email
  sendVerificationEmail({
    to: email,
    otp,
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
  // 1. Get pending user
  const cacheKey = `pending_user:${email}`;

  const pendingUser =
    await CacheService.get(cacheKey);

  if (!pendingUser) {
    throw new Error(
      "OTP expired or registration not found"
    );
  }
  
  if(!otp) throw new Error("OTP not provided")

  // 2. Compare OTP
  const isOtpValid =
    await HashUtils.compareOTP(
      otp,
      pendingUser.otp
    );

  if (!isOtpValid) {
    throw new Error("Invalid OTP");
  }

  // 3. Create real user
  const user =
    await AuthRepository.register({
      first_name: pendingUser.first_name,
      last_name: pendingUser.last_name,
      email: pendingUser.email,
      password: pendingUser.password,
    });

  // 4. Delete pending registration
  await CacheService.del(cacheKey);

  // 5. Create session
  const session_id = randomUUID();

  const payload = {
    userId: user.id,
    role: user.role,
    session_id,
  };

  // 6. Generate tokens
  const accessToken =
    await JWT.generateAccessToken(payload);

  const refreshToken =
    await JWT.generateRefreshToken(payload);

  // 7. Hash refresh token
  const hashedToken =
    await HashUtils.hashToken(refreshToken);

  // 8. Save refresh session
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


const logout = async(payload) => {
  const { session_id, userId } = payload;
  
  if(!userId) throw new Error("User not found");
  
  const session = 
    await AuthRepository.findTokenBySession({token_id: session_id})
  
  if (!session) throw new Error("Session not found");
  
  if(session.revoked) throw new Error("This session has already been revoked")
  
  const result = await AuthRepository.revokeToken({
    user_id: userId,
    session_id
  });
  
  return result;
};

// GET ME
const getMe = async (userId) => {
  if(!userId) throw new Error("User id not found")
  
  const user = await AuthRepository.findUserById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const refresh = async(oldRefreshToken, payloadData) => {
  const { userId, session_id } = payloadData;
  
  if(!userId) throw new Error("User id not found")
  
  const user = await AuthRepository.findUserById(userId);
  
  if(!user) throw new Error("User not found")
  
  const session = 
    await AuthRepository.findTokenBySession({token_id: session_id})
  
  if (!session) throw new Error("Session not found");

  if (session.revoked)
    throw new Error("This session has already been revoked");
  
  if (!session.token)
    throw new Error("Refresh token not found");
  
  if(!session.token) throw new Error("Refresh Token not found")
  
  const isTokenValid = await HashUtils.compareToken(
    oldRefreshToken, session.token
  )
  
  if(!isTokenValid) throw new Error("Token expired or invalid")
  
  const payload = {
    userId: user.id,
    role: user.role,
    session_id,
  };
  
  const newAccessToken = await JWT.generateAccessToken(payload)
  
  return { newAccessToken };
};

const updateUser = async(data, userId) => {
  const {
    first_name,
    last_name,
    avatar_url } = data;
  
  if(!userId) throw new Error("User id not found")
  
  const user = await AuthRepository.findUserById(userId);
  
  if(!user) throw new Error("User not found")
  
  const result = await AuthRepository.updateUser(data, userId)
  
  return result;
};

const forgotPassword = async({email}) => {
  
  const existing = await AuthRepository.findUserByEmail(email);

  if (!existing) {
    throw new Error("User with this email doesn't exist");
  }
  
  if (!existing.is_active) {
    throw new Error("Your account temporarily locked");
  }
  
  const cacheKey = `forgot_password:${email}`
  
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
  
  sendVerificationEmail({
    to: email,
    otp,
  });

  return {
    message: "OTP sent successfully to your email, please check your email",
  };
  
}

const resetPassword = async({email, otp, password}) => {
  const cacheKey = `forgot_password:${email}`;
  
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
  
  return {
    message: "Password reset successfully"
  }
  
}


export const AuthService = {
  register,
  login,
  logout,
  refresh,
  updateUser,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword
}