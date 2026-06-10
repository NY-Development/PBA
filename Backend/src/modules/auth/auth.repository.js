import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { refreshTokens } from "../../db/schema/refreshTokens.js";
import { eq, sql, and } from "drizzle-orm";

// FIND USER BY EMAIL
const findUserByEmail = async (email) => {
  const result = await db
    .select()
    .from(users)
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

// REGISTER 
const register = async ({
  firstName,
  lastName,
  email,
  password,
}) => {

  const result = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email,
      password,
    })
    .returning();

  return result[0];
};

// CREATE TOKEN
const createToken = async ({
  sessionId,
  token,
  userId,
}) => {
  
  const result = await db
    .insert(refreshTokens)
    .values({
      id: sessionId,
      userId,
      token,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    })
    .returning();

  return result[0];
};

// FIND TOKEN BY SESSION
const findTokenBySession = async (token_id) => {
  const result = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.id, token_id))
    .limit(1);
    
  return result[0] || null;
};

// REVOKE TOKEN
const revokeToken = async ({ sessionId, userId }) => {
  const result = await db
    .update(refreshTokens)
    .set({
      revoked: true
    })
    .where(
      and(
        eq(refreshTokens.id, sessionId),
        eq(refreshTokens.userId, userId)
      )
    )
    .returning();

  return result[0] || null;
};

// RESET PASSWORD 
const resetPassword = async ({
  email,
  password,
}) => {

  const result = await db
    .update(users)
    .set({
      password,
    })
    .where(eq(users.email, email))
    .returning();

  return result[0];
};

// LOGOUT ALL
const logoutAll = async (userId) => {

  const result = await db
    .update(refreshTokens)
    .set({
      revoked: true
    })
    .where(eq(refreshTokens.userId, userId))
    .returning();

  return result;
};


export const AuthRepository = {
  findUserByEmail,
  register,
  createToken,
  findTokenBySession,
  revokeToken,
  findUserById,
  resetPassword,
  logoutAll,
};