import { keys } from "ts-transformer-keys";
import { FormatUtils } from "@utils";
export interface EventInterface {
  bill_code: string;
  title: string;
  publication_date: string | undefined;
  id?: string;
  created_at?: Date;
}

export class Event implements EventInterface {
  bill_code: string;
  title: string;
  publication_date: string | undefined;
  id?: string;
  created_at?: Date;

  static getColumnNames(): string[] {
    return keys<EventInterface>();
  }

  constructor({ description, title, pubDate }: BillEvent) {
    this.bill_code = FormatUtils.formatCode(description);
    this.title = FormatUtils.formatTitle(title);
    this.publication_date = FormatUtils.formatDate(pubDate);
  }
}
