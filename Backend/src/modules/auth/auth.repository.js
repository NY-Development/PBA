import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { eq } from "drizzle-orm";

// FIND USER BY EMAIL
const findUserByEmail = async (email) => {
  const result = await db
    .select()
    .from()
    .where(eq(users.email, email))
    .limit(1);
    
    return result[0];
};

// FIND USER BY ID
const findUserById = async (id) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0];
};

const register = async ({
  first_name,
  last_name,
  email,
  password
}) => {
  const result = await db
    `INSERT INTO users 
      (first_name, last_name, email, password)
     VALUES (${first_name}, ${last_name}, ${email}, ${password})
     RETURNING *`

    return result[0] || null;
};

const register = async({})

const createToken = async ({
  token_id,
  token,
  user_id
}) => {
  const result = await db
    `INSERT INTO refresh_tokens
      (id, user_id, token, expires_at)
     VALUES (
       ${token_id}, 
       ${user_id}, 
       ${token}, 
       Now () + INTERVAL '7 days'
    )
     RETURNING *`;

    return result[0] || null;
};

const findTokenBySession = async (token_id) => {
  const result = await db`
    SELECT * FROM refresh_tokens 
    WHERE id = ${token_id}
  `;
  return result[0] || null;
};

const revokeToken = async ({ session_id, user_id }) => {
  const result = await db`
    UPDATE refresh_tokens
    SET is_revoked = true
    WHERE id = ${session_id} AND user_id = ${user_id}
    RETURNING *
  `;

  return result[0] || null
};

const updateUser = async({
  id,
  first_name,
  last_name,
  avatar_url,
  avatar_public_id
}) => {
  
  const result = await db`
    UPDATE users
    SET 
      first_name = COALESCE(${first_name}, first_name),
      last_name = COALESCE(${last_name}, last_name),
      avatar_url = COALESCE(${avatar_url}, avatar_url),
      avatar_public_id = COALESCE(${avatar_public_id}, avatar_public_id)
    WHERE id=${id}
    RETURNING *
  `
  
  return result[0] || null;
};

const resetPassword = async({email, password}) => {
  const result = await db`
    UPDATE users
    SET password=${password}
    WHERE email=${email}
    RETURNING *
  `
  return result[0] || null;
}

const logoutAll = async({userId}) => {
  const result = await db`
    DELETE FROM refresh_tokens
    WHERE user_id=${userId}
    RETURNING *
  `
  return result[0] || null;
}


export const AuthRepository = {
  findUserByEmail,
  register,
  createToken,
  findTokenBySession,
  revokeToken,
  updateUser,
  findUserById,
  resetPassword,
  logoutAll,
}