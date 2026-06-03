
import { HashUtils } from "../../utils/hash.js";
import { JWT } from "../../utils/jwt.js";
import { AuthRepository } from "./auth.repository.js";


// REGISTER
const register = async (data) => {
  const { first_name, last_name, email, password } = data;
  
  const existing = await AuthRepository.findByEmail(email);
  
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await HashUtils.hashPassword(password);
  
  const user = await AuthRepository.register(
    first_name,
    last_name,
    email,
    hashedPassword
  );
  
  const payload = { 
    user: user.id, 
    role: user.role, 
    email: user.email 
  };
  
  const newAccessToken = await JWT.generateAccessToken(payload);
  const newRefreshToken = await JWT.generateRefreshToken(payload);
  
  const hashedToken = await HashUtils.hashToken(newRefreshToken);
  
  await AuthRepository.createToken(user.id, hashedToken);

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
    newAccessToken, 
    newRefreshToken };
  };

// LOGIN
const login = async (data) => {
  const { email, password } = data;
  
  const user = await AuthRepository.findByEmail(email);
  
  if (!user) throw new Error("User with this email doesn't exist");
  
  const isMatch = 
    await HashUtils.comparePassword(password, user.password);
  if (!isMatch) throw new Error("Incorrect password");
  
  if (!user.is_active) throw new Error("Account banned or deactivated, please contact support");
  
  if(!tokenMatch) throw new Error("Invalid")
  
  const payload = { 
    user: user.id, 
    role: user.role, 
    email: user.email 
  };
  
  const newAccessToken = await JWT.generateAccessToken(payload);
  const newRefreshToken = await JWT.generateRefreshToken(payload);
  
  const hashedToken = await HashUtils.hashToken(newRefreshToken);
  
  await AuthRepository.updateToken(user.id, hashedToken);
  
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
    newAccessToken,
    newRefreshToken
  };
};

const logout = async(user_id) => {
  if(!user_id) throw new Error("User id not found");
  
  const result = await AuthRepository.updateToken(user_id, null);
  
  return result;
};

// GET ME
const getMe = async (userId) => {
  if(!user_id) throw new Error("User id not found")
  
  const user = await findUserByIdRepo(userId);
  
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const AuthService = {
  register,
  login,
  logout,
  getMe
}