import { keys } from "ts-transformer-keys";

export interface EventInterface {
  id: string | undefined;
  bill_code: string | undefined;
  title: string;
  publication_date: string | undefined;
}

export class Event implements EventInterface {
  id: string | undefined;
  bill_code: string | undefined;
  title: string;
  publication_date: string | undefined;

  static getColumnNames(): string[] {
    return keys<EventInterface>();
  }

  constructor({ id, bill_code, title, publication_date }) {
    this.id = id;
    this.bill_code = bill_code;
    this.title = title;
    this.publication_date = publication_date;
  }
}
