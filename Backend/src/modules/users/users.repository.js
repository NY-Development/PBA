import { } from "drizzle-orm";
import { db } from "../../db/index.js";
import { expoTokens } from "../../db/schema/expoTokens.js";

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

export const UsersRepository = {
  savePushToken,
}