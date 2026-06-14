import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { categories } from "../schema/categories.js";

export const seedCategories = async() => {
    const data = [
      { name: "Crunchy" },
      { name: "Sugar-Free" },
      { name: "Chocolate" },
      { name: "Smooth" },
    ];

  await db.delete(categories);

  return await db.insert(categories).values(data).returning();
};