export interface Bill {
  parliamentary_session_id: number;
  code: string;
  title: string;
  description?: string;
  introduced_date?: Date;
  summary_url?: string;
  page_url?: string;
  full_text_url?: string;
  passed?: boolean;
  created_at?: Date;
}
