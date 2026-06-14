import { UsersRepository } from "./users.repository.js";
import { CacheService } from "../../utils/cache.js";
import { AuthRepository } from "../auth/auth.repository.js";


// SAVE EXPO TOKEN 
export const savePushToken = async ({
  userId,
  token }) => {
  
  if(!userId){
    throw new Error("User id not found");
  }
  if(!token){
    throw new Error("Token is undefined");
  }
  
  const result = await UsersRepository.savePushToken({
    userId,
    token
  });
  
  const cacheKey = `expo_token:${token}`;
  await CacheService.set(cacheKey, result);
  
  return {
    message: "Expo push token saved successfully"
  };
};

// GET USER PROFILE
const getUserProfile = async({
  userId,
  sessionId
}) => {
  if(!userId) throw new Error("User id not found");
  
  const user = await AuthRepository.findUserById(userId);
  if(!user) throw new Error("User not found");
  if(!user.isActive) throw new Error("Account is temporarily locked");
  
  const session = await AuthRepository.findTokenBySession(sessionId);
  
  if (!session) throw new Error("Session not found");

  if (session.revoked) throw new Error("This session has been revoked");
  
  const userInfo = await UsersRepository.getUserProfile(userId);
  
  return {
    id: userInfo.id,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    phone: userInfo.phone,
    role: userInfo.role,
    isActive: userInfo.isActive,
    avatarUrl: userInfo.avatar,
    createdAt: userInfo.createdAt,
    updatedAt: userInfo.updatedAt,
  };
};

// UPDATE
const updateUserProfile = async ({
  userId,
  bodyData,
}) => {

  const { firstName, lastName, phone } = bodyData;

  if (!userId) {
    throw new Error("User id not found");
  }

  const user = await AuthRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }
  
  const updateData = {};

  if (firstName !== undefined)
    updateData.firstName = firstName;
  
  if (lastName !== undefined)
    updateData.lastName = lastName;
    
  if (phone !== undefined)
    updateData.phone = phone;

  const result = await UsersRepository.updateUserProfile({
    updateData,
    userId
  });
 
  return result;
};

// UPLOAD AVATAR 
const uploadAvatar = async ({
  userId,
  avatarBuffer,
}) => {
  if(!userId) throw new Error("User id not found");
  
  const user = await AuthRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }
  
  let avatarUrl = user.avatarUrl;
  let avatarPublicId = user.avatarPublicId;

  if (avatarBuffer) {
    const uploaded = await uploadToCloudinary(
      avatarBuffer,
      `profiles/${userId}`
    );
    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }
    avatarUrl = uploaded.secure_url;
    avatarPublicId = uploaded.public_id;
  }
  
  const result = await UsersRepository.uploadAvatar({
    avatarUrl,
    avatarPublicId,
    userId
  });
 
  return {
    avatarUrl,
    avatarPublicId
  };
};

// GET ADDRESSES 
const getAddresses = async(userId) => {
  if(!userId) throw new Error("User id not found");
  
  const addresses = await UsersRepository.getAddresses(userId);
  
  return addresses;
};

export const UsersService = {
  savePushToken,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getAddresses,
};