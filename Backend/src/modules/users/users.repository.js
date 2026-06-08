import { sql } from "../../configs/db.js";

// SAVE EXPO TOKEN
const savePushToken = async({
  userId,
  token
}) => {
  const result = await sql`
    INSERT INTO expo_tokens
      (token, user_id)
    VALUES 
      (${token}, ${userId})
    RETURNING *
  `
  return result[0];
}

export const UsersRepository = {
  savePushToken,
}