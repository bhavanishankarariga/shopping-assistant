/*
  # Voice Command Shopping Assistant Schema

  1. New Tables
    - `shopping_items`
      - `id` (uuid, primary key) - Unique identifier for each item
      - `name` (text) - Item name
      - `quantity` (integer) - Number of items
      - `unit` (text) - Unit of measurement (e.g., packets, kg, liters)
      - `category` (text) - Auto-categorized type (dairy, fruits, vegetables, snacks, etc.)
      - `is_completed` (boolean) - Whether item is checked off
      - `created_at` (timestamptz) - When item was added
      - `updated_at` (timestamptz) - Last modification time

    - `item_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name
      - `keywords` (text[]) - Keywords for categorization
      - `icon` (text) - Icon identifier

  2. Security
    - Enable RLS on all tables
    - Since this is a public frontend app without auth, allow all operations
    - Note: In production, you'd want to add user authentication

  3. Initial Data
    - Populate item_categories with common shopping categories
*/

CREATE TABLE IF NOT EXISTS shopping_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity integer DEFAULT 1,
  unit text DEFAULT 'item',
  category text DEFAULT 'other',
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS item_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  keywords text[] NOT NULL,
  icon text NOT NULL
);

ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to shopping_items"
  ON shopping_items FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to shopping_items"
  ON shopping_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to shopping_items"
  ON shopping_items FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from shopping_items"
  ON shopping_items FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to item_categories"
  ON item_categories FOR SELECT
  USING (true);

INSERT INTO item_categories (name, keywords, icon) VALUES
  ('dairy', ARRAY['milk', 'cheese', 'butter', 'yogurt', 'cream', 'curd'], 'milk'),
  ('fruits', ARRAY['apple', 'banana', 'orange', 'grape', 'mango', 'berry', 'strawberry', 'watermelon', 'pineapple'], 'apple'),
  ('vegetables', ARRAY['tomato', 'potato', 'onion', 'carrot', 'lettuce', 'spinach', 'broccoli', 'cucumber'], 'carrot'),
  ('snacks', ARRAY['chips', 'biscuit', 'cookie', 'chocolate', 'candy', 'popcorn', 'crackers'], 'cookie'),
  ('beverages', ARRAY['juice', 'soda', 'coffee', 'tea', 'water', 'drink'], 'coffee'),
  ('meat', ARRAY['chicken', 'beef', 'pork', 'fish', 'meat', 'lamb'], 'drumstick'),
  ('grains', ARRAY['rice', 'bread', 'pasta', 'cereal', 'flour', 'oats'], 'wheat'),
  ('other', ARRAY[]::text[], 'shopping-basket')
ON CONFLICT (name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_shopping_items_category ON shopping_items(category);
CREATE INDEX IF NOT EXISTS idx_shopping_items_is_completed ON shopping_items(is_completed);
CREATE INDEX IF NOT EXISTS idx_shopping_items_created_at ON shopping_items(created_at DESC);