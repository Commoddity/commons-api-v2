import { db } from "@db";

const restBillsSQL = `
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

GRANT ALL PRIVILEGES ON TABLE bills TO commoddity;

INSERT INTO bills 
  (parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed)
VALUES 
  ((SELECT id FROM parliamentary_sessions ORDER BY created_at DESC LIMIT 1), 'C-420', 'A Bill to Save Baby Seals', 'Saving cute little baby seals', '2020/03/10', 'http://www.savetheseals.com', 'http://www.savesomeseals.com', 'http://www.saveaseal.com', null), 
  ((SELECT id FROM parliamentary_sessions ORDER BY created_at DESC LIMIT 1), 'C-829', 'A Bill to Climb a Tree', 'Climbing trees is lots of fun', '2020/10/10', 'http://www.climbthetrees.com', 'http://www.climbsometrees.com', 'http://www.climbatree.com', true), 
  ((SELECT id FROM parliamentary_sessions ORDER BY created_at DESC LIMIT 1), 'C-44', 'A Bill to Drive a Car', 'Driving all the time yay', '2019/12/07', 'http://www.drivethecars.com', 'http://www.drivesomecars.com', 'http://www.driveacar.com', false);

DROP TABLE IF EXISTS bill_categories CASCADE;

CREATE TABLE bill_categories (
  bill_id TEXT NOT NULL REFERENCES bills (id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (bill_id, category_id)
);

GRANT ALL PRIVILEGES ON TABLE bill_categories TO commoddity;
`;

export const resetBills = async (): Promise<void> => {
  await db.none(restBillsSQL);
};
