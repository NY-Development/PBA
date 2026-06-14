import { seedUsers } from "./users.js";
import { seedVendors } from "./vendors.js";
import { seedNotifications } from "./notifications.js";
import { seedOrders } from "./orders.js";

async function seed() {
  console.log("🌱 Seeding...");

  const users = await seedUsers();

  await seedVendors(users);
  await seedNotifications(users);
  await seedOrders(users);

  console.log("✅ Done");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});