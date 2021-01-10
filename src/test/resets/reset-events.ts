import { db } from "@config";

const restEventsSQL = `
DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  bill_code VARCHAR (7) NOT NULL REFERENCES bills (code),
  title VARCHAR (555) NOT NULL,
  publication_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE events TO commoddity;

GRANT ALL ON SEQUENCE events_id_seq TO commoddity;

INSERT INTO events (bill_code, title, publication_date)
VALUES ('C-420', 'First Reading', '2020/03/11'), ('C-829', 'Second Reading', '2020/10/11'), ('C-44', 'Third Reading', '2019/12/08');
`;

export const resetEvents = async (): Promise<void> => {
  await db.none(restEventsSQL);
};
