DROP INDEX "variants_product_idx";--> statement-breakpoint
CREATE INDEX "variants_product_relation_idx" ON "product_variants" USING btree ("product_id");