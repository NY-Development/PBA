import { UsersRepository } from "./users.repository.js";
import { CacheService } from "../../utils/cache.js";


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

export const UsersService = {
  savePushToken,
};