```sql
-- Table: profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Table: stores
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store manager can view store"
  ON stores FOR SELECT
  USING (manager_id = auth.uid());

CREATE POLICY "Store manager can update store"
  ON stores FOR UPDATE
  USING (manager_id = auth.uid());

CREATE POLICY "Admin can view all stores"
  ON stores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Table: products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Owner or store can update product"
  ON products FOR UPDATE
  USING (
    user_id = auth.uid() OR
    store_id IN (SELECT id FROM stores WHERE manager_id = auth.uid())
  );

CREATE POLICY "Owner or store can delete product"
  ON products FOR DELETE
  USING (
    user_id = auth.uid() OR
    store_id IN (SELECT id FROM stores WHERE manager_id = auth.uid())
  );

CREATE POLICY "User can insert their product"
  ON products FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Table: product_images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read product images"
  ON product_images FOR SELECT
  USING (
    product_id IN (SELECT id FROM products WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can insert product images"
  ON product_images FOR INSERT
  WITH CHECK (
    product_id IN (SELECT id FROM products WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can delete product images"
  ON product_images FOR DELETE
  USING (
    product_id IN (SELECT id FROM products WHERE user_id = auth.uid())
  );

-- Table: reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read their reservations"
  ON reservations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "User can create reservation"
  ON reservations FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Table: negotiations
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read negotiation"
  ON negotiations FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Participants can update negotiation"
  ON negotiations FOR UPDATE
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Buyer can create negotiation"
  ON negotiations FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- Table: transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyer or seller can read transaction"
  ON transactions FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Store manager can view store transactions"
  ON transactions FOR SELECT
  USING (
    store_id IN (SELECT id FROM stores WHERE manager_id = auth.uid())
  );

-- Table: cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can manage own cart (select)"
  ON cart_items FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "User can manage own cart (insert)"
  ON cart_items FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can manage own cart (update)"
  ON cart_items FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "User can manage own cart (delete)"
  ON cart_items FOR DELETE
  USING (user_id = auth.uid());

-- Table: donations
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read their donations"
  ON donations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "User can update their donations"
  ON donations FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "User can delete their donations"
  ON donations FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "User can insert donation"
  ON donations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can validate donation"
  ON donations FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
  );

-- Table: donation_images
ALTER TABLE donation_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner of donation can read images"
  ON donation_images FOR SELECT
  USING (
    donation_id IN (SELECT id FROM donations WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can insert donation image"
  ON donation_images FOR INSERT
  WITH CHECK (
    donation_id IN (SELECT id FROM donations WHERE user_id = auth.uid())
  );

CREATE POLICY "Owner can delete donation image"
  ON donation_images FOR DELETE
  USING (
    donation_id IN (SELECT id FROM donations WHERE user_id = auth.uid())
  );

-- Table: help_requests
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can manage own help requests (select)"
  ON help_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "User can insert help request"
  ON help_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can update help request"
  ON help_requests FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "User can delete help request"
  ON help_requests FOR DELETE
  USING (user_id = auth.uid());

-- Table: admin_validations
ALTER TABLE admin_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can SELECT validations"
  ON admin_validations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can INSERT validations"
  ON admin_validations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can UPDATE validations"
  ON admin_validations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can DELETE validations"
  ON admin_validations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );


-- Table: store_metrics
ALTER TABLE store_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store manager can read metrics"
  ON store_metrics FOR SELECT
  USING (
    store_id IN (SELECT id FROM stores WHERE manager_id = auth.uid())
  );

CREATE POLICY "Admin can read all metrics"
  ON store_metrics FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
  );

-- Table: notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "User can insert notification"
  ON notifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can delete notification"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());
```
