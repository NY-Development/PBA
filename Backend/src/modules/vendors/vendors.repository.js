import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { vendors } from "../../db/schema/vendors.js";
import { users } from "../../db/schema/users.js";


const register = async (data) => {
  const result = await db
    .insert(vendors)
    .values(data)
    .returning();

  return result[0];
};

const findUserById = async (id) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0];
};

const findVendorByUserId = async (userId) => {
  const result = await db
    .select()
    .from(vendors)
    .where(eq(vendors.userId, userId))
    .limit(1);

  return result[0];
};

const findVendorById = async (id) => {
  const result = await db
    .select()
    .from(vendors)
    .where(eq(vendors.id, id))
    .limit(1);

  return result[0];
};

const verifyVendor = async (id) => {
  const result = await db
    .update(vendors)
    .set({
      status: "verified",
    })
    .where(eq(vendors.id, id))
    .returning();

  return result[0];
};

const getVendors = async () => {
  const result = await db
    .select()
    .from(vendors);

  return result;
};

const updateProfile = async ({
  userId,
  data
}) => {
  const result = await db
    .update(vendors)
    .set(data)
    .where(
      eq(vendors.userId, userId)
    )
    .returning();

  return result[0];
};

export const VendorsRepository = {
  register,
  findUserById,
  findVendorByUserId,
  findVendorById,
  verifyVendor,
  getVendors,
  updateProfile,
};