import logger from "../../utils/logger.js";
import { seedUsers } from "./users.js";
import { seedAddresses } from "./addresses.js";
import { seedVendors } from "./vendors.js";
import { seedCategories } from "./categories.js";
import { seedNotifications } from "./notifications.js";


const seed = async () => {
  try {
    
    const users = await seedUsers();
    logger.info(`✅ Seeded ${users.length} users`);
    
    const addresses = await seedAddresses(users);
    logger.info(`✅ Seeded ${addresses.length} addresses`);
    
    const vendors = await seedVendors(users);
    logger.info(`✅ Seeded ${vendors.length} vendors`);
    
    const categories = await seedCategories();
    logger.info(`✅ Seeded ${categories.length} categories`);
    
    const notifications = await seedNotifications(users);
    logger.info(`✅ Seeded ${notifications.length} notifications`);

  } catch (err) {
    logger.error(err.cause || err.message);
  }
};

seed();