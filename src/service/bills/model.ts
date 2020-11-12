import { keys } from "ts-transformer-keys";

export interface BillInterface {
  parliamentary_session_id: number | undefined;
  code: string;
  title: string;
  description: string | undefined;
  introduced_date: string | undefined;
  page_url: string;
  summary_url: string | undefined;
  full_text_url: string | undefined;
  passed: boolean | undefined;
}

export class Bill implements BillInterface {
  parliamentary_session_id: number | undefined;
  code: string;
  title: string;
  description: string | undefined;
  introduced_date: string | undefined;
  page_url: string;
  summary_url: string | undefined;
  full_text_url: string | undefined;
  passed: boolean | undefined;

  static getColumnNames(): string[] {
    return keys<BillInterface>();
  }

  constructor({
    parliamentary_session_id,
    code,
    title,
    description,
    introduced_date,
    summary_url,
    page_url,
    full_text_url,
    passed,
  }) {
    this.parliamentary_session_id = parliamentary_session_id;
    this.code = code;
    this.title = title;
    this.description = description;
    this.introduced_date = introduced_date;
    this.summary_url = summary_url;
    this.page_url = page_url;
    this.full_text_url = full_text_url;
    this.passed = passed;
  }
}
