import { keys } from "ts-transformer-keys";

export interface BillInterface {
  id?: string;
  parliamentary_session_id?: number;
  code: string;
  title: string;
  description?: string;
  introduced_date?: string;
  page_url: string;
  summary_url?: string;
  full_text_url?: string;
  passed?: boolean;
  created_at?: Date;
}

export class Bill implements BillInterface {
  id?: string;
  parliamentary_session_id?: number;
  code: string;
  title: string;
  description?: string;
  introduced_date?: string;
  page_url: string;
  summary_url?: string;
  full_text_url?: string;
  passed?: boolean;
  created_at?: Date;

  static getColumnNames(): string[] {
    return keys<BillInterface>();
  }

  constructor({
    id,
    parliamentary_session_id,
    code,
    title,
    description,
    introduced_date,
    summary_url,
    page_url,
    full_text_url,
    passed,
    created_at,
  }) {
    this.id = id;
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

export interface BillCategory {
  bill_id: string;
  category_id: string;
}
