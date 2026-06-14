import { faker } from "@faker-js/faker";
import logger from "../../utils/logger.js";
import { db } from "../index.js";
import { categories } from "../schema/categories.js";

export const seedCategories = async() => {
    const data = [
      "Smooth",
      "Crunchy",
      "Sugar-Free",
      "Chocolate",
      "Smooth",
    ];

  await db.delete(categories);

  return await db.insert(categories).values(data).returning();
};