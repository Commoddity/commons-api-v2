DROP TABLE IF EXISTS user_categories CASCADE;

CREATE TABLE user_categories (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, category_id)
);

GRANT ALL PRIVILEGES ON TABLE user_categories TO commoddity;
