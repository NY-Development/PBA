import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { expoTokens } from "../../db/schema/expoTokens.js";
import { users } from "../../db/schema/users.js";

const safeUser = {
  id: users.id,
  firstName: users.firstName,
  lastName: users.lastName,
  email: users.email,
  phone: users.phone,
  role: users.role,
  isActive: users.isActive,
  avatarUrl: users.avatarUrl,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

// USER PROFILE 
const getUserProfile = async(userId) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  
  return result[0];
};

// UPDATE USER PROFILE 
const updateUserProfile = async ({
  userId,
  updateData,
}) => {

  const result = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning(safeUser);
 
  return result[0] || null;
};

// SAVE EXPO TOKEN
const savePushToken = async({
  userId,
  token
}) => {
  const result = await db
    .insert(expo_tokens)
    .values({
      userId,
      token
    })
    .returning();
    
  return result[0];
};

// UPLOAD AVATAR 
const uploadAvatar = async({
  avatarUrl,
  avatarPublicId,
  userId
}) => {
    const result = await db
      .update(users)
      .values({
        avatarUrl,
        avatarPublicId
      })
      .where(eq(users.id, userId))
      .returning({
        avatarUrl,
        avatarPublicId
      });
      
      return result[0];
  };

export const UsersRepository = {
  savePushToken,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
};