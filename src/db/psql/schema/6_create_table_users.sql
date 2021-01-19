DROP TABLE IF EXISTS users CASCADE;

CREATE OR REPLACE FUNCTION generate_uid(size INT) RETURNS TEXT AS $$
DECLARE
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  bytes BYTEA := gen_random_bytes(size);
  l INT := length(characters);
  i INT := 0;
  output TEXT := '';
BEGIN
  WHILE i < size LOOP
    output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
    i := i + 1;
  END LOOP;
  RETURN output;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  first_name VARCHAR (255) NOT NULL,
  last_name VARCHAR (255) NOT NULL,
  username VARCHAR (255) NOT NULL UNIQUE,
  email VARCHAR (255) NOT NULL UNIQUE,
  email_notification INT,
  sms_notification INT,
  active BOOLEAN,
  phone_number BIGINT,
  address VARCHAR (255),
  street VARCHAR (255),
  city VARCHAR (255),
  province VARCHAR (255),
  postal_code VARCHAR (255),
  mp VARCHAR (255),
  party VARCHAR (255),
  riding_name VARCHAR (255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE users TO commoddity;