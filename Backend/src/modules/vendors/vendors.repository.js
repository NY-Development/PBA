import { sql } from "../../configs/db.js";


const register = async({
  userId,
  store_name,
  description,
  payout_email,
  tin_number,
  license_type,
  logo_url,
  banner_url,
  license_public_id,
  logo_public_id,
  banner_public_id
}) => {
  const result = await sql`
    INSERT INTO vendors
      (store_name, description, payout_email, tin_number, license_type, logo_url, banner_url, user_id, banner_public_id, logo_public_id, license_public_id)
    VALUES 
      (${store_name}, ${description}, ${payout_email}, ${tin_number}, ${license_type}, ${logo_url}, ${banner_url}, ${userId}, ${banner_public_id}, ${logo_public_id}, ${license_public_id})
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
    WHERE user_id=${id}
  `
}

const verifyVendor = async(id) => {
  const result = await sql`
    UPDATE vendors
    SET status='verified'
    WHERE id=${id}
    RETURNING *
  `
  return result[0];
}

export const VendorsRepository = {
  register,
  findUserById,
  findVendorById
}