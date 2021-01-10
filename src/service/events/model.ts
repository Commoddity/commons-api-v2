import { keys } from "ts-transformer-keys";

export interface EventInterface {
  id?: string;
  bill_code: string;
  title: string;
  publication_date: string;
  created_at?: Date;
}

export class Event implements EventInterface {
  id?: string;
  bill_code: string;
  title: string;
  publication_date: string;
  created_at?: Date;

  static getColumnNames(): string[] {
    return keys<EventInterface>();
  }

  constructor({ id, bill_code, title, publication_date, created_at }) {
    this.id = id;
    this.bill_code = bill_code;
    this.title = title;
    this.publication_date = publication_date;
    this.created_at = created_at;
  }
}
