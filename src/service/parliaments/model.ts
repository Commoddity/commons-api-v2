import { keys } from "ts-transformer-keys";

export interface BillInterface {
  parliamentary_session_id: number;
  code: string;
  title: string;
  description: string;
  introduced_date: Date;
  summary_url: string;
  page_url: string;
  full_text_url: string;
  passed: boolean;
  created_at: Date;
}

export class Bill implements BillInterface {
  parliamentary_session_id;
  code;
  title;
  description;
  introduced_date;
  summary_url;
  page_url;
  full_text_url;
  passed;
  created_at;

  static getColumnNames(): string[] {
    return keys<BillInterface>();
  }

  constructor({
    parliamentary_session_id = null,
    code = null,
    title = null,
    description = null,
    introduced_date = null,
    summary_url = null,
    page_url = null,
    full_text_url = null,
    passed = null,
    created_at = null,
  } = {}) {
    this.parliamentary_session_id = parliamentary_session_id;
    this.code = code;
    this.title = title;
    this.description = description;
    this.introduced_date = introduced_date;
    this.summary_url = summary_url;
    this.page_url = page_url;
    this.full_text_url = full_text_url;
    this.passed = passed;
    this.created_at = created_at;
  }
}
