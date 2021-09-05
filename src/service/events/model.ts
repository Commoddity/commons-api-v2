import { FormatUtils } from "@utils";

export interface IBillEvent {
  id: string;
  bill_code: string;
  title: string;
  publication_date: string | undefined;
  parliamentary_session_id: string;
  createdAt: Date;
}

export class BillEvent implements IBillEvent {
  id: string;
  bill_code: string;
  title: string;
  publication_date: string | undefined;
  parliamentary_session_id: string;
  createdAt: Date;

  constructor({
    id,
    bill_code,
    title,
    publication_date,
    parliamentary_session_id,
  }: BillEventInput) {
    this.id = id;
    this.bill_code = bill_code;
    this.title = title;
    this.publication_date = publication_date;
    this.parliamentary_session_id = parliamentary_session_id;
  }
}

export class BillEventInput {
  id: string;
  bill_code: string;
  title: string;
  publication_date: string | undefined;
  parliamentary_session_id: string;

  constructor({ description, title, pubDate }: PBillEvent) {
    this.bill_code = FormatUtils.formatCode(description);
    this.title = FormatUtils.formatTitle(title);
    this.publication_date = FormatUtils.formatDate(pubDate);
    this.parliamentary_session_id = "";
  }
}
