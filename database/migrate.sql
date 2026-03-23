-- Run this file to add new columns needed for the updated features
-- Command: psql -U postgres clothing_store < database/migrate.sql

-- 1. Add gender column to products
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='gender') THEN
    ALTER TABLE products ADD COLUMN gender VARCHAR(20) DEFAULT 'Kids';
    RAISE NOTICE 'Added gender column to products';
  ELSE
    RAISE NOTICE 'gender column already exists, skipping';
  END IF;
END $$;

-- 2. Tag products by gender based on category and name
UPDATE products SET gender = 'Girls' 
WHERE category = 'Dresses' 
   OR name ILIKE '%frock%' 
   OR name ILIKE '%dress%' 
   OR name ILIKE '%princess%' 
   OR name ILIKE '%fairy%' 
   OR name ILIKE '%butterfly%'
   OR name ILIKE '%tutu%'
   OR name ILIKE '%ruffle%';

UPDATE products SET gender = 'Boys' 
WHERE name ILIKE '%vehicle%' 
   OR name ILIKE '%car%' 
   OR name ILIKE '%taz%' 
   OR name ILIKE '%bugs bunny%'
   OR name ILIKE '%truck%'
   OR name ILIKE '%explorer%';

-- 3. Add order_status column to orders
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='orders' AND column_name='order_status') THEN
    ALTER TABLE orders ADD COLUMN order_status VARCHAR(30) DEFAULT 'confirmed';
    RAISE NOTICE 'Added order_status column to orders';
  ELSE
    RAISE NOTICE 'order_status column already exists, skipping';
  END IF;
END $$;

-- 4. Set existing orders to confirmed
UPDATE orders SET order_status = 'confirmed' WHERE order_status IS NULL;

-- 5. Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  customer_email VARCHAR(255),
  rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Done!
SELECT 'Migration complete! ✅' as status;

-- Add customer_name to product_reviews if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_reviews' AND column_name='customer_name') THEN
    ALTER TABLE product_reviews ADD COLUMN customer_name VARCHAR(100) DEFAULT 'Anonymous';
  END IF;
END $$;
