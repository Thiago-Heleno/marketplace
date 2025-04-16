DROP INDEX "order_items_vendor_idx";--> statement-breakpoint
CREATE INDEX "order_items_vendor_relation_idx" ON "order_items" USING btree ("vendor_id");