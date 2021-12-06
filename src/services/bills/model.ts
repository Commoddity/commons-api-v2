import {
  EBillCategories,
  ERecordStatus,
  IBill,
  IBillAddedFields,
  IBillMediaSource,
} from "../../types";

export class BillInput implements IBillAddedFields {
  id: string;
  parliamentarySession: string;
  code: string;
  title: string;
  pageUrl: string;
  fullTextUrl: string;
  categories?: EBillCategories[];
  mediaSources?: IBillMediaSource[];

  createdAt: string;
  updatedAt: string;
  recordStatus: ERecordStatus;

  constructor(bill: IBill) {
    const { NumberCode, LongTitle, ParliamentNumber, SessionNumber } = bill;
    this.parliamentarySession = `${ParliamentNumber}-${SessionNumber}`;
    this.code = NumberCode;
    this.title = LongTitle;
    this.pageUrl = this.getPageUrl(bill);
    this.fullTextUrl = this.getFullTextUrl(bill);
    this.categories = [];
    this.mediaSources = [];
  }

  getPageUrl = ({ ParliamentNumber, SessionNumber, NumberCode }: IBill): string =>
    `https://www.parl.ca/legisinfo/en/bill/${ParliamentNumber}-${SessionNumber}/${NumberCode.toLowerCase()}`;

  getFullTextUrl = ({
    ParliamentNumber,
    SessionNumber,
    NumberCode,
    LatestCompletedMajorStageName,
  }: IBill) =>
    `https://www.parl.ca/DocumentViewer/en/${ParliamentNumber}-${SessionNumber}/bill/${NumberCode.toLowerCase()}/${LatestCompletedMajorStageName.replace(
      /\s+/g,
      "-",
    ).toLowerCase()}`;
}
