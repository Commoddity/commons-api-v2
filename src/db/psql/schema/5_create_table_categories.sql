DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR (555) NOT NULL,
  class_code VARCHAR (555) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE categories TO commoddity;

GRANT ALL ON SEQUENCE categories_id_seq TO commoddity;
