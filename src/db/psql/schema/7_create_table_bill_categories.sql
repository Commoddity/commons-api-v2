DROP TABLE IF EXISTS bill_categories CASCADE;

CREATE TABLE bill_categories (
  bill_id TEXT NOT NULL REFERENCES bills (id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (bill_id, category_id)
);

GRANT ALL PRIVILEGES ON TABLE bill_categories TO commoddity;
