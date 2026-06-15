import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { vendors } from "../../db/schema/vendors.js";
import { users } from "../../db/schema/users.js";

        
const getVendors = async () => {
  const result = await db
    .select({
      vendorId: vendors.id,
      firstName: users.firstName,
      lastName: users.lastName,
      storeName: vendors.storeName,
      logoUrl: vendors.logoUrl,
      bannerUrl: vendors.bannerUrl,
      status: vendors.status,
      avatarUrl: users.avatarUrl,
      role: users.role,
      isActive: users.isActive,
      email: users.email,
      phone: users.phone,
      payoutEmail: vendors.payoutEmail,
      tinNumber: vendors.tinNumber,
      description: vendors.description,
    })
    .from(vendors)
    .innerJoin( users, eq(vendors.userId, users.id));

  return result;
};



export const AdminRepository = {
  getVendors,
};