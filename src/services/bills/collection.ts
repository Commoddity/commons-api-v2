import mongoose from "mongoose";

import { Bill, BillEvent, EBillType } from "./model";
import { EBillCategories, ERecordStatus } from "../../types";

const billEventSchema = new mongoose.Schema<BillEvent>(
  {
    eventId: { type: String, required: true },
    title: { type: String, required: true },
    publicationDate: { type: Date, required: true },
  },
  { timestamps: true, _id: false },
);

const billSchema = new mongoose.Schema<Bill>(
  {
    code: { type: String, required: true },
    title: { type: String, required: true },
    pageUrl: { type: String, required: true },
    parliamentarySessionId: { type: String },
    description: { type: String },
    summaryUrl: { type: String },
    fullTextUrl: { type: String },
    passed: { type: Boolean },
    introducedDate: { type: Date },
    passedDate: { type: Date },
    events: { type: [billEventSchema], required: true },
    categories: {
      type: [String],
      enum: Object.values(EBillCategories),
    },
    type: {
      type: String,
      enum: Object.values(EBillType),
    },
    recordStatus: {
      type: String,
      required: true,
      enum: Object.values(ERecordStatus),
      default: ERecordStatus.Created,
    },
  },
  { timestamps: true },
);

billSchema.index({ code: 1 }, { unique: true });

const collection = mongoose.model<Bill>("Bill", billSchema);

export { collection as Collection };
