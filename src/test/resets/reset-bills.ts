import { db } from "@config";

const restBillsSQL = `
DROP TABLE IF EXISTS bills CASCADE;

CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  parliamentary_session_id INT NOT NULL REFERENCES parliamentary_sessions (id),
  code VARCHAR (7) NOT NULL UNIQUE,
  title VARCHAR (555) NOT NULL,
  description TEXT,
  introduced_date DATE,
  summary_url VARCHAR(555),
  page_url VARCHAR(555),
  full_text_url VARCHAR(555),
  passed BOOLEAN,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE bills TO commoddity;

GRANT ALL ON SEQUENCE bills_id_seq TO commoddity;

INSERT INTO bills (parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed)
VALUES (1, 'C-420', 'A Bill to Save Baby Seals', 'Saving cute little baby seals', '2020/03/10', 'http://www.savetheseals.com', 'http://www.savesomeseals.com', 'http://www.saveaseal.com', null), (2, 'C-829', 'A Bill to Climb a Tree', 'Climbing trees is lots of fun', '2020/10/10', 'http://www.climbthetrees.com', 'http://www.climbsometrees.com', 'http://www.climbatree.com', true), (2, 'C-44', 'A Bill to Drive a Car', 'Driving all the time yay', '2019/12/07', 'http://www.drivethecars.com', 'http://www.drivesomecars.com', 'http://www.driveacar.com', false);

DROP TABLE IF EXISTS bill_categories CASCADE;

CREATE TABLE bill_categories (
  bill_id INT NOT NULL REFERENCES bills (id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (bill_id, category_id)
);

GRANT ALL PRIVILEGES ON TABLE bill_categories TO commoddity;
`;

export const resetBills = async (): Promise<void> => {
  await db.none(restBillsSQL);
};
