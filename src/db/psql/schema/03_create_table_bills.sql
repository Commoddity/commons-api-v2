DROP TABLE IF EXISTS bills CASCADE;

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