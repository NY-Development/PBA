import { seedUsers } from "./users.js";
import logger from "../../utils/logger.js";

const seed = async () => {
  try {
    logger.info("🌱 Seeding...");

    const users = await seedUsers();

    logger.info(`✅ Seeded ${users.length} users`);
  } catch (err) {
    logger.error(err.cause);
  }
};

seed();