import logger from "../../utils/logger.js";
import { resetDatabase } from "./reset.js"
import { seedUsers } from "./users.js";
import { seedAddresses } from "./addresses.js";
import { seedVendors } from "./vendors.js";
import { seedCategories } from "./categories.js";
import { seedNotifications } from "./notifications.js";
import { seedOrders } from "./orders.js";
import { seedProducts } from "./products.js";
import { seedCartItems } from "./cartItems.js";


const seed = async () => {
  try {
    
    logger.info("DELETING THE EXISTING DATA ...");
    await resetDatabase();
    
    logger.info(` SEEDING DATA ... `);
    
    const categories = await seedCategories();
    logger.info(`✅ Seeded ${categories.length} categories`);
    
    const users = await seedUsers();
    logger.info(`✅ Seeded ${users.length} users`);
    
    const vendors = await seedVendors(users);
    logger.info(`✅ Seeded ${vendors.length} vendors`);
    
    const products = await seedProducts();
    logger.info(`✅ Seeded ${products.length} products`);
    
    const addresses = await seedAddresses(users);
    logger.info(`✅ Seeded ${addresses.length} addresses`);
    
    const orders = await seedOrders();
    logger.info(`✅ Seeded ${orders.length} orders`);
    
    const cartItems = await seedCartItems();
    logger.info(`✅ Seeded ${cartItems.length} cart items`);
    
    const notifications = await seedNotifications(users);
    logger.info(`✅ Seeded ${notifications.length} notifications`);

  } catch (err) {
    logger.error(err.cause || err.message);
  }
};

seed();