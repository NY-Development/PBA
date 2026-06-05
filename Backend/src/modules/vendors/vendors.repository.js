import { sql } from "../../configs/db.js";


const register = async({
  userId,
  store_name,
  description,
  payout_email,
  tin_number,
  logo_url,
  banner_url,
  logo_public_id,
  banner_public_id
}) => {
  const result = await sql`
    INSERT INTO vendors
      (store_name, description, payout_email, tin_number, logo_url, banner_url, user_id, banner_public_id, logo_public_id)
    VALUES 
      (${store_name}, ${description}, ${payout_email}, ${tin_number}, ${logo_url}, ${banner_url}, ${userId}, ${banner_public_id}, ${logo_public_id})
    RETURNING *
  `
  return result[0];
}

const findUserById = async(id) => {
  const result = await sql`
    SELECT * FROM users
    WHERE id=${id}
  `
}

const findVendorById = async(id) => {
  const result = await sql`
    SELECT * FROM vendors
    WHERE id=${id}
  `
}

export const VendorsRepository = {
  register,
  findUserById,
  findVendorById
}