DROP INDEX "orders_user_idx";--> statement-breakpoint
CREATE INDEX "orders_user_relation_idx" ON "orders" USING btree ("user_id");