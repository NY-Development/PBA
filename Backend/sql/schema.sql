
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_vendor   ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user   ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product   ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_refresh_id   ON refresh_tokens(id);
CREATE INDEX IF NOT EXISTS idx_refresh_revoked ON refresh_tokens(is_revoked);
CREATE INDEX IF NOT EXISTS idx_user_provider ON payment_accounts(user_id, provider),
CREATE INDEX IF NOT EXISTS idx_provider ON payment_accounts (provider);