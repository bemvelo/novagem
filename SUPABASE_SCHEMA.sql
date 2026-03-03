-- Supabase Database Schema for Gleamia
-- Run these queries in your Supabase SQL Editor

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  items JSONB NOT NULL, -- Array of {id, name, quantity, price}
  total DECIMAL(10, 2) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  method VARCHAR(50) NOT NULL DEFAULT 'ecocash', -- 'ecocash' or 'cod'
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Products (Optional - add sample data for testing)
INSERT INTO products (name, price, category, description) VALUES
  ('Diamond Ring', 1299.99, 'Rings', 'Elegant diamond ring with 18k gold band'),
  ('Pearl Necklace', 599.99, 'Necklaces', 'Beautiful pearl necklace with silver chain'),
  ('Gold Earrings', 399.99, 'Earrings', 'Classic gold earring set'),
  ('Luxury Watch', 1999.99, 'Watches', 'Premium women''s luxury watch')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users Table
CREATE POLICY "Users can read their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for Products Table
CREATE POLICY "Anyone can read products" 
  ON products FOR SELECT 
  USING (true);

-- RLS Policies for Orders Table
CREATE POLICY "Users can read their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all orders" 
  ON orders FOR SELECT 
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update order status" 
  ON orders FOR UPDATE 
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
