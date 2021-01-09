import { FormatUtils } from "@utils";

export const testBills = [
  {
    parliamentary_session_id: 1,
    code: "C-205",
    title: "A Bill to Touch Butts",
    description: "Literally just touching butts.",
    introduced_date: FormatUtils.formatDate("2020-09-23"),
    summary_url: "http://billsbillsbills.com",
    page_url: "http://billsandbills.com",
    full_text_url: "http://billsplusbills.com",
    passed: undefined,
  },
  {
    parliamentary_session_id: 2,
    code: "C-231",
    title: "A Bill for the Provision of Momentary Sanity",
    description: "Why god why",
    introduced_date: FormatUtils.formatDate("2020-08-26"),
    summary_url: "http://billsarebills.com",
    page_url: "http://billsbillsbills.com",
    full_text_url: "http://whybillstho.com",
    passed: true,
  },
  {
    parliamentary_session_id: 2,
    code: "C-242",
    title: "A Bill for Sea Otters",
    description: "Cute little guys",
    introduced_date: FormatUtils.formatDate("2019-03-10"),
    summary_url: "http://billsarebills.com",
    page_url: "http://billsbillsbills.com",
    full_text_url: "http://whybillstho.com",
    passed: true,
  },
];
