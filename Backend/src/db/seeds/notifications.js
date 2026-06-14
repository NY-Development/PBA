import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { notifications } from "../schema/notifications.js";

export const seedNotifications = async(users) => {
  const data = users.map((user) => ({
    userId: user.id,
    type: faker.helpers.arrayElement(['system', 'order', 'promotion']),
    title: faker.lorem.word({ length: { min: 5, max: 8 }, strategy: 'fail' }),
    content: faker.lorem.sentence(3),
    isRead: faker.datatype.boolean(),
    isArchived: faker.datatype.boolean(),
  }));

  await db.delete(notifications);

  return await db.insert(notifications).values(data).returning();
};