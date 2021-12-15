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
    this.categories = [];
    this.mediaSources = [];
  }

  getPageUrl = ({ ParliamentNumber, SessionNumber, NumberCode }: IBill): string =>
    `https://www.parl.ca/legisinfo/en/bill/${ParliamentNumber}-${SessionNumber}/${NumberCode.toLowerCase()}`;
}
