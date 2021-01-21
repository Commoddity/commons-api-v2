DROP EXTENSION IF EXISTS pgcrypto;
CREATE EXTENSION pgcrypto;

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

DROP TABLE IF EXISTS parliaments CASCADE;

CREATE TABLE parliaments (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  number INT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (number)
);

GRANT ALL PRIVILEGES ON TABLE parliaments TO commons_admin;

DROP TABLE IF EXISTS parliamentary_sessions CASCADE;

CREATE TABLE parliamentary_sessions (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  parliament INT NOT NULL REFERENCES parliaments (number),
  number INT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE parliamentary_sessions TO commons_admin;

DROP TABLE IF EXISTS bills CASCADE;

CREATE TABLE bills (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  parliamentary_session_id TEXT NOT NULL REFERENCES parliamentary_sessions (id),
  code VARCHAR (7) NOT NULL UNIQUE,
  title VARCHAR (555) NOT NULL,
  description TEXT,
  introduced_date VARCHAR(555),
  summary_url VARCHAR(555),
  page_url VARCHAR(555),
  full_text_url VARCHAR(555),
  passed BOOLEAN,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE bills TO commons_admin;

DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE events (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  bill_code VARCHAR (7) NOT NULL REFERENCES bills (code),
  title VARCHAR (555) NOT NULL,
  publication_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE events TO commons_admin;

DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  name VARCHAR (555) NOT NULL,
  class_code VARCHAR (555) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE categories TO commons_admin;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  first_name VARCHAR (255) NOT NULL,
  last_name VARCHAR (255) NOT NULL,
  email VARCHAR (255) NOT NULL,
  email_notification INT,
  sms_notification INT,
  active BOOLEAN,
  phone_number BIGINT,
  address VARCHAR (255),
  street VARCHAR (255),
  city VARCHAR (255),
  province VARCHAR (255),
  postal_code VARCHAR (7),
  mp VARCHAR (255),
  party VARCHAR (255),
  riding_name VARCHAR (255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email)
);

GRANT ALL PRIVILEGES ON TABLE users TO commons_admin;

DROP TABLE IF EXISTS bill_categories CASCADE;

CREATE TABLE bill_categories (
  bill_id TEXT NOT NULL REFERENCES bills (id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (bill_id, category_id)
);

GRANT ALL PRIVILEGES ON TABLE bill_categories TO commons_admin;

DROP TABLE IF EXISTS user_bills CASCADE;

CREATE TABLE user_bills (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  bill_id TEXT NOT NULL REFERENCES bills (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, bill_id)
);

GRANT ALL PRIVILEGES ON TABLE user_bills TO commons_admin;

DROP TABLE IF EXISTS user_categories CASCADE;

CREATE TABLE user_categories (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, category_id)
);

GRANT ALL PRIVILEGES ON TABLE user_categories TO commons_admin;

DROP TABLE IF EXISTS user_credentials CASCADE;

CREATE TABLE user_credentials (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  user_id TEXT NOT NULL REFERENCES users (id),
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, type)
);

GRANT ALL PRIVILEGES ON TABLE user_credentials TO commons_admin;

INSERT INTO parliaments 
  (number, start_date, end_date)
VALUES 
  (43, '2019-12-05', null);

INSERT INTO parliamentary_sessions 
  (parliament, number, start_date, end_date)
VALUES 
  (43, 1, '2019-12-05', '2019-08-18'), 
  (43, 2, '2020-09-23', null);

INSERT INTO categories 
  (name, class_code)
VALUES 
  ('Agriculture, environment, fisheries and natural resources', 'agriculture_environment'), 
  ('Arts, culture and entertainment', 'arts_culture'), 
  ('Business, industry and trade', 'business_industry'), 
  ('Economics and finance', 'economics_finance'), 
  ('Education, language and training', 'education_language'), 
  ('Employment and labour', 'employment_labour'), 
  ('Government, Parliament and politics', 'government_politics'), 
  ('Health and safety', 'health_safety'), 
  ('Indigenous affairs', 'indigenous_affairs'), 
  ('Information and communications', 'information_communications'), 
  ('International affairs and defence', 'international_affairs'), 
  ('Law, justice and rights', 'law_justice'), 
  ('Science and technology', 'science_technology'), 
  ('Social affairs and population', 'social_affairs');