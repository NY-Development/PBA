import { seedUsers } from "./users.js";
import { seedAddresses } from "./addresses.js";
import logger from "../../utils/logger.js";

const seed = async () => {
  try {
    
    const users = await seedUsers();
    logger.info(`✅ Seeded ${users.length} users`);
    
    const addresses = await seedAddresses(users);
    logger.info(`✅ Seeded ${addresses.length} addresses`);

  } catch (err) {
    logger.error(err.cause);
  }
};

seed();