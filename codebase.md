

// ---- File: 0001_snapshot.json ----

{
  "id": "347c3724-46cc-4515-b581-241e5528efa6",
  "prevId": "035f1ffe-376c-406e-a937-34a75d6bd29f",
  "version": "7",
  "dialect": "postgresql",
  "tables": {
    "public.addresses": {
      "name": "addresses",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "street": {
          "name": "street",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "city": {
          "name": "city",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "state": {
          "name": "state",
          "type": "varchar(50)",
          "primaryKey": false,
          "notNull": true
        },
        "postal_code": {
          "name": "postal_code",
          "type": "varchar(20)",
          "primaryKey": false,
          "notNull": true
        },
        "country": {
          "name": "country",
          "type": "varchar(50)",
          "primaryKey": false,
          "notNull": true
        },
        "is_default": {
          "name": "is_default",
          "type": "boolean",
          "primaryKey": false,
          "notNull": false,
          "default": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {},
      "foreignKeys": {
        "addresses_user_id_users_id_fk": {
          "name": "addresses_user_id_users_id_fk",
          "tableFrom": "addresses",
          "tableTo": "users",
          "columnsFrom": [
            "user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.affiliate_codes": {
      "name": "affiliate_codes",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "code": {
          "name": "code",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "is_active": {
          "name": "is_active",
          "type": "boolean",
          "primaryKey": false,
          "notNull": true,
          "default": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "affiliate_codes_user_idx": {
          "name": "affiliate_codes_user_idx",
          "columns": [
            {
              "expression": "user_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "affiliate_codes_code_idx": {
          "name": "affiliate_codes_code_idx",
          "columns": [
            {
              "expression": "code",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "affiliate_codes_user_id_users_id_fk": {
          "name": "affiliate_codes_user_id_users_id_fk",
          "tableFrom": "affiliate_codes",
          "tableTo": "users",
          "columnsFrom": [
            "user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "affiliate_codes_code_unique": {
          "name": "affiliate_codes_code_unique",
          "nullsNotDistinct": false,
          "columns": [
            "code"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.affiliate_referrals": {
      "name": "affiliate_referrals",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "affiliate_user_id": {
          "name": "affiliate_user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "affiliate_code_id": {
          "name": "affiliate_code_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "order_item_id": {
          "name": "order_item_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "commission_rate_at_time": {
          "name": "commission_rate_at_time",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "commission_earned_in_cents": {
          "name": "commission_earned_in_cents",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "status": {
          "name": "status",
          "type": "affiliate_referral_status",
          "typeSchema": "public",
          "primaryKey": false,
          "notNull": true,
          "default": "'PENDING'"
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "referrals_affiliate_user_idx": {
          "name": "referrals_affiliate_user_idx",
          "columns": [
            {
              "expression": "affiliate_user_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "referrals_order_item_idx": {
          "name": "referrals_order_item_idx",
          "columns": [
            {
              "expression": "order_item_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "affiliate_referrals_affiliate_user_id_users_id_fk": {
          "name": "affiliate_referrals_affiliate_user_id_users_id_fk",
          "tableFrom": "affiliate_referrals",
          "tableTo": "users",
          "columnsFrom": [
            "affiliate_user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "restrict",
          "onUpdate": "no action"
        },
        "affiliate_referrals_affiliate_code_id_affiliate_codes_id_fk": {
          "name": "affiliate_referrals_affiliate_code_id_affiliate_codes_id_fk",
          "tableFrom": "affiliate_referrals",
          "tableTo": "affiliate_codes",
          "columnsFrom": [
            "affiliate_code_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "restrict",
          "onUpdate": "no action"
        },
        "affiliate_referrals_order_item_id_order_items_id_fk": {
          "name": "affiliate_referrals_order_item_id_order_items_id_fk",
          "tableFrom": "affiliate_referrals",
          "tableTo": "order_items",
          "columnsFrom": [
            "order_item_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "affiliate_referrals_order_item_id_unique": {
          "name": "affiliate_referrals_order_item_id_unique",
          "nullsNotDistinct": false,
          "columns": [
            "order_item_id"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.categories": {
      "name": "categories",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "name": {
          "name": "name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "slug": {
          "name": "slug",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "description": {
          "name": "description",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "categories_name_unique": {
          "name": "categories_name_unique",
          "nullsNotDistinct": false,
          "columns": [
            "name"
          ]
        },
        "categories_slug_unique": {
          "name": "categories_slug_unique",
          "nullsNotDistinct": false,
          "columns": [
            "slug"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.digital_assets": {
      "name": "digital_assets",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "product_id": {
          "name": "product_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "file_path": {
          "name": "file_path",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "file_name": {
          "name": "file_name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "file_type": {
          "name": "file_type",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "file_size_bytes": {
          "name": "file_size_bytes",
          "type": "integer",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "assets_product_idx": {
          "name": "assets_product_idx",
          "columns": [
            {
              "expression": "product_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "digital_assets_product_id_products_id_fk": {
          "name": "digital_assets_product_id_products_id_fk",
          "tableFrom": "digital_assets",
          "tableTo": "products",
          "columnsFrom": [
            "product_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "digital_assets_file_path_unique": {
          "name": "digital_assets_file_path_unique",
          "nullsNotDistinct": false,
          "columns": [
            "file_path"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.order_items": {
      "name": "order_items",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "order_id": {
          "name": "order_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "product_id": {
          "name": "product_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "product_variant_id": {
          "name": "product_variant_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": false
        },
        "vendor_id": {
          "name": "vendor_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "quantity": {
          "name": "quantity",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "price_at_purchase_in_cents": {
          "name": "price_at_purchase_in_cents",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "status": {
          "name": "status",
          "type": "order_item_status",
          "typeSchema": "public",
          "primaryKey": false,
          "notNull": true,
          "default": "'PENDING_FULFILLMENT'"
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "order_items_order_idx": {
          "name": "order_items_order_idx",
          "columns": [
            {
              "expression": "order_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "order_items_product_idx": {
          "name": "order_items_product_idx",
          "columns": [
            {
              "expression": "product_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "order_items_variant_idx": {
          "name": "order_items_variant_idx",
          "columns": [
            {
              "expression": "product_variant_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "order_items_vendor_idx": {
          "name": "order_items_vendor_idx",
          "columns": [
            {
              "expression": "vendor_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "order_items_order_id_orders_id_fk": {
          "name": "order_items_order_id_orders_id_fk",
          "tableFrom": "order_items",
          "tableTo": "orders",
          "columnsFrom": [
            "order_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        },
        "order_items_product_id_products_id_fk": {
          "name": "order_items_product_id_products_id_fk",
          "tableFrom": "order_items",
          "tableTo": "products",
          "columnsFrom": [
            "product_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "restrict",
          "onUpdate": "no action"
        },
        "order_items_product_variant_id_product_variants_id_fk": {
          "name": "order_items_product_variant_id_product_variants_id_fk",
          "tableFrom": "order_items",
          "tableTo": "product_variants",
          "columnsFrom": [
            "product_variant_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "restrict",
          "onUpdate": "no action"
        },
        "order_items_vendor_id_users_id_fk": {
          "name": "order_items_vendor_id_users_id_fk",
          "tableFrom": "order_items",
          "tableTo": "users",
          "columnsFrom": [
            "vendor_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "restrict",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.orders": {
      "name": "orders",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "total_amount_in_cents": {
          "name": "total_amount_in_cents",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "shipping_address_id": {
          "name": "shipping_address_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": false
        },
        "stripe_payment_intent_id": {
          "name": "stripe_payment_intent_id",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "status": {
          "name": "status",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "default": "'PENDING'"
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "orders_user_idx": {
          "name": "orders_user_idx",
          "columns": [
            {
              "expression": "user_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "orders_stripe_pi_idx": {
          "name": "orders_stripe_pi_idx",
          "columns": [
            {
              "expression": "stripe_payment_intent_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "orders_user_id_users_id_fk": {
          "name": "orders_user_id_users_id_fk",
          "tableFrom": "orders",
          "tableTo": "users",
          "columnsFrom": [
            "user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "restrict",
          "onUpdate": "no action"
        },
        "orders_shipping_address_id_addresses_id_fk": {
          "name": "orders_shipping_address_id_addresses_id_fk",
          "tableFrom": "orders",
          "tableTo": "addresses",
          "columnsFrom": [
            "shipping_address_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "set null",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "orders_stripe_payment_intent_id_unique": {
          "name": "orders_stripe_payment_intent_id_unique",
          "nullsNotDistinct": false,
          "columns": [
            "stripe_payment_intent_id"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.password_reset_tokens": {
      "name": "password_reset_tokens",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "token": {
          "name": "token",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "expires_at": {
          "name": "expires_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {},
      "foreignKeys": {
        "password_reset_tokens_user_id_users_id_fk": {
          "name": "password_reset_tokens_user_id_users_id_fk",
          "tableFrom": "password_reset_tokens",
          "tableTo": "users",
          "columnsFrom": [
            "user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "password_reset_tokens_token_unique": {
          "name": "password_reset_tokens_token_unique",
          "nullsNotDistinct": false,
          "columns": [
            "token"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.product_images": {
      "name": "product_images",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "product_id": {
          "name": "product_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "url": {
          "name": "url",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "alt_text": {
          "name": "alt_text",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "order": {
          "name": "order",
          "type": "integer",
          "primaryKey": false,
          "notNull": false,
          "default": 0
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "images_product_idx": {
          "name": "images_product_idx",
          "columns": [
            {
              "expression": "product_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "product_images_product_id_products_id_fk": {
          "name": "product_images_product_id_products_id_fk",
          "tableFrom": "product_images",
          "tableTo": "products",
          "columnsFrom": [
            "product_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.product_variants": {
      "name": "product_variants",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "product_id": {
          "name": "product_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "name": {
          "name": "name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "value": {
          "name": "value",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "price_modifier_in_cents": {
          "name": "price_modifier_in_cents",
          "type": "integer",
          "primaryKey": false,
          "notNull": false,
          "default": 0
        },
        "stock": {
          "name": "stock",
          "type": "integer",
          "primaryKey": false,
          "notNull": true,
          "default": 0
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "variants_product_idx": {
          "name": "variants_product_idx",
          "columns": [
            {
              "expression": "product_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "product_variants_product_id_products_id_fk": {
          "name": "product_variants_product_id_products_id_fk",
          "tableFrom": "product_variants",
          "tableTo": "products",
          "columnsFrom": [
            "product_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.products": {
      "name": "products",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "vendor_id": {
          "name": "vendor_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "category_id": {
          "name": "category_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": false
        },
        "title": {
          "name": "title",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "slug": {
          "name": "slug",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "description": {
          "name": "description",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "price_in_cents": {
          "name": "price_in_cents",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "stock": {
          "name": "stock",
          "type": "integer",
          "primaryKey": false,
          "notNull": true,
          "default": 0
        },
        "tags": {
          "name": "tags",
          "type": "jsonb",
          "primaryKey": false,
          "notNull": false
        },
        "is_digital": {
          "name": "is_digital",
          "type": "boolean",
          "primaryKey": false,
          "notNull": true,
          "default": false
        },
        "is_physical": {
          "name": "is_physical",
          "type": "boolean",
          "primaryKey": false,
          "notNull": true,
          "default": true
        },
        "is_active": {
          "name": "is_active",
          "type": "boolean",
          "primaryKey": false,
          "notNull": true,
          "default": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "products_vendor_idx": {
          "name": "products_vendor_idx",
          "columns": [
            {
              "expression": "vendor_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "products_category_idx": {
          "name": "products_category_idx",
          "columns": [
            {
              "expression": "category_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "products_slug_idx": {
          "name": "products_slug_idx",
          "columns": [
            {
              "expression": "slug",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "products_vendor_id_users_id_fk": {
          "name": "products_vendor_id_users_id_fk",
          "tableFrom": "products",
          "tableTo": "users",
          "columnsFrom": [
            "vendor_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        },
        "products_category_id_categories_id_fk": {
          "name": "products_category_id_categories_id_fk",
          "tableFrom": "products",
          "tableTo": "categories",
          "columnsFrom": [
            "category_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "set null",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "products_slug_unique": {
          "name": "products_slug_unique",
          "nullsNotDistinct": false,
          "columns": [
            "slug"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.question_answers": {
      "name": "question_answers",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "product_id": {
          "name": "product_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "question": {
          "name": "question",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "answer": {
          "name": "answer",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "answered_by_user_id": {
          "name": "answered_by_user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "answered_at": {
          "name": "answered_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": false
        }
      },
      "indexes": {
        "qa_product_idx": {
          "name": "qa_product_idx",
          "columns": [
            {
              "expression": "product_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "qa_user_idx": {
          "name": "qa_user_idx",
          "columns": [
            {
              "expression": "user_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "question_answers_product_id_products_id_fk": {
          "name": "question_answers_product_id_products_id_fk",
          "tableFrom": "question_answers",
          "tableTo": "products",
          "columnsFrom": [
            "product_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        },
        "question_answers_user_id_users_id_fk": {
          "name": "question_answers_user_id_users_id_fk",
          "tableFrom": "question_answers",
          "tableTo": "users",
          "columnsFrom": [
            "user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        },
        "question_answers_answered_by_user_id_users_id_fk": {
          "name": "question_answers_answered_by_user_id_users_id_fk",
          "tableFrom": "question_answers",
          "tableTo": "users",
          "columnsFrom": [
            "answered_by_user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "set null",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.reviews": {
      "name": "reviews",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "product_id": {
          "name": "product_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "rating": {
          "name": "rating",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "comment": {
          "name": "comment",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "reviews_product_user_idx": {
          "name": "reviews_product_user_idx",
          "columns": [
            {
              "expression": "product_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            },
            {
              "expression": "user_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "reviews_product_id_products_id_fk": {
          "name": "reviews_product_id_products_id_fk",
          "tableFrom": "reviews",
          "tableTo": "products",
          "columnsFrom": [
            "product_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        },
        "reviews_user_id_users_id_fk": {
          "name": "reviews_user_id_users_id_fk",
          "tableFrom": "reviews",
          "tableTo": "users",
          "columnsFrom": [
            "user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.users": {
      "name": "users",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "first_name": {
          "name": "first_name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "last_name": {
          "name": "last_name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "email": {
          "name": "email",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "password_hash": {
          "name": "password_hash",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "role": {
          "name": "role",
          "type": "user_role",
          "typeSchema": "public",
          "primaryKey": false,
          "notNull": true,
          "default": "'CUSTOMER'"
        },
        "status": {
          "name": "status",
          "type": "user_status",
          "typeSchema": "public",
          "primaryKey": false,
          "notNull": true,
          "default": "'ACTIVE'"
        },
        "pix_key": {
          "name": "pix_key",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "users_email_unique": {
          "name": "users_email_unique",
          "nullsNotDistinct": false,
          "columns": [
            "email"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.withdrawal_requests": {
      "name": "withdrawal_requests",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "amount_in_cents": {
          "name": "amount_in_cents",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "status": {
          "name": "status",
          "type": "withdrawal_status",
          "typeSchema": "public",
          "primaryKey": false,
          "notNull": true,
          "default": "'PENDING'"
        },
        "pix_key_used": {
          "name": "pix_key_used",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "requested_at": {
          "name": "requested_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "processed_at": {
          "name": "processed_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": false
        },
        "admin_notes": {
          "name": "admin_notes",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        }
      },
      "indexes": {
        "withdrawals_user_idx": {
          "name": "withdrawals_user_idx",
          "columns": [
            {
              "expression": "user_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "withdrawal_requests_user_id_users_id_fk": {
          "name": "withdrawal_requests_user_id_users_id_fk",
          "tableFrom": "withdrawal_requests",
          "tableTo": "users",
          "columnsFrom": [
            "user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    }
  },
  "enums": {
    "public.affiliate_referral_status": {
      "name": "affiliate_referral_status",
      "schema": "public",
      "values": [
        "PENDING",
        "CONFIRMED",
        "PAID",
        "CANCELLED"
      ]
    },
    "public.order_item_status": {
      "name": "order_item_status",
      "schema": "public",
      "values": [
        "PENDING_FULFILLMENT",
        "SHIPPED",
        "DELIVERED",
        "ACCESS_GRANTED",
        "CANCELLED"
      ]
    },
    "public.user_role": {
      "name": "user_role",
      "schema": "public",
      "values": [
        "CUSTOMER",
        "VENDOR",
        "AFFILIATE",
        "ADMIN"
      ]
    },
    "public.user_status": {
      "name": "user_status",
      "schema": "public",
      "values": [
        "PENDING",
        "ACTIVE",
        "REJECTED",
        "SUSPENDED"
      ]
    },
    "public.withdrawal_status": {
      "name": "withdrawal_status",
      "schema": "public",
      "values": [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "PAID"
      ]
    }
  },
  "schemas": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "views": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}

// ---- File: product.actions.ts ----

"use server";

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
// import { z } from "zod"; // Removed direct import, used via ProductSchema
import { auth } from "../../auth";
import { db } from "@/db"; // Needed for database operations
import {
  products,
  productImages,
  digitalAssets,
  categories,
} from "@/db/schema"; // Import necessary schemas
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in orderBy callbacks
import { eq, and, or, ilike, desc, asc } from "drizzle-orm"; // Add or, ilike, desc, asc back
import {
  ProductSchema,
  type ProductFormData,
} from "@/lib/schemas/product.schema";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation"; // Optional redirect after creation

// Define constants for upload directories
const PUBLIC_UPLOADS_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "images"
);
const PROTECTED_UPLOADS_DIR = path.join(process.cwd(), "uploads", "assets");

// Ensure directories exist
const ensureDirectoryExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
  } catch (error: unknown) {
    // Changed any to unknown
    // Directory does not exist, create it recursively
    // Log error message if it's an Error object
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(
      `Directory ${dirPath} not found, creating... Error: ${errorMessage}`
    );
    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    } catch (mkdirError) {
      console.error(`Failed to create directory ${dirPath}:`, mkdirError);
      // Optionally re-throw or handle more gracefully
      throw mkdirError;
    }
  }
};

// Call this at the start to make sure directories are ready
ensureDirectoryExists(PUBLIC_UPLOADS_DIR);
ensureDirectoryExists(PROTECTED_UPLOADS_DIR);

// Define allowed file types and max size (Example: 5MB)
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
// Add allowed types for digital assets if needed (e.g., 'application/pdf')
const ALLOWED_ASSET_TYPES = ["application/pdf", "application/zip"]; // Example

interface UploadFileResult {
  success: boolean;
  filePath?: string; // Relative path for DB storage
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  error?: string;
}

// TODO: Add Zod schema for input validation if needed beyond FormData

export async function uploadFile(
  formData: FormData,
  fileType: "image" | "asset" // Specify if it's a public image or protected asset
): Promise<UploadFileResult> {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    // TODO: Refine role check if ADMIN should also upload
    return {
      success: false,
      error: "Unauthorized: Only active vendors can upload files.",
    };
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "No file provided." };
  }

  // --- Validation ---
  // Size validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `File exceeds maximum size of ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  // Type validation
  const allowedTypes =
    fileType === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_ASSET_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  // --- File Handling ---
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;

    let uploadDir: string;
    let relativePath: string;

    if (fileType === "image") {
      uploadDir = PUBLIC_UPLOADS_DIR;
      // Relative path from /public for web access
      relativePath = path
        .join("/uploads", "images", uniqueFilename)
        .replace(/\\/g, "/");
    } else {
      uploadDir = PROTECTED_UPLOADS_DIR;
      // Relative path from project root for internal access/secure download
      relativePath = path
        .join("uploads", "assets", uniqueFilename)
        .replace(/\\/g, "/");
    }

    const destinationPath = path.join(uploadDir, uniqueFilename);

    // Write the file
    await fs.writeFile(destinationPath, fileBuffer);

    console.log(`File uploaded successfully to: ${destinationPath}`);

    return {
      success: true,
      filePath: relativePath, // Return the relative path suitable for DB storage/access
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };
  } catch (error) {
    console.error("File upload failed:", error);
    return { success: false, error: "File upload failed. Please try again." };
  }
}

// --- Create Product Action ---

interface CreateProductResult {
  success: boolean;
  message?: string;
  error?: string;
  productId?: string;
  redirectTo?: string; // Add redirectTo path
}

export async function createProduct(
  formData: ProductFormData,
  imageData: File | undefined,
  assetData: File | undefined
): Promise<CreateProductResult> {
  // 1. Authentication & Authorization
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized" };
  }
  const vendorId = session.user.id;

  // 2. Input Validation (Schema)
  const validatedFields = ProductSchema.safeParse(formData);
  if (!validatedFields.success) {
    console.error(
      "Product validation failed:",
      validatedFields.error.flatten()
    );
    return {
      success: false,
      error: "Invalid product data.",
      // TODO: Consider returning fieldErrors: validatedFields.error.flatten().fieldErrors
    };
  }
  const productData = validatedFields.data;

  // 3. File Validation (Presence)
  if (!imageData) {
    return { success: false, error: "Product image is required." };
  }
  if (productData.isDigital && !assetData) {
    return {
      success: false,
      error: "Digital asset file is required for digital products.",
    };
  }

  // 4. File Uploads
  let imageUploadResult: UploadFileResult | null = null;
  let assetUploadResult: UploadFileResult | null = null;

  try {
    // Upload Image
    const imageFormData = new FormData();
    imageFormData.append("file", imageData);
    imageUploadResult = await uploadFile(imageFormData, "image");
    if (!imageUploadResult.success || !imageUploadResult.filePath) {
      return {
        success: false,
        error: imageUploadResult.error || "Failed to upload product image.",
      };
    }

    // Upload Asset (if digital)
    if (productData.isDigital && assetData) {
      const assetFormData = new FormData();
      assetFormData.append("file", assetData);
      assetUploadResult = await uploadFile(assetFormData, "asset");
      if (!assetUploadResult.success || !assetUploadResult.filePath) {
        // Attempt to clean up already uploaded image if asset fails
        if (imageUploadResult.filePath) {
          try {
            const imageDiskPath = path.join(
              process.cwd(),
              "public",
              imageUploadResult.filePath
            );
            await fs.unlink(imageDiskPath);
            console.log(
              "Cleaned up uploaded image due to asset upload failure:",
              imageUploadResult.filePath
            );
          } catch (cleanupError) {
            console.error("Failed to cleanup image file:", cleanupError);
          }
        }
        return {
          success: false,
          error: assetUploadResult.error || "Failed to upload digital asset.",
        };
      }
    }
  } catch (uploadError) {
    console.error("Unexpected error during file upload:", uploadError);
    // TODO: Add cleanup logic here too if needed
    return {
      success: false,
      error: "An unexpected error occurred during file upload.",
    };
  }

  // 5. Database Transaction
  try {
    // Generate a UUID for potential slug suffix *before* the transaction
    const uniqueSuffix = uuidv4().substring(0, 8);

    const newProductId = await db.transaction(async (tx) => {
      // Generate initial slug
      let slug = generateSlug(productData.title);

      // Check if slug exists
      const existingSlug = await tx.query.products.findFirst({
        where: eq(products.slug, slug),
        columns: { id: true }, // Only need to know if it exists
      });

      // If slug exists, append unique suffix
      if (existingSlug) {
        slug = `${slug}-${uniqueSuffix}`;
        console.log(`Slug collision detected. Using unique slug: ${slug}`);
      }

      // Parse Tags
      const tagsArray = productData.tags
        ? productData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // Insert Product
      const [newProduct] = await tx
        .insert(products)
        .values({
          vendorId: vendorId,
          title: productData.title,
          slug: slug, // Use generated slug
          description: productData.description,
          priceInCents: productData.priceInCents,
          categoryId: productData.categoryId || null, // Handle optional category
          tags: tagsArray,
          stock: productData.stock,
          isDigital: productData.isDigital,
          isPhysical: productData.isPhysical,
          isActive: true, // Default to active
        })
        .returning({ id: products.id });

      if (!newProduct?.id) {
        throw new Error("Failed to create product record.");
      }
      const productId = newProduct.id;

      // Insert Image Metadata (we know imageUploadResult is successful here)
      await tx.insert(productImages).values({
        productId: productId,
        url: imageUploadResult!.filePath!, // Use the relative path from upload result
        altText: productData.title, // Use product title as default alt text
        order: 0,
      });

      // Insert Asset Metadata (if applicable)
      if (assetUploadResult?.success && assetUploadResult.filePath) {
        await tx.insert(digitalAssets).values({
          productId: productId,
          filePath: assetUploadResult.filePath,
          fileName: assetUploadResult.fileName || "download", // Provide default if undefined (schema requires NOT NULL)
          fileType: assetUploadResult.fileType || null, // Pass null if undefined (schema allows NULL)
          fileSizeBytes: assetUploadResult.fileSize || null, // Pass null if undefined (schema allows NULL)
        });
      }

      return productId;
    });

    // 6. Revalidate Path & Return Success
    revalidatePath("/dashboard/vendor/products"); // Update product list cache
    // Remove commented-out redirect

    return {
      success: true,
      message: "Product created successfully!",
      productId: newProductId,
      redirectTo: "/dashboard/vendor/products", // Add redirect path
    };
  } catch (error) {
    console.error("Failed to create product:", error);
    // Attempt to clean up uploaded files if DB transaction fails
    if (imageUploadResult?.filePath) {
      try {
        const imageDiskPath = path.join(
          process.cwd(),
          "public",
          imageUploadResult.filePath
        );
        await fs.unlink(imageDiskPath);
        console.log(
          "Cleaned up uploaded image due to DB error:",
          imageUploadResult.filePath
        );
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup image file after DB error:",
          cleanupError
        );
      }
    }
    if (assetUploadResult?.filePath) {
      try {
        const assetDiskPath = path.join(
          process.cwd(),
          assetUploadResult.filePath
        ); // Asset path is relative to root
        await fs.unlink(assetDiskPath);
        console.log(
          "Cleaned up uploaded asset due to DB error:",
          assetUploadResult.filePath
        );
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup asset file after DB error:",
          cleanupError
        );
      }
    }
    return { success: false, error: "Database error: Failed to save product." };
  } // End of catch block for DB transaction
} // End of createProduct function

// --- Update Product Action ---

interface UpdateProductResult {
  success: boolean;
  message?: string;
  error?: string;
  redirectTo?: string; // Add redirectTo path
}

export async function updateProduct(
  productId: string,
  formData: ProductFormData,
  imageData?: File, // Optional: Only provided if changed
  assetData?: File // Optional: Only provided if changed
): Promise<UpdateProductResult> {
  // 1. Authentication & Authorization
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized" };
  }
  const vendorId = session.user.id;

  // 2. Input Validation
  const validatedFields = ProductSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid product data." };
  }
  const productData = validatedFields.data;

  // 3. Verify Ownership & Fetch Existing Product
  const existingProduct = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      images: { limit: 1, orderBy: (images, { asc }) => [asc(images.order)] },
      digitalAssets: { limit: 1 },
    },
  });

  if (!existingProduct) {
    return { success: false, error: "Product not found." };
  }
  if (existingProduct.vendorId !== vendorId) {
    return { success: false, error: "Unauthorized: Cannot edit this product." };
  }

  // --- File Handling (Update/Delete Old, Upload New) ---
  let imageUploadResult: UploadFileResult | null = null;
  let assetUploadResult: UploadFileResult | null = null;
  const oldImagePath: string | null = existingProduct.images[0]?.url || null;
  const oldAssetPath: string | null =
    existingProduct.digitalAssets[0]?.filePath || null;

  try {
    // Handle Image Update
    if (imageData) {
      const imageFormData = new FormData();
      imageFormData.append("file", imageData);
      imageUploadResult = await uploadFile(imageFormData, "image");
      if (!imageUploadResult.success || !imageUploadResult.filePath) {
        return {
          success: false,
          error:
            imageUploadResult.error || "Failed to upload new product image.",
        };
      }
      // If upload successful, mark old image for deletion (delete after DB update)
    }

    // Handle Asset Update (if digital)
    if (productData.isDigital && assetData) {
      const assetFormData = new FormData();
      assetFormData.append("file", assetData);
      assetUploadResult = await uploadFile(assetFormData, "asset");
      if (!assetUploadResult.success || !assetUploadResult.filePath) {
        // Cleanup newly uploaded image if asset upload fails
        if (imageUploadResult?.filePath) {
          try {
            const imageDiskPath = path.join(
              process.cwd(),
              "public",
              imageUploadResult.filePath
            );
            await fs.unlink(imageDiskPath);
          } catch (cleanupError) {
            console.error("Failed cleanup new image:", cleanupError);
          }
        }
        return {
          success: false,
          error:
            assetUploadResult.error || "Failed to upload new digital asset.",
        };
      }
      // If upload successful, mark old asset for deletion (delete after DB update)
    } else if (
      !productData.isDigital &&
      existingProduct.isDigital &&
      oldAssetPath
    ) {
      // Product type changed from digital to non-digital, mark old asset for deletion
      console.log(
        "Product changed to non-digital, marking old asset for deletion:",
        oldAssetPath
      );
    }
  } catch (uploadError) {
    console.error("Unexpected error during file update upload:", uploadError);
    // Cleanup any newly uploaded files if error occurs before DB transaction
    if (imageUploadResult?.filePath) {
      try {
        await fs.unlink(
          path.join(process.cwd(), "public", imageUploadResult.filePath)
        );
      } catch {
        /* Ignore cleanup error */
      }
    }
    if (assetUploadResult?.filePath) {
      try {
        await fs.unlink(path.join(process.cwd(), assetUploadResult.filePath));
      } catch {
        /* Ignore cleanup error */
      }
    }
    return {
      success: false,
      error: "An unexpected error occurred during file upload.",
    };
  }

  // 4. Database Transaction (Update)
  try {
    await db.transaction(async (tx) => {
      // Generate Slug (only if title changed?) - For simplicity, let's keep slug for now.
      // const slug = generateSlug(productData.title);

      // Parse Tags
      const tagsArray = productData.tags
        ? productData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // Update Product Record
      await tx
        .update(products)
        .set({
          title: productData.title,
          // slug: slug, // Keep slug for now
          description: productData.description,
          priceInCents: productData.priceInCents,
          categoryId: productData.categoryId || null,
          tags: tagsArray,
          stock: productData.stock,
          isDigital: productData.isDigital,
          isPhysical: productData.isPhysical,
          // isActive: productData.isActive, // Add isActive to form/schema if needed
          updatedAt: new Date(), // Manually set update timestamp
        })
        .where(eq(products.id, productId));

      // Update Image Metadata (if new image uploaded)
      if (imageUploadResult?.success && imageUploadResult.filePath) {
        // Upsert logic: Update if exists, insert if not (though should always exist if product exists)
        // For simplicity, let's assume one image and update it. Delete old one later.
        // If supporting multiple images, logic needs refinement (delete old, insert new, or update existing record).
        await tx
          .update(productImages)
          .set({
            url: imageUploadResult.filePath,
            altText: productData.title,
          })
          .where(eq(productImages.productId, productId)); // Assuming only one image for now
        // If no image record existed (unlikely), insert:
        // .returning() check length, if 0 then insert... (more complex)
      }

      // Update/Insert/Delete Asset Metadata
      if (assetUploadResult?.success && assetUploadResult.filePath) {
        // New asset uploaded
        if (existingProduct.digitalAssets.length > 0) {
          // Update existing asset record
          await tx
            .update(digitalAssets)
            .set({
              filePath: assetUploadResult.filePath,
              fileName: assetUploadResult.fileName || "download",
              fileType: assetUploadResult.fileType || null,
              fileSizeBytes: assetUploadResult.fileSize || null,
            })
            .where(eq(digitalAssets.productId, productId)); // Assuming one asset
        } else {
          // Insert new asset record if none existed
          await tx.insert(digitalAssets).values({
            productId: productId,
            filePath: assetUploadResult.filePath,
            fileName: assetUploadResult.fileName || "download",
            fileType: assetUploadResult.fileType || null,
            fileSizeBytes: assetUploadResult.fileSize || null,
          });
        }
      } else if (
        !productData.isDigital &&
        existingProduct.isDigital &&
        existingProduct.digitalAssets.length > 0
      ) {
        // Product changed to non-digital, delete asset record
        await tx
          .delete(digitalAssets)
          .where(eq(digitalAssets.productId, productId));
      }
    }); // End DB Transaction

    // --- Cleanup Old Files (After successful DB update) ---
    // Delete old image if new one was uploaded
    if (imageUploadResult?.success && oldImagePath) {
      try {
        const oldImageDiskPath = path.join(
          process.cwd(),
          "public",
          oldImagePath
        );
        await fs.unlink(oldImageDiskPath);
        console.log("Cleaned up old image:", oldImagePath);
      } catch (cleanupError) {
        console.error("Failed to cleanup old image file:", cleanupError);
      }
    }
    // Delete old asset if new one was uploaded OR if product became non-digital
    if (
      (assetUploadResult?.success ||
        (!productData.isDigital && existingProduct.isDigital)) &&
      oldAssetPath
    ) {
      try {
        const oldAssetDiskPath = path.join(process.cwd(), oldAssetPath); // Asset path relative to root
        await fs.unlink(oldAssetDiskPath);
        console.log("Cleaned up old asset:", oldAssetPath);
      } catch (cleanupError) {
        console.error("Failed to cleanup old asset file:", cleanupError);
      }
    }

    // 5. Revalidate & Return Success
    revalidatePath("/dashboard/vendor/products");
    revalidatePath(`/dashboard/vendor/products/edit/${productId}`); // Revalidate edit page too

    return {
      success: true,
      message: "Product updated successfully!",
      redirectTo: "/dashboard/vendor/products", // Add redirect path
    };
  } catch (error) {
    console.error("Failed to update product:", error);
    // Cleanup any newly uploaded files if DB transaction fails
    if (imageUploadResult?.filePath) {
      try {
        await fs.unlink(
          path.join(process.cwd(), "public", imageUploadResult.filePath)
        );
      } catch {
        /* Ignore cleanup error */
      }
    }
    if (assetUploadResult?.filePath) {
      try {
        await fs.unlink(path.join(process.cwd(), assetUploadResult.filePath));
      } catch {
        /* Ignore cleanup error */
      }
    }
    return {
      success: false,
      error: "Database error: Failed to update product.",
    };
  }
}

// --- Delete Product Action ---

interface DeleteProductResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function deleteProduct(
  productId: string
): Promise<DeleteProductResult> {
  // 1. Authentication & Authorization
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized" };
  }
  const vendorId = session.user.id;

  // 2. Verify Ownership & Fetch File Paths
  const productToDelete = await db.query.products.findFirst({
    where: eq(products.id, productId),
    columns: { id: true, vendorId: true }, // Only fetch necessary columns
    with: {
      images: { columns: { url: true }, limit: 1 }, // Get image path
      digitalAssets: { columns: { filePath: true }, limit: 1 }, // Get asset path
    },
  });

  if (!productToDelete) {
    return { success: false, error: "Product not found." };
  }
  if (productToDelete.vendorId !== vendorId) {
    return {
      success: false,
      error: "Unauthorized: Cannot delete this product.",
    };
  }

  const imagePath = productToDelete.images[0]?.url || null;
  const assetPath = productToDelete.digitalAssets[0]?.filePath || null;

  // 3. Database Deletion (should cascade via schema relations) & File Cleanup
  try {
    // Delete the product record from the database
    await db.delete(products).where(eq(products.id, productId));

    // If DB deletion is successful, proceed to delete files
    if (imagePath) {
      try {
        const imageDiskPath = path.join(process.cwd(), "public", imagePath);
        await fs.unlink(imageDiskPath);
        console.log("Deleted product image file:", imageDiskPath);
      } catch (cleanupError) {
        console.error("Failed to delete product image file:", cleanupError);
        // Log error but don't necessarily fail the whole operation if DB delete succeeded
      }
    }
    if (assetPath) {
      try {
        const assetDiskPath = path.join(process.cwd(), assetPath); // Asset path relative to root
        await fs.unlink(assetDiskPath);
        console.log("Deleted product asset file:", assetDiskPath);
      } catch (cleanupError) {
        console.error("Failed to delete product asset file:", cleanupError);
        // Log error but don't necessarily fail the whole operation
      }
    }

    // 4. Revalidate & Return Success
    revalidatePath("/dashboard/vendor/products");
    return { success: true, message: "Product deleted successfully!" };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return {
      success: false,
      error: "Database error: Failed to delete product.",
    };
  }
}

// --- Get Single Product Action (for editing) ---
export async function getProductById(productId: string) {
  // 1. Authentication
  const session = await auth();
  if (!session?.user?.id) {
    console.log("getProductById: Unauthenticated access attempt.");
    return null; // Not logged in
  }

  try {
    // 2. Fetch Product Data
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        images: { orderBy: (images, { asc }) => [asc(images.order)] },
        digitalAssets: true,
        // Add variants later if needed
      },
    });

    // 3. Check Product Existence
    if (!product) {
      console.log(`getProductById: Product not found for ID: ${productId}`);
      return null;
    }

    // 4. Authorization Check: Must be owner or admin
    const isOwner = product.vendorId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      console.log(
        `getProductById: Unauthorized access attempt by user ${session.user.id} for product ${productId}.`
      );
      return null; // Not authorized
    }

    // 5. Format data slightly for the form (e.g., tags array to string)
    return {
      ...product,
      tags: product.tags?.join(", ") || "", // Convert array back to comma-separated string
      // Return image/asset info if needed for display/comparison in form
      imageUrl: product.images[0]?.url || null,
      assetFileName: product.digitalAssets[0]?.fileName || null,
    };
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    return null;
  }
}
// --- Get Vendor Products Action ---

// Define the type for the returned product data, including the primary image URL
export type VendorProductListItem = Awaited<
  ReturnType<typeof getVendorProducts>
>[0];

export async function getVendorProducts() {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    // Or throw an error, depending on how you want to handle unauthorized access in components
    return [];
  }
  const vendorId = session.user.id;

  try {
    const vendorProducts = await db.query.products.findMany({
      where: eq(products.vendorId, vendorId),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      with: {
        images: {
          columns: {
            url: true,
          },
          orderBy: (images, { asc }) => [asc(images.order)],
          limit: 1, // Get only the first image (order 0)
        },
        // Add variants count or other relevant info later if needed
      },
      columns: {
        id: true,
        title: true,
        priceInCents: true,
        stock: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Map to include primary image URL directly
    return vendorProducts.map((p) => ({
      ...p,
      imageUrl: p.images[0]?.url || null, // Get the first image URL or null
    }));
  } catch (error) {
    console.error("Failed to fetch vendor products:", error);
    return []; // Return empty array on error
  }
}

// --- Public Storefront Actions ---

// Removed potentially redundant import of desc, asc
// import { desc, asc } from "drizzle-orm"; // Keep this commented or remove line
import {} from // categories, // Now imported above
// users, // Unused
// reviews, // Unused
// questionAnswers, // Unused
// productVariants, // Unused - variants are accessed via relation, not direct import needed here
"@/db/schema"; // Import additional schemas

// --- Get All Public Products ---
export async function getPublicProducts(
  limit: number = 20,
  offset: number = 0
) {
  try {
    const publicProducts = await db.query.products.findMany({
      where: eq(products.isActive, true),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: limit,
      offset: offset,
      with: {
        // Corrected structure after potential auto-format corruption
        images: {
          columns: { url: true },
          orderBy: (images, { asc }) => [asc(images.order)],
          limit: 1,
        },
        category: {
          // Include category for potential filtering/display
          columns: { name: true, slug: true },
        },
      },
      columns: {
        id: true,
        title: true,
        slug: true,
        priceInCents: true,
        // Add other fields needed for listing card if necessary
      },
    });

    return publicProducts.map((p) => ({
      ...p,
      imageUrl: p.images[0]?.url || null,
    }));
  } catch (error) {
    console.error("Failed to fetch public products:", error);
    return [];
  }
}

// --- Get Public Products By Category ---
export async function getPublicProductsByCategory(
  categorySlug: string,
  limit: number = 20,
  offset: number = 0
) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
      columns: { id: true, name: true }, // Get category ID and name
    });

    if (!category) {
      console.log(`Category not found for slug: ${categorySlug}`);
      return { categoryName: null, products: [] }; // Indicate category not found
    }

    const categoryProducts = await db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        eq(products.categoryId, category.id) // Filter by category ID
      ),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: limit,
      offset: offset,
      with: {
        images: {
          columns: { url: true },
          orderBy: (images, { asc }) => [asc(images.order)],
          limit: 1,
        },
      },
      columns: {
        id: true,
        title: true,
        slug: true,
        priceInCents: true,
      },
    });

    return {
      categoryName: category.name,
      products: categoryProducts.map((p) => ({
        ...p,
        imageUrl: p.images[0]?.url || null,
      })),
    };
  } catch (error) {
    console.error(
      `Failed to fetch products for category ${categorySlug}:`,
      error
    );
    return { categoryName: null, products: [] }; // Return empty on error
  }
}

// --- Get Single Public Product By Slug ---
export async function getPublicProductBySlug(productSlug: string) {
  try {
    const product = await db.query.products.findFirst({
      where: and(eq(products.isActive, true), eq(products.slug, productSlug)),
      with: {
        images: {
          orderBy: (images, { asc }) => [asc(images.order)], // Get all images, ordered
        },
        digitalAssets: {
          // Needed to check if digital for download link logic later
          columns: { id: true },
        },
        variants: {
          // Renamed from productVariants for clarity in result
          orderBy: (variants, { asc }) => [
            asc(variants.name),
            asc(variants.value),
          ], // Order variants consistently
        },
        category: {
          columns: { name: true, slug: true },
        },
        vendor: {
          // Fetch vendor info
          columns: { firstName: true, lastName: true }, // Select only needed fields
        },
        reviews: {
          // Fetch reviews
          with: {
            user: { columns: { firstName: true, lastName: true } }, // Get reviewer name
          },
          orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
        },
        questionAnswers: {
          // Fetch Q&A
          with: {
            user: { columns: { firstName: true, lastName: true } },
            answeredByUser: { columns: { firstName: true, lastName: true } },
            product: { columns: { vendorId: true } }, // Added nested product with vendorId
          },
          orderBy: (qa, { desc }) => [desc(qa.createdAt)],
        },
      },
    });

    if (!product) {
      return null; // Not found or not active
    }

    // Combine vendor first/last name using optional chaining
    const vendorName = product.vendor?.firstName
      ? `${product.vendor.firstName} ${product.vendor.lastName}`.trim()
      : "Unknown Vendor";

    // Structure the result cleanly
    return {
      ...product,
      vendor: { name: vendorName }, // Simplified vendor info
      // variants are already included via 'with'
      // images are already included via 'with'
      // category is already included via 'with'
      // reviews are already included via 'with'
      // questionAnswers are already included via 'with'
      hasDigitalAsset: (product.digitalAssets?.length ?? 0) > 0, // Use optional chaining and nullish coalescing
    };
  } catch (error) {
    console.error(`Failed to fetch product by slug ${productSlug}:`, error);
    return null; // Return null on error
  }
}

// --- Search Products Action ---
export async function searchProducts(
  query: string,
  limit: number = 20,
  offset: number = 0
) {
  if (!query) {
    return []; // Return empty if query is empty
  }

  const searchTerm = `%${query}%`; // Prepare for ILIKE

  try {
    const searchResults = await db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        or(
          ilike(products.title, searchTerm),
          ilike(products.description, searchTerm)
          // TODO: Add tag search later if feasible/required. Searching within JSON array needs specific approach.
          // Example (Postgres specific, might need raw sql): sql`tags::text ILIKE ${searchTerm}`
        )
      ),
      orderBy: (products, { desc }) => [desc(products.createdAt)], // Keep consistent ordering
      limit: limit,
      offset: offset,
      with: {
        images: {
          columns: { url: true },
          orderBy: (images, { asc }) => [asc(images.order)],
          limit: 1,
        },
        category: {
          columns: { name: true, slug: true },
        },
      },
      columns: {
        id: true,
        title: true,
        slug: true,
        priceInCents: true,
      },
    });

    return searchResults.map((p) => ({
      ...p,
      imageUrl: p.images[0]?.url || null,
    }));
  } catch (error) {
    console.error(`Failed to search products for query "${query}":`, error);
    return []; // Return empty array on error
  }
}


// ---- File: user.actions.ts ----

"use server";

import { z } from "zod";
import { auth } from "../../auth";
import { db } from "@/db";
import { users, addresses, withdrawalRequests } from "@/db/schema"; // Added withdrawalRequests here too
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in orderBy callback
import { eq, and, desc, sum, sql, or, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { orderItems } from "@/db/schema"; // Moved orderItems import down
import { formatPrice } from "@/lib/utils";

// --- Get User Profile Data ---

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    return null; // Or throw error
  }
  const userId = session.user.id;

  try {
    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        pixKey: true,
      },
      with: {
        addresses: {
          // Fetch associated addresses
          orderBy: (addr, { desc }) => [desc(addr.createdAt)], // Use different alias for orderBy
        },
      },
    });
    return userProfile;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

// --- Approve Withdrawal (Admin) ---
export async function approveWithdrawal(
  requestId: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updated] = await db
      .update(withdrawalRequests)
      .set({
        status: "APPROVED",
        processedAt: new Date(),
        // updatedAt: new Date(), // Removed non-existent field
      })
      .where(
        and(
          eq(withdrawalRequests.id, requestId),
          eq(withdrawalRequests.status, "PENDING") // Can only approve pending requests
        )
      )
      .returning({ id: withdrawalRequests.id });

    if (!updated) {
      return {
        success: false,
        error: "Request not found or not in PENDING state.",
      };
    }

    revalidatePath("/dashboard/admin/withdrawals");
    // TODO: Notify vendor?
    return { success: true, message: "Withdrawal approved." };
  } catch (error) {
    console.error("Failed to approve withdrawal:", error);
    return {
      success: false,
      error: "Database error: Failed to approve withdrawal.",
    };
  }
}

// --- Reject Withdrawal (Admin) ---
const RejectWithdrawalSchema = z.object({
  adminNotes: z.string().min(1, "Rejection reason is required."),
});
export async function rejectWithdrawal(
  requestId: string,
  formData: z.infer<typeof RejectWithdrawalSchema>
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const validatedFields = RejectWithdrawalSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid rejection reason." };
  }
  const { adminNotes } = validatedFields.data;

  try {
    const [updated] = await db
      .update(withdrawalRequests)
      .set({
        status: "REJECTED",
        adminNotes: adminNotes,
        processedAt: new Date(),
        // updatedAt: new Date(), // Removed non-existent field
      })
      .where(
        and(
          eq(withdrawalRequests.id, requestId),
          or(
            // Can reject PENDING or APPROVED requests
            eq(withdrawalRequests.status, "PENDING"),
            eq(withdrawalRequests.status, "APPROVED")
          )
        )
      )
      .returning({ id: withdrawalRequests.id });

    if (!updated) {
      return {
        success: false,
        error: "Request not found or cannot be rejected in its current state.",
      };
    }

    revalidatePath("/dashboard/admin/withdrawals");
    // TODO: Notify vendor?
    return { success: true, message: "Withdrawal rejected." };
  } catch (error) {
    console.error("Failed to reject withdrawal:", error);
    return {
      success: false,
      error: "Database error: Failed to reject withdrawal.",
    };
  }
}

// --- Mark Withdrawal as Paid (Admin) ---
export async function markWithdrawalPaid(
  requestId: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updated] = await db
      .update(withdrawalRequests)
      .set({ status: "PAID", processedAt: new Date() }) // Ensure processedAt is updated
      .where(
        and(
          eq(withdrawalRequests.id, requestId),
          eq(withdrawalRequests.status, "APPROVED") // Can only mark APPROVED requests as paid
        )
      )
      .returning({ id: withdrawalRequests.id });

    if (!updated) {
      return {
        success: false,
        error: "Request not found or not in APPROVED state.",
      };
    }

    revalidatePath("/dashboard/admin/withdrawals");
    // TODO: Notify vendor?
    return { success: true, message: "Withdrawal marked as paid." };
  } catch (error) {
    console.error("Failed to mark withdrawal as paid:", error);
    return {
      success: false,
      error: "Database error: Failed to mark withdrawal as paid.",
    };
  }
}

// --- Admin Withdrawal Management Actions ---

// --- Get Withdrawal Requests (Admin) ---
export async function getWithdrawalRequests(
  status?: "PENDING" | "APPROVED" | "REJECTED" | "PAID"
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  try {
    const requests = await db.query.withdrawalRequests.findMany({
      where: status ? eq(withdrawalRequests.status, status) : undefined, // Optional status filter
      with: {
        user: {
          // Join with user table
          columns: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: (reqs, { desc }) => [desc(reqs.requestedAt)], // Show newest first
    });
    return requests;
  } catch (error) {
    console.error("Failed to fetch withdrawal requests:", error);
    return [];
  }
}

// --- Update User Profile Action ---

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  pixKey: z.string().optional(), // Optional PIX key
});

interface UpdateProfileResult {
  success: boolean;
  message?: string;
  error?: string;
  // fieldErrors?: z.ZodIssue['path'][]; // Consider returning field errors
}

export async function updateUserProfile(
  formData: z.infer<typeof UpdateProfileSchema>
): Promise<UpdateProfileResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;
  const userRole = session.user.role; // Get role for PIX key logic

  const validatedFields = UpdateProfileSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid profile data." };
  }
  const { firstName, lastName, pixKey } = validatedFields.data;

  try {
    const updateData: Partial<typeof users.$inferInsert> = {
      firstName,
      lastName,
      updatedAt: new Date(),
    };

    // Only allow updating PIX key for VENDOR or AFFILIATE
    if (
      (userRole === "VENDOR" || userRole === "AFFILIATE") &&
      pixKey !== undefined
    ) {
      updateData.pixKey = pixKey || null; // Set to null if empty string provided
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    revalidatePath("/dashboard/profile"); // Revalidate profile page
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return {
      success: false,
      error: "Database error: Failed to update profile.",
    };
  }
}

// --- Address Management Actions ---

const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddressFormData = z.infer<typeof AddressSchema>;

interface AddressActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

// --- Create Address ---
export async function createAddress(
  formData: AddressFormData
): Promise<AddressActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  const validatedFields = AddressSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid address data." };
  }

  try {
    // Check if this is the first address, if so, make it default
    const existingAddresses = await db.query.addresses.findMany({
      where: eq(addresses.userId, userId),
      columns: { id: true },
    });
    const isFirstAddress = existingAddresses.length === 0;

    await db.insert(addresses).values({
      ...validatedFields.data,
      userId: userId,
      isDefault: isFirstAddress, // Set as default if it's the first one
    });

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Address added successfully." };
  } catch (error) {
    console.error("Failed to create address:", error);
    return { success: false, error: "Database error: Failed to add address." };
  }
}

// --- Update Address ---
export async function updateAddress(
  addressId: string,
  formData: AddressFormData
): Promise<AddressActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  const validatedFields = AddressSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid address data." };
  }

  try {
    // Verify ownership before updating
    const [updated] = await db
      .update(addresses)
      .set({ ...validatedFields.data, updatedAt: new Date() })
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
      .returning({ id: addresses.id });

    if (!updated) {
      return { success: false, error: "Address not found or access denied." };
    }

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Address updated successfully." };
  } catch (error) {
    console.error("Failed to update address:", error);
    return {
      success: false,
      error: "Database error: Failed to update address.",
    };
  }
}

// --- Delete Address ---
export async function deleteAddress(
  addressId: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  try {
    // Verify ownership before deleting
    const [deleted] = await db
      .delete(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
      .returning({ id: addresses.id, isDefault: addresses.isDefault });

    if (!deleted) {
      return { success: false, error: "Address not found or access denied." };
    }

    // If the deleted address was the default, try to set another one as default
    if (deleted.isDefault) {
      const nextAddress = await db.query.addresses.findFirst({
        where: eq(addresses.userId, userId),
        orderBy: (addr, { desc }) => [desc(addr.createdAt)], // Pick the most recent as new default
      });
      if (nextAddress) {
        await db
          .update(addresses)
          .set({ isDefault: true })
          .where(eq(addresses.id, nextAddress.id));
      }
    }

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Address deleted successfully." };
  } catch (error) {
    console.error("Failed to delete address:", error);
    return {
      success: false,
      error: "Database error: Failed to delete address.",
    };
  }
}

// --- Set Default Address ---
export async function setDefaultAddress(
  addressId: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  try {
    // Use transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // 1. Unset current default
      await tx
        .update(addresses)
        .set({ isDefault: false })
        .where(
          and(eq(addresses.userId, userId), eq(addresses.isDefault, true))
        );

      // 2. Set new default (verify ownership implicitly)
      const [updated] = await tx
        .update(addresses)
        .set({ isDefault: true })
        .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
        .returning({ id: addresses.id });

      if (!updated) {
        throw new Error("Address not found or access denied."); // Rollback transaction
      }
    });

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Default address updated." };
  } catch (error) {
    console.error("Failed to set default address:", error);
    const message =
      error instanceof Error &&
      error.message === "Address not found or access denied."
        ? error.message
        : "Database error: Failed to set default address.";
    return { success: false, error: message };
  }
}

// --- Admin User Management Actions ---

// --- Get Pending Users ---
export async function getPendingUsers() {
  const session = await auth();
  // Ensure user is admin
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
    // Or return { success: false, error: "Unauthorized" } if preferred
  }

  try {
    const pendingUsers = await db.query.users.findMany({
      where: eq(users.status, "PENDING"),
      columns: {
        // Select only necessary fields
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: (users, { asc }) => [asc(users.createdAt)],
    });
    return pendingUsers;
  } catch (error) {
    console.error("Failed to fetch pending users:", error);
    return []; // Return empty array on error
  }
}

// --- Approve User ---
export async function approveUser(
  userIdToApprove: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updatedUser] = await db
      .update(users)
      .set({ status: "ACTIVE", updatedAt: new Date() })
      .where(and(eq(users.id, userIdToApprove), eq(users.status, "PENDING"))) // Ensure user is actually pending
      .returning({ id: users.id });

    if (!updatedUser) {
      return {
        success: false,
        error: "User not found or not pending approval.",
      };
    }

    revalidatePath("/dashboard/admin/approvals"); // Revalidate approvals page
    // TODO: Send notification email to user?
    return { success: true, message: "User approved successfully." };
  } catch (error) {
    console.error("Failed to approve user:", error);
    return { success: false, error: "Database error: Failed to approve user." };
  }
}

// --- Reject User ---
export async function rejectUser(
  userIdToReject: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updatedUser] = await db
      .update(users)
      .set({ status: "REJECTED", updatedAt: new Date() })
      .where(and(eq(users.id, userIdToReject), eq(users.status, "PENDING"))) // Ensure user is actually pending
      .returning({ id: users.id });

    if (!updatedUser) {
      return {
        success: false,
        error: "User not found or not pending approval.",
      };
    }

    revalidatePath("/dashboard/admin/approvals"); // Revalidate approvals page
    // TODO: Send notification email to user?
    return { success: true, message: "User rejected successfully." };
  } catch (error) {
    console.error("Failed to reject user:", error);
    return { success: false, error: "Database error: Failed to reject user." };
  }
}

export async function getVendorBalance() {
  const session = await auth();
  if (session?.user?.role !== "VENDOR" || !session?.user?.id) {
    // Only vendors have a balance in this context
    // Or throw an error if preferred
    return {
      availableBalance: 0,
      pendingBalance: 0, // Balance from orders not yet delivered/accessed
      pendingWithdrawals: 0, // Amount requested but not yet paid
      totalEarnings: 0, // Total earned from completed items (for info)
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
  const vendorId = session.user.id;
  // Ensure commission rate is read correctly from ENV and parsed
  const commissionRateString = process.env.MARKETPLACE_COMMISSION_RATE;
  if (commissionRateString === undefined) {
    console.error(
      "MARKETPLACE_COMMISSION_RATE environment variable is not set."
    );
    // Handle error appropriately, maybe return zero balance or throw
    return {
      availableBalance: 0,
      pendingBalance: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
  const commissionRate = parseFloat(commissionRateString);
  if (isNaN(commissionRate)) {
    console.error("Invalid MARKETPLACE_COMMISSION_RATE:", commissionRateString);
    // Handle error
    return {
      availableBalance: 0,
      pendingBalance: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }

  try {
    // 1. Calculate total earnings from completed order items
    const earningsResult = await db
      .select({
        // Use sql for explicit casting and null handling
        total: sql<string>`coalesce(sum(${orderItems.priceAtPurchaseInCents}::integer), 0)::text`,
      })
      .from(orderItems)
      .where(
        and(
          eq(orderItems.vendorId, vendorId),
          // Statuses indicating vendor should be credited
          or(
            eq(orderItems.status, "DELIVERED"),
            eq(orderItems.status, "ACCESS_GRANTED")
          )
        )
      )
      .groupBy(orderItems.vendorId); // Grouping needed for aggregate function

    const totalEarnedGross = parseInt(
      earningsResult[0]?.total?.toString() || "0"
    ); // Ensure parsing from potential string sum
    const totalCommission = Math.round(totalEarnedGross * commissionRate);
    const totalEarningsNet = totalEarnedGross - totalCommission;

    // 2. Calculate earnings from items pending completion (for info)
    const pendingEarningsResult = await db
      .select({
        // Use sql for explicit casting and null handling
        total: sql<string>`coalesce(sum(${orderItems.priceAtPurchaseInCents}::integer), 0)::text`,
      })
      .from(orderItems)
      .where(
        and(
          eq(orderItems.vendorId, vendorId),
          // Statuses indicating payment received but not yet fully completed for vendor payout
          inArray(orderItems.status, ["PENDING_FULFILLMENT", "SHIPPED"])
        )
      )
      .groupBy(orderItems.vendorId);

    const pendingEarnedGross = parseInt(
      pendingEarningsResult[0]?.total?.toString() || "0"
    );
    const pendingCommission = Math.round(pendingEarnedGross * commissionRate);
    const pendingBalance = pendingEarnedGross - pendingCommission;

    // 3. Calculate total amount from pending/approved withdrawal requests
    const withdrawalsResult = await db
      .select({
        // Use sql for explicit casting and null handling
        total: sql<string>`coalesce(sum(${withdrawalRequests.amountInCents}::integer), 0)::text`,
      })
      .from(withdrawalRequests)
      .where(
        and(
          eq(withdrawalRequests.userId, vendorId),
          // Withdrawals requested or approved but not yet marked as paid
          inArray(withdrawalRequests.status, ["PENDING", "APPROVED"])
        )
      )
      .groupBy(withdrawalRequests.userId);

    const pendingWithdrawals = parseInt(
      withdrawalsResult[0]?.total?.toString() || "0"
    );

    // 4. Calculate available balance
    // Available = Total Net Earnings (from completed items) - Pending/Approved Withdrawals
    const availableBalance = totalEarningsNet - pendingWithdrawals;

    return {
      availableBalance: availableBalance,
      pendingBalance: pendingBalance, // Informational: potential future earnings
      pendingWithdrawals: pendingWithdrawals, // Amount locked in requests
      totalEarnings: totalEarningsNet, // Net earnings from completed items
      formatted: {
        availableBalance: formatPrice(availableBalance),
        pendingBalance: formatPrice(pendingBalance),
        pendingWithdrawals: formatPrice(pendingWithdrawals),
        totalEarnings: formatPrice(totalEarningsNet),
      },
    };
  } catch (error) {
    console.error("Failed to calculate vendor balance:", error);
    // Return zero balance on error, log the error
    return {
      availableBalance: 0,
      pendingBalance: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
}

// --- Request Withdrawal Action ---

const RequestWithdrawalSchema = z.object({
  amount: z.coerce // Use coerce to ensure string input becomes number
    .number()
    .int("Amount must be in cents.")
    .positive("Withdrawal amount must be positive."),
});

interface RequestWithdrawalResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function requestWithdrawal(
  formData: z.infer<typeof RequestWithdrawalSchema>
): Promise<RequestWithdrawalResult> {
  const session = await auth();
  if (session?.user?.role !== "VENDOR" || !session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized: Only vendors can request withdrawals.",
    };
  }
  const vendorId = session.user.id;

  // 1. Validate Input Amount
  const validatedFields = RequestWithdrawalSchema.safeParse(formData);
  if (!validatedFields.success) {
    // Extract specific field errors if needed
    const firstError =
      validatedFields.error.errors[0]?.message || "Invalid amount.";
    return { success: false, error: firstError };
  }
  const requestedAmountInCents = validatedFields.data.amount;

  try {
    // 2. Get Vendor's PIX Key and Current Balance
    const [vendorData, balanceData] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, vendorId),
        columns: { pixKey: true },
      }),
      getVendorBalance(), // Reuse the balance calculation logic
    ]);

    if (!vendorData) {
      return { success: false, error: "Vendor not found." }; // Should not happen if session is valid
    }

    // 3. Check for PIX Key
    if (!vendorData.pixKey) {
      return {
        success: false,
        error:
          "Please set your PIX key in your profile before requesting a withdrawal.",
      };
    }

    // 4. Check Available Balance
    if (requestedAmountInCents > balanceData.availableBalance) {
      return {
        success: false,
        error: `Withdrawal amount exceeds available balance (${formatPrice(balanceData.availableBalance)}).`,
      };
    }

    // 5. Check for existing PENDING withdrawal request (optional, prevent multiple pending)
    const existingPending = await db.query.withdrawalRequests.findFirst({
      where: and(
        eq(withdrawalRequests.userId, vendorId),
        eq(withdrawalRequests.status, "PENDING")
      ),
    });
    if (existingPending) {
      return {
        success: false,
        error: "You already have a pending withdrawal request.",
      };
    }

    // 6. Create Withdrawal Request Record
    await db.insert(withdrawalRequests).values({
      userId: vendorId,
      amountInCents: requestedAmountInCents,
      status: "PENDING", // Initial status
      pixKeyUsed: vendorData.pixKey, // Record the key used for this request
      requestedAt: new Date(),
    });

    // Revalidate relevant paths if needed (e.g., vendor dashboard, admin withdrawals page)
    revalidatePath("/dashboard/vendor");
    // revalidatePath("/dashboard/admin/withdrawals"); // Uncomment when admin page exists

    return {
      success: true,
      message: "Withdrawal request submitted successfully.",
    };
  } catch (error) {
    console.error("Failed to request withdrawal:", error);
    return {
      success: false,
      error: "Database error: Failed to submit withdrawal request.",
    };
  }
}


// ---- File: schema.ts ----

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// --- Enums ---

export const userRoleEnum = pgEnum("user_role", [
  "CUSTOMER",
  "VENDOR",
  "AFFILIATE",
  "ADMIN",
]);
export const userStatusEnum = pgEnum("user_status", [
  "PENDING",
  "ACTIVE",
  "REJECTED",
  "SUSPENDED", // Added for potential future use
]);

export const orderItemStatusEnum = pgEnum("order_item_status", [
  "PENDING_FULFILLMENT", // Physical item, awaiting shipment
  "SHIPPED", // Physical item, shipped
  "DELIVERED", // Physical item, delivered
  "ACCESS_GRANTED", // Digital item, access provided (typically on order completion)
  "CANCELLED", // Item cancelled (by vendor or admin)
]);

export const affiliateReferralStatusEnum = pgEnum("affiliate_referral_status", [
  "PENDING", // Linked order item not yet fulfilled/confirmed
  "CONFIRMED", // Linked order item fulfilled, commission eligible
  "PAID", // Commission included in a paid withdrawal
  "CANCELLED", // Linked order item cancelled
]);

export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "PENDING", // Requested, awaiting admin action
  "APPROVED", // Approved by admin, awaiting payment
  "REJECTED", // Rejected by admin
  "PAID", // Marked as paid by admin
]);

// --- Tables ---

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("CUSTOMER"),
  status: userStatusEnum("status").notNull().default("ACTIVE"), // Default handled dynamically on creation based on role
  pixKey: text("pix_key"), // Optional, for Vendors/Affiliates
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Cascade delete if user is deleted
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: varchar("state", { length: 50 }).notNull(), // Assuming state/province codes/names fit
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  // No changes needed here for Task 2.1
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- Phase 2 Tables ---

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(), // For URLs
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Link to the vendor (user)
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null", // Keep product if category deleted
    }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(), // Unique slug for product URL
    description: text("description"),
    priceInCents: integer("price_in_cents").notNull(), // Store price as integer cents
    stock: integer("stock").notNull().default(0), // Overall stock, might be sum of variants if used
    tags: jsonb("tags").$type<string[]>(), // Store tags as a JSON array of strings
    isDigital: boolean("is_digital").notNull().default(false),
    isPhysical: boolean("is_physical").notNull().default(true), // Assume physical unless specified
    isActive: boolean("is_active").notNull().default(true), // Vendor can deactivate
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      vendorIdx: uniqueIndex("products_vendor_idx").on(table.vendorId),
      categoryIdx: uniqueIndex("products_category_idx").on(table.categoryId),
      slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
    };
  }
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }), // Cascade delete variants if product deleted
    name: text("name").notNull(), // e.g., "Size", "Color"
    value: text("value").notNull(), // e.g., "Large", "Red"
    priceModifierInCents: integer("price_modifier_in_cents").default(0), // Add/subtract from base product price
    stock: integer("stock").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      productIdx: uniqueIndex("variants_product_idx").on(table.productId),
      // Unique constraint for product + name + value? Maybe too strict?
      // unique(table.productId, table.name, table.value)
    };
  }
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(), // Path relative to /public/uploads/images
    altText: text("alt_text"),
    order: integer("order").default(0), // For ordering images
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      productIdx: uniqueIndex("images_product_idx").on(table.productId),
    };
  }
);

export const digitalAssets = pgTable(
  "digital_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    filePath: text("file_path").notNull().unique(), // Path relative to ./uploads/assets (secure location)
    fileName: text("file_name").notNull(), // Original filename for download
    fileType: text("file_type"), // e.g., application/pdf
    fileSizeBytes: integer("file_size_bytes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      productIdx: uniqueIndex("assets_product_idx").on(table.productId),
    };
  }
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // User who wrote the review
    rating: integer("rating").notNull(), // e.g., 1-5 stars
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      productUserIdx: uniqueIndex("reviews_product_user_idx").on(
        table.productId,
        table.userId
      ), // Allow only one review per user per product
    };
  }
);

export const questionAnswers = pgTable(
  "question_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // User who asked the question
    question: text("question").notNull(),
    answer: text("answer"), // Answer provided by vendor or admin
    answeredByUserId: uuid("answered_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }), // User who answered
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
  },
  (table) => {
    return {
      productIdx: uniqueIndex("qa_product_idx").on(table.productId),
      userIdx: uniqueIndex("qa_user_idx").on(table.userId),
    };
  }
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Don't delete orders if user deleted? Or set null? Restrict for now.
    totalAmountInCents: integer("total_amount_in_cents").notNull(),
    shippingAddressId: uuid("shipping_address_id").references(
      () => addresses.id,
      { onDelete: "set null" } // Keep order even if address deleted
    ),
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(), // Store Stripe Payment Intent ID
    status: text("status").default("PENDING"), // e.g., PENDING, PROCESSING, COMPLETED, FAILED
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdx: uniqueIndex("orders_user_idx").on(table.userId),
      paymentIntentIdx: uniqueIndex("orders_stripe_pi_idx").on(
        table.stripePaymentIntentId
      ),
    };
  }
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }), // Delete items if order deleted
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }), // Don't delete item if product deleted (keep order history)
    productVariantId: uuid("product_variant_id").references(
      () => productVariants.id,
      { onDelete: "restrict" } // Don't delete item if variant deleted
    ),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Keep item even if vendor deleted
    quantity: integer("quantity").notNull(),
    priceAtPurchaseInCents: integer("price_at_purchase_in_cents").notNull(), // Price of the item (variant adjusted) when bought
    status: orderItemStatusEnum("status")
      .notNull()
      .default("PENDING_FULFILLMENT"), // Default handled dynamically based on product type
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      orderIdx: uniqueIndex("order_items_order_idx").on(table.orderId),
      productIdx: uniqueIndex("order_items_product_idx").on(table.productId),
      variantIdx: uniqueIndex("order_items_variant_idx").on(
        table.productVariantId
      ),
      vendorIdx: uniqueIndex("order_items_vendor_idx").on(table.vendorId),
    };
  }
);

export const affiliateCodes = pgTable(
  "affiliate_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Affiliate user
    code: text("code").notNull().unique(), // The unique referral code
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      userIdx: uniqueIndex("affiliate_codes_user_idx").on(table.userId),
      codeIdx: uniqueIndex("affiliate_codes_code_idx").on(table.code),
    };
  }
);

export const affiliateReferrals = pgTable(
  "affiliate_referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    affiliateUserId: uuid("affiliate_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Affiliate who gets commission
    affiliateCodeId: uuid("affiliate_code_id")
      .notNull()
      .references(() => affiliateCodes.id, { onDelete: "restrict" }), // Code used
    orderItemId: uuid("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }) // Link to the specific item generating commission
      .unique(), // Only one referral per order item
    commissionRateAtTime: integer("commission_rate_at_time").notNull(), // Store as integer basis points (e.g., 500 for 5%)
    commissionEarnedInCents: integer("commission_earned_in_cents").notNull(),
    status: affiliateReferralStatusEnum("status").notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      affiliateUserIdx: uniqueIndex("referrals_affiliate_user_idx").on(
        table.affiliateUserId
      ),
      orderItemIdx: uniqueIndex("referrals_order_item_idx").on(
        table.orderItemId
      ),
    };
  }
);

export const withdrawalRequests = pgTable(
  "withdrawal_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Vendor or Affiliate requesting
    amountInCents: integer("amount_in_cents").notNull(),
    status: withdrawalStatusEnum("status").notNull().default("PENDING"),
    pixKeyUsed: text("pix_key_used").notNull(), // Record the PIX key used for this request
    requestedAt: timestamp("requested_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }), // When admin processed it
    adminNotes: text("admin_notes"), // Optional notes from admin
  },
  (table) => {
    return {
      userIdx: uniqueIndex("withdrawals_user_idx").on(table.userId),
    };
  }
);

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  passwordResetTokens: many(passwordResetTokens),
  products: many(products, { relationName: "vendorProducts" }), // Vendor's products
  orders: many(orders), // Customer's orders
  reviews: many(reviews),
  questions: many(questionAnswers, { relationName: "userQuestions" }),
  answers: many(questionAnswers, { relationName: "userAnswers" }),
  affiliateCodes: many(affiliateCodes),
  affiliateReferrals: many(affiliateReferrals), // Referrals generated by this affiliate
  withdrawalRequests: many(withdrawalRequests),
  orderItemsVendor: many(orderItems, { relationName: "vendorOrderItems" }), // Order items belonging to this vendor
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  // Removed unused 'many' here
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  // Removed unused 'many' relation for orders here as it wasn't defined elsewhere
  // orders: many(orders), // Orders shipped to this address
}));

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  })
);

// --- Phase 2 Relations ---

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  vendor: one(users, {
    fields: [products.vendorId],
    references: [users.id],
    // relationName: "vendorProducts", // Removed relationName
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  digitalAssets: many(digitalAssets),
  reviews: many(reviews),
  questionAnswers: many(questionAnswers),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    orderItems: many(orderItems),
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const digitalAssetsRelations = relations(digitalAssets, ({ one }) => ({
  product: one(products, {
    fields: [digitalAssets.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const questionAnswersRelations = relations(
  questionAnswers,
  ({ one }) => ({
    product: one(products, {
      fields: [questionAnswers.productId],
      references: [products.id],
    }),
    user: one(users, {
      fields: [questionAnswers.userId],
      references: [users.id],
      relationName: "userQuestions",
    }),
    answeredByUser: one(users, {
      fields: [questionAnswers.answeredByUserId],
      references: [users.id],
      relationName: "userAnswers",
    }),
  })
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
  vendor: one(users, {
    fields: [orderItems.vendorId],
    references: [users.id],
    relationName: "vendorOrderItems",
  }),
  affiliateReferral: one(affiliateReferrals, {
    // Link back to the referral if one exists
    fields: [orderItems.id],
    references: [affiliateReferrals.orderItemId],
  }),
}));

export const affiliateCodesRelations = relations(
  affiliateCodes,
  ({ one, many }) => ({
    user: one(users, {
      // The affiliate who owns the code
      fields: [affiliateCodes.userId],
      references: [users.id],
    }),
    referrals: many(affiliateReferrals), // Referrals made using this code
  })
);

export const affiliateReferralsRelations = relations(
  affiliateReferrals,
  ({ one }) => ({
    affiliateUser: one(users, {
      // The affiliate who earned the commission
      fields: [affiliateReferrals.affiliateUserId],
      references: [users.id],
    }),
    affiliateCode: one(affiliateCodes, {
      // The code used for the referral
      fields: [affiliateReferrals.affiliateCodeId],
      references: [affiliateCodes.id],
    }),
    orderItem: one(orderItems, {
      // The specific order item that triggered the referral
      fields: [affiliateReferrals.orderItemId],
      references: [orderItems.id],
    }),
  })
);

export const withdrawalRequestsRelations = relations(
  withdrawalRequests,
  ({ one }) => ({
    user: one(users, {
      // The user (Vendor/Affiliate) requesting withdrawal
      fields: [withdrawalRequests.userId],
      references: [users.id],
    }),
  })
);


// ---- File: 0001_amazing_gamora.sql ----

CREATE TYPE "public"."affiliate_referral_status" AS ENUM('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."order_item_status" AS ENUM('PENDING_FULFILLMENT', 'SHIPPED', 'DELIVERED', 'ACCESS_GRANTED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID');--> statement-breakpoint
ALTER TYPE "public"."user_status" ADD VALUE 'SUSPENDED';--> statement-breakpoint
CREATE TABLE "affiliate_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"code" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "affiliate_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "affiliate_referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"affiliate_user_id" uuid NOT NULL,
	"affiliate_code_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"commission_rate_at_time" integer NOT NULL,
	"commission_earned_in_cents" integer NOT NULL,
	"status" "affiliate_referral_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "affiliate_referrals_order_item_id_unique" UNIQUE("order_item_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "digital_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"file_path" text NOT NULL,
	"file_name" text NOT NULL,
	"file_type" text,
	"file_size_bytes" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "digital_assets_file_path_unique" UNIQUE("file_path")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"product_variant_id" uuid,
	"vendor_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price_at_purchase_in_cents" integer NOT NULL,
	"status" "order_item_status" DEFAULT 'PENDING_FULFILLMENT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_amount_in_cents" integer NOT NULL,
	"shipping_address_id" uuid,
	"stripe_payment_intent_id" text,
	"status" text DEFAULT 'PENDING',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"price_modifier_in_cents" integer DEFAULT 0,
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"category_id" uuid,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"price_in_cents" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"tags" jsonb,
	"is_digital" boolean DEFAULT false NOT NULL,
	"is_physical" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "question_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text,
	"answered_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"answered_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "withdrawal_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount_in_cents" integer NOT NULL,
	"status" "withdrawal_status" DEFAULT 'PENDING' NOT NULL,
	"pix_key_used" text NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"admin_notes" text
);
--> statement-breakpoint
ALTER TABLE "affiliate_codes" ADD CONSTRAINT "affiliate_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD CONSTRAINT "affiliate_referrals_affiliate_user_id_users_id_fk" FOREIGN KEY ("affiliate_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD CONSTRAINT "affiliate_referrals_affiliate_code_id_affiliate_codes_id_fk" FOREIGN KEY ("affiliate_code_id") REFERENCES "public"."affiliate_codes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD CONSTRAINT "affiliate_referrals_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_assets" ADD CONSTRAINT "digital_assets_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_answers" ADD CONSTRAINT "question_answers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_answers" ADD CONSTRAINT "question_answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_answers" ADD CONSTRAINT "question_answers_answered_by_user_id_users_id_fk" FOREIGN KEY ("answered_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "affiliate_codes_user_idx" ON "affiliate_codes" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "affiliate_codes_code_idx" ON "affiliate_codes" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "referrals_affiliate_user_idx" ON "affiliate_referrals" USING btree ("affiliate_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "referrals_order_item_idx" ON "affiliate_referrals" USING btree ("order_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "assets_product_idx" ON "digital_assets" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "order_items_product_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "order_items_variant_idx" ON "order_items" USING btree ("product_variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "order_items_vendor_idx" ON "order_items" USING btree ("vendor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_user_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_stripe_pi_idx" ON "orders" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "images_product_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "variants_product_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_vendor_idx" ON "products" USING btree ("vendor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_category_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "qa_product_idx" ON "question_answers" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "qa_user_idx" ON "question_answers" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_product_user_idx" ON "reviews" USING btree ("product_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "withdrawals_user_idx" ON "withdrawal_requests" USING btree ("user_id");

// ---- File: route.ts ----

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  orders,
  orderItems,
  products,
  productVariants,
  affiliateCodes, // Added
  affiliateReferrals, // Added
} from "@/db/schema";
import { eq, inArray, sql, and } from "drizzle-orm"; // Added 'and'
import { Resend } from "resend";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const resendApiKey = process.env.RESEND_API_KEY;
const affiliateCommissionRateString = process.env.AFFILIATE_COMMISSION_RATE; // Added

if (
  !stripeSecretKey ||
  !webhookSecret ||
  !resendApiKey ||
  affiliateCommissionRateString === undefined // Check if rate is set
) {
  throw new Error(
    "Stripe secret key, webhook secret, Resend API key, or Affiliate Commission Rate is not set in environment variables."
  );
}

const stripe = new Stripe(stripeSecretKey);
const resend = new Resend(resendApiKey);

// Helper type for parsed cart details
type ParsedCartItem = { vId: string; qty: number };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }
  if (!webhookSecret) {
    console.error("❌ Stripe webhook secret is not configured.");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(
      `❌ Error verifying Stripe webhook signature: ${errorMessage}`
    );
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("✅ Received checkout.session.completed event:", session.id);

    // --- Order Creation Logic ---
    const metadata = session.metadata;
    const userId = metadata?.userId;
    const cartDetailsString = metadata?.cartDetails;
    const shippingAddressId = metadata?.addressId;
    const affiliateCode = metadata?.affiliateCode; // Extract affiliate code
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    const customerEmail = session.customer_details?.email; // Get customer email for confirmation
    const totalAmount = session.amount_total; // Total amount in cents from Stripe

    // Basic validation of metadata
    if (!userId || !cartDetailsString || !paymentIntentId || !totalAmount) {
      console.error("❌ Missing essential metadata from Stripe session:", {
        userId,
        cartDetailsString,
        paymentIntentId,
        totalAmount,
      });
      return NextResponse.json(
        { error: "Missing essential metadata." },
        { status: 400 }
      );
    }

    let parsedCartItems: ParsedCartItem[] = [];
    try {
      parsedCartItems = JSON.parse(cartDetailsString);
      if (!Array.isArray(parsedCartItems) || parsedCartItems.length === 0) {
        throw new Error("Invalid cart details format or empty cart.");
      }
    } catch (error) {
      console.error("❌ Failed to parse cartDetails metadata:", error);
      return NextResponse.json(
        { error: "Invalid cart details metadata." },
        { status: 400 }
      );
    }

    try {
      // Fetch necessary product/variant details for order creation
      const variantIds = parsedCartItems.map((item) => item.vId);
      const fetchedVariants = await db.query.productVariants.findMany({
        where: inArray(productVariants.id, variantIds),
        with: {
          product: {
            columns: { id: true, vendorId: true, isDigital: true, title: true },
          },
        },
        columns: { id: true, productId: true, priceModifierInCents: true },
      });

      const productIds = fetchedVariants.map((v) => v.productId);
      const baseProducts = await db.query.products.findMany({
        where: inArray(products.id, productIds),
        columns: { id: true, priceInCents: true },
      });
      const basePriceMap = new Map(
        baseProducts.map((p) => [p.id, p.priceInCents])
      );

      // Assert userId as string before transaction, as the initial check guarantees it's defined here.
      const customerUserId = userId as string;

      // Start DB Transaction
      const newOrderId = await db.transaction(async (tx) => {
        // Create Order record
        const [newOrder] = await tx
          .insert(orders)
          .values({
            userId: customerUserId, // Use asserted variable
            totalAmountInCents: totalAmount,
            shippingAddressId: shippingAddressId || null, // Use null if not provided
            stripePaymentIntentId: paymentIntentId,
            status: "PROCESSING", // Initial status
          })
          .returning({ id: orders.id });

        if (!newOrder?.id) {
          throw new Error("Failed to create order record.");
        }
        const orderId = newOrder.id;

        // Create OrderItem records and decrement stock
        for (const item of parsedCartItems) {
          const variantDetails = fetchedVariants.find((v) => v.id === item.vId);
          const basePrice = basePriceMap.get(variantDetails?.productId ?? "");

          if (!variantDetails || basePrice === undefined) {
            throw new Error(`Could not find details for variant ${item.vId}`);
          }

          const finalPrice =
            basePrice + (variantDetails.priceModifierInCents || 0);
          const itemStatus = variantDetails.product.isDigital
            ? "ACCESS_GRANTED"
            : "PENDING_FULFILLMENT";

          // Insert Order Item
          const [insertedOrderItem] = await tx
            .insert(orderItems)
            .values({
              // Capture inserted item ID
              orderId: orderId,
              productId: variantDetails.productId,
              productVariantId: variantDetails.id,
              vendorId: variantDetails.product.vendorId, // Get vendorId from fetched product
              quantity: item.qty,
              priceAtPurchaseInCents: finalPrice,
              status: itemStatus,
            })
            .returning({ id: orderItems.id }); // Return the ID

          if (!insertedOrderItem?.id) {
            console.error(
              `❌ Failed to insert or retrieve ID for order item with variant ${variantDetails.id}`
            );
            // Optionally throw error to rollback transaction if this is critical
            continue; // Skip stock/affiliate logic if item insertion failed
          }
          const newOrderItemId = insertedOrderItem.id;

          // Decrement Stock (Atomic operation with check)
          const updateStockResult = await tx
            .update(productVariants)
            .set({ stock: sql`${productVariants.stock} - ${item.qty}` })
            .where(
              and(
                eq(productVariants.id, item.vId),
                sql`${productVariants.stock} >= ${item.qty}` // Check if stock is sufficient
              )
            )
            .returning({ id: productVariants.id }); // Return ID to check if update occurred

          // Check if stock update failed (due to insufficient stock)
          if (updateStockResult.length === 0) {
            console.error(
              `❌ Stock update failed for variant ${item.vId} (Order ${orderId}, Item ${newOrderItemId}). Insufficient stock (${item.qty} requested). Payment already processed.`
            );
            // Mark the order item as cancelled due to stock issue after payment
            await tx
              .update(orderItems)
              .set({ status: "CANCELLED" }) // Or a custom 'STOCK_ERROR' status
              .where(eq(orderItems.id, newOrderItemId));
            console.warn(
              `⚠️ Order item ${newOrderItemId} status set to CANCELLED due to insufficient stock after payment.`
            );
            // Skip affiliate logic for this item as it couldn't be fulfilled
            continue;
          }

          // --- Affiliate Referral Logic ---
          // Check if affiliateCode is a valid, non-empty string first
          if (
            typeof affiliateCode === "string" && // Check type first
            affiliateCode.trim() !== "" // Then check content
          ) {
            const codeToQuery = affiliateCode; // Let TS infer type (should be string here)
            const affiliateRate = parseFloat(affiliateCommissionRateString);

            if (isNaN(affiliateRate)) {
              console.error(
                "❌ Invalid AFFILIATE_COMMISSION_RATE:",
                affiliateCommissionRateString
              );
            } else {
              // Now query for the code using the guaranteed string constant
              const validCode = await tx.query.affiliateCodes.findFirst({
                where: and(
                  eq(affiliateCodes.code, codeToQuery), // Use the guaranteed string
                  eq(affiliateCodes.isActive, true)
                ),
                columns: { id: true, userId: true },
              });

              // Check if code exists, is active, and affiliate is not the customer
              // Use the asserted customerUserId here
              if (validCode && validCode.userId !== customerUserId) {
                const commissionEarned = Math.round(finalPrice * affiliateRate);

                // Insert referral record only if commission > 0
                if (commissionEarned > 0) {
                  await tx.insert(affiliateReferrals).values({
                    affiliateUserId: validCode.userId,
                    affiliateCodeId: validCode.id,
                    orderItemId: newOrderItemId, // Use the captured ID
                    commissionRateAtTime: Math.round(affiliateRate * 10000), // Store as basis points (e.g., 5% = 500)
                    commissionEarnedInCents: commissionEarned,
                    status: "PENDING", // Initial status
                  });
                  console.log(
                    `🔗 Affiliate referral created for order item ${newOrderItemId} via code ${codeToQuery}` // Use guaranteed string
                  );
                }
              } else if (validCode && validCode.userId === customerUserId) {
                // Use asserted variable
                // Log inside the main 'if' block where codeToQuery is string
                console.log(
                  // Use asserted customerUserId variable
                  `ℹ️ Affiliate code ${codeToQuery} belongs to the customer (${customerUserId}), skipping referral.`
                );
              } else {
                // Log inside the main 'if' block where codeToQuery is string
                console.log(
                  `ℹ️ Affiliate code ${codeToQuery} not found or inactive.`
                );
              }
            }
          } else {
            // Log here if the code was provided but invalid/empty
            if (affiliateCode) {
              // Check if it existed at all
              // Simplify log message to avoid type issues with interpolation
              console.log(
                // Uncommented the log
                `ℹ️ Invalid or empty affiliate code provided, skipping referral.`
              );
            }
            // No need to log if affiliateCode was undefined/null initially
          }
          // --- End Affiliate Referral Logic ---
        }

        return orderId;
      }); // End DB Transaction

      // Send Order Confirmation Email (outside transaction)
      if (customerEmail && newOrderId) {
        try {
          await resend.emails.send({
            from: "Marketplace <noreply@yourdomain.com>", // Replace with your verified domain
            to: customerEmail,
            subject: "Your Marketplace Order Confirmation",
            // TODO: Create a proper email template (React Email?)
            html: `<p>Thank you for your order! Your order ID is ${newOrderId}.</p><p>We've received your payment and are processing your order.</p>`,
          });
          console.log(
            `✅ Order confirmation email sent to ${customerEmail} for order ${newOrderId}`
          );
        } catch (emailError) {
          console.error(
            `❌ Failed to send order confirmation email for order ${newOrderId}:`,
            emailError
          );
          // Don't fail the webhook response if email fails, just log it.
        }
      } else {
        console.warn(
          `⚠️ Could not send confirmation email. Missing email or order ID. Email: ${customerEmail}, OrderID: ${newOrderId}`
        );
      }
    } catch (error) {
      console.error("❌ Error processing order:", error);
      // Return 500 even if processing fails, Stripe will retry.
      return NextResponse.json(
        { error: "Internal server error during order processing." },
        { status: 500 }
      );
    }
  } else {
    console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}


// ---- File: auth.actions.ts ----

"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import crypto from "crypto"; // For token generation

import { db } from "@/db";
import {
  users,
  userRoleEnum,
  userStatusEnum,
  passwordResetTokens,
} from "@/db/schema"; // Added passwordResetTokens
import {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema, // Import ResetPasswordSchema
} from "@/lib/schemas/auth.schema";
import { signIn } from "@/../auth"; // Import signIn from auth.ts
import { resend } from "@/lib/resend"; // Import resend client

// Define a more specific schema for the action input, including role
const RegisterActionSchema = RegisterSchema.extend({
  role: z.enum(userRoleEnum.enumValues), // Expect role to be passed to the action
});

interface ActionResult {
  success: boolean;
  message: string;
}

export async function registerUser(
  values: z.infer<typeof RegisterActionSchema>
): Promise<ActionResult> {
  // 1. Validate input using the extended schema
  const validatedFields = RegisterActionSchema.safeParse(values);
  if (!validatedFields.success) {
    console.error("Registration validation failed:", validatedFields.error);
    return { success: false, message: "Invalid registration details." };
  }

  const { firstName, lastName, email, password, role } = validatedFields.data;

  try {
    // 2. Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { success: false, message: "Email already in use." };
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10); // Salt rounds = 10

    // 4. Determine initial status based on role
    const initialStatus =
      role === userRoleEnum.enumValues[0] // 'CUSTOMER'
        ? userStatusEnum.enumValues[1] // 'ACTIVE'
        : userStatusEnum.enumValues[0]; // 'PENDING' for VENDOR, AFFILIATE, ADMIN

    // 5. Create user in database
    await db.insert(users).values({
      firstName,
      lastName,
      email,
      passwordHash,
      role,
      status: initialStatus,
      // id, createdAt, updatedAt will use defaults
    });

    console.log(`User registered successfully: ${email}, Role: ${role}`);
    return {
      success: true,
      message:
        initialStatus === "PENDING"
          ? "Registration successful! Your account requires admin approval."
          : "Registration successful! You can now log in.",
    };
  } catch (error) {
    console.error("Error during user registration:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

// --- Sign In Action ---

interface SignInResult {
  success: boolean;
  message: string;
  redirectTo?: string; // Optional redirect path on success
}

export async function signInWithCredentials(
  values: z.infer<typeof LoginSchema>
): Promise<SignInResult> {
  // 1. Validate input
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid login details." };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. Attempt sign in using NextAuth's signIn function
    // This will internally call the `authorize` function in auth.ts
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirect, handle it manually
    });

    // If signIn doesn't throw, it means authentication was successful
    // (or handled by the authorize callback returning null/user)
    // Note: We might not reach here if authorize throws or returns null early
    // depending on NextAuth version behavior. The error handling below is crucial.

    // Since redirect is false, we return success. The page component can handle redirect.
    return {
      success: true,
      message: "Login successful!",
      redirectTo: "/dashboard",
    };
  } catch (error) {
    // Handle specific NextAuth errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password." };
        case "CallbackRouteError":
          // This might indicate an issue within the authorize callback itself
          console.error("CallbackRouteError during sign in:", error.cause);
          return { success: false, message: "Login failed. Please try again." };
        default:
          console.error("Unhandled AuthError during sign in:", error);
          return {
            success: false,
            message: "An authentication error occurred.",
          };
      }
    }

    // Handle other potential errors
    console.error("Unexpected error during sign in:", error);
    // IMPORTANT: Do NOT re-throw the error here if you want the Server Action
    // to return a structured response to the client. Throwing will cause an
    // unhandled server error.
    return { success: false, message: "An unexpected error occurred." };
  }
}

// --- Password Reset Actions ---

export async function requestPasswordReset(
  values: z.infer<typeof ForgotPasswordSchema> // Use imported schema
): Promise<ActionResult> {
  // 1. Validate email
  const validatedFields = ForgotPasswordSchema.safeParse(values); // Use imported schema
  if (!validatedFields.success) {
    return { success: false, message: "Invalid email address." };
  }
  const { email } = validatedFields.data;

  try {
    // 2. Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // 3. If user doesn't exist, return success to prevent email enumeration
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return {
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      };
    }

    // 4. Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour

    // 5. Store token in database
    // Consider deleting previous tokens for the same user here
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token: token,
      expiresAt: expiresAt,
    });

    // 6. Construct reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // 7. Send email using Resend
    // TODO: Create a proper email template later (Task 1.4.4)
    const emailHtml = `<p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a><p>This link will expire in 1 hour.</p>`;

    // Ensure RESEND_API_KEY is available before attempting to send
    if (!process.env.RESEND_API_KEY) {
      console.error(
        "Resend API Key not configured. Cannot send password reset email."
      );
      // Return success to the user, but log the error server-side
      return {
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      };
    }

    const { data, error: emailError } = await resend.emails.send({
      from: "Marketplace <noreply@yourdomain.com>", // Replace with your verified sender domain
      to: [email],
      subject: "Reset Your Marketplace Password",
      html: emailHtml,
    });

    if (emailError) {
      console.error("Error sending password reset email:", emailError);
      // Even if email fails, return success to prevent enumeration
      return {
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      };
    }

    console.log(
      `Password reset email sent successfully to ${email}. ID: ${data?.id}`
    );
    return {
      success: true,
      message:
        "If an account with this email exists, a password reset link has been sent.",
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    // Generic success message even on internal errors to prevent enumeration
    return {
      success: true,
      message:
        "If an account with this email exists, a password reset link has been sent.",
    };
  }
}

export async function resetPassword(
  values: z.infer<typeof ResetPasswordSchema> // Use imported schema
): Promise<ActionResult> {
  // 1. Validate input
  const validatedFields = ResetPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    // Combine multiple error messages if necessary, or take the first one
    const firstError =
      validatedFields.error.errors[0]?.message || "Invalid input.";
    return { success: false, message: firstError };
  }

  const { token, password } = validatedFields.data;

  try {
    // 2. Find the token in the database
    const existingToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    // 3. Check if token exists and hasn't expired
    if (!existingToken) {
      return { success: false, message: "Invalid or expired reset token." };
    }

    const now = new Date();
    if (existingToken.expiresAt < now) {
      // Optionally delete expired token
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
      return { success: false, message: "Reset token has expired." };
    }

    // 4. Find the associated user
    const user = await db.query.users.findFirst({
      where: eq(users.id, existingToken.userId),
    });

    if (!user) {
      // Should not happen if token exists, but good to check
      return { success: false, message: "User not found for this token." };
    }

    // 5. Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 10);

    // 6. Update user's password hash
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // 7. Delete the used token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));

    console.log(`Password reset successfully for user ${user.email}`);
    return {
      success: true,
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: "An unexpected error occurred while resetting the password.",
    };
  }
}


// ---- File: page.tsx ----

"use client"; // Correct placement of directive

import React, { useState } from "react"; // Import useState
import Image from "next/image";
import { getPublicProductBySlug } from "@/actions/product.actions";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; // Import Separator
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { ReviewList } from "@/components/products/ReviewList"; // Import actual components
import { QuestionAnswerList } from "@/components/products/QuestionAnswerList";
import { ReviewForm } from "@/components/products/ReviewForm";
import { QuestionForm } from "@/components/products/QuestionForm";
import { ProductVariantSelector } from "@/components/products/ProductVariantSelector"; // Import new component
import { AddToCartButton } from "@/components/products/AddToCartButton"; // Import new component
import type { Metadata } from "next"; // Removed ResolvingMetadata
import type {} from // products, // Removed unused import
// productVariants, // Removed unused import
// reviews as reviewsSchema, // Type not needed directly here
// questionAnswers as qnaSchema, // Type not needed directly here
// users, // Type not needed directly here
"@/db/schema"; // Import schema types

// Define more specific types for placeholder props - Removed unused Variant type
// type Variant = typeof productVariants.$inferSelect;
// type Review = typeof reviewsSchema.$inferSelect & { // Removed unused type
//   user?: Pick<typeof users.$inferSelect, "firstName" | "lastName"> | null;
// };
// type QnA = typeof qnaSchema.$inferSelect & { // Removed unused type
//   user?: Pick<typeof users.$inferSelect, "firstName" | "lastName"> | null;
//   answeredByUser?: Pick<
//     typeof users.$inferSelect,
//     "firstName" | "lastName"
//   > | null;
// };
// A simplified product type for the AddToCartButton, adjust as needed - No longer needed here
// type ProductForCart = Pick<typeof products.$inferSelect, "id" | "stock">;

// Removed placeholder components

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  // State to hold the selected variant ID
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );

  // Fetch data within the client component or pass as props if using Server Component structure
  // For simplicity here, assuming product data is fetched and available
  // In a real app, you might fetch this data server-side and pass it down,
  // or use a hook like useSWR/React Query client-side.
  // Let's assume 'product' is available as fetched data (like in the original server component)
  // const product = await getPublicProductBySlug(params.slug); // This needs to be handled differently in client component

  // --- TEMPORARY: Mock product data structure for client-side rendering ---
  // Replace this with actual data fetching logic (e.g., useEffect + fetch or library)
  const [product, setProduct] = React.useState<Awaited<
    ReturnType<typeof getPublicProductBySlug>
  > | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const fetchedProduct = await getPublicProductBySlug(params.slug);
      if (!fetchedProduct) {
        // Handle not found case, maybe redirect or show error
        console.error("Product not found");
      }
      setProduct(fetchedProduct);
      setIsLoading(false);
    };
    fetchData();
  }, [params.slug]);
  // --- END TEMPORARY MOCK ---

  if (isLoading) {
    // TODO: Add proper loading skeleton
    return <div>Loading product...</div>;
  }

  if (!product) {
    // Handle not found case after fetch attempt
    notFound(); // Or return a "Not Found" component
  }

  const placeholderImage = "/placeholder.svg";

  // Find the selected variant object based on ID
  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) ?? null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square relative w-full overflow-hidden rounded-lg border">
            <Image
              src={product.images?.[0]?.url || placeholderImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority // Prioritize main product image
              onError={(e) => {
                e.currentTarget.srcset = placeholderImage;
                e.currentTarget.src = placeholderImage;
              }}
            />
          </div>
          {/* TODO: Add thumbnail gallery if multiple images exist */}
          {/* {product.images && product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {product.images.map((img) => (
                <div key={img.id} className="aspect-square relative border rounded overflow-hidden cursor-pointer">
                   <Image src={img.url} alt={`Thumbnail ${img.order + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )} */}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            {product.title}
          </h1>
          <p className="text-2xl font-semibold mb-4">
            {formatPrice(product.priceInCents)}
          </p>
          {/* TODO: Add average rating display */}
          <div className="flex items-center gap-2 mb-4">
            {product.category && (
              <Badge variant="outline">{product.category.name}</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              Sold by: {product.vendor.name}
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground mb-6">
            {product.description || "No description available."}
          </div>

          {/* Variant Selection */}
          <ProductVariantSelector
            variants={product.variants || []}
            onVariantSelect={setSelectedVariantId} // Pass setter function
          />

          {/* Add to Cart */}
          <AddToCartButton
            productId={product.id}
            selectedVariant={selectedVariant} // Pass selected variant object
            productStock={product.stock} // Pass base stock
            variants={product.variants || []} // Pass all variants for stock check
          />

          {/* Stock Info - Shows selected variant stock or base stock */}
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Stock:{" "}
            {selectedVariant
              ? selectedVariant.stock > 0
                ? selectedVariant.stock
                : "Out of Stock"
              : product.stock > 0
                ? product.stock
                : "Out of Stock"}
            {selectedVariant && ` (Selected: ${selectedVariant.value})`}
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <Separator className="mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
            {/* SessionProvider needed for useSession in ReviewForm */}
            <SessionProvider>
              <ReviewForm productId={product.id} />
            </SessionProvider>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Existing Reviews</h3>
            <ReviewList reviews={product.reviews || []} />
          </div>
        </div>
      </div>

      {/* Q&A Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Questions & Answers</h2>
        <Separator className="mb-6" />
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Ask a Question</h3>
          {/* SessionProvider needed for useSession in QuestionForm */}
          <SessionProvider>
            <QuestionForm productId={product.id} />
          </SessionProvider>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Existing Questions</h3>
          {/* SessionProvider needed for useSession in QuestionAnswerList */}
          <SessionProvider>
            <QuestionAnswerList
              questionAnswers={product.questionAnswers || []}
            />
          </SessionProvider>
        </div>
      </div>
    </div>
  );
}

// --- generateMetadata ---
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props // Removed unused _parent
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const product = await getPublicProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  if (!product) {
    // Return default metadata or handle not found case
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
    };
  }

  return {
    title: `${product.title} | Marketplace`,
    description:
      product.description?.substring(0, 160) || // Use first 160 chars of description
      `Check out ${product.title} on our marketplace.`, // Fallback description
    openGraph: {
      title: product.title,
      description:
        product.description?.substring(0, 160) || `Check out ${product.title}`,
      images: product.images?.[0]?.url
        ? [
            {
              url: product.images[0].url, // Use the first product image
              // width: 800, // Optional: Specify image dimensions
              // height: 600,
              alt: product.title,
            },
          ]
        : [], // Provide empty array if no image
    },
  };
}


// ---- File: ProductForm.tsx ----

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // Import useRouter
// import { z } from "zod"; // Removed unused import
import {
  ProductSchema,
  type ProductFormData,
} from "@/lib/schemas/product.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// TODO: Fetch categories for the select dropdown

interface ProductFormProps {
  onSubmit: (
    data: ProductFormData,
    imageData?: File,
    assetData?: File
    // Update the expected return type to include redirectTo
  ) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    redirectTo?: string;
  }>;
  initialData?: Partial<ProductFormData> & { id?: string }; // For editing
  isLoading?: boolean;
}

export function ProductForm({
  onSubmit,
  initialData = {},
  isLoading = false,
}: ProductFormProps) {
  const router = useRouter(); // Initialize router
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [assetFile, setAssetFile] = useState<File | undefined>(undefined);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: initialData.title ?? "",
      description: initialData.description ?? "",
      priceInCents: initialData.priceInCents ?? 0,
      categoryId: initialData.categoryId ?? undefined,
      tags: initialData.tags ?? "",
      stock: initialData.stock ?? 0,
      isDigital: initialData.isDigital ?? false,
      isPhysical: initialData.isPhysical ?? true,
    },
  });

  const isDigital = form.watch("isDigital");

  const handleFormSubmit = async (data: ProductFormData) => {
    // Basic validation for file inputs based on product type
    if (!initialData.id && !imageFile) {
      // Require image for new products
      toast.error("Product image is required.");
      return;
    }
    if (data.isDigital && !initialData.id && !assetFile) {
      // Require asset file for new digital products
      toast.error("Digital asset file is required for digital products.");
      return;
    }

    const result = await onSubmit(data, imageFile, assetFile);

    if (result.success) {
      toast.success(result.message || "Product saved successfully!");
      // Redirect if redirectTo path is provided in the result
      if (result.redirectTo) {
        router.push(result.redirectTo);
      } else {
        // Optionally reset form if staying on the same page (e.g., after update)
        // form.reset(); // Consider if reset is needed after update
      }
    } else {
      toast.error(result.error || "Failed to save product.");
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(undefined);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Amazing Widget" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="priceInCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (in Cents)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 1999 for $19.99"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the price in cents (e.g., 1000 for $10.00).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 100" {...field} />
              </FormControl>
              <FormDescription>
                Overall stock count. Variants will have their own stock later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category (Placeholder) */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: Populate with actual categories */}
                  <SelectItem value="placeholder-cat-1">
                    Placeholder Category 1
                  </SelectItem>
                  <SelectItem value="placeholder-cat-2">
                    Placeholder Category 2
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Assign product to a category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., widget, blue, useful" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated tags for search.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Type Checkboxes */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isPhysical"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Physical Product</FormLabel>
                  <FormDescription>
                    Requires shipping address at checkout.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isDigital"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Digital Product</FormLabel>
                  <FormDescription>
                    Requires digital asset upload. Grants download access after
                    purchase.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          {/* Display error if neither is checked - handled by Zod refine */}
          <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        </div>

        {/* Image Upload */}
        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setImageFile)}
            />
          </FormControl>
          <FormDescription>
            Upload the main product image (JPEG, PNG, WEBP, GIF). Required for
            new products.
            {initialData.id && " Leave empty to keep the existing image."}
          </FormDescription>
          {imageFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {imageFile.name}
            </p>
          )}
          {/* TODO: Show preview of selected/existing image */}
          <FormMessage />
        </FormItem>

        {/* Digital Asset Upload (Conditional) */}
        {isDigital && (
          <FormItem>
            <FormLabel>Digital Asset File</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept=".pdf,.zip" // Example accepted types
                onChange={(e) => handleFileChange(e, setAssetFile)}
              />
            </FormControl>
            <FormDescription>
              Upload the file customers will download (PDF, ZIP recommended).
              Required for new digital products.
              {initialData.id && " Leave empty to keep the existing asset."}
            </FormDescription>
            {assetFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {assetFile.name}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}

        {/* TODO: Add Variant Management Section */}

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : initialData.id
              ? "Update Product"
              : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}


// ---- File: VendorProductTable.tsx ----

"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  Row, // Import Row type
} from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteProduct,
  type VendorProductListItem,
} from "@/actions/product.actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Helper function to format currency
const formatCurrency = (amountInCents: number | null) => {
  if (amountInCents === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // TODO: Make currency configurable
  }).format(amountInCents / 100);
};

// Helper function to format dates
const formatDate = (date: Date | null) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

// --- Actions Cell Component ---
interface ProductActionsCellProps {
  row: Row<VendorProductListItem>; // Pass the full row
}

const ProductActionsCell: React.FC<ProductActionsCellProps> = ({ row }) => {
  const product = row.original;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false); // Prevent closing during confirm

  const handleDelete = async () => {
    // Prevent menu from closing
    setIsMenuOpen(true);

    // Confirmation dialog
    if (
      !confirm(
        `Are you sure you want to delete the product "${product.title}"? This action cannot be undone.`
      )
    ) {
      setIsMenuOpen(false); // Allow menu to close if cancelled
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (result.success) {
        toast.success(result.message || "Product deleted successfully!");
        router.refresh(); // Refresh data on the current page
        // No need to manually close menu here, refresh will unmount it
      } else {
        toast.error(result.error || "Failed to delete product.");
        setIsMenuOpen(false); // Allow menu to close on error
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
      console.error("Delete product error:", error);
      setIsMenuOpen(false); // Allow menu to close on error
    } finally {
      // Only set deleting to false if it hasn't succeeded (and unmounted)
      // This state might not even be reached if refresh() is fast enough
      if (document.getElementById(`action-menu-${product.id}`)) {
        // Check if element still exists
        setIsDeleting(false);
      }
    }
  };

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" id={`action-menu-${product.id}`}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(product.id)}
        >
          Copy product ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/vendor/products/edit/${product.id}`}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-700 focus:bg-red-100"
          onClick={(e: React.MouseEvent) => {
            // Added type for event
            e.preventDefault(); // Prevent menu closing immediately
            handleDelete();
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- Define Table Columns ---
export const columns: ColumnDef<VendorProductListItem>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string | null;
      const title = row.original.title;
      return imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={40}
          height={40}
          className="rounded object-cover aspect-square"
        />
      ) : (
        <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center text-muted-foreground text-xs">
          No img
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "priceInCents",
    header: "Price",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("priceInCents"))}</div>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => <div>{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isActive") ? "default" : "outline"}>
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    // Render the dedicated component for actions
    cell: ({ row }) => <ProductActionsCell row={row} />,
  },
];

// --- Main Table Component ---
interface VendorProductTableProps {
  data: VendorProductListItem[];
}

export function VendorProductTable({ data }: VendorProductTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}


// ---- File: CartSheet.tsx ----

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, CartItem } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/actions/checkout.actions";
import { toast } from "sonner";
import { Label } from "@/components/ui/label"; // Import Label

// Placeholder type for fetched product details - refine later
interface CartItemDetails extends CartItem {
  title: string;
  priceInCents: number;
  imageUrl: string | null;
  slug: string;
  variantName?: string; // e.g., "Size"
  variantValue?: string; // e.g., "Large"
  isPhysical: boolean;
}

// Placeholder function to fetch details - replace with actual action later
async function fetchCartItemDetails(
  items: CartItem[]
): Promise<CartItemDetails[]> {
  console.log("Placeholder: Fetching details for items:", items);
  // In a real app, this would call a server action:
  // const details = await getCartItemsDetailsAction(items.map(item => item.productVariantId));
  // return items.map(item => ({ ...item, ...details[item.productVariantId] }));

  // Mock data for now:
  return items.map((item) => ({
    ...item,
    title: `Product ${item.productId.substring(0, 4)}`,
    priceInCents: Math.floor(Math.random() * 5000) + 1000, // Random price
    imageUrl: null, // Placeholder
    slug: `product-${item.productId.substring(0, 4)}`,
    variantName: "Size",
    variantValue: "M",
    isPhysical: Math.random() > 0.5,
  }));
}

export function CartSheet() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount } =
    useCart();
  const [detailedItems, setDetailedItems] = useState<CartItemDetails[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState(""); // State for affiliate code input

  // Fetch details when cart items change and sheet is open
  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      setIsLoadingDetails(true);
      fetchCartItemDetails(cartItems)
        .then(setDetailedItems)
        .catch((err) => console.error("Failed to fetch cart details:", err))
        .finally(() => setIsLoadingDetails(false));
    } else if (cartItems.length === 0) {
      setDetailedItems([]); // Clear details if cart is empty
    }
  }, [cartItems, isOpen]);

  const subtotal = detailedItems.reduce(
    (sum, item) => sum + item.priceInCents * item.quantity,
    0
  );

  // Check if any item is physical (needed for checkout prep)
  const hasPhysicalItems = detailedItems.some((item) => item.isPhysical);

  // Handle checkout button click
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // TODO: Pass selected addressId when implemented
      const result = await createCheckoutSession({ cartItems, affiliateCode }); // Pass affiliateCode

      if (result.success && result.redirectUrl) {
        // Redirect to Stripe checkout
        window.location.href = result.redirectUrl;
        // Optionally clear cart here or wait for webhook confirmation
        // clearCart();
      } else {
        toast.error(result.error || "Failed to initiate checkout.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred during checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {cartCount}
            </span>
          )}
          <span className="sr-only">Open shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          {" "}
          {/* Add ScrollArea */}
          {isLoadingDetails ? ( // Use renamed state
            <p className="text-center py-10">Loading cart details...</p> // Basic loading state
          ) : detailedItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-4">
              {detailedItems.map((item) => (
                <div
                  key={item.productVariantId}
                  className="flex gap-4 items-start"
                >
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="rounded border aspect-square object-cover"
                  />
                  <div className="flex-grow">
                    <Link
                      href={`/products/${item.slug}`}
                      className="hover:underline font-medium text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {item.variantName && item.variantValue && (
                      <p className="text-xs text-muted-foreground">
                        {item.variantName}: {item.variantValue}
                      </p>
                    )}
                    <p className="text-sm font-semibold mt-1">
                      {formatPrice(item.priceInCents)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productVariantId,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="h-8 w-16 text-center"
                        aria-label={`Quantity for ${item.title}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.productVariantId)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {detailedItems.length > 0 && (
          <SheetFooter className="mt-auto pt-6 border-t">
            <div className="w-full space-y-4">
              {/* Affiliate Code Input */}
              <div className="space-y-1.5">
                <Label htmlFor="affiliate-code">
                  Affiliate Code (Optional)
                </Label>
                <Input
                  id="affiliate-code"
                  value={affiliateCode}
                  onChange={(e) =>
                    setAffiliateCode(e.target.value.toUpperCase())
                  } // Store uppercase
                  placeholder="Enter code"
                  disabled={isCheckingOut}
                  className="h-9"
                />
              </div>

              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {/* Placeholder for shipping/address (Task 3.4) */}
              {hasPhysicalItems && (
                <p className="text-sm text-muted-foreground text-center">
                  Shipping cost ({formatPrice(500)}) will be added.{" "}
                  {/* Placeholder value */}
                  <br />
                  Address selection required at checkout (Task 3.4).
                </p>
              )}
              {/* TODO: Implement actual address fetching/selection UI */}
              <Button
                className="w-full"
                onClick={handleCheckout} // Add onClick handler
                disabled={
                  isLoadingDetails ||
                  isCheckingOut ||
                  hasPhysicalItems /* && !selectedAddressId */
                } // Disable during loading, checkout, or if address needed but not selected
              >
                {isCheckingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </Button>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}


// ---- File: dropdown-menu.tsx ----

"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}


// ---- File: order.actions.ts ----

"use server";

import { auth } from "../../auth"; // Corrected import path
import { db } from "@/db";
import {
  orderItems,
  orderItemStatusEnum,
  affiliateReferrals, // Added affiliateReferrals schema
} from "@/db/schema";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in orderBy callback
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Define the return type for vendor order items, including related data
export type VendorOrderItem = Awaited<
  ReturnType<typeof getVendorOrderItems>
>[0];

export async function getVendorOrderItems() {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    console.error("Unauthorized attempt to fetch vendor orders.");
    return []; // Return empty array or throw error for unauthorized access
  }
  const vendorId = session.user.id;

  try {
    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.vendorId, vendorId),
      orderBy: (items, { desc }) => [desc(items.createdAt)], // Use 'items' alias from orderBy
      with: {
        // Include related product and variant details needed for display
        product: {
          columns: {
            title: true,
            slug: true,
            isPhysical: true, // Add isPhysical here
          },
        },
        productVariant: {
          columns: {
            name: true, // e.g., "Size"
            value: true, // e.g., "Large"
          },
        },
        order: {
          // Include order details like ID and creation date
          columns: {
            id: true,
            createdAt: true,
          },
        },
      },
      // Select necessary columns from orderItems itself
      columns: {
        id: true,
        orderId: true,
        quantity: true,
        priceAtPurchaseInCents: true,
        status: true,
        createdAt: true,
      },
    });
    return items;
  } catch (error) {
    console.error("Failed to fetch vendor order items:", error);
    return []; // Return empty array on error
  }
}

// --- Update Order Item Status Action ---

// Define allowed status transitions for physical goods by vendors
const allowedVendorTransitions: Record<string, string[]> = {
  PENDING_FULFILLMENT: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  // DELIVERED: [], // No further vendor actions
  // ACCESS_GRANTED: [], // Digital goods, no vendor action
  // CANCELLED: [], // Cannot un-cancel
};

// Helper to format status for error messages
const formatStatus = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
};

// Define the type for the status enum values
type OrderItemStatus = (typeof orderItemStatusEnum.enumValues)[number];

interface UpdateStatusResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function updateOrderItemStatus(
  orderItemId: string,
  newStatus: OrderItemStatus
): Promise<UpdateStatusResult> {
  // 1. Authentication & Authorization
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized" };
  }
  const vendorId = session.user.id;

  // 2. Validate newStatus is a valid enum value (basic check)
  if (!orderItemStatusEnum.enumValues.includes(newStatus)) {
    return { success: false, error: "Invalid status value provided." };
  }

  try {
    // 3. Fetch the order item and verify ownership
    const item = await db.query.orderItems.findFirst({
      where: and(
        eq(orderItems.id, orderItemId),
        eq(orderItems.vendorId, vendorId) // Ensure vendor owns this item
      ),
      columns: { id: true, status: true },
      with: {
        product: { columns: { isPhysical: true } }, // Check if it's a physical product
      },
    });

    if (!item) {
      return {
        success: false,
        error: "Order item not found or access denied.",
      };
    }

    // 4. Check if it's a physical product (vendors only update physical)
    if (!item.product?.isPhysical) {
      return {
        success: false,
        error: "Status for digital items cannot be updated by vendor.",
      };
    }

    // 5. Validate Status Transition
    const currentStatus = item.status;
    const allowedTransitions = allowedVendorTransitions[currentStatus];

    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid status transition from ${formatStatus(currentStatus)} to ${formatStatus(newStatus)}.`,
      };
    }

    // 6. Update Status in DB (within a transaction)
    await db.transaction(async (tx) => {
      // Update OrderItem status
      await tx
        .update(orderItems)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(orderItems.id, orderItemId));

      // Update AffiliateReferral status if applicable
      if (newStatus === "DELIVERED" || newStatus === "ACCESS_GRANTED") {
        // If item is confirmed, confirm the referral
        await tx
          .update(affiliateReferrals)
          .set({ status: "CONFIRMED", updatedAt: new Date() })
          .where(
            and(
              eq(affiliateReferrals.orderItemId, orderItemId),
              eq(affiliateReferrals.status, "PENDING") // Only update pending referrals
            )
          );
      } else if (newStatus === "CANCELLED") {
        // If item is cancelled, cancel the referral
        await tx
          .update(affiliateReferrals)
          .set({ status: "CANCELLED", updatedAt: new Date() })
          .where(
            and(
              eq(affiliateReferrals.orderItemId, orderItemId),
              eq(affiliateReferrals.status, "PENDING") // Only cancel pending referrals
            )
          );
      }
    }); // End transaction

    // 7. Revalidate relevant paths
    revalidatePath("/dashboard/vendor/orders"); // Revalidate the orders page
    // Potentially revalidate customer order view if implemented: revalidatePath(`/dashboard/orders/${item.orderId}`);

    return { success: true, message: "Order item status updated." };
  } catch (error) {
    console.error("Failed to update order item status:", error);
    return {
      success: false,
      error: "Database error: Failed to update status.",
    };
  }
}

// --- Get Customer Orders Action ---

import { orders } from "@/db/schema"; // Import orders schema

// Define the return type, including nested items and their details
export type CustomerOrder = Awaited<ReturnType<typeof getCustomerOrders>>[0];

export async function getCustomerOrders() {
  const session = await auth();
  if (!session?.user?.id) {
    console.error("Unauthorized attempt to fetch customer orders.");
    return []; // Return empty array for unauthorized access
  }
  const userId = session.user.id;

  try {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)], // Order by creation date
      with: {
        // Include order items and their related product/variant details
        orderItems: {
          with: {
            product: {
              columns: {
                title: true,
                slug: true,
                isDigital: true, // Needed for download link logic
              },
              // Also fetch the digital asset ID if the product is digital
              with: {
                digitalAssets: {
                  columns: {
                    id: true, // Fetch the asset ID
                  },
                  limit: 1, // Assuming one asset per product
                },
              },
            },
            productVariant: {
              columns: {
                name: true,
                value: true,
              },
            },
          },
          columns: {
            // Select necessary columns from orderItems
            id: true,
            quantity: true,
            priceAtPurchaseInCents: true,
            status: true,
            productId: true, // Needed for download link logic
          },
        },
        shippingAddress: true, // Include shipping address details
      },
      // Select necessary columns from the order itself
      columns: {
        id: true,
        totalAmountInCents: true,
        status: true, // Overall order status (might differ from item status)
        createdAt: true,
      },
    });
    return userOrders;
  } catch (error) {
    console.error("Failed to fetch customer orders:", error);
    return []; // Return empty array on error
  }
}


// ---- File: WithdrawalManagementTable.tsx ----

"use client";

import { useState } from "react";
import {
  approveWithdrawal,
  rejectWithdrawal,
  markWithdrawalPaid,
} from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the type for a single request, mirroring the data structure from getWithdrawalRequests
type WithdrawalRequest = {
  id: string;
  amountInCents: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  pixKeyUsed: string;
  requestedAt: Date;
  processedAt: Date | null;
  adminNotes: string | null;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
};

interface WithdrawalManagementTableProps {
  requests: WithdrawalRequest[];
}

// Helper function to format date nicely (copied from page)
function formatDate(date: Date | null | undefined): string {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function WithdrawalManagementTable({
  requests,
}: WithdrawalManagementTableProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(
    null
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAction = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (id: string, ...args: any[]) => Promise<any>,
    requestId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => {
    setIsLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      const result = await action(requestId, ...args);
      if (result.success) {
        toast.success(result.message || "Action successful!");
        // Revalidation happens via server action, data should refresh on next load/navigation
      } else {
        toast.error(result.error || "Action failed.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Withdrawal action error:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [requestId]: false }));
      setRejectingRequestId(null); // Close dialog if open
      setRejectionReason(""); // Clear reason
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectingRequestId) return;
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason cannot be empty.");
      return;
    }
    handleAction(rejectWithdrawal, rejectingRequestId, {
      adminNotes: rejectionReason,
    });
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>PIX Key</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Processed At</TableHead>
            <TableHead>Admin Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No withdrawal requests found.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <div className="font-medium">
                    {req.user?.firstName} {req.user?.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {req.user?.email}
                  </div>
                </TableCell>
                <TableCell>{formatPrice(req.amountInCents)}</TableCell>
                <TableCell>{req.pixKeyUsed}</TableCell>
                <TableCell>{formatDate(req.requestedAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      req.status === "PENDING"
                        ? "secondary"
                        : req.status === "APPROVED"
                          ? "default"
                          : req.status === "PAID"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(req.processedAt)}</TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={req.adminNotes ?? ""}
                >
                  {req.adminNotes || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {req.status === "PENDING" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAction(approveWithdrawal, req.id)
                          }
                          disabled={isLoading[req.id]}
                        >
                          {isLoading[req.id] ? "Approving..." : "Approve"}
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setRejectingRequestId(req.id)}
                            disabled={isLoading[req.id]}
                          >
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                      </>
                    )}
                    {req.status === "APPROVED" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleAction(markWithdrawalPaid, req.id)
                          }
                          disabled={isLoading[req.id]}
                        >
                          {isLoading[req.id] ? "Marking..." : "Mark Paid"}
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setRejectingRequestId(req.id)}
                            disabled={isLoading[req.id]}
                          >
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                      </>
                    )}
                    {/* No actions needed for PAID or REJECTED */}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Rejection Dialog */}
      <AlertDialog
        open={!!rejectingRequestId}
        onOpenChange={(open: boolean) => !open && setRejectingRequestId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Withdrawal Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this withdrawal request.
              This note will be stored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rejection-reason" className="text-right">
                Reason
              </Label>
              <Input
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Insufficient completed orders"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectSubmit}
              disabled={
                !rejectionReason.trim() || isLoading[rejectingRequestId || ""]
              }
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


// ---- File: globals.css ----

@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}


// ---- File: checkout.actions.ts ----

"use server";

// import { redirect } from "next/navigation"; // Unused
import Stripe from "stripe";
import { auth } from "../../auth"; // Corrected import path
import { db } from "@/db";
import { products, productVariants } from "@/db/schema"; // Import necessary schemas
import { inArray } from "drizzle-orm"; // Removed unused eq
import { CartItem } from "@/context/CartContext"; // Import CartItem type

// Ensure Stripe secret key is set in environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia", // Updated API version based on error
});

// Define the expected input for the action
interface CreateCheckoutSessionInput {
  cartItems: CartItem[];
  addressId?: string | null;
  affiliateCode?: string | null; // Add optional affiliate code
}

interface CreateCheckoutSessionResult {
  success: boolean;
  error?: string;
  sessionId?: string; // ID of the Stripe Checkout Session
  redirectUrl?: string; // URL to redirect the user to
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "User not authenticated." };
  }
  const userId = session.user.id;

  const { cartItems, addressId, affiliateCode } = input; // Destructure affiliateCode

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Cart is empty." };
  }

  try {
    // 1. Fetch Product Variant Details from DB
    const variantIds = cartItems.map((item) => item.productVariantId);
    const fetchedVariants = await db.query.productVariants.findMany({
      where: inArray(productVariants.id, variantIds),
      with: {
        product: {
          // Fetch base product info too
          columns: {
            title: true,
            isPhysical: true,
            isDigital: true,
            // Add other fields if needed for Stripe line items (e.g., description, images)
          },
        },
      },
      columns: {
        id: true,
        productId: true,
        name: true,
        value: true,
        priceModifierInCents: true,
        stock: true, // Add stock column
        // Need base price from product table
      },
    });

    // Fetch base product prices separately (or adjust query above if possible)
    const productIds = fetchedVariants.map((v) => v.productId);
    const baseProducts = await db.query.products.findMany({
      where: inArray(products.id, productIds),
      columns: { id: true, priceInCents: true },
    });
    const basePriceMap = new Map(
      baseProducts.map((p) => [p.id, p.priceInCents])
    );

    // --- Pre-Checkout Stock Check ---
    for (const item of cartItems) {
      const variantDetails = fetchedVariants.find(
        (v) => v.id === item.productVariantId
      );
      if (!variantDetails) {
        // This case should ideally not happen if cart is synced, but good to check
        return {
          success: false,
          error: `Details not found for an item in your cart (Variant ID: ${item.productVariantId}). Please refresh your cart.`,
        };
      }
      // Check stock for the specific variant
      if (variantDetails.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${variantDetails.product.title} ${variantDetails.name ? `(${variantDetails.name}: ${variantDetails.value})` : ""}. Requested: ${item.quantity}, Available: ${variantDetails.stock}.`,
        };
      }
    }
    // --- End Stock Check ---

    // 2. Construct Stripe Line Items & Check for Physical Goods
    let hasPhysicalItems = false;
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cartItems) {
      const variantDetails = fetchedVariants.find(
        (v) => v.id === item.productVariantId
      );
      const basePrice = basePriceMap.get(variantDetails?.productId ?? "");

      if (!variantDetails || basePrice === undefined) {
        console.error(
          `Details not found for variant ID: ${item.productVariantId}`
        );
        return {
          success: false,
          error: `Product details missing for an item in your cart.`,
        };
      }

      if (variantDetails.product.isPhysical) {
        hasPhysicalItems = true;
      }

      const finalPrice = basePrice + (variantDetails.priceModifierInCents || 0);

      line_items.push({
        price_data: {
          currency: "usd", // Or your desired currency
          product_data: {
            name: `${variantDetails.product.title} ${variantDetails.name ? `(${variantDetails.name}: ${variantDetails.value})` : ""}`.trim(),
            // Add description, images if needed
            metadata: {
              // Store IDs for webhook processing
              productId: variantDetails.productId,
              productVariantId: variantDetails.id,
            },
          },
          unit_amount: finalPrice, // Price in cents
        },
        quantity: item.quantity,
      });
    }

    // 3. Add Shipping Cost if Physical Items Present
    const flatShippingRateCents = parseInt(
      process.env.FLAT_SHIPPING_RATE_CENTS || "0",
      10
    );
    if (hasPhysicalItems) {
      if (!addressId) {
        return {
          success: false,
          error: "Shipping address is required for physical items.",
        };
      }
      if (flatShippingRateCents > 0) {
        line_items.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shipping Fee",
            },
            unit_amount: flatShippingRateCents,
          },
          quantity: 1,
        });
      }
    }

    // 4. Prepare Metadata for Webhook
    const metadata = {
      userId: userId,
      // Stringify cart details to fit in metadata (Stripe limits value size)
      // Store only essential info needed to recreate the order in the webhook
      cartDetails: JSON.stringify(
        cartItems.map((item) => ({
          vId: item.productVariantId,
          qty: item.quantity,
        }))
      ),
      // Ensure addressId is string or null, never undefined for Stripe metadata
      addressId: hasPhysicalItems && addressId ? addressId : null,
      // Include affiliateCode in metadata if it exists and is not empty
      ...(affiliateCode && {
        affiliateCode: affiliateCode.trim().toUpperCase(),
      }),
    };

    // 5. Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`, // Use env var for base URL
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?cancelled=true`, // Redirect back to cart on cancellation
      metadata: metadata,
      // If collecting address in Stripe Checkout for physical goods:
      // shipping_address_collection: hasPhysicalItems ? { allowed_countries: ['US', 'CA'] } : undefined, // Example countries
    });

    if (!stripeSession.url) {
      return { success: false, error: "Could not create Stripe session." };
    }

    // 6. Return Session ID and Redirect URL
    return {
      success: true,
      sessionId: stripeSession.id,
      redirectUrl: stripeSession.url,
    };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Stripe error: ${errorMessage}` };
  }
}


// ---- File: 0000_snapshot.json ----

{
  "id": "035f1ffe-376c-406e-a937-34a75d6bd29f",
  "prevId": "00000000-0000-0000-0000-000000000000",
  "version": "7",
  "dialect": "postgresql",
  "tables": {
    "public.addresses": {
      "name": "addresses",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "street": {
          "name": "street",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "city": {
          "name": "city",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "state": {
          "name": "state",
          "type": "varchar(50)",
          "primaryKey": false,
          "notNull": true
        },
        "postal_code": {
          "name": "postal_code",
          "type": "varchar(20)",
          "primaryKey": false,
          "notNull": true
        },
        "country": {
          "name": "country",
          "type": "varchar(50)",
          "primaryKey": false,
          "notNull": true
        },
        "is_default": {
          "name": "is_default",
          "type": "boolean",
          "primaryKey": false,
          "notNull": false,
          "default": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {},
      "foreignKeys": {
        "addresses_user_id_users_id_fk": {
          "name": "addresses_user_id_users_id_fk",
          "tableFrom": "addresses",
          "tableTo": "users",
          "columnsFrom": [
            "user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.password_reset_tokens": {
      "name": "password_reset_tokens",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "user_id": {
          "name": "user_id",
          "type": "uuid",
          "primaryKey": false,
          "notNull": true
        },
        "token": {
          "name": "token",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "expires_at": {
          "name": "expires_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {},
      "foreignKeys": {
        "password_reset_tokens_user_id_users_id_fk": {
          "name": "password_reset_tokens_user_id_users_id_fk",
          "tableFrom": "password_reset_tokens",
          "tableTo": "users",
          "columnsFrom": [
            "user_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "password_reset_tokens_token_unique": {
          "name": "password_reset_tokens_token_unique",
          "nullsNotDistinct": false,
          "columns": [
            "token"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.users": {
      "name": "users",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "uuid",
          "primaryKey": true,
          "notNull": true,
          "default": "gen_random_uuid()"
        },
        "first_name": {
          "name": "first_name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "last_name": {
          "name": "last_name",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "email": {
          "name": "email",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "password_hash": {
          "name": "password_hash",
          "type": "text",
          "primaryKey": false,
          "notNull": true
        },
        "role": {
          "name": "role",
          "type": "user_role",
          "typeSchema": "public",
          "primaryKey": false,
          "notNull": true,
          "default": "'CUSTOMER'"
        },
        "status": {
          "name": "status",
          "type": "user_status",
          "typeSchema": "public",
          "primaryKey": false,
          "notNull": true,
          "default": "'ACTIVE'"
        },
        "pix_key": {
          "name": "pix_key",
          "type": "text",
          "primaryKey": false,
          "notNull": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {
        "users_email_unique": {
          "name": "users_email_unique",
          "nullsNotDistinct": false,
          "columns": [
            "email"
          ]
        }
      },
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    }
  },
  "enums": {
    "public.user_role": {
      "name": "user_role",
      "schema": "public",
      "values": [
        "CUSTOMER",
        "VENDOR",
        "AFFILIATE",
        "ADMIN"
      ]
    },
    "public.user_status": {
      "name": "user_status",
      "schema": "public",
      "values": [
        "PENDING",
        "ACTIVE",
        "REJECTED"
      ]
    }
  },
  "schemas": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "views": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}

// ---- File: affiliate.actions.ts ----

"use server";

// import { z } from "zod"; // Removed unused import
import { auth } from "../../auth";
import { db } from "@/db";
import {
  affiliateCodes,
  affiliateReferrals,
  withdrawalRequests,
} from "@/db/schema"; // Added schemas
import { eq, and, sql, inArray } from "drizzle-orm"; // Removed sum, Added sql, inArray
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/lib/utils"; // Added formatPrice

// Helper to generate a random alphanumeric code
function generateCode(length = 8): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

interface AffiliateCodeResult {
  success: boolean;
  code?: string;
  message?: string;
  error?: string;
}

// --- Get Affiliate Code ---
export async function getAffiliateCode(): Promise<{ code: string | null }> {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "AFFILIATE" ||
    session.user.status !== "ACTIVE"
  ) {
    // Return null or throw error if not an active affiliate
    return { code: null };
  }
  const userId = session.user.id;

  try {
    const existingCode = await db.query.affiliateCodes.findFirst({
      where: and(
        eq(affiliateCodes.userId, userId),
        eq(affiliateCodes.isActive, true) // Only fetch active codes
      ),
      columns: { code: true },
    });
    return { code: existingCode?.code || null };
  } catch (error) {
    console.error("Failed to fetch affiliate code:", error);
    return { code: null }; // Return null on error
  }
}

// --- Get Affiliate Balance ---

export async function getAffiliateBalance() {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "AFFILIATE" ||
    session.user.status !== "ACTIVE"
  ) {
    // Return zero balance if not an active affiliate
    return {
      availableBalance: 0,
      pendingBalance: 0, // Commissions from referrals not yet confirmed
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
  const affiliateId = session.user.id;

  try {
    // 1. Calculate total confirmed earnings
    const confirmedEarningsResult = await db
      .select({
        total: sql<string>`coalesce(sum(${affiliateReferrals.commissionEarnedInCents}::integer), 0)::text`,
      })
      .from(affiliateReferrals)
      .where(
        and(
          eq(affiliateReferrals.affiliateUserId, affiliateId),
          eq(affiliateReferrals.status, "CONFIRMED") // Only confirmed commissions
        )
      )
      .groupBy(affiliateReferrals.affiliateUserId);

    const totalEarningsNet = parseInt(confirmedEarningsResult[0]?.total || "0");

    // 2. Calculate pending commissions (for info)
    const pendingEarningsResult = await db
      .select({
        total: sql<string>`coalesce(sum(${affiliateReferrals.commissionEarnedInCents}::integer), 0)::text`,
      })
      .from(affiliateReferrals)
      .where(
        and(
          eq(affiliateReferrals.affiliateUserId, affiliateId),
          eq(affiliateReferrals.status, "PENDING") // Only pending commissions
        )
      )
      .groupBy(affiliateReferrals.affiliateUserId);

    const pendingBalance = parseInt(pendingEarningsResult[0]?.total || "0");

    // 3. Calculate total amount from pending/approved withdrawal requests
    const withdrawalsResult = await db
      .select({
        total: sql<string>`coalesce(sum(${withdrawalRequests.amountInCents}::integer), 0)::text`,
      })
      .from(withdrawalRequests)
      .where(
        and(
          eq(withdrawalRequests.userId, affiliateId), // Match the affiliate user ID
          inArray(withdrawalRequests.status, ["PENDING", "APPROVED"])
        )
      )
      .groupBy(withdrawalRequests.userId);

    const pendingWithdrawals = parseInt(withdrawalsResult[0]?.total || "0");

    // 4. Calculate available balance
    const availableBalance = totalEarningsNet - pendingWithdrawals;

    return {
      availableBalance: availableBalance,
      pendingBalance: pendingBalance,
      pendingWithdrawals: pendingWithdrawals,
      totalEarnings: totalEarningsNet,
      formatted: {
        availableBalance: formatPrice(availableBalance),
        pendingBalance: formatPrice(pendingBalance),
        pendingWithdrawals: formatPrice(pendingWithdrawals),
        totalEarnings: formatPrice(totalEarningsNet),
      },
    };
  } catch (error) {
    console.error("Failed to calculate affiliate balance:", error);
    // Return zero balance on error
    return {
      availableBalance: 0,
      pendingBalance: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
}

// --- Generate Affiliate Code ---
export async function generateAffiliateCode(): Promise<AffiliateCodeResult> {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "AFFILIATE" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized or inactive affiliate." };
  }
  const userId = session.user.id;

  try {
    // 1. Check if user already has an active code
    const existingCode = await db.query.affiliateCodes.findFirst({
      where: and(
        eq(affiliateCodes.userId, userId),
        eq(affiliateCodes.isActive, true)
      ),
    });

    if (existingCode) {
      return {
        success: false,
        error: "You already have an active affiliate code.",
        code: existingCode.code, // Return existing code for reference
      };
    }

    // 2. Generate a unique code
    let newCode = "";
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loop

    while (attempts < maxAttempts) {
      newCode = generateCode();
      const codeCheck = await db.query.affiliateCodes.findFirst({
        where: eq(affiliateCodes.code, newCode),
        columns: { id: true }, // Only need to check existence
      });
      if (!codeCheck) {
        break; // Unique code found
      }
      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.error(
        "Failed to generate a unique affiliate code after multiple attempts."
      );
      return {
        success: false,
        error: "Could not generate a unique code. Please try again later.",
      };
    }

    // 3. Insert the new code
    await db.insert(affiliateCodes).values({
      userId: userId,
      code: newCode,
      isActive: true,
    });

    revalidatePath("/dashboard/affiliate"); // Revalidate the affiliate dashboard

    return {
      success: true,
      code: newCode,
      message: "Affiliate code generated successfully!",
    };
  } catch (error) {
    console.error("Failed to generate affiliate code:", error);
    return {
      success: false,
      error: "Database error: Failed to generate code.",
    };
  }
}


// ---- File: QuestionAnswerList.tsx ----

"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react"; // Use client-side session hook
import { submitAnswer } from "@/actions/review.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Define the structure of Q&A, including user and answerer details
type QuestionAnswerWithDetails = {
  id: string;
  question: string;
  answer: string | null;
  createdAt: Date;
  answeredAt: Date | null;
  user: {
    // User who asked
    firstName: string | null;
    lastName: string | null;
  } | null;
  answeredByUser: {
    // User who answered (Vendor/Admin)
    firstName: string | null;
    lastName: string | null;
  } | null;
  product: {
    // Needed for authorization check
    vendorId: string;
  } | null;
};

interface QuestionAnswerListProps {
  questionAnswers: QuestionAnswerWithDetails[];
  // productId: string; // Removed unused prop
}

// Helper function to format date nicely
function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Helper to get initials for Avatar fallback
const getInitials = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase() || "U"; // Default to 'U' for User
};

export function QuestionAnswerList({
  questionAnswers,
}: // productId, // Removed unused prop
QuestionAnswerListProps) {
  const { data: session } = useSession(); // Get session on client
  const [answerForms, setAnswerForms] = useState<
    Record<string, { text: string; isLoading: boolean }>
  >({});

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswerForms((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], text },
    }));
  };

  const handleAnswerSubmit = async (questionId: string) => {
    const answerText = answerForms[questionId]?.text;
    if (!answerText || !answerText.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }

    setAnswerForms((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], isLoading: true },
    }));

    try {
      const result = await submitAnswer({
        questionId,
        answer: answerText.trim(),
      });
      if (result.success) {
        toast.success(result.message || "Answer submitted!");
        // Clear form state after successful submission
        setAnswerForms((prev) => {
          const newState = { ...prev };
          delete newState[questionId];
          return newState;
        });
        // Revalidation should happen via server action, but might need client-side update too
      } else {
        toast.error(result.error || "Failed to submit answer.");
        setAnswerForms((prev) => ({
          ...prev,
          [questionId]: { ...prev[questionId], isLoading: false },
        }));
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Submit answer error:", error);
      setAnswerForms((prev) => ({
        ...prev,
        [questionId]: { ...prev[questionId], isLoading: false },
      }));
    }
  };

  // Determine if the current user can answer a specific question
  const canAnswer = (qa: QuestionAnswerWithDetails): boolean => {
    if (!session?.user) return false; // Not logged in
    if (session.user.role === "ADMIN") return true; // Admin can always answer
    if (
      session.user.role === "VENDOR" &&
      qa.product?.vendorId === session.user.id
    )
      return true; // Vendor owns product
    return false;
  };

  if (!questionAnswers || questionAnswers.length === 0) {
    return <p className="text-muted-foreground">No questions asked yet.</p>;
  }

  return (
    <div className="space-y-8">
      {questionAnswers.map((qa) => (
        <div key={qa.id} className="flex gap-4">
          <Avatar className="h-10 w-10 mt-1">
            <AvatarFallback>
              {getInitials(qa.user?.firstName, qa.user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            {/* Question */}
            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {qa.user?.firstName || "User"} {qa.user?.lastName || ""}
                </p>
                <span className="text-xs text-muted-foreground">
                  Asked: {formatDate(qa.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm">Q: {qa.question}</p>
            </div>

            {/* Answer */}
            {qa.answer ? (
              <div className="pl-6 border-l-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">
                    A: {qa.answeredByUser?.firstName || "Staff"}{" "}
                    {qa.answeredByUser?.lastName || ""}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Answered: {formatDate(qa.answeredAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {qa.answer}
                </p>
              </div>
            ) : (
              // Show Answer Form if user is authorized and no answer exists
              canAnswer(qa) && (
                <div className="pl-6 space-y-2">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={answerForms[qa.id]?.text || ""}
                    onChange={(e) => handleAnswerChange(qa.id, e.target.value)}
                    disabled={answerForms[qa.id]?.isLoading}
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAnswerSubmit(qa.id)}
                    disabled={
                      answerForms[qa.id]?.isLoading ||
                      !answerForms[qa.id]?.text?.trim()
                    }
                  >
                    {answerForms[qa.id]?.isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit Answer
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


// ---- File: select.tsx ----

"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}


// ---- File: RegisterForm.tsx ----

"use client";

import { useState, useTransition } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form"; // Import ControllerRenderProps
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link"; // Import Link component

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Import sonner toast
import { registerUser } from "@/actions/auth.actions";
import { RegisterSchema } from "@/lib/schemas/auth.schema";
import { userRoleEnum } from "@/db/schema"; // Import enum for roles

// Define the extended schema type including role for the form
type RegisterFormInput = z.infer<typeof RegisterSchema> & {
  role: (typeof userRoleEnum.enumValues)[number];
};

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(
      RegisterSchema.extend({ role: z.enum(userRoleEnum.enumValues) })
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: userRoleEnum.enumValues[0], // Default to CUSTOMER
    },
  });

  const onSubmit = (values: RegisterFormInput) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await registerUser(values);
      if (result.success) {
        setSuccess(result.message);
        toast.success("Registration Successful", {
          description: result.message,
        }); // Corrected call
        form.reset(); // Reset form on success
      } else {
        setError(result.message);
        toast.error("Registration Failed", { description: result.message }); // Corrected call
        // Note: Sonner doesn't have variants like Shadcn toast, styling is different.
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<RegisterFormInput, "firstName">;
                }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<RegisterFormInput, "lastName">;
                }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({
                field,
              }: {
                field: ControllerRenderProps<RegisterFormInput, "email">;
              }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({
                field,
              }: {
                field: ControllerRenderProps<RegisterFormInput, "password">;
              }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({
                field,
              }: {
                field: ControllerRenderProps<RegisterFormInput, "role">;
              }) => (
                <FormItem>
                  <FormLabel>Register as</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Filter out ADMIN role from registration options */}
                      {userRoleEnum.enumValues
                        .filter((role) => role !== "ADMIN")
                        .map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0) + role.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Success/Error Messages */}
            {success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
                {success}
              </div>
            )}
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Registering..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline hover:text-primary">
                Login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


// ---- File: page.tsx ----

import {
  getAffiliateCode,
  getAffiliateBalance,
} from "@/actions/affiliate.actions"; // Added getAffiliateBalance
import { getUserProfile } from "@/actions/user.actions"; // Added getUserProfile
import { AffiliateCodeDisplay } from "@/components/affiliate/AffiliateCodeDisplay";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added Card components
import { WithdrawalRequestForm } from "@/components/vendor/WithdrawalRequestForm"; // Re-use vendor form

export default async function AffiliateDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "AFFILIATE") {
    // Redirect if not an affiliate (or handle appropriately)
    // Might redirect to profile or a specific 'become affiliate' page later
    redirect("/login");
  }

  // Fetch code, balance, and profile data in parallel
  const [{ code }, balanceData, userProfile] = await Promise.all([
    getAffiliateCode(),
    getAffiliateBalance(),
    getUserProfile(),
  ]);

  // Handle case where data might be null/error
  if (!balanceData || !userProfile) {
    return <div>Error loading affiliate dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Affiliate Dashboard</h1>

      <AffiliateCodeDisplay initialCode={code} />

      {/* Balance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.availableBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Commissions
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.pendingBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              From referrals awaiting confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Withdrawals
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.pendingWithdrawals}
            </div>
            <p className="text-xs text-muted-foreground">
              Requested but not yet paid
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Net Earnings
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.totalEarnings}
            </div>
            <p className="text-xs text-muted-foreground">
              From all confirmed referrals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Commission Tracking Table (Task 5.2.3) */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Referral History</h2>
        {/* Referral list table will go here */}
        <p className="text-muted-foreground">Referral history coming soon...</p>
      </div>

      {/* Withdrawal Form */}
      <div className="mt-6">
        <WithdrawalRequestForm
          availableBalanceInCents={balanceData.availableBalance}
          pixKeySet={!!userProfile.pixKey} // Pass whether PIX key is set
        />
      </div>
    </div>
  );
}


// ---- File: VendorOrderTable.tsx ----

"use client";

import React, { useTransition } from "react"; // Removed useState
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Corrected import path
import { formatPrice } from "@/lib/utils";
import {
  VendorOrderItem,
  updateOrderItemStatus,
} from "@/actions/order.actions";
import { ArrowRight, MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { orderItemStatusEnum } from "@/db/schema";

interface VendorOrderTableProps {
  orderItems: VendorOrderItem[];
}

// Helper to format date nicely
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// Helper to make status more readable
const formatStatus = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
};

// Define allowed status transitions for UI logic
const allowedVendorTransitionsUI: Record<string, string[]> = {
  PENDING_FULFILLMENT: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
};

// Define the type for the status enum values used in the component
type OrderItemStatus = (typeof orderItemStatusEnum.enumValues)[number];

// Row Actions Component
function OrderItemActions({ item }: { item: VendorOrderItem }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (newStatus: OrderItemStatus) => {
    startTransition(async () => {
      const result = await updateOrderItemStatus(item.id, newStatus);
      if (result.success) {
        toast.success(result.message || "Status updated successfully.");
      } else {
        toast.error(result.error || "Failed to update status.");
      }
    });
  };

  // Determine possible next statuses based on current status and product type
  const possibleNextStatuses =
    (item.product?.isPhysical && allowedVendorTransitionsUI[item.status]) || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <span className="sr-only">Open menu</span>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {possibleNextStatuses.length > 0 ? (
          possibleNextStatuses.map(
            (
              status: string // Added explicit type for status
            ) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusUpdate(status as OrderItemStatus)}
                disabled={isPending}
              >
                Mark as {formatStatus(status)}
              </DropdownMenuItem>
            )
          )
        ) : (
          <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function VendorOrderTable({ orderItems }: VendorOrderTableProps) {
  if (!orderItems || orderItems.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        You have no order items yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Variant</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium truncate" title={item.orderId}>
              {item.order.id.substring(0, 8)}... {/* Shorten Order ID */}
            </TableCell>
            <TableCell>{formatDate(item.order.createdAt)}</TableCell>
            <TableCell>
              <Link
                href={`/products/${item.product?.slug || "#"}`}
                className="hover:underline flex items-center gap-1"
                target="_blank"
              >
                {item.product?.title || "N/A"}{" "}
                <ArrowRight className="h-3 w-3 inline-block" />
              </Link>
            </TableCell>
            <TableCell>
              {item.productVariant?.name && item.productVariant?.value
                ? `${item.productVariant.name}: ${item.productVariant.value}`
                : "N/A"}
            </TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">
              {formatPrice(item.priceAtPurchaseInCents)}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  item.status === "DELIVERED" ||
                  item.status === "ACCESS_GRANTED"
                    ? "default"
                    : "secondary"
                }
              >
                {formatStatus(item.status)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <OrderItemActions item={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


// ---- File: AddressList.tsx ----

"use client";

import React, { useState, useTransition } from "react";
import { addresses as AddressSchema } from "@/db/schema"; // Import schema type
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card"; // Removed unused CardHeader, CardTitle
import { Badge } from "@/components/ui/badge"; // Added Badge import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogClose, // Removed unused DialogClose
} from "@/components/ui/dialog";
import { AddressForm } from "./AddressForm";
import { deleteAddress, setDefaultAddress } from "@/actions/user.actions";
import { toast } from "sonner";
import { Loader2, Trash2, Edit, Star, Home } from "lucide-react"; // Import icons

type Address = typeof AddressSchema.$inferSelect;

interface AddressListProps {
  addresses: Address[];
}

export function AddressList({ addresses }: AddressListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store ID of address being deleted
  const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [, startTransition] = useTransition(); // Prefix unused variable

  const handleDelete = (addressId: string) => {
    startTransition(async () => {
      setIsDeleting(addressId);
      const result = await deleteAddress(addressId);
      if (result.success) {
        toast.success(result.message || "Address deleted.");
      } else {
        toast.error(result.error || "Failed to delete address.");
      }
      setIsDeleting(null);
    });
  };

  const handleSetDefault = (addressId: string) => {
    startTransition(async () => {
      setIsSettingDefault(addressId);
      const result = await setDefaultAddress(addressId);
      if (result.success) {
        toast.success(result.message || "Default address updated.");
      } else {
        toast.error(result.error || "Failed to set default address.");
      }
      setIsSettingDefault(null);
    });
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAddress(null); // Clear editing state when closing
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>Add New Address</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm onSuccess={closeAddModal} />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          You have no saved addresses.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="flex flex-col">
              <CardContent className="pt-6 flex-grow">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4 border-t">
                <div>
                  {address.isDefault ? (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1 inline-block" /> Default
                    </Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isSettingDefault === address.id}
                    >
                      {isSettingDefault === address.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Home className="h-4 w-4 mr-1" />
                      )}
                      Set as Default
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={isEditModalOpen && editingAddress?.id === address.id}
                    onOpenChange={(open) => !open && closeEditModal()}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(address)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Address</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                      </DialogHeader>
                      <AddressForm
                        addressId={address.id}
                        initialData={address}
                        onSuccess={closeEditModal}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                    disabled={isDeleting === address.id || !!address.isDefault} // Ensure boolean for disabled prop
                    title={
                      address.isDefault
                        ? "Cannot delete default address"
                        : "Delete Address"
                    }
                  >
                    {isDeleting === address.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">Delete Address</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


// ---- File: review.actions.ts ----

"use server";

import { z } from "zod";
import { auth } from "../../auth";
import { db } from "@/db";
import { reviews, questionAnswers } from "@/db/schema"; // Removed unused 'products'
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Submit Review Action ---

export const SubmitReviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID."),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be at most 5."),
  comment: z.string().optional(),
});

interface SubmitReviewResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitReview(
  formData: z.infer<typeof SubmitReviewSchema>
): Promise<SubmitReviewResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized. Please log in to submit a review.",
    };
  }
  const userId = session.user.id;

  const validatedFields = SubmitReviewSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid review data." };
  }
  const { productId, rating, comment } = validatedFields.data;

  try {
    // TODO: Check if user has purchased this product before allowing review?
    // This requires checking the orders/orderItems table. Skipping for V1 simplicity.

    // Check if user already reviewed this product
    const existingReview = await db.query.reviews.findFirst({
      where: and(eq(reviews.productId, productId), eq(reviews.userId, userId)),
    });

    if (existingReview) {
      return {
        success: false,
        error: "You have already reviewed this product.",
      };
    }

    // Insert new review
    await db.insert(reviews).values({
      productId,
      userId,
      rating,
      comment: comment || null, // Store null if comment is empty
    });

    revalidatePath(`/products/${productId}`); // Revalidate product page

    return { success: true, message: "Review submitted successfully!" };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return {
      success: false,
      error: "Database error: Failed to submit review.",
    };
  }
}

// --- Submit Question Action ---

export const SubmitQuestionSchema = z.object({
  productId: z.string().uuid("Invalid product ID."),
  question: z.string().min(5, "Question must be at least 5 characters long."),
});

interface SubmitQuestionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitQuestion(
  formData: z.infer<typeof SubmitQuestionSchema>
): Promise<SubmitQuestionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized. Please log in to ask a question.",
    };
  }
  const userId = session.user.id;

  const validatedFields = SubmitQuestionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid question data." };
  }
  const { productId, question } = validatedFields.data;

  try {
    // Insert new question
    await db.insert(questionAnswers).values({
      productId,
      userId,
      question,
    });

    revalidatePath(`/products/${productId}`); // Revalidate product page

    return { success: true, message: "Question submitted successfully!" };
  } catch (error) {
    console.error("Failed to submit question:", error);
    return {
      success: false,
      error: "Database error: Failed to submit question.",
    };
  }
}

// --- Submit Answer Action ---

export const SubmitAnswerSchema = z.object({
  questionId: z.string().uuid("Invalid question ID."),
  answer: z.string().min(1, "Answer cannot be empty."),
});

interface SubmitAnswerResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitAnswer(
  formData: z.infer<typeof SubmitAnswerSchema>
): Promise<SubmitAnswerResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized." };
  }
  const userId = session.user.id;
  const userRole = session.user.role;

  const validatedFields = SubmitAnswerSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid answer data." };
  }
  const { questionId, answer } = validatedFields.data;

  try {
    // Fetch the question to verify ownership (if vendor) or admin role
    const questionData = await db.query.questionAnswers.findFirst({
      where: eq(questionAnswers.id, questionId),
      columns: { id: true, productId: true },
      with: {
        product: { columns: { vendorId: true } },
      },
    });

    if (!questionData) {
      return { success: false, error: "Question not found." };
    }

    // Authorization check: Must be ADMIN or the VENDOR who owns the product
    const isVendorOwner =
      userRole === "VENDOR" && questionData.product?.vendorId === userId;
    if (userRole !== "ADMIN" && !isVendorOwner) {
      return { success: false, error: "Unauthorized to answer this question." };
    }

    // Update the question with the answer
    await db
      .update(questionAnswers)
      .set({
        answer: answer,
        answeredByUserId: userId,
        answeredAt: new Date(),
      })
      .where(eq(questionAnswers.id, questionId));

    revalidatePath(`/products/${questionData.productId}`); // Revalidate product page

    return { success: true, message: "Answer submitted successfully!" };
  } catch (error) {
    console.error("Failed to submit answer:", error);
    return {
      success: false,
      error: "Database error: Failed to submit answer.",
    };
  }
}


// ---- File: page.tsx ----

import { getVendorBalance, getUserProfile } from "@/actions/user.actions"; // Added getUserProfile
import { auth } from "../../../../auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { WithdrawalRequestForm } from "@/components/vendor/WithdrawalRequestForm"; // Import the form

export default async function VendorDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "VENDOR") {
    // Redirect if not a vendor (or handle appropriately)
    redirect("/login");
  }

  // Fetch balance and profile data in parallel
  const [balanceData, userProfile] = await Promise.all([
    getVendorBalance(),
    getUserProfile(), // Fetch profile to check PIX key
  ]);

  // Handle case where balance data might be null/error
  if (!balanceData || !userProfile) {
    return <div>Error loading balance information.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Vendor Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            {/* Optional Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.availableBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Balance
            </CardTitle>
            {/* Optional Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.pendingBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              From orders awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Withdrawals
            </CardTitle>
            {/* Optional Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.pendingWithdrawals}
            </div>
            <p className="text-xs text-muted-foreground">
              Requested but not yet paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Net Earnings
            </CardTitle>
            {/* Optional Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balanceData.formatted.totalEarnings}
            </div>
            <p className="text-xs text-muted-foreground">
              From all completed orders (after commission)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Request Form */}
      <div className="mt-6">
        <WithdrawalRequestForm
          availableBalanceInCents={balanceData.availableBalance}
          pixKeySet={!!userProfile.pixKey} // Pass whether PIX key is set
        />
      </div>
    </div>
  );
}


// ---- File: CartContext.tsx ----

"use client"; // This context needs to be client-side

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// Define the structure of a cart item
export interface CartItem {
  productId: string;
  productVariantId: string; // Crucial for identifying the specific variant
  quantity: number;
  // Add other details fetched on demand or stored if needed (e.g., title, price, image)
  // For simplicity now, we only store IDs and quantity. Details fetched when displaying cart.
}

// Define the shape of the context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void; // Allow adding with specific quantity or default 1
  removeFromCart: (productVariantId: string) => void;
  updateQuantity: (productVariantId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productVariantId: string) => number;
  cartCount: number; // Total number of items in the cart
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem("marketplaceCart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Basic validation to ensure it's an array
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.warn("Invalid cart data found in localStorage.");
          localStorage.removeItem("marketplaceCart"); // Clear invalid data
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("marketplaceCart"); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("marketplaceCart", JSON.stringify(cartItems));
    } else {
      // Clear localStorage if cart becomes empty
      localStorage.removeItem("marketplaceCart");
    }
  }, [cartItems]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (i) => i.productVariantId === item.productVariantId
        );
        const addQuantity = item.quantity ?? 1; // Default to adding 1

        if (existingItemIndex > -1) {
          // Item exists, update quantity
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + addQuantity,
          };
          return updatedItems;
        } else {
          // Item doesn't exist, add new item
          return [...prevItems, { ...item, quantity: addQuantity }];
        }
      });
    },
    []
  );

  const removeFromCart = useCallback((productVariantId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productVariantId !== productVariantId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productVariantId: string, quantity: number) => {
      setCartItems((prevItems) => {
        if (quantity <= 0) {
          // If quantity is 0 or less, remove the item
          return prevItems.filter(
            (item) => item.productVariantId !== productVariantId
          );
        }
        // Otherwise, update the quantity
        return prevItems.map((item) =>
          item.productVariantId === productVariantId
            ? { ...item, quantity }
            : item
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productVariantId: string): number => {
      const item = cartItems.find(
        (i) => i.productVariantId === productVariantId
      );
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  // Calculate total number of items (sum of quantities)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};


// ---- File: AddressForm.tsx ----

"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createAddress, updateAddress } from "@/actions/user.actions"; // Import actions
import { Loader2 } from "lucide-react";
import { addresses } from "@/db/schema"; // Import schema type for initialData

// Schema for the form
const AddressFormSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddressFormValues = z.infer<typeof AddressFormSchema>;

interface AddressFormProps {
  addressId?: string; // Provided if editing
  initialData?: typeof addresses.$inferSelect | null; // Match DB type
  onSuccess?: () => void; // Callback on successful save
}

export function AddressForm({
  addressId,
  initialData,
  onSuccess,
}: AddressFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!addressId;

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      street: initialData?.street || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      postalCode: initialData?.postalCode || "",
      country: initialData?.country || "",
    },
  });

  const onSubmit = (values: AddressFormValues) => {
    startTransition(async () => {
      let result;
      if (isEditing && addressId) {
        // Ensure addressId exists when editing
        result = await updateAddress(addressId, values);
      } else {
        result = await createAddress(values);
      }

      if (result.success) {
        toast.success(
          result.message ||
            `Address ${isEditing ? "updated" : "added"} successfully!`
        );
        form.reset(); // Reset form on success
        onSuccess?.(); // Call success callback if provided
      } else {
        toast.error(
          result.error || `Failed to ${isEditing ? "update" : "add"} address.`
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Street */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Anytown" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State / Province</FormLabel>
              <FormControl>
                <Input placeholder="CA" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Postal Code */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="90210" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="USA" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isPending
            ? "Saving..."
            : isEditing
              ? "Update Address"
              : "Add Address"}
        </Button>
      </form>
    </Form>
  );
}


// ---- File: ResetPasswordForm.tsx ----

"use client";

import { useState, useTransition } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"; // For linking back to login

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { resetPassword } from "@/actions/auth.actions";
import {
  ResetPasswordSchema,
  ResetPasswordInput,
} from "@/lib/schemas/auth.schema";

interface ResetPasswordFormProps {
  token: string | null; // Receive token as a prop
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: token || "", // Initialize token from prop
      password: "",
      confirmPassword: "",
    },
  });

  // Show error immediately if token is missing
  useState(() => {
    if (!token) {
      setError("Password reset token is missing or invalid.");
      toast.error("Invalid Link", {
        description: "Password reset token is missing or invalid.",
      });
    }
  });

  const onSubmit = (values: ResetPasswordInput) => {
    setError(null);
    setSuccess(null);

    // Ensure token is present before submitting
    if (!values.token) {
      setError("Password reset token is missing or invalid.");
      toast.error("Invalid Link", {
        description: "Password reset token is missing or invalid.",
      });
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(values);

      if (result.success) {
        setSuccess(result.message);
        toast.success("Password Reset Successful", {
          description: result.message,
        });
        form.reset(); // Reset form on success
        // Optionally redirect to login after a delay
      } else {
        setError(result.message);
        toast.error("Password Reset Failed", { description: result.message });
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden input for the token (already in form state) */}
            {/* <input type="hidden" {...form.register("token")} /> */}

            <FormField
              control={form.control}
              name="password"
              render={({
                field,
              }: {
                field: ControllerRenderProps<ResetPasswordInput, "password">;
              }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isPending || !token || !!success} // Disable if no token or success
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  ResetPasswordInput,
                  "confirmPassword"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isPending || !token || !!success} // Disable if no token or success
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Success/Error Messages */}
            {success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
                {success}
              </div>
            )}
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !token || !!success} // Disable if no token or success
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/login" className="underline hover:text-primary">
                Back to Login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


// ---- File: page.tsx ----

import React from "react";
import Link from "next/link";
import {
  getCustomerOrders /*, type CustomerOrder */,
} from "@/actions/order.actions"; // Removed unused type import
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Download } from "lucide-react"; // For download button

// Helper to format date nicely (consider moving to utils if used elsewhere)
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

// Helper to make status more readable (consider moving to utils)
const formatStatus = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
};

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.id.substring(0, 8)}...
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on: {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge variant="outline">{order.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <Link
                        href={`/products/${item.product?.slug || "#"}`}
                        className="font-medium hover:underline"
                      >
                        {item.product?.title || "Product not found"}
                      </Link>
                      {item.productVariant && (
                        <p className="text-xs text-muted-foreground">
                          {item.productVariant.name}:{" "}
                          {item.productVariant.value}
                        </p>
                      )}
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.priceAtPurchaseInCents)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatStatus(item.status)}
                      </p>
                      {/* Download Link for Digital Products */}
                      {item.product?.isDigital &&
                        item.status === "ACCESS_GRANTED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="mt-1"
                          >
                            {/* Use the actual asset ID from the fetched data */}
                            <Link
                              href={`/api/download/${item.product.digitalAssets?.[0]?.id}`}
                              // Disable link if asset ID is somehow missing
                              aria-disabled={
                                !item.product.digitalAssets?.[0]?.id
                              }
                              className={
                                !item.product.digitalAssets?.[0]?.id
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            >
                              <Download className="mr-2 h-4 w-4" /> Download
                            </Link>
                          </Button>
                        )}
                    </div>
                  </div>
                ))}
                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="pt-2 text-sm text-muted-foreground">
                    <h4 className="font-medium text-foreground mb-1">
                      Shipping Address
                    </h4>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end font-semibold">
                Total: {formatPrice(order.totalAmountInCents)}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


// ---- File: ReviewForm.tsx ----

"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription, // Removed unused import
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { submitReview, SubmitReviewSchema } from "@/actions/review.actions"; // Import action and schema
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { useSession } from "next-auth/react";

type ReviewFormValues = z.infer<typeof SubmitReviewSchema>;

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { status } = useSession(); // Removed unused 'session'
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(SubmitReviewSchema),
    defaultValues: {
      productId: productId,
      rating: 0,
      comment: "",
    },
  });

  // Update form rating value when star rating changes
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    form.setValue("rating", newRating, { shouldValidate: true });
  };

  async function onSubmit(data: ReviewFormValues) {
    setIsLoading(true);
    // Ensure rating is set before submitting
    if (data.rating === 0) {
      toast.error("Please select a rating.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await submitReview(data);
      if (result.success) {
        toast.success(result.message || "Review submitted successfully!");
        form.reset({ productId: productId, rating: 0, comment: "" }); // Reset form
        setRating(0); // Reset visual rating
      } else {
        toast.error(result.error || "Failed to submit review.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Submit review error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (status === "unauthenticated") {
    return (
      <p className="text-sm text-muted-foreground">
        Please log in to leave a review.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={(
            { field } // Ensure comment is exactly here
          ) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const currentRating = index + 1;
                    return (
                      <Star
                        key={index}
                        className={`h-6 w-6 cursor-pointer ${
                          currentRating <= (hoverRating || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground"
                        }`}
                        onMouseEnter={() => setHoverRating(currentRating)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRatingChange(currentRating)}
                      />
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about the product..."
                  {...field}
                  rows={4}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || rating === 0}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Review
        </Button>
      </form>
    </Form>
  );
}


// ---- File: sheet.tsx ----

"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}


// ---- File: auth.ts ----

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db"; // Drizzle instance
import { users, userStatusEnum } from "@/db/schema"; // User schema (removed unused userRoleEnum)
import { LoginSchema } from "@/lib/schemas/auth.schema"; // Zod schema for validation
import { authConfig } from "./auth.config"; // Shared config (pages, basic callbacks)

export const {
  handlers: { GET, POST }, // API route handlers
  auth, // Server-side auth access
  signIn, // Server Action for signing in
  signOut, // Server Action for signing out
  // update, // Optional: For updating session
} = NextAuth({
  ...authConfig, // Spread shared config (pages, authorized callback)
  adapter: DrizzleAdapter(db), // Use Drizzle adapter
  session: { strategy: "jwt" }, // Use JWT for session strategy (recommended)
  providers: [
    Credentials({
      // Optional: You can skip the default login form generation
      // by not providing `credentials` or returning null here.
      // We will build our own form.
      async authorize(credentials) {
        // 1. Validate credentials using Zod
        const validatedCredentials = LoginSchema.safeParse(credentials);

        if (validatedCredentials.success) {
          const { email, password } = validatedCredentials.data;

          // 2. Find user by email in the database
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          // 3. Check if user exists and password matches
          // Also check if user status is ACTIVE
          if (
            !user ||
            !user.passwordHash ||
            user.status !== userStatusEnum.enumValues[1] // 'ACTIVE'
          ) {
            console.log(
              `Login failed: User not found, no password hash, or status not ACTIVE for ${email}`
            );
            return null; // User not found, inactive, or missing hash
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (passwordsMatch) {
            console.log(`Login successful for ${email}`);
            // Return user object (must match NextAuth User type)
            // DrizzleAdapter handles mapping DB fields to standard User fields
            return user;
          }
        }
        console.log(
          `Login failed: Invalid credentials or validation failed for credentials: ${JSON.stringify(credentials)}`
        );
        return null; // Invalid credentials or validation failed
      },
    }),
    // Add other providers like Google, GitHub etc. later if needed
  ],
  callbacks: {
    ...authConfig.callbacks, // Include the authorized callback from auth.config

    // Extend JWT with user ID, role, and status
    async jwt({ token, user }) {
      // The 'user' object passed here can be the result of the authorize callback (full user)
      // or potentially the AdapterUser type in other flows.
      if (user) {
        // Safely add properties if they exist on the user object
        token.id = user.id;
        if ("role" in user) {
          token.role = user.role;
        }
        if ("status" in user) {
          token.status = user.status;
        }
      }
      // TODO: If role/status might change and need immediate reflection,
      // fetch user from DB using token.sub (user ID) here.
      // For now, assume initial role/status persists for the session.
      return token;
    },

    // Extend session object with user ID, role, and status from the JWT
    async session({ session, token }) {
      // The token contains the data added in the jwt callback
      if (token && session.user) {
        session.user.id = token.sub ?? (token.id as string); // Prefer sub if available, fallback to id
        session.user.role = token.role; // Now correctly typed via next-auth.d.ts
        session.user.status = token.status; // Now correctly typed via next-auth.d.ts
        // Add other properties from token to session if needed
      }
      return session;
    },
  },
  // Optional: Add custom event listeners
  // events: {
  //   async signIn(message) { /* Handle successful sign-in */ },
  //   async signOut(message) { /* Handle sign-out */ },
  // },
  // Optional: Configure logging
  // debug: process.env.NODE_ENV === 'development',
});


// ---- File: page.tsx ----

import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}


// ---- File: route.ts ----

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth"; // Corrected path
import { db } from "@/db";
import { digitalAssets, orderItems, orders } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm"; // Added inArray
import { promises as fs } from "fs";
import path from "path";
import mime from "mime-types";

// Define the expected context params
interface RouteContext {
  params: {
    assetId: string;
  };
}

export async function GET(req: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const { assetId } = context.params;

  if (!assetId) {
    return NextResponse.json(
      { error: "Asset ID is required." },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch asset details (including productId)
    const asset = await db.query.digitalAssets.findFirst({
      where: eq(digitalAssets.id, assetId), // Assuming assetId is the UUID of the digitalAsset record
      columns: { filePath: true, fileName: true, productId: true },
    });

    if (!asset || !asset.filePath || !asset.productId) {
      return NextResponse.json({ error: "Asset not found." }, { status: 404 });
    }

    // 2. Verify user has purchased this product
    // a. Find order items for this product with ACCESS_GRANTED status
    const potentialOrderItems = await db.query.orderItems.findMany({
      columns: { orderId: true },
      where: and(
        eq(orderItems.productId, asset.productId),
        eq(orderItems.status, "ACCESS_GRANTED")
      ),
    });

    if (potentialOrderItems.length === 0) {
      console.warn(
        `No ACCESS_GRANTED items found for Product ${asset.productId}, Asset ${assetId}`
      );
      return NextResponse.json(
        { error: "Purchase record not found." },
        { status: 403 }
      );
    }

    // b. Extract the order IDs
    const orderIds = potentialOrderItems.map((item) => item.orderId);

    // c. Check if any of these orders belong to the user and are completed
    const validOrder = await db.query.orders.findFirst({
      columns: { id: true }, // Only need to confirm existence
      where: and(
        inArray(orders.id, orderIds), // Order ID must be one from the items
        eq(orders.userId, userId), // Order must belong to the current user
        eq(orders.status, "COMPLETED") // Order must be completed
      ),
    });

    if (!validOrder) {
      console.warn(
        `Unauthorized download attempt: User ${userId}, Asset ${assetId}, Product ${asset.productId}. No valid completed order found.`
      );
      return NextResponse.json(
        { error: "Valid purchase record not found." },
        { status: 403 }
      );
    }

    // 3. Read file from secure location
    const secureFilePath = path.join(process.cwd(), asset.filePath); // filePath is relative to project root

    try {
      await fs.access(secureFilePath); // Check if file exists
    } catch (accessError) {
      console.error(
        `❌ File not found at path: ${secureFilePath}`,
        accessError
      );
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(secureFilePath);

    // 4. Determine MIME type
    const mimeType = mime.lookup(asset.fileName) || "application/octet-stream";

    // 5. Stream response
    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${asset.fileName}"`
    );
    headers.set("Content-Type", mimeType);
    headers.set("Content-Length", fileBuffer.length.toString());

    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (error) {
    console.error(`❌ Error fetching/streaming asset ${assetId}:`, error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}


// ---- File: WithdrawalRequestForm.tsx ----

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { requestWithdrawal } from "@/actions/user.actions";
import { toast } from "sonner";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Schema for form validation (client-side) - amount in dollars
const FormSchema = z.object({
  amountDollars: z.coerce // Coerce string input to number
    .number({ invalid_type_error: "Please enter a valid amount." })
    .positive("Withdrawal amount must be positive.")
    .multipleOf(0.01, {
      message: "Amount must have up to two decimal places.",
    }), // Ensure cents
});

type FormValues = z.infer<typeof FormSchema>;

interface WithdrawalRequestFormProps {
  availableBalanceInCents: number;
  pixKeySet: boolean;
}

export function WithdrawalRequestForm({
  availableBalanceInCents,
  pixKeySet,
}: WithdrawalRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amountDollars: undefined, // Start with empty or placeholder
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const amountInCents = Math.round(data.amountDollars * 100); // Convert dollars to cents

    // Client-side check before calling server action
    if (!pixKeySet) {
      toast.error("Please set your PIX key in your profile first.");
      setIsSubmitting(false);
      return;
    }
    if (amountInCents <= 0) {
      toast.error("Withdrawal amount must be positive.");
      setIsSubmitting(false);
      return;
    }
    if (amountInCents > availableBalanceInCents) {
      toast.error("Withdrawal amount exceeds available balance.");
      setIsSubmitting(false);
      return;
    }

    const result = await requestWithdrawal({ amount: amountInCents });

    if (result.success) {
      toast.success(result.message || "Withdrawal request submitted!");
      form.reset(); // Reset form on success
    } else {
      toast.error(result.error || "Failed to submit withdrawal request.");
    }
    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Available Balance:{" "}
                <span className="font-medium">
                  {formatPrice(availableBalanceInCents)}
                </span>
              </p>
              {!pixKeySet && (
                <p className="text-sm text-red-600">
                  Warning: PIX Key not set in profile. You cannot request a
                  withdrawal.
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="amountDollars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01" // Allow cents
                      placeholder="e.g., 50.00"
                      {...field}
                      disabled={isSubmitting || !pixKeySet}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the amount you wish to withdraw.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                isSubmitting || !pixKeySet || availableBalanceInCents <= 0
              }
            >
              {isSubmitting ? "Submitting..." : "Request Withdrawal"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


// ---- File: form.tsx ----

"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}


// ---- File: alert-dialog.tsx ----

"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}


// ---- File: dialog.tsx ----

"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}


// ---- File: ProfileForm.tsx ----

"use client";

import React, { useTransition } from "react"; // Removed useState
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Removed unused Label
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/user.actions"; // Import the action
import { Loader2 } from "lucide-react";

// Schema for the form (subset of the action schema, only editable fields)
const ProfileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  pixKey: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

interface ProfileFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    pixKey?: string | null; // Match DB type
    role: string; // Needed to conditionally show PIX key
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const showPixKeyField =
    initialData.role === "VENDOR" || initialData.role === "AFFILIATE";

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      pixKey: initialData.pixKey || "",
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      // Only include pixKey if the field should be shown
      const dataToSend = showPixKeyField
        ? values
        : { firstName: values.firstName, lastName: values.lastName };
      const result = await updateUserProfile(dataToSend);
      if (result.success) {
        toast.success(result.message || "Profile updated successfully!");
        // Optionally reset form or handle success state
      } else {
        toast.error(result.error || "Failed to update profile.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {showPixKeyField && (
          <FormField
            control={form.control}
            name="pixKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIX Key (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your PIX key (e.g., email, CPF, phone)"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}


// ---- File: ApprovalList.tsx ----

"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { approveUser, rejectUser } from "@/actions/user.actions"; // Import actions
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

// Define the expected shape of a pending user based on getPendingUsers action
type PendingUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: Date;
};

interface ApprovalListProps {
  users: PendingUser[];
}

function UserApprovalActions({ userId }: { userId: string }) {
  const [isApproving, startApproveTransition] = useTransition();
  const [isRejecting, startRejectTransition] = useTransition();

  const handleApprove = () => {
    startApproveTransition(async () => {
      const result = await approveUser(userId);
      if (result.success) {
        toast.success(result.message || "User approved.");
      } else {
        toast.error(result.error || "Failed to approve user.");
      }
    });
  };

  const handleReject = () => {
    startRejectTransition(async () => {
      const result = await rejectUser(userId);
      if (result.success) {
        toast.success(result.message || "User rejected.");
      } else {
        toast.error(result.error || "Failed to reject user.");
      }
    });
  };

  const isPending = isApproving || isRejecting;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleApprove}
        disabled={isPending}
        className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
      >
        {isApproving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        <span className="ml-1">Approve</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleReject}
        disabled={isPending}
      >
        {isRejecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        <span className="ml-1">Reject</span>
      </Button>
    </div>
  );
}

export function ApprovalList({ users }: ApprovalListProps) {
  // Helper to format date nicely
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  if (!users || users.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No users awaiting approval.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {user.firstName} {user.lastName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <Badge variant="secondary">{user.role}</Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Registered: {formatDate(user.createdAt)}
              </p>
            </div>
            <UserApprovalActions userId={user.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


// ---- File: LoginForm.tsx ----

"use client";

import { useState, useTransition } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import Link from "next/link"; // Import Link component

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signInWithCredentials } from "@/actions/auth.actions";
import { LoginSchema, LoginInput } from "@/lib/schemas/auth.schema";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Initialize router
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginInput) => {
    setError(null);

    startTransition(async () => {
      const result = await signInWithCredentials(values);

      if (result.success) {
        toast.success(result.message);
        // Redirect on success using router.push()
        router.push(result.redirectTo || "/dashboard"); // Default to /dashboard if no redirect path
      } else {
        setError(result.message);
        toast.error("Login Failed", { description: result.message });
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({
                field,
              }: {
                field: ControllerRenderProps<LoginInput, "email">;
              }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({
                field,
              }: {
                field: ControllerRenderProps<LoginInput, "password">;
              }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="text-right text-sm">
                    <Link
                      href="/forgot-password"
                      className="underline hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Error Message */}
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="underline hover:text-primary">
                Register
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


// ---- File: package.json ----

{
  "name": "marketplace-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:seed:admin": "tsx scripts/seed-admin.ts"
  },
  "dependencies": {
    "@auth/drizzle-adapter": "^1.8.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slot": "^1.1.2",
    "@tanstack/react-table": "^8.21.2",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "drizzle-orm": "^0.41.0",
    "lucide-react": "^0.485.0",
    "next": "15.2.4",
    "next-auth": "^5.0.0-beta.25",
    "next-themes": "^0.4.6",
    "postgres": "^3.4.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.55.0",
    "resend": "^4.2.0",
    "sonner": "^2.0.2",
    "stripe": "^17.7.0",
    "tailwind-merge": "^3.0.2",
    "tailwindcss-animate": "^1.0.7",
    "tw-animate-css": "^1.2.5",
    "uuid": "^11.1.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/bcryptjs": "^2.4.6",
    "@types/mime-types": "^2.1.4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/uuid": "^10.0.0",
    "@vitest/coverage-v8": "^3.1.1",
    "@vitest/ui": "^3.1.1",
    "cypress": "^14.2.1",
    "dotenv": "^16.4.7",
    "drizzle-kit": "^0.30.6",
    "eslint": "^9",
    "eslint-config-next": "15.2.4",
    "jsdom": "^26.0.0",
    "tailwindcss": "^4",
    "ts-node": "^10.9.2",
    "tsx": "^4.19.3",
    "typescript": "^5",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.1.1",
    "whatwg-fetch": "^3.6.20"
  }
}


// ---- File: AffiliateCodeDisplay.tsx ----

"use client";

import { useState } from "react";
import { generateAffiliateCode } from "@/actions/affiliate.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AffiliateCodeDisplayProps {
  initialCode: string | null;
}

export function AffiliateCodeDisplay({
  initialCode,
}: AffiliateCodeDisplayProps) {
  const [code, setCode] = useState<string | null>(initialCode);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    try {
      const result = await generateAffiliateCode();
      if (result.success && result.code) {
        setCode(result.code);
        toast.success(result.message || "Code generated successfully!");
      } else {
        // Handle cases where code already exists or other errors
        toast.error(result.error || "Failed to generate code.");
        if (result.code) {
          // If error was 'already exists', update state anyway
          setCode(result.code);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred during code generation.");
      console.error("Generate code error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          toast.success("Code copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy code.");
          console.error("Failed to copy text: ", err);
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Affiliate Code</CardTitle>
        <CardDescription>
          Share this code with others. You will earn a commission on qualifying
          purchases made using your code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {code ? (
          <div className="flex items-center space-x-2">
            <Input value={code} readOnly className="font-mono text-lg" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyToClipboard}
              title="Copy to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-start space-y-2">
            <p className="text-muted-foreground">
              You do not have an affiliate code yet.
            </p>
            <Button onClick={handleGenerateCode} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Code"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


// ---- File: ForgotPasswordForm.tsx ----

"use client";

import { useState, useTransition } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"; // For linking back to login

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { requestPasswordReset } from "@/actions/auth.actions";
import {
  ForgotPasswordSchema,
  ForgotPasswordInput,
} from "@/lib/schemas/auth.schema";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordInput) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await requestPasswordReset(values);

      // Always show the generic success message to prevent email enumeration
      setSuccess(result.message);
      toast.success("Request Submitted", { description: result.message });

      // Optionally clear form or disable button further if needed
      form.reset(); // Reset form regardless of actual outcome for security
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({
                field,
              }: {
                field: ControllerRenderProps<ForgotPasswordInput, "email">;
              }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Success/Error Messages (only success shown for security) */}
            {success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
                {success}
              </div>
            )}
            {/* We don't show specific errors here to prevent enumeration */}
            {/* {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )} */}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/login" className="underline hover:text-primary">
                Back to Login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


// ---- File: AddToCartButton.tsx ----

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import type { products, productVariants } from "@/db/schema";

// Define the props needed for the button
interface AddToCartButtonProps {
  productId: (typeof products.$inferSelect)["id"];
  selectedVariant: typeof productVariants.$inferSelect | null; // Allow null if no variants or none selected
  productStock: number; // Base product stock if no variants
  variants: (typeof productVariants.$inferSelect)[]; // All variants for stock checking
}

export function AddToCartButton({
  productId,
  selectedVariant,
  productStock,
  variants,
}: AddToCartButtonProps) {
  const { addToCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    let variantIdToAdd: string | null = null;
    let stockToCheck: number = productStock; // Default to base product stock
    let canAddToCart = true;

    // Determine which stock to check and which ID to add
    if (variants.length > 0) {
      // Product has variants
      if (!selectedVariant) {
        toast.error("Please select a variant.");
        return; // Don't add if variant needed but not selected
      }
      variantIdToAdd = selectedVariant.id;
      stockToCheck = selectedVariant.stock;
    } else {
      // Product has no variants, use base product stock
      variantIdToAdd = null; // No variant ID needed for cart context in this case
      stockToCheck = productStock;
    }

    // Check stock availability
    const currentQuantityInCart = getItemQuantity(variantIdToAdd ?? productId); // Use product ID if no variant
    if (currentQuantityInCart >= stockToCheck) {
      toast.error("Item is out of stock or quantity limit reached.");
      canAddToCart = false;
    }

    if (canAddToCart) {
      // Use productId as the variantId if no variant is selected/exists
      const idForCart = variantIdToAdd ?? productId;
      // Pass the item object as expected by the context
      addToCart({
        productId: productId,
        productVariantId: idForCart, // Use productId if variantIdToAdd is null
        // quantity: 1 // Default quantity is 1 in the context function
      });
      toast.success("Item added to cart!");
    }
  };

  // Determine if button should be disabled
  const isOutOfStock = selectedVariant
    ? selectedVariant.stock <= 0
    : productStock <= 0;
  const isDisabled = isOutOfStock || (variants.length > 0 && !selectedVariant);

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full mt-6"
      disabled={isDisabled}
    >
      {isDisabled
        ? isOutOfStock
          ? "Out of Stock"
          : "Select Variant"
        : "Add to Cart"}
    </Button>
  );
}


// ---- File: ReviewList.tsx ----

import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Removed AvatarImage
import { Star } from "lucide-react";

// Define the structure of a review, including user details
type ReviewWithUser = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    firstName: string | null;
    lastName: string | null;
    // Add image field if you store user avatars
  } | null;
};

interface ReviewListProps {
  reviews: ReviewWithUser[];
}

// Helper function to format date nicely
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Helper to get initials for Avatar fallback
const getInitials = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase() || "U"; // Default to 'U' for User
};

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4">
          <Avatar className="h-10 w-10">
            {/* Placeholder for user image - replace with actual image if available */}
            {/* <AvatarImage src={review.user?.imageUrl} alt={`${review.user?.firstName} ${review.user?.lastName}`} /> */}
            <AvatarFallback>
              {getInitials(review.user?.firstName, review.user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {review.user?.firstName || "User"} {review.user?.lastName || ""}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            {review.comment && (
              <p className="mt-2 text-sm text-muted-foreground">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


// ---- File: table.tsx ----

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}


// ---- File: ProductVariantSelector.tsx ----

"use client";

import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { productVariants } from "@/db/schema"; // Import schema type

type Variant = typeof productVariants.$inferSelect;

interface ProductVariantSelectorProps {
  variants: Variant[];
  onVariantSelect: (variantId: string | null) => void; // Callback to parent
}

export function ProductVariantSelector({
  variants,
  onVariantSelect,
}: ProductVariantSelectorProps) {
  // State to hold the ID of the selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );

  // Handle selection change
  const handleSelectionChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    onVariantSelect(variantId); // Notify parent component
  };

  if (!variants || variants.length === 0) {
    return null; // Don't render anything if no variants
  }

  // Group variants by name (e.g., "Color", "Size") for display purposes
  const variantGroups: Record<string, Variant[]> = {};
  variants.forEach((variant) => {
    if (!variantGroups[variant.name]) {
      variantGroups[variant.name] = [];
    }
    variantGroups[variant.name].push(variant);
  });
  const groupNames = Object.keys(variantGroups);

  return (
    <div className="mt-4 space-y-4">
      <Label className="text-base font-medium">Select Option</Label>
      <RadioGroup
        onValueChange={handleSelectionChange} // Pass the variant ID directly
        value={selectedVariantId ?? ""} // Use selected ID for value
        className="flex flex-wrap gap-2"
      >
        {variants.map((variant) => (
          <Label
            key={variant.id}
            htmlFor={variant.id}
            className={`flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent ${
              selectedVariantId === variant.id
                ? "bg-accent ring-2 ring-primary"
                : ""
            } ${variant.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`} // Dim out of stock
          >
            <RadioGroupItem
              value={variant.id} // Use variant ID as the value for selection
              id={variant.id}
              className="sr-only"
              disabled={variant.stock <= 0} // Disable out of stock
            />
            {/* Display variant name and value */}
            {groupNames.length > 1 && `${variant.name}: `}
            {variant.value}
            {variant.stock <= 0 && (
              <span className="ml-1 text-xs text-muted-foreground">
                (Out of stock)
              </span>
            )}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}


// ---- File: page.tsx ----

import React from "react";
import { getPublicProductsByCategory } from "@/actions/product.actions";
import { ProductCard } from "@/components/products/ProductCard";
import { notFound } from "next/navigation"; // Import for handling not found categories
import type { Metadata, ResolvingMetadata } from "next"; // Import Metadata types

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const { categoryName, products } = await getPublicProductsByCategory(slug);

  // If categoryName is null, the category wasn't found
  if (!categoryName) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Category: {categoryName}
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No products found in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {/* TODO: Add pagination controls */}
    </div>
  );
}

// TODO: Implement generateStaticParams if needed for SSG.

// --- generateMetadata ---
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams: _searchParams }: Props, // Prefix unused searchParams
  parent: ResolvingMetadata // Prefix unused parent
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data - We only need the category name for metadata here
  // Re-fetching just the name might be slightly more efficient than fetching all products again,
  // but for simplicity, we can reuse the existing action or create a dedicated one later.
  // Let's reuse for now, acknowledging potential minor inefficiency.
  const { categoryName } = await getPublicProductsByCategory(slug, 0, 0); // Fetch with limit 0

  if (!categoryName) {
    // Return default metadata or handle not found case
    return {
      title: "Category Not Found",
      description: "The category you are looking for could not be found.",
    };
  }

  return {
    title: `${categoryName} | Marketplace`,
    description: `Browse products in the ${categoryName} category.`,
    // openGraph: { // Optional: Add Open Graph data if needed
    //   title: `${categoryName} | Marketplace`,
    //   description: `Browse products in the ${categoryName} category.`,
    // },
  };
}


// ---- File: QuestionForm.tsx ----

"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { submitQuestion, SubmitQuestionSchema } from "@/actions/review.actions"; // Import action and schema
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

type QuestionFormValues = z.infer<typeof SubmitQuestionSchema>;

interface QuestionFormProps {
  productId: string;
}

export function QuestionForm({ productId }: QuestionFormProps) {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(SubmitQuestionSchema),
    defaultValues: {
      productId: productId,
      question: "",
    },
  });

  async function onSubmit(data: QuestionFormValues) {
    setIsLoading(true);
    try {
      const result = await submitQuestion(data);
      if (result.success) {
        toast.success(result.message || "Question submitted successfully!");
        form.reset(); // Reset form
      } else {
        toast.error(result.error || "Failed to submit question.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Submit question error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (status === "unauthenticated") {
    return (
      <p className="text-sm text-muted-foreground">
        Please log in to ask a question.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ask a Question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your question about the product here..."
                  {...field}
                  rows={3}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Question
        </Button>
      </form>
    </Form>
  );
}


// ---- File: tailwind.config.ts ----

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate"; // Import the plugin

const config = {
  darkMode: "class", // Corrected: Use string 'class'
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}", // Ensure src directory is included
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate], // Corrected: Use imported plugin
} satisfies Config;

export default config;


// ---- File: seed-admin.ts ----

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { users } from "../src/db/schema";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const {
  DATABASE_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
} = process.env;

async function seedAdmin() {
  console.log("Starting admin user seeding...");

  // Validate environment variables
  if (
    !DATABASE_URL ||
    !ADMIN_EMAIL ||
    !ADMIN_PASSWORD ||
    !ADMIN_FIRST_NAME ||
    !ADMIN_LAST_NAME
  ) {
    console.error(
      "Error: Missing required environment variables (DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, ADMIN_LAST_NAME)"
    );
    process.exit(1);
  }

  let client;
  try {
    // Establish database connection
    client = postgres(DATABASE_URL, { max: 1 }); // Use max: 1 for scripts
    const db = drizzle(client, { schema });

    console.log("Database connection established.");

    // Check if admin user already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, ADMIN_EMAIL),
    });

    if (existingAdmin) {
      console.log(`Admin user with email ${ADMIN_EMAIL} already exists.`);
      process.exit(0); // Exit gracefully if admin exists
    }

    console.log(`Admin user ${ADMIN_EMAIL} not found, creating...`);

    // Hash the admin password
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    console.log("Password hashed.");

    // Insert the new admin user
    const [newAdmin] = await db
      .insert(users)
      .values({
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        email: ADMIN_EMAIL,
        passwordHash: passwordHash,
        role: "ADMIN",
        status: "ACTIVE", // Admins are active immediately
      })
      .returning();

    console.log("Admin user created successfully:");
    console.log(JSON.stringify(newAdmin, null, 2));

    process.exit(0); // Success
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1); // Exit with error code
  } finally {
    // Ensure the database connection is closed
    if (client) {
      await client.end();
      console.log("Database connection closed.");
    }
  }
}

seedAdmin();


// ---- File: page.tsx ----

// Basic placeholder page for Privacy Policy

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          Your privacy is important to us. It is our policy to respect your
          privacy regarding any information we may collect from you across our
          website.
        </p>
        <p>
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We also let you know why we’re collecting it
          and how it will be used.
        </p>

        <h2 className="mt-6 text-2xl font-semibold">Information We Collect</h2>
        <p>
          Log data: Like many site operators, we collect information that your
          browser sends whenever you visit our site. This Log Data may include
          information such as your computer's Internet Protocol ("IP") address,
          browser type, browser version, the pages of our site that you visit,
          the time and date of your visit, the time spent on those pages and
          other statistics.
        </p>
        <p>
          Personal Information: We may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you. Personally identifiable information may include, but is
          not limited to your name, email address, postal address ("Personal
          Information").
        </p>

        <h2 className="mt-6 text-2xl font-semibold">How We Use Information</h2>
        <p>
          We use the information we collect in various ways, including to:
          Provide, operate, and maintain our website; Improve, personalize, and
          expand our website; Understand and analyze how you use our website;
          Develop new products, services, features, and functionality;
          Communicate with you, either directly or through one of our partners,
          including for customer service, to provide you with updates and other
          information relating to the website, and for marketing and promotional
          purposes; Send you emails; Find and prevent fraud.
        </p>

        <p className="mt-8 font-semibold">
          [This is placeholder content. Please replace with your actual Privacy
          Policy.]
        </p>
      </div>
    </div>
  );
}


// ---- File: page.tsx ----

import React, { Suspense } from "react";
import { searchProducts } from "@/actions/product.actions";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

interface SearchPageProps {
  searchParams: {
    q?: string; // Search query
    // Add other potential search params like page later
  };
}

// Separate async component to fetch and display results
async function SearchResults({ query }: { query: string }) {
  const products = await searchProducts(query);

  return (
    <>
      {products.length === 0 ? (
        <p className="text-center text-muted-foreground col-span-full">
          No products found matching your search: {query}.
        </p>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </>
  );
}

// Loading skeleton component
function SearchLoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Search Results {query && `for: ${query}`}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Use Suspense for streaming results */}
        <Suspense fallback={<SearchLoadingSkeleton />}>
          {query ? (
            <SearchResults query={query} />
          ) : (
            <p className="text-center text-muted-foreground col-span-full">
              Please enter a search term.
            </p>
          )}
        </Suspense>
      </div>
      {/* TODO: Add pagination controls */}
    </div>
  );
}

// TODO: Add generateMetadata for search page


// ---- File: button.tsx ----

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }


// ---- File: card.tsx ----

import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}


// ---- File: ProductCard.tsx ----

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils"; // Assuming formatPrice exists

// Define the expected props based on getPublicProducts return type
interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    priceInCents: number;
    imageUrl: string | null;
    category?: {
      // Optional category display
      name: string;
      slug: string;
    } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const placeholderImage = "/placeholder.svg"; // Define a placeholder

  return (
    <Card className="w-full overflow-hidden transition-shadow duration-200 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} aria-label={product.title}>
        <CardHeader className="p-0">
          <div className="aspect-square relative w-full">
            <Image
              src={product.imageUrl || placeholderImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Basic responsive sizes
              className="object-cover"
              priority={false} // Set priority based on context if needed (e.g., for first few items)
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.srcset = placeholderImage;
                e.currentTarget.src = placeholderImage;
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold leading-tight truncate">
            {product.title}
          </CardTitle>
          {/* Optional: Display category */}
          {/* {product.category && (
            <p className="text-sm text-muted-foreground mt-1">
              {product.category.name}
            </p>
          )} */}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-base font-medium">
            {formatPrice(product.priceInCents)}
          </p>
          {/* Add other info like rating later if needed */}
        </CardFooter>
      </Link>
    </Card>
  );
}


// ---- File: page.tsx ----

import React from "react";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/actions/user.actions";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AddressList } from "@/components/profile/AddressList"; // Import AddressList

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    // Check for user ID as well
    redirect("/login"); // Redirect if not logged in
  }

  // Fetch user data
  const userData = await getUserProfile();

  if (!userData) {
    // Handle case where user data couldn't be fetched (shouldn't happen if session exists)
    return (
      <p className="text-center text-destructive">
        Error loading profile data.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Update Form */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
          <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
            <p className="text-muted-foreground mb-1">
              Email: {userData.email}
            </p>
            <p className="text-muted-foreground mb-1">Role: {userData.role}</p>
            <p className="text-muted-foreground mb-4">
              Status: {userData.status}
            </p>
            <ProfileForm
              initialData={{
                firstName: userData.firstName,
                lastName: userData.lastName,
                pixKey: userData.pixKey,
                role: userData.role,
              }}
            />
          </div>
        </div>

        {/* Address Management */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Manage Addresses</h2>
          {/* Pass fetched addresses to the AddressList component */}
          <AddressList addresses={userData.addresses || []} />
          {/* Removed extra closing div */}
        </div>
      </div>
    </div>
  );
}


// ---- File: 0000_familiar_psylocke.sql ----

CREATE TYPE "public"."user_role" AS ENUM('CUSTOMER', 'VENDOR', 'AFFILIATE', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('PENDING', 'ACTIVE', 'REJECTED');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"street" text NOT NULL,
	"city" text NOT NULL,
	"state" varchar(50) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(50) NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'CUSTOMER' NOT NULL,
	"status" "user_status" DEFAULT 'ACTIVE' NOT NULL,
	"pix_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

// ---- File: product.schema.ts ----

import { z } from "zod";

// Zod schema for product creation/update
export const ProductSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
    description: z.string().optional(),
    priceInCents: z.coerce // Coerce input (likely string from form) to number
      .number({ invalid_type_error: "Price must be a number." })
      .int("Price must be in cents (integer).")
      .positive("Price must be positive.")
      .min(1, "Price must be at least 1 cent."),
    categoryId: z.string().uuid("Invalid category selected.").optional(), // Optional for now, maybe make required later
    tags: z.string().optional(), // Simple comma-separated string for now, parse in action
    stock: z.coerce // Coerce input to number
      .number({ invalid_type_error: "Stock must be a number." })
      .int("Stock must be an integer.")
      .min(0, "Stock cannot be negative."),
    isDigital: z.boolean().default(false),
    isPhysical: z.boolean().default(true),
    // imageFile: represents the uploaded image file (handled separately via FormData)
    // assetFile: represents the uploaded digital asset file (handled separately via FormData)
    // variants: Array of variant objects (handle later)
  })
  .refine((data) => data.isDigital || data.isPhysical, {
    message: "Product must be either digital or physical (or both).",
    // This path helps associate the error with a specific field if needed,
    // but for a general refinement, it might not point to a single input.
    // path: ["isDigital"], // Or ["isPhysical"]
  });

export type ProductFormData = z.infer<typeof ProductSchema>;

// Example schema for variants if added later
// export const VariantSchema = z.object({
//   name: z.string().min(1),
//   value: z.string().min(1),
//   priceModifierInCents: z.coerce.number().int().default(0),
//   stock: z.coerce.number().int().min(0),
// });


// ---- File: page.tsx ----

// Basic placeholder page for Terms of Service

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          Welcome to our marketplace! These terms and conditions outline the
          rules and regulations for the use of our website.
        </p>
        <p>
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use Marketplace if you do not agree to
          take all of the terms and conditions stated on this page.
        </p>

        <h2 className="mt-6 text-2xl font-semibold">Placeholder Section 1</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
          quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
          mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
          Vestibulum lacinia arcu eget nulla.
        </p>

        <h2 className="mt-6 text-2xl font-semibold">Placeholder Section 2</h2>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Curabitur sodales ligula in libero. Sed
          dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean
          quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis
          tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi
          lectus risus, iaculis vel, suscipit quis, luctus non, massa.
        </p>

        <p className="mt-8 font-semibold">
          [This is placeholder content. Please replace with your actual Terms of
          Service.]
        </p>
      </div>
    </div>
  );
}


// ---- File: page.tsx ----

import React from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductForm } from "@/components/vendor/ProductForm";
import { getProductById, updateProduct } from "@/actions/product.actions"; // Import actions
import type { ProductFormData } from "@/lib/schemas/product.schema"; // Import the type

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = params;
  const product = await getProductById(productId);

  if (!product) {
    notFound(); // Trigger 404 if product doesn't exist
  }

  // Wrapper function to pass productId to the server action
  const handleUpdateSubmit = async (
    data: ProductFormData,
    imageData?: File,
    assetData?: File
  ) => {
    // Need 'use server' directive if this wrapper itself becomes complex,
    // but since it just calls another server action, it's fine here.
    return updateProduct(productId, data, imageData, assetData);
  };

  // Prepare initial data, ensuring null values are converted to undefined for the form
  const initialFormData = {
    ...product,
    description: product.description ?? undefined,
    categoryId: product.categoryId ?? undefined,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>
          Update the details for: {product.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Pass initialData and the bound update action */}
        <ProductForm
          initialData={initialFormData} // Use prepared data
          onSubmit={handleUpdateSubmit} // Pass the wrapper function
        />
      </CardContent>
    </Card>
  );
}


// ---- File: middleware.ts ----

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Initialize NextAuth with the shared configuration
const { auth } = NextAuth(authConfig);

// Export the middleware function, applying the auth logic
// The `authorized` callback in authConfig handles the redirection logic
export default auth;

// Define which routes the middleware should apply to
export const config = {
  // Matcher to protect specific routes
  // This example protects all routes under /dashboard
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
  // Explanation of matcher:
  // - `^`: Start of the string
  // - `/`: Match the root path
  // - `(`: Start of a group
  // - `?!`: Negative lookahead (ensure the following pattern doesn't match)
  //   - `api`: Matches `/api`
  //   - `|`: OR
  //   - `_next/static`: Matches Next.js static files
  //   - `|`: OR
  //   - `_next/image`: Matches Next.js image optimization files
  //   - `|`: OR
  //   - `favicon.ico`: Matches the favicon file
  //   - `|`: OR
  //   - `login`: Matches `/login`
  //   - `|`: OR
  //   - `register`: Matches `/register`
  // - `)`: End of the negative lookahead group
  // - `.*`: Match any character (except newline) zero or more times
  // - `)`: End of the main group
  // This effectively matches all routes EXCEPT the ones specified in the negative lookahead.
  // The `authorized` callback in auth.config.ts then specifically checks if the matched route
  // starts with `/dashboard` and if the user is logged in.
};


// ---- File: badge.tsx ----

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }


// ---- File: auth.schema.ts ----

import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  // Role will be determined by the registration form/context, not directly submitted here
});

// Type definitions inferred from schemas
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Reset token is required." }), // Usually from URL param, passed via form
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Error applies to the confirmPassword field
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;


// ---- File: scroll-area.tsx ----

"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }


// ---- File: README.md ----

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


// ---- File: radio-group.tsx ----

"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }


// ---- File: page.tsx ----

import { getWithdrawalRequests } from "@/actions/user.actions";
// import { formatPrice } from "@/lib/utils"; // No longer needed here
// import { Badge } from "@/components/ui/badge"; // No longer needed here
import { WithdrawalManagementTable } from "@/components/admin/WithdrawalManagementTable"; // Import the table component

// Helper function to format date nicely (optional) - Moved to table component
/*
function formatDate(date: Date | null | undefined): string {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
*/

export default async function AdminWithdrawalsPage() {
  // Fetch all requests initially, could add status filter later
  const requests = await getWithdrawalRequests();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Withdrawals</h1>

      {requests.length === 0 ? (
        <p>No withdrawal requests found.</p> // Keep this for empty state
      ) : (
        // Render the table component instead of the list
        <WithdrawalManagementTable requests={requests} />
      )}
      {/* Task 5.1.6 is now complete with the table component */}
    </div>
  );
}


// ---- File: Footer.tsx ----

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {currentYear} Marketplace Inc. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="/terms"
            className="text-sm hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false} // Optional: set prefetch behavior
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-sm hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            Privacy Policy
          </Link>
          <Link
            href="/about"
            className="text-sm hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            About Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}


// ---- File: page.tsx ----

// Basic placeholder page for About Us

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">About Us</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>
          Welcome to Marketplace! We are passionate about connecting vendors
          with customers and providing a seamless platform for discovering and
          selling unique products.
        </p>

        <h2 className="mt-6 text-2xl font-semibold">Our Mission</h2>
        <p>
          Our mission is to empower creators and entrepreneurs by providing them
          with the tools they need to succeed in the online marketplace, while
          offering customers a diverse and high-quality selection of goods.
        </p>

        <h2 className="mt-6 text-2xl font-semibold">Our Team</h2>
        <p>
          We are a small, dedicated team focused on building the best possible
          experience for everyone involved. [Add more details about the team or
          company history here if desired.]
        </p>

        <p className="mt-8 font-semibold">
          [This is placeholder content. Please replace with your actual About Us
          information.]
        </p>
      </div>
    </div>
  );
}


// ---- File: drizzle.config.ts ----

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  // Provide a default dummy URL for initial setup if needed,
  // but ideally, the user should create .env.local first.
  // Throwing an error is safer to ensure configuration is correct.
  console.warn(
    'DATABASE_URL environment variable is not set. Please create a .env.local file with DATABASE_URL="postgresql://user:password@host:port/db"'
  );
  // Using a placeholder to allow initial generation without a real DB connection yet
  // process.env.DATABASE_URL = 'postgresql://user:password@host:port/db_placeholder';
  throw new Error(
    "DATABASE_URL environment variable is required in .env.local"
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts", // Path to the schema file (will be created in Task 1.2)
  out: "./src/db/migrations", // Directory to output migration files
  dialect: "postgresql", // Specify the database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true, // Enable verbose logging during migrations
  strict: true, // Enable strict mode for schema checking
});


// ---- File: layout.tsx ----

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartSheet } from "@/components/cart/CartSheet"; // Import CartSheet

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {/* TODO: Add a proper Header component later */}
          <div className="fixed top-4 right-4 z-50">
            {" "}
            {/* Basic positioning */}
            <CartSheet />
          </div>
          {children}
          <Toaster richColors />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}


// ---- File: checkbox.tsx ----

"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }


// ---- File: auth.config.ts ----

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", // Custom login page path
    // error: '/auth/error', // Optional: Custom error page
    // newUser: '/auth/new-user' // Optional: Redirect new users
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true; // Allow access if logged in
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Optional: Redirect logged-in users from auth pages like /login or /register
        // if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')) {
        //   return Response.redirect(new URL('/dashboard', nextUrl));
        // }
      }
      // Allow access to all other pages by default
      return true;
    },
    // Add other callbacks like jwt, session as needed later
  },
  providers: [], // Add providers in the main auth.ts file
} satisfies NextAuthConfig;


// ---- File: page.tsx ----

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Duplicate imports removed below
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getVendorProducts } from "@/actions/product.actions"; // Import the action
import { VendorProductTable } from "@/components/vendor/VendorProductTable"; // Import the table component (removed columns import)

export default async function VendorProductsPage() {
  // Fetch products server-side
  const products = await getVendorProducts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Products</CardTitle>
        <CardDescription>
          View, add, edit, or delete your product listings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link href="/dashboard/vendor/products/new">Add New Product</Link>
          </Button>
        </div>
        {/* Render the table component with fetched data - columns are defined within the component */}
        <VendorProductTable data={products} />
      </CardContent>
    </Card>
  );
}


// ---- File: avatar.tsx ----

"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }


// ---- File: utils.ts ----

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a URL-friendly slug from a string.
 * @param str The string to slugify.
 * @returns The slugified string.
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/ /g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, ""); // Remove all non-word chars except hyphens
}

/**
 * Formats a price in cents into a currency string (e.g., $10.50).
 * Assumes USD for simplicity, adjust locale and currency as needed.
 * @param priceInCents The price in cents.
 * @returns The formatted price string.
 */
export function formatPrice(priceInCents: number): string {
  const priceInDollars = priceInCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInDollars);
}


// ---- File: input.tsx ----

import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }


// ---- File: page.tsx ----

import React from "react";
import { getPublicProducts } from "@/actions/product.actions";
import { ProductCard } from "@/components/products/ProductCard";

export default async function AllProductsPage() {
  // Fetch products - Add pagination later if needed
  const products = await getPublicProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No products found. Check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {/* TODO: Add pagination controls */}
    </div>
  );
}


// ---- File: page.tsx ----

import React from "react";
import { getPendingUsers } from "@/actions/user.actions"; // Import action
import { ApprovalList } from "@/components/admin/ApprovalList"; // Import component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminApprovalsPage() {
  // Fetch pending users
  const pendingUsers = await getPendingUsers();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Approvals (Admin)</h1>
      <p className="text-muted-foreground mb-6">
        Approve or reject pending Vendor and Affiliate registrations.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovalList users={pendingUsers} />
        </CardContent>
      </Card>
    </div>
  );
}


// ---- File: page.tsx ----

import React from "react";
import { getVendorOrderItems } from "@/actions/order.actions";
import { VendorOrderTable } from "@/components/vendor/VendorOrderTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components

export default async function VendorOrdersPage() {
  const orderItems = await getVendorOrderItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Order Items</h1>
      <p className="text-muted-foreground mb-6">
        View and manage items from orders placed for your products.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <VendorOrderTable orderItems={orderItems} />
        </CardContent>
      </Card>
    </div>
  );
}


// ---- File: page.tsx ----

import React from "react";
// Import necessary components and actions later

// TODO: Add action to fetch ALL orders (admin only)

export default async function AdminAllOrdersPage() {
  // TODO: Fetch all orders using an admin-specific action
  // const allOrders = await getAllOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Orders (Admin)</h1>
      <p className="text-muted-foreground mb-6">
        View all orders placed across the marketplace.
      </p>

      {/* TODO: Display all orders in a table */}
      <div className="border rounded-lg p-4">
        <p className="text-center text-muted-foreground">
          All orders table implementation pending.
        </p>
        {/* Placeholder for table */}
      </div>
    </div>
  );
}


// ---- File: page.tsx ----

import React from "react";
// Import necessary components and actions later

// TODO: Add action to fetch ALL users (admin only)

export default async function AdminAllUsersPage() {
  // TODO: Fetch all users using an admin-specific action
  // const allUsers = await getAllUsers();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Users (Admin)</h1>
      <p className="text-muted-foreground mb-6">
        View all registered users on the marketplace.
      </p>

      {/* TODO: Display all users in a table */}
      <div className="border rounded-lg p-4">
        <p className="text-center text-muted-foreground">
          All users table implementation pending.
        </p>
        {/* Placeholder for table */}
      </div>
    </div>
  );
}


// ---- File: page.tsx ----

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react"; // Import Suspense

// Helper component to extract search params
function ResetPasswordPageContent({ token }: { token: string | null }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <ResetPasswordForm token={token} />
    </div>
  );
}

// Page component receives searchParams prop
export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams?.token as string | null;

  return (
    // Use Suspense for client components accessing searchParams
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageContent token={token ?? null} />
    </Suspense>
  );
}


// ---- File: resend.ts ----

import { Resend } from "resend";

// Ensure RESEND_API_KEY is set (it should be loaded via .env.local by Next.js)
if (!process.env.RESEND_API_KEY) {
  // In development, we might want to allow proceeding without a key,
  // but log a warning. In production, this should definitely throw an error.
  console.warn(
    "RESEND_API_KEY environment variable is not set. Email sending will fail. Please check your .env.local file."
  );
  // For now, let's throw to ensure configuration is addressed.
  // throw new Error('RESEND_API_KEY environment variable is required.');
}

// Initialize Resend client. If the key is missing, it might throw an error
// internally or fail silently depending on the Resend library version.
// Adding a check above is safer.
export const resend = new Resend(process.env.RESEND_API_KEY);


// ---- File: page.tsx ----

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductForm } from "@/components/vendor/ProductForm";
// import type { ProductFormData } from "@/lib/schemas/product.schema"; // Removed unused import
import { createProduct } from "@/actions/product.actions"; // Import the actual action

export default function NewProductPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Fill in the details below to list a new product in the marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm onSubmit={createProduct} /> {/* Use the imported action */}
      </CardContent>
    </Card>
  );
}


// ---- File: textarea.tsx ----

import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }


// ---- File: separator.tsx ----

"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }


// ---- File: index.ts ----

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // Import all exports from schema.ts

// Ensure DATABASE_URL is set (it should be loaded via .env.local by Next.js)
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please check your .env.local file."
  );
}

// Create the connection client
const client = postgres(process.env.DATABASE_URL);

// Create the Drizzle instance
// Pass the schema to the drizzle function
export const db = drizzle(client, { schema });

// Optionally, export the schema itself if needed elsewhere directly
export * as dbSchema from "./schema";


// ---- File: .gitignore ----

# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts


// ---- File: sonner.tsx ----

"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }


// ---- File: label.tsx ----

"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }


// ---- File: components.json ----

{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}

// ---- File: _journal.json ----

{
  "version": "7",
  "dialect": "postgresql",
  "entries": [
    {
      "idx": 0,
      "version": "7",
      "when": 1743385893379,
      "tag": "0000_familiar_psylocke",
      "breakpoints": true
    },
    {
      "idx": 1,
      "version": "7",
      "when": 1743562386071,
      "tag": "0001_amazing_gamora",
      "breakpoints": true
    }
  ]
}

// ---- File: eslint.config.mjs ----

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;


// ---- File: skeleton.tsx ----

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }


// ---- File: page.tsx ----

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <ForgotPasswordForm />
    </div>
  );
}


// ---- File: page.tsx ----

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <LoginForm />
    </div>
  );
}


// ---- File: page.tsx ----

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <RegisterForm />
    </div>
  );
}


// ---- File: route.ts ----

// This file simply exports the handlers from the main auth configuration.
// It allows NextAuth.js to handle requests to /api/auth/* routes.

export { GET, POST } from "@/../auth"; // Adjust path relative to the api route


// ---- File: cypress.config.ts ----

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});


// ---- File: next.config.ts ----

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


// ---- File: postcss.config.mjs ----

const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;


// ---- File: .gitkeep ----

# Keep this directory
