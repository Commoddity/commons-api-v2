import { db } from "@db";

const resetUsersSQL = `
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
  email VARCHAR (255) NOT NULL UNIQUE,
  phone_number BIGINT,
  postal_code VARCHAR (255),
  email_notification INT,
  sms_notification INT,
  active BOOLEAN,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE users TO commoddity;

DROP TABLE IF EXISTS user_credentials CASCADE;

CREATE TABLE user_credentials (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  user_id TEXT NOT NULL REFERENCES users (id),
  type VARCHAR(55),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, type)
);

GRANT ALL PRIVILEGES ON TABLE user_credentials TO commoddity;

INSERT INTO users 
  (first_name, last_name, email, phone_number, postal_code, email_notification, sms_notification, active)
VALUES 
  ('Greg', 'Winter', 'greg@winter.com', 7781234567, 'ABC 123', 1, 2, true), 
  ('Mary', 'Jane', 'buddy@friend.com', 2504530123, 'GFH 542', 1, 1, true), 
  ('Gerald', 'Grundy', 'gerald@thegod.com', 2503215421, 'QWS 591', 2, 2, false);

INSERT INTO user_credentials 
  (user_id, type)
VALUES 
  ((SELECT id FROM users WHERE first_name='Greg'), 'apple'),
  ((SELECT id FROM users WHERE first_name='Mary'), 'facebook'),
  ((SELECT id FROM users WHERE first_name='Mary'), 'apple'),
  ((SELECT id FROM users WHERE first_name='Mary'), 'username'),
  ((SELECT id FROM users WHERE first_name='Gerald'), 'username'),
  ((SELECT id FROM users WHERE first_name='Gerald'), 'facebook');
`;

export const resetUsers = async (): Promise<void> => {
  await db.none(resetUsersSQL);
};
