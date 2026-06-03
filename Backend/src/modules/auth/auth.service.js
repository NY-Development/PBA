import { randomUUID } from "crypto";
import { HashUtils } from "../../utils/hash.js";
import { JWT } from "../../utils/jwt.js";
import { AuthRepository } from "./auth.repository.js";


// REGISTER
const register = async (data) => {
  const { first_name, last_name, email, password } = data;

  const existing = await AuthRepository.findUserByEmail(email);

  if (existing) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await HashUtils.hashPassword(password);

  const user = await AuthRepository.register({
    first_name,
    last_name,
    email,
    password: hashedPassword
  });

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
    user,
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


export const AuthService = {
  register,
  login,
  logout,
  refresh,
  updateUser,
  getMe
}