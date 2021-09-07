import mongoose from "mongoose";

import { EBillCategories, ERecordStatus } from "@types";

const billEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    publicationDate: { type: Date, required: true },
  },
  { timestamps: true },
);

const billSchema = new mongoose.Schema(
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

const collection = mongoose.model("Bill", billSchema);

export { collection as Collection };
