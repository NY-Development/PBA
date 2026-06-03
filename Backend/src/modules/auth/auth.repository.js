import { sql } from "../../config/db.js";

const findUserByEmail = async (email) => {
  const result = await sql`
    SELECT * FROM users 
    WHERE email = ${email}
  `;
  return result[0] || null;
};

const register = async ({
  first_name,
  last_name,
  email,
  password
}) => {
  const result = await sql
    `INSERT INTO users 
      (first_name, last_name, email, password)
     VALUES (${first_name}, ${last_name}, ${email}, ${password})
     RETURNING *`

    return result[0] || null;
};

const createToken = async ({
  token_id,
  token,
  user_id
}) => {
  const result = await sql
    `INSERT INTO refresh_tokens
      (id, user_id, token, expires_at)
     VALUES (
       ${token_id}, 
       ${user_id}, 
       ${token}, 
       Now () + INTERVAL '7 days'
    )
     RETURNING *`

    return result[0] || null;
};

const findTokenBySession = async ({token_id}) => {
  const result = await sql`
    SELECT * FROM refresh_tokens 
    WHERE id = ${token_id}
  `;
  return result[0] || null;
};

const revokeToken = async ({ session_id, user_id }) => {
  const result = await sql`
    UPDATE refresh_tokens
    SET revoked = true
    WHERE id = ${session_id} AND user_id = ${user_id};
    RETURNING *
  `;

  return result[0] || null
};

const findById = async (id) => {
  const result = await sql`
    SELECT * FROM users 
    WHERE id = ${id}
  `;
  return result[0] || null;
};