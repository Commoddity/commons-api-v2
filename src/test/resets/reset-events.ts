import { db } from "@db";

const restEventsSQL = `
DROP TABLE IF EXISTS events CASCADE;

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

CREATE TABLE events (
  id TEXT PRIMARY KEY DEFAULT (generate_uid(20)),
  bill_code VARCHAR (7) NOT NULL REFERENCES bills (code),
  title VARCHAR (555) NOT NULL,
  publication_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE events TO commons_admin;

INSERT INTO events 
  (bill_code, title, publication_date)
VALUES 
  ('C-420', 'First Reading', '2020/03/11'), 
  ('C-829', 'Second Reading', '2020/10/11'), 
  ('C-44', 'Third Reading', '2019/12/08');
`;

export const resetEvents = async (): Promise<void> => {
  await db.none(restEventsSQL);
};
