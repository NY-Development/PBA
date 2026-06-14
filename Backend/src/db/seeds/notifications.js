import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { notifications } from "../schema/notifications.js";
import { users } from "../schema/users.js";


export const seedNotifications = async() => {
  try{
    const allUsers = await db.select().from(users);
    
    const data = Array.from({ length: 50 }, () => {
      const user = faker.helpers.arrayElement(allUsers);
      
      return {
        userId: user.id,
        type: faker.helpers.arrayElement(['system', 'order', 'promotion']),
        title: faker.lorem.word({ length: { min: 5, max: 8 }, strategy: 'fail' }),
        content: faker.lorem.sentence(3),
        isRead: faker.datatype.boolean(),
        isArchived: faker.datatype.boolean(),
      };
    });
    
    return await db.insert(notifications).values(data).returning();
  }catch (err) {
    logger.error(err.cause || err.message);
  }
};