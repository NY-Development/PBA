ALTER TABLE "reviews" ALTER COLUMN "rating" SET DATA TYPE numeric(1, 2);--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "chapa_id";